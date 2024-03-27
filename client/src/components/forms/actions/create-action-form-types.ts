import { z } from "zod";
import { ActionType } from "../../../../../server/prisma/public";
import {
  numberWithValueGeneratorSchema,
  nonNegativeNumberWithValueGeneratorSchema,
  positiveNumberWithValueGeneratorSchema,
} from "../value-generators/types";
import { ipSchema } from "../../../utils/schemas";
import { SelectOption } from "../select";

const createActionBaseFormValuesSchema = z.object({
  type: z.nativeEnum(ActionType),
});

export enum BitNoiseStrategy {
  Left = "left",
  Right = "right",
  Random = "random",
}

export enum BitNoiseLayer {
  L2 = "L2",
  L3 = "L3",
  L4 = "L4",
}

const bitNoiseActionValuesSchema = createActionBaseFormValuesSchema.extend({
  type: z.literal(ActionType.BitNoise),
  layer: z.nativeEnum(BitNoiseLayer),
  noiseStrategy: z.nativeEnum(BitNoiseStrategy),
  usingPercentage: z.boolean(),
  percentageOfBitsToSwap: z
    .union([nonNegativeNumberWithValueGeneratorSchema, z.undefined()])
    .optional(),
  amountOfBitsToSwap: z
    .union([nonNegativeNumberWithValueGeneratorSchema, z.undefined()])
    .optional(),
});

const delayActionValuesSchema = createActionBaseFormValuesSchema.extend({
  type: z.literal(ActionType.Delay),
  n: nonNegativeNumberWithValueGeneratorSchema,
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
  Random = "random",
  Reverse = "reverse",
}

const reorderActionValuesSchema = createActionBaseFormValuesSchema.extend({
  type: z.literal(ActionType.Reorder),
  count: positiveNumberWithValueGeneratorSchema,
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
  count: positiveNumberWithValueGeneratorSchema,
  action: baseActionSchema,
});

const socketTcpActionValuesSchema = createActionBaseFormValuesSchema.extend({
  type: z.literal(ActionType.SocketTcp),
  ip: ipSchema,
  port: z.number(),
  packFormat: z.string(),
  mark: z.number(),
  // format: z.object({
  //   meta: z.string(),
  //   data: z.string(),
  //   type: z.string(),
  // }),
});

const throttleActionValuesSchema = createActionBaseFormValuesSchema.extend({
  type: z.literal(ActionType.Throttle),
  limit: positiveNumberWithValueGeneratorSchema,
});

export const actionFormValuesSchema = z
  .discriminatedUnion("type", [
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
  ])
  .refine(
    (x) =>
      x.type === ActionType.BitNoise && x.usingPercentage
        ? x.percentageOfBitsToSwap !== undefined
        : true,
    { message: "Required", path: ["percentageOfBitsToSwap"] },
  )
  .refine(
    (x) =>
      x.type === ActionType.BitNoise && !x.usingPercentage
        ? x.amountOfBitsToSwap !== undefined
        : true,
    { message: "Required", path: ["amountOfBitsToSwap"] },
  )
  .refine(
    (x) =>
      x.type === ActionType.BitNoise &&
      x.usingPercentage &&
      typeof x.percentageOfBitsToSwap === "number"
        ? x.percentageOfBitsToSwap >= 0 && x.percentageOfBitsToSwap <= 1
        : true,
    {
      message: "Enter a value between 0 and 1",
      path: ["percentageOfBitsToSwap"],
    },
  )
  .refine(
    (x) =>
      x.type === ActionType.BitNoise &&
      x.usingPercentage &&
      typeof x.percentageOfBitsToSwap !== "number"
        ? x.percentageOfBitsToSwap?.max !== undefined &&
          x.percentageOfBitsToSwap.max <= 1
        : true,
    {
      message: "Value should be 1 or less",
      path: ["percentageOfBitsToSwap", "max"],
    },
  );

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

export type ActionData = Omit<CreateActionFormValues, "type" | "name">;

export const actionTypeOptions: SelectOption[] = [
  { value: ActionType.BitNoise, label: ActionType.BitNoise },
  { value: ActionType.Delay, label: ActionType.Delay },
  { value: ActionType.Drop, label: ActionType.Drop },
  { value: ActionType.Finish, label: ActionType.Finish },
  { value: ActionType.Pause, label: ActionType.Pause },
  { value: ActionType.Reorder, label: ActionType.Reorder },
  { value: ActionType.Replicate, label: ActionType.Replicate },
  { value: ActionType.Restart, label: ActionType.Restart },
  { value: ActionType.Skip, label: ActionType.Skip },
  { value: ActionType.SocketTcp, label: ActionType.SocketTcp },
  { value: ActionType.Throttle, label: ActionType.Throttle },
];
