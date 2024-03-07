import express from "express";
import { wsWrapper } from "./websocket";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { appRouter } from "./trpc-routers";
import { createContext } from "./context";
import { getStatus, startNetLoiter, stopNetLoiter } from "./nl-status";
import { z } from "zod";
import { createScenarioFormValuesSchema } from "netloier-ui/src/components/forms/scenarios/create-scenario-form-types";
import { createConfigFormValuesSchema } from "netloier-ui/src/components/forms/configs/create-config-form-types";
import { initHyperTable, sequelize } from "./sequelize";
import { objectWithId } from "./trpc-routers/utils/object-with-id";

const trpcHandler = createHTTPHandler({
  middleware: cors(),
  router: appRouter,
  createContext,
});

const app = express().use(cors(), express.json());

sequelize.sync().then(initHyperTable);

const startBodySchema = z.object({
  scenario: createScenarioFormValuesSchema.merge(objectWithId),
  config: z.intersection(createConfigFormValuesSchema, objectWithId),
});

app.post("/start", (req, res) => {
  const parsedBody = startBodySchema.safeParse(req.body);

  if (parsedBody.success) {
    startNetLoiter(parsedBody.data.scenario, parsedBody.data.config);
  } else {
    res.status(400);
  }
  res.send();
});

app.get("/status", (req, res) => {
  res.send(getStatus());
});

app.get("/stop", (req, res) => {
  stopNetLoiter();
  res.send();
});

app.route("*").all(async (req, res) => {
  await trpcHandler(req, res);
});

export const httpServer = app.listen(2022);
wsWrapper(httpServer);

console.log("✅  Server listening at http://localhost:2022");
