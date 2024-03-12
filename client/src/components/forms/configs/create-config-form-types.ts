import { z } from "zod";
import { ConfigMode } from "../../../../../server/prisma/public";
import { ipSchema } from "../../../utils/schemas";

const createConfigBaseFormValuesSchema = z.object({
  name: z.string().refine((name) => name.length > 0, { message: "Required" }),
  mode: z.nativeEnum(ConfigMode),
});

export enum FlowActionType {
  Catch = "catch",
  Ignore = "ignore",
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
  mode: z.literal(ConfigMode.nf_mark),
  flows: z.array(flowSchema),
});

const tcMarkVlanConfigFormValuesSchema =
  createConfigBaseFormValuesSchema.extend({
    mode: z.literal(ConfigMode.tc_mark_vlan),
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
  mode: z.literal(ConfigMode.socket),
  tcpAddresses: z.array(socketSchema).optional(),
  udpAddresses: z.array(socketSchema).optional(),
});

export const createConfigFormValuesSchema = z.discriminatedUnion("mode", [
  nfMarkConfigFormValuesSchema,
  tcMarkVlanConfigFormValuesSchema,
  socketConfigFormValuesSchema,
]);

export type CreateConfigFormValues = z.infer<
  typeof createConfigFormValuesSchema
>;

export type ConfigData = Omit<CreateConfigFormValues, "mode" | "name">;
