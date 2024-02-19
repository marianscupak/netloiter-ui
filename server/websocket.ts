import { WebSocket } from "ws";
import { Server } from "http";
import { eventEmitter } from "./event-emitter";

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
    broadcast(
      websocketServer.clients,
      JSON.stringify({ message: String.fromCharCode(...data) }),
    );
  });

  return websocketServer;
};
