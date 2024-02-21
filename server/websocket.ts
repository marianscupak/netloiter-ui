import { WebSocket } from "ws";
import { Server } from "http";
import { eventEmitter } from "./event-emitter";
import { parseMessage } from "./nl-status/parse-message";
import { Message } from "./nl-status/message-types";

const broadcast = (clients: Set<WebSocket>, message: string) => {
  clients.forEach((client) => {
    client.send(message);
  });
};

let runtimeMessages: Message[] = [];

export const wsWrapper = (expressServer: Server) => {
  const websocketServer = new WebSocket.Server({
    noServer: true,
  });

  expressServer.on("upgrade", (request, socket, head) => {
    websocketServer.handleUpgrade(request, socket, head, (websocket) => {
      websocketServer.emit("connection", websocket, request);
      websocket.send(JSON.stringify({ messages: runtimeMessages }));
    });
  });

  eventEmitter.on("add", (data) => {
    const messages = parseMessage(String.fromCharCode(...data));
    runtimeMessages.push(...messages);

    broadcast(websocketServer.clients, JSON.stringify({ messages }));
  });

  eventEmitter.on("close", () => {
    runtimeMessages = [];
  });

  return websocketServer;
};
