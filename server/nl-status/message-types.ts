import { z } from "zod";

export enum MessageType {
  UnknownMessage = -1,
  StartingNetLoiter = 1,
  EvaluatingAllRule,
  AllRuleFailure,
  AllRuleSuccess,
  EvaluatingAnyRule,
  AnyRuleFailure,
  AnyRuleSuccess,
  StartingPacketProcessing,
  EndingPacketProcessing,
  BitNoiseAction,
  DelayAction,
  DropAction,
  FinishAction,
  PauseAction,
  ReorderAction,
  ReplicateAction,
  RestartAction,
  SkipAction,
  SocketTcpAction,
  ThrottleActionPass,
  ThrottleActionDelay,
}

interface SelectOption {
  label: string;
  value: number | string;
}

export const messageTypeOptions: SelectOption[] = [
  { value: MessageType.StartingNetLoiter, label: "Starting NetLoiter" },
  { value: MessageType.EvaluatingAllRule, label: "Evaluating All Rule" },
  { value: MessageType.AllRuleFailure, label: "All Rule Failure" },
  { value: MessageType.AllRuleSuccess, label: "All Rule Success" },
  { value: MessageType.EvaluatingAnyRule, label: "Evaluating Any Rule" },
  { value: MessageType.AnyRuleFailure, label: "Any Rule Failure" },
  { value: MessageType.AnyRuleSuccess, label: "Any Rule Success" },
  {
    value: MessageType.StartingPacketProcessing,
    label: "Starting Packet Processing",
  },
  {
    value: MessageType.EndingPacketProcessing,
    label: "Ending Packet Processing",
  },
  { value: MessageType.BitNoiseAction, label: "Bit Noise Action" },
  { value: MessageType.DelayAction, label: "Delay Action" },
  { value: MessageType.DropAction, label: "Drop Action" },
  { value: MessageType.FinishAction, label: "Finish Action" },
  { value: MessageType.PauseAction, label: "Pause Action" },
  { value: MessageType.ReorderAction, label: "Reorder Action" },
  { value: MessageType.ReplicateAction, label: "Replicate Action" },
  { value: MessageType.RestartAction, label: "Restart Action" },
  { value: MessageType.SkipAction, label: "Skip Action" },
  { value: MessageType.SocketTcpAction, label: "Socket TCP Action" },
  { value: MessageType.ThrottleActionPass, label: "Throttle Action Pass" },
  { value: MessageType.ThrottleActionDelay, label: "Throttle Action Delay" },
];

export const messageTypeSchema = z.nativeEnum(MessageType);

const baseMessageSchema = z.object({
  type: messageTypeSchema,
});

const startingNLMessageSchema = baseMessageSchema.extend({
  type: z.literal(MessageType.StartingNetLoiter),
});

const baseMessageWithPacketIdSchema = baseMessageSchema.merge(
  z.object({ packetId: z.number() }),
);

const evaluatingAllRuleMessageSchema = baseMessageWithPacketIdSchema.extend({
  type: z.literal(MessageType.EvaluatingAllRule),
  ruleIndex: z.number(),
});

const allRuleFailureMessageSchema = baseMessageWithPacketIdSchema.extend({
  type: z.literal(MessageType.AllRuleFailure),
  ruleIndex: z.number(),
  failedGuardIndex: z.number(),
});

const allRuleSuccessMessageSchema = baseMessageWithPacketIdSchema.extend({
  type: z.literal(MessageType.AllRuleSuccess),
  ruleIndex: z.number(),
});

const evaluatingAnyRuleMessageSchema = baseMessageWithPacketIdSchema.extend({
  type: z.literal(MessageType.EvaluatingAnyRule),
  ruleIndex: z.number(),
});

const anyRuleFailureMessageSchema = baseMessageWithPacketIdSchema.extend({
  type: z.literal(MessageType.AnyRuleFailure),
  ruleIndex: z.number(),
});

const anyRuleSuccessMessageSchema = baseMessageWithPacketIdSchema.extend({
  type: z.literal(MessageType.AnyRuleSuccess),
  ruleIndex: z.number(),
  passedGuardIndex: z.number(),
});

const startingPacketProcessingMessageSchema =
  baseMessageWithPacketIdSchema.extend({
    type: z.literal(MessageType.StartingPacketProcessing),
    sourceIp: z.string(),
    sourcePort: z.number(),
    destIp: z.string(),
    destPort: z.number(),
  });

const endingPacketProcessingMessageSchema =
  baseMessageWithPacketIdSchema.extend({
    type: z.literal(MessageType.EndingPacketProcessing),
  });

const bitNoiseActionMessageSchema = baseMessageWithPacketIdSchema.extend({
  type: z.literal(MessageType.BitNoiseAction),
  rawPayload: z.string(),
  mask: z.string(),
  result: z.string(),
});

const delayActionMessageSchema = baseMessageWithPacketIdSchema.extend({
  type: z.literal(MessageType.DelayAction),
  duration: z.number(),
});

const dropActionMessageSchema = baseMessageWithPacketIdSchema.extend({
  type: z.literal(MessageType.DropAction),
});

const finishActionMessageSchema = baseMessageWithPacketIdSchema.extend({
  type: z.literal(MessageType.FinishAction),
});

const pauseActionMessageSchema = baseMessageWithPacketIdSchema.extend({
  type: z.literal(MessageType.PauseAction),
});

const reorderActionMessageSchema = baseMessageWithPacketIdSchema.extend({
  type: z.literal(MessageType.ReorderAction),
  strategy: z.string(),
});

const replicateActionMessageSchema = baseMessageWithPacketIdSchema.extend({
  type: z.literal(MessageType.ReplicateAction),
  n: z.number(),
});

const restartActionMessageSchema = baseMessageWithPacketIdSchema.extend({
  type: z.literal(MessageType.RestartAction),
});

const skipActionMessageSchema = baseMessageWithPacketIdSchema.extend({
  type: z.literal(MessageType.SkipAction),
});

const socketTcpActionMessageSchema = baseMessageWithPacketIdSchema.extend({
  type: z.literal(MessageType.SocketTcpAction),
  addr: z.string(),
});

const throttleActionPassMessageSchema = baseMessageWithPacketIdSchema.extend({
  type: z.literal(MessageType.ThrottleActionPass),
});

const throttleActionDelayMessageSchema = baseMessageWithPacketIdSchema.extend({
  type: z.literal(MessageType.ThrottleActionDelay),
});

const unknownMessageSchema = baseMessageSchema.extend({
  type: z.literal(MessageType.UnknownMessage),
});

export const messageWithPacketIdSchema = z.union([
  evaluatingAllRuleMessageSchema,
  evaluatingAllRuleMessageSchema,
  allRuleFailureMessageSchema,
  allRuleSuccessMessageSchema,
  evaluatingAnyRuleMessageSchema,
  anyRuleFailureMessageSchema,
  anyRuleSuccessMessageSchema,
  startingPacketProcessingMessageSchema,
  endingPacketProcessingMessageSchema,
  bitNoiseActionMessageSchema,
  delayActionMessageSchema,
  dropActionMessageSchema,
  finishActionMessageSchema,
  pauseActionMessageSchema,
  reorderActionMessageSchema,
  replicateActionMessageSchema,
  restartActionMessageSchema,
  skipActionMessageSchema,
  socketTcpActionMessageSchema,
  throttleActionPassMessageSchema,
  throttleActionDelayMessageSchema,
]);

export type MessageWithPacketId = z.infer<typeof messageWithPacketIdSchema>;

export const messageSchema = z.union([
  messageWithPacketIdSchema,
  startingNLMessageSchema,
  unknownMessageSchema,
]);

export type Message = z.infer<typeof messageSchema>;
