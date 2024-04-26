import express from "express";
import { wsWrapper } from "./websocket";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { appRouter } from "./trpc-routers";
import { createContext } from "./context";
import { getStatus, startNetLoiter, stopNetLoiter } from "./nl-status";
import { z } from "zod";
import { createScenarioFormValuesSchema } from "netloiter-ui-fe/src/components/forms/scenarios/create-scenario-form-types";
import { createConfigFormValuesSchema } from "netloiter-ui-fe/src/components/forms/configs/create-config-form-types";
import { initHyperTable, sequelize } from "./sequelize";
import { objectWithId } from "./trpc-routers/utils/object-with-id";
import { baseActionSchema } from "netloiter-ui-fe/src/components/forms/actions/create-action-form-types";

const trpcHandler = createHTTPHandler({
  middleware: cors(),
  router: appRouter,
  createContext,
});

const app = express().use(cors(), express.json());

sequelize.sync().then(initHyperTable);

const objectWithConfigSchema = z.object({
  config: z.intersection(createConfigFormValuesSchema, objectWithId),
});

const startBodySchema = z
  .object({
    scenario: createScenarioFormValuesSchema.merge(objectWithId),
  })
  .merge(objectWithConfigSchema)
  .or(
    z.object({ defaultAction: baseActionSchema }).merge(objectWithConfigSchema),
  );

app.post("/start", (req, res) => {
  const parsedBody = startBodySchema.safeParse(req.body);

  if (parsedBody.success) {
    if ("scenario" in parsedBody.data) {
      startNetLoiter({
        scenario: parsedBody.data.scenario,
        config: parsedBody.data.config,
      });
    } else if ("defaultAction" in parsedBody.data) {
      startNetLoiter({
        defaultAction: parsedBody.data.defaultAction,
        config: parsedBody.data.config,
      });
    } else {
      res.status(400);
    }
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

const port = z.coerce.number().parse(process.env.BE_PORT);

export const httpServer = app.listen(port, "0.0.0.0", () => {
  console.log(`✅  Server listening at http://0.0.0.0:${port}`);
});
wsWrapper(httpServer);
