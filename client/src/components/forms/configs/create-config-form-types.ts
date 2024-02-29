import { z } from "zod";
import { ConfigType } from "../../../../../server/prisma/public";
import { ipSchema } from "../../../utils/schemas";

const createConfigBaseFormValuesSchema = z.object({
  name: z.string().refine((name) => name.length > 0, { message: "Required" }),
  type: z.nativeEnum(ConfigType),
});

export enum FlowActionType {
  Catch = "catch",
}

const flowSchema = z.object({
  action: z.nativeEnum(FlowActionType),
  all: z.boolean().optional(),
  ip: ipSchema.optional(),
  port: z.number().optional(),
  dstPort: z.number().optional(),
  protocol: z.number().optional(),
  icmpType: z.number().optional(),
});

const nfMarkConfigFormValuesSchema = createConfigBaseFormValuesSchema.extend({
  type: z.literal(ConfigType.nf_mark),
  flows: z.array(flowSchema),
});

const tcMarkVlanConfigFormValuesSchema =
  createConfigBaseFormValuesSchema.extend({
    type: z.literal(ConfigType.tc_mark_vlan),
    flows: z.array(flowSchema),
  });

const ipWithPortSchema = z.object({
  ip: ipSchema,
  port: z.number(),
});

const socketSchema = z.object({
  local: ipWithPortSchema,
  remote: ipWithPortSchema,
});

const socketConfigFormValuesSchema = createConfigBaseFormValuesSchema.extend({
  type: z.literal(ConfigType.socket),
  tcpAddresses: z.array(socketSchema).optional(),
  udpAddresses: z.array(socketSchema).optional(),
});

export const createConfigFormValuesSchema = z.discriminatedUnion("type", [
  nfMarkConfigFormValuesSchema,
  tcMarkVlanConfigFormValuesSchema,
  socketConfigFormValuesSchema,
]);

export type CreateConfigFormValues = z.infer<
  typeof createConfigFormValuesSchema
>;
