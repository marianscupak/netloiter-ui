import { z } from "zod";
import { GuardType } from "../../../../../server/prisma/public";
import { numberWithValueGeneratorSchema } from "../value-generators/types";
import { ipSchema } from "../../../utils/schemas";

const createGuardBaseFormValuesSchema = z.object({
  type: z.nativeEnum(GuardType),
  invert: z.boolean(),
});

const countGuardValuesSchema = createGuardBaseFormValuesSchema.extend({
  type: z.literal(GuardType.Count),
  after: numberWithValueGeneratorSchema,
  duration: numberWithValueGeneratorSchema,
});

const countPeriodGuardValuesSchema = createGuardBaseFormValuesSchema.extend({
  type: z.literal(GuardType.CountPeriod),
  truePeriod: numberWithValueGeneratorSchema,
  falsePeriod: numberWithValueGeneratorSchema,
});

const everyNGuardValuesSchema = createGuardBaseFormValuesSchema.extend({
  type: z.literal(GuardType.EveryN),
  n: numberWithValueGeneratorSchema,
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
  prob: numberWithValueGeneratorSchema,
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
  size: z.number(),
  op: z.nativeEnum(SizeGuardOperation),
});

const timeGuardValuesSchema = createGuardBaseFormValuesSchema.extend({
  type: z.literal(GuardType.Time),
  after: numberWithValueGeneratorSchema,
  duration: numberWithValueGeneratorSchema,
  instant: z.boolean(),
});

const timePeriodGuardValuesSchema = createGuardBaseFormValuesSchema.extend({
  type: z.literal(GuardType.TimePeriod),
  truePeriod: numberWithValueGeneratorSchema,
  falsePeriod: numberWithValueGeneratorSchema,
  instant: z.boolean(),
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
