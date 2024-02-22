import { z } from "zod";
import { ActionType } from "../../../../../server/prisma/public";
import { numberWithValueGeneratorSchema } from "../value-generators/types";

const createActionBaseFormValuesSchema = z.object({
  name: z.string().refine((name) => name.length > 0, { message: "Required" }),
  type: z.nativeEnum(ActionType),
});

export enum BitNoiseStrategy {
  Left,
  Right,
  Random,
}

const bitNoiseActionValuesSchema = createActionBaseFormValuesSchema.extend({
  type: z.literal(ActionType.BitNoise),
  percentageOfBitsToSwap: numberWithValueGeneratorSchema.refine(
    (n) => (typeof n === "number" ? n > 0 && n < 1 : true),
    {
      message: "Enter a value between 0 and 1",
    },
  ),
  layer: z.number().refine((l) => l > 0 && l < 5, {
    message: "Enter a value between 1 and 4",
  }),
  noiseStrategy: z.nativeEnum(BitNoiseStrategy),
});

const delayActionValuesSchema = createActionBaseFormValuesSchema.extend({
  type: z.literal(ActionType.Delay),
  n: numberWithValueGeneratorSchema,
});

const dropActionValuesSchema = createActionBaseFormValuesSchema.extend({
  type: z.literal(ActionType.Drop),
});

const finishActionValuesSchema = createActionBaseFormValuesSchema.extend({
  type: z.literal(ActionType.Finish),
});

const pauseActionValuesSchema = createActionBaseFormValuesSchema.extend({
  type: z.literal(ActionType.Pause),
});

const restartActionValuesSchema = createActionBaseFormValuesSchema.extend({
  type: z.literal(ActionType.Restart),
});

const skipActionValuesSchema = createActionBaseFormValuesSchema.extend({
  type: z.literal(ActionType.Skip),
});

export enum ReorderStrategy {
  Random,
  Reverse,
}

const reorderActionValuesSchema = createActionBaseFormValuesSchema.extend({
  type: z.literal(ActionType.Reorder),
  count: numberWithValueGeneratorSchema,
  reorderStrategy: z.nativeEnum(ReorderStrategy),
});

const replicateActionValuesSchema = createActionBaseFormValuesSchema.extend({
  type: z.literal(ActionType.Reorder),
  count: numberWithValueGeneratorSchema,
  // TODO: Action
});

const ipv4regex =
  /\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/;

const socketTcpActionValuesSchema = createActionBaseFormValuesSchema.extend({
  type: z.literal(ActionType.SocketTcp),
  ip: z.string().regex(ipv4regex, { message: "Invalid IP" }),
  port: z.number(),
  packFormat: z.string(),
  mark: z.string(),
  format: z.object({
    meta: z.string(),
    data: z.string(),
    type: z.string(),
  }),
});

const throttleActionValuesSchema = createActionBaseFormValuesSchema.extend({
  type: z.literal(ActionType.Throttle),
  limit: numberWithValueGeneratorSchema,
});

export const createActionFormValuesSchema = z.union([
  bitNoiseActionValuesSchema,
  delayActionValuesSchema,
  dropActionValuesSchema,
  finishActionValuesSchema,
  pauseActionValuesSchema,
  restartActionValuesSchema,
  skipActionValuesSchema,
  reorderActionValuesSchema,
  replicateActionValuesSchema,
  socketTcpActionValuesSchema,
  throttleActionValuesSchema,
]);

export type CreateActionFormValues = z.infer<
  typeof createActionFormValuesSchema
>;