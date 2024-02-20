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

const messageTypeSchema = z.nativeEnum(MessageType);

const baseMessageSchema = z.object({
  type: messageTypeSchema,
});

const startingNLMessageSchema = baseMessageSchema.extend({
  type: z.literal(MessageType.StartingNetLoiter),
});

const baseMessageWithPacketIdSchema = baseMessageSchema.merge(
  z.object({ packetId: z.string() }),
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
