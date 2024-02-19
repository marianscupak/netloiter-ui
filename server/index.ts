import express from "express";
import { wsWrapper } from "./websocket";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { appRouter } from "./trpc-routers";
import { createContext } from "./context";
import { getRunningFrom, startNetLoiter, stopNetLoiter } from "./nl-status";

const trpcHandler = createHTTPHandler({
  middleware: cors(),
  router: appRouter,
  createContext,
});

const app = express().use(cors());

app.get("/start", (req, res) => {
  startNetLoiter();
  res.send();
});

app.get("/status", (req, res) => {
  res.send({ runningFrom: getRunningFrom() });
});

app.get("/stop", (req, res) => {
  stopNetLoiter();
  res.send();
});

app.route("*").get(async (req, res) => {
  await trpcHandler(req, res);
});

export const httpServer = app.listen(2022);
wsWrapper(httpServer);

console.log("✅  Server listening at http://localhost:2022");
