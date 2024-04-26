import { WebSocket } from "ws";
import { Server } from "http";
import { eventEmitter } from "./event-emitter";
import { parseMessage } from "./nl-status/parse-message";
import { Message } from "./nl-status/message-types";
import { Run } from "./sequelize/models/run";
import { RunMessage } from "./sequelize/models/run-message";
import { BaseAction } from "netloiter-ui-fe/src/components/forms/actions/create-action-form-types";

const broadcast = (clients: Set<WebSocket>, message: string) => {
  clients.forEach((client) => {
    client.send(message);
  });
};

const DB_SAVE_MESSAGE_INTERVAL = 1000;

let messagesBatch: Message[] = [];

let DbRun: Run | undefined;

export const initializeRun = async (
  runningFrom: Date,
  scenarioId: number | undefined,
  configId: number | undefined,
  defaultAction: BaseAction | undefined,
) => {
  DbRun = await Run.create({
    dateTime: runningFrom,
    scenarioId,
    configId,
    defaultAction,
  });
};

export const wsWrapper = (expressServer: Server) => {
  const websocketServer = new WebSocket.Server({
    noServer: true,
  });

  expressServer.on("upgrade", (request, socket, head) => {
    websocketServer.handleUpgrade(request, socket, head, (websocket) => {
      websocketServer.emit("connection", websocket, request);
    });
  });

  eventEmitter.on("add", (data) => {
    const messages = parseMessage(String.fromCharCode(...data));
    messagesBatch.push(...messages);
  });

  eventEmitter.on("close", () => {
    messagesBatch = [];
  });

  setInterval(async () => {
    if (DbRun) {
      const now = new Date();
      await RunMessage.bulkCreate(
        messagesBatch.map((message) => ({
          data: { ...message },
          runId: DbRun!.id,
          time: now,
        })),
      );
      messagesBatch = [];

      const messagesCount = await RunMessage.count({
        where: { runId: DbRun.id },
      });

      broadcast(
        websocketServer.clients,
        JSON.stringify({ messagesCount, runId: DbRun.id }),
      );
    }
  }, DB_SAVE_MESSAGE_INTERVAL);

  return websocketServer;
};
