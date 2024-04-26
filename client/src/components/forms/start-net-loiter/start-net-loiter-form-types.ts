import { z } from "zod";
import { baseActionSchema } from "../actions/create-action-form-types";

export const startNetLoiterFormValuesSchema = z
  .object({
    scenarioId: z.number(),
    configId: z.number(),
  })
  .or(z.object({ defaultAction: baseActionSchema, configId: z.number() }));

export type StartNetLoiterFormValues = z.infer<
  typeof startNetLoiterFormValuesSchema
>;
