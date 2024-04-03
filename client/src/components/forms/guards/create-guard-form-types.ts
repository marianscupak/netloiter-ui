import { z } from "zod";
import { GuardType } from "../../../../../server/prisma/public";
import {
  positiveNumberWithValueGeneratorSchema,
  nonNegativeNumberWithValueGeneratorSchema,
} from "../value-generators/types";
import { ipSchema } from "../../../utils/schemas";

import { SelectOption } from "../../../utils/select-option";

const createGuardBaseFormValuesSchema = z.object({
  type: z.nativeEnum(GuardType),
  invert: z.boolean(),
});

const countGuardValuesSchema = createGuardBaseFormValuesSchema.extend({
  type: z.literal(GuardType.Count),
  after: positiveNumberWithValueGeneratorSchema,
  duration: positiveNumberWithValueGeneratorSchema,
});

const countPeriodGuardValuesSchema = createGuardBaseFormValuesSchema.extend({
  type: z.literal(GuardType.CountPeriod),
  truePeriod: positiveNumberWithValueGeneratorSchema,
  falsePeriod: positiveNumberWithValueGeneratorSchema,
});

const everyNGuardValuesSchema = createGuardBaseFormValuesSchema.extend({
  type: z.literal(GuardType.EveryN),
  n: positiveNumberWithValueGeneratorSchema,
});

const icmpGuardValuesSchema = createGuardBaseFormValuesSchema.extend({
  type: z.literal(GuardType.ICMP),
  icmpType: z.number(),
  icmpCode: z.number(),
});

// TODO: If @ip argument is provided, then @src and @dst must not be provided!
const ipGuardValuesSchema = createGuardBaseFormValuesSchema.extend({
  type: z.literal(GuardType.IP),
  src: ipSchema.optional(),
  dst: ipSchema.optional(),
  any: ipSchema.optional(),
});

const portGuardValuesSchema = createGuardBaseFormValuesSchema.extend({
  type: z.literal(GuardType.Port),
  src: z.number().optional(),
  dst: z.number().optional(),
  any: z.number().optional(),
});

const probGuardValuesSchema = createGuardBaseFormValuesSchema.extend({
  type: z.literal(GuardType.Prob),
  prob: nonNegativeNumberWithValueGeneratorSchema
    .refine((x) => (typeof x === "number" ? x < 1 : true), {
      message: "Value should be less than 1",
    })
    .refine(
      (x) => (typeof x !== "number" ? x.max !== undefined && x.max < 1 : true),
      { message: "Value should be less than 1", path: ["max"] },
    ),
});

const protocolGuardValuesSchema = createGuardBaseFormValuesSchema.extend({
  type: z.literal(GuardType.Protocol),
  id: z.number(),
});

export enum SizeGuardOperation {
  Eq = "=",
  Lt = "<",
  Le = "<=",
  Gt = ">",
  Ge = ">=",
}

const sizeGuardValuesSchema = createGuardBaseFormValuesSchema.extend({
  type: z.literal(GuardType.Size),
  size: z.number().positive(),
  op: z.nativeEnum(SizeGuardOperation),
});

const timeGuardValuesSchema = createGuardBaseFormValuesSchema.extend({
  type: z.literal(GuardType.Time),
  after: positiveNumberWithValueGeneratorSchema,
  duration: positiveNumberWithValueGeneratorSchema,
  instant: z.boolean().optional(),
});

const timePeriodGuardValuesSchema = createGuardBaseFormValuesSchema.extend({
  type: z.literal(GuardType.TimePeriod),
  truePeriod: positiveNumberWithValueGeneratorSchema,
  falsePeriod: positiveNumberWithValueGeneratorSchema,
  instant: z.boolean().optional(),
});

export const guardFormValuesSchema = z
  .discriminatedUnion("type", [
    countGuardValuesSchema,
    countPeriodGuardValuesSchema,
    everyNGuardValuesSchema,
    icmpGuardValuesSchema,
    ipGuardValuesSchema,
    portGuardValuesSchema,
    probGuardValuesSchema,
    protocolGuardValuesSchema,
    sizeGuardValuesSchema,
    timeGuardValuesSchema,
    timePeriodGuardValuesSchema,
  ])
  .refine(
    (x) =>
      !(
        (x.type === GuardType.IP || x.type === GuardType.Port) &&
        (x.src === "" || x.src === undefined) &&
        (x.dst === "" || x.dst === undefined) &&
        (x.any === "" || x.any === undefined)
      ),
    { message: "Fill out at least one parameter", path: ["any"] },
  );

export type GuardFormValues = z.infer<typeof guardFormValuesSchema>;

export const createGuardFormValuesSchema = z.intersection(
  guardFormValuesSchema,
  z.object({
    name: z.string().refine((name) => name.length > 0, { message: "Required" }),
  }),
);

export type CreateGuardFormValues = z.infer<typeof createGuardFormValuesSchema>;

export type GuardData = Omit<CreateGuardFormValues, "type" | "name" | "invert">;

export const guardTypeOptions: SelectOption[] = [
  { value: GuardType.Count, label: GuardType.Count },
  { value: GuardType.CountPeriod, label: GuardType.CountPeriod },
  { value: GuardType.EveryN, label: GuardType.EveryN },
  { value: GuardType.ICMP, label: GuardType.ICMP },
  { value: GuardType.IP, label: GuardType.IP },
  { value: GuardType.Port, label: GuardType.Port },
  { value: GuardType.Prob, label: GuardType.Prob },
  { value: GuardType.Protocol, label: GuardType.Protocol },
  { value: GuardType.Size, label: GuardType.Size },
  { value: GuardType.Time, label: GuardType.Time },
  { value: GuardType.TimePeriod, label: GuardType.TimePeriod },
];
