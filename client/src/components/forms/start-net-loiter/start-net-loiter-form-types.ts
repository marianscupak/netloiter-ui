import { z } from "zod";

export const startNetLoiterFormValuesSchema = z.object({
  scenarioId: z.number(),
  configId: z.number(),
});

export type StartNetLoiterFormValues = z.infer<
  typeof startNetLoiterFormValuesSchema
>;
