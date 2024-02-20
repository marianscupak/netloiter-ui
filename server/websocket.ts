import { WebSocket } from "ws";
import { Server } from "http";
import { eventEmitter } from "./event-emitter";
import { parseMessage } from "./nl-status/parse-message";

const broadcast = (clients: Set<WebSocket>, message: string) => {
  clients.forEach((client) => {
    client.send(message);
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
    const message = String.fromCharCode(...data);

    broadcast(
      websocketServer.clients,
      JSON.stringify({ messages: parseMessage(message) }),
    );
  });

  return websocketServer;
};
