import { z } from "zod";
import { GuardType } from "../../../../../server/prisma/public";
import { numberWithValueGeneratorSchema } from "../value-generators/types";
import { ipSchema } from "../../../utils/schemas";

const createGuardBaseFormValuesSchema = z.object({
  name: z.string().refine((name) => name.length > 0, { message: "Required" }),
  type: z.nativeEnum(GuardType),
  invert: z.boolean(),
});

const countGuardValuesSchema = createGuardBaseFormValuesSchema.extend({
  type: z.literal(GuardType.Count),
  after: numberWithValueGeneratorSchema,
  count: numberWithValueGeneratorSchema,
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

const ipGuardValuesSchema = createGuardBaseFormValuesSchema
  .extend({
    type: z.literal(GuardType.IP),
    src: ipSchema.optional(),
    dst: ipSchema.optional(),
    any: ipSchema.optional(),
  })
  .refine(
    (x) => x.src !== undefined || x.dst !== undefined || x.any !== undefined,
    { message: "Fill out at least one parameter", path: ["any"] },
  );

const portGuardValuesSchema = createGuardBaseFormValuesSchema
  .extend({
    type: z.literal(GuardType.Port),
    src: z.number().optional(),
    dst: z.number().optional(),
    any: z.number().optional(),
  })
  .refine(
    (x) => x.src !== undefined || x.dst !== undefined || x.any !== undefined,
    { message: "Fill out at least one parameter", path: ["any"] },
  );

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

export const createGuardFormValuesSchema = z.union([
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
]);

export type CreateGuardFormValues = z.infer<typeof createGuardFormValuesSchema>;
