import { z } from "zod";
import { ActionType } from "../../../../../server/prisma/public";
import { numberWithValueGeneratorSchema } from "../value-generators/types";
import { ipSchema } from "../../../utils/schemas";

const createActionBaseFormValuesSchema = z.object({
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

export const baseActionSchema = z.union([
  z.literal(ActionType.Finish),
  z.literal(ActionType.Drop),
  z.literal(ActionType.Pause),
  z.literal(ActionType.Skip),
]);

export type BaseAction = z.infer<typeof baseActionSchema>;

const replicateActionValuesSchema = createActionBaseFormValuesSchema.extend({
  type: z.literal(ActionType.Replicate),
  count: numberWithValueGeneratorSchema,
  action: baseActionSchema,
});

const socketTcpActionValuesSchema = createActionBaseFormValuesSchema.extend({
  type: z.literal(ActionType.SocketTcp),
  ip: ipSchema,
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

export const actionFormValuesSchema = z.discriminatedUnion("type", [
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

export type ActionFormValues = z.infer<typeof actionFormValuesSchema>;

export const createActionFormValuesSchema = z.intersection(
  actionFormValuesSchema,
  z.object({
    name: z.string().refine((name) => name.length > 0, { message: "Required" }),
  }),
);

export type CreateActionFormValues = z.infer<
  typeof createActionFormValuesSchema
>;
