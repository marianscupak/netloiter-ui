import { WebSocket } from "ws";
import { Server } from "http";
import { eventEmitter } from "./event-emitter";
import { parseMessage } from "./nl-status/parse-message";
import { Message } from "./nl-status/message-types";
import { Run } from "./sequelize/models/run";
import { RunMessage } from "./sequelize/models/run-message";

const broadcast = (clients: Set<WebSocket>, message: string) => {
  clients.forEach((client) => {
    client.send(message);
  });
};

const CLIENT_SEND_BATCH_INTERVAL = 1000;
const DB_SAVE_MESSAGE_INTERVAL = 1000;

let dbMessagesBatch: Message[] = [];
let messagesBatch: Message[] = [];

let DbRun: Run | undefined;

export const initializeRun = async (
  runningFrom: Date,
  scenarioId: number | undefined,
  configId: number | undefined,
) => {
  DbRun = await Run.create({ dateTime: runningFrom, scenarioId, configId });
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
    dbMessagesBatch.push(...messages);
    messagesBatch.push(...messages);
  });

  eventEmitter.on("close", () => {
    dbMessagesBatch = [];
    messagesBatch = [];
  });

  setInterval(() => {
    broadcast(
      websocketServer.clients,
      JSON.stringify({ messages: messagesBatch }),
    );
    messagesBatch = [];
  }, CLIENT_SEND_BATCH_INTERVAL);

  setInterval(() => {
    if (DbRun) {
      const now = new Date();
      RunMessage.bulkCreate(
        dbMessagesBatch.map((message) => ({
          data: { ...message },
          runId: DbRun!.id,
          time: now,
        })),
      );
      dbMessagesBatch = [];
    }
  }, DB_SAVE_MESSAGE_INTERVAL);

  return websocketServer;
};
