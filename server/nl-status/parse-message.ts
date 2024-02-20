import { Message, MessageType } from "./message-types";

const parseLog = (log: string): Message => {
  const messageWithoutDebug = log.slice(7);
  const parts = messageWithoutDebug.split(",");
  const messageType = Number.parseInt(parts[0]);

  if (messageType === MessageType.StartingNetLoiter) {
    return { type: MessageType.StartingNetLoiter };
  }
  const packetId = parts[1];

  switch (messageType) {
    case MessageType.EvaluatingAllRule: {
      const ruleIndex = Number.parseInt(parts[2]);

      return { type: MessageType.EvaluatingAllRule, packetId, ruleIndex };
    }
    case MessageType.AllRuleFailure: {
      const ruleIndex = Number.parseInt(parts[2]);
      const failedGuardIndex = Number.parseInt(parts[3]);

      return {
        type: MessageType.AllRuleFailure,
        packetId,
        ruleIndex,
        failedGuardIndex,
      };
    }
    case MessageType.AllRuleSuccess: {
      const ruleIndex = Number.parseInt(parts[2]);

      return {
        type: MessageType.AllRuleSuccess,
        packetId,
        ruleIndex,
      };
    }
    case MessageType.EvaluatingAnyRule: {
      const ruleIndex = Number.parseInt(parts[2]);

      return {
        type: MessageType.EvaluatingAnyRule,
        packetId,
        ruleIndex,
      };
    }
    case MessageType.AnyRuleFailure: {
      const ruleIndex = Number.parseInt(parts[2]);

      return {
        type: MessageType.AnyRuleFailure,
        packetId,
        ruleIndex,
      };
    }
    case MessageType.AnyRuleSuccess: {
      const ruleIndex = Number.parseInt(parts[2]);
      const passedGuardIndex = Number.parseInt(parts[3]);

      return {
        type: MessageType.AnyRuleSuccess,
        packetId,
        ruleIndex,
        passedGuardIndex,
      };
    }
    case MessageType.StartingPacketProcessing: {
      return {
        type: MessageType.StartingPacketProcessing,
        packetId,
      };
    }
    case MessageType.EndingPacketProcessing: {
      return {
        type: MessageType.EndingPacketProcessing,
        packetId,
      };
    }
    case MessageType.BitNoiseAction: {
      const rawPayload = parts[2];
      const mask = parts[3];
      const result = parts[4];

      return {
        type: MessageType.BitNoiseAction,
        packetId,
        rawPayload,
        mask,
        result,
      };
    }
    case MessageType.DelayAction: {
      const duration = Number.parseFloat(parts[2]);

      return {
        type: MessageType.DelayAction,
        packetId,
        duration,
      };
    }
    case MessageType.DropAction: {
      return {
        type: MessageType.DropAction,
        packetId,
      };
    }
    case MessageType.FinishAction: {
      return {
        type: MessageType.FinishAction,
        packetId,
      };
    }
    case MessageType.PauseAction: {
      return {
        type: MessageType.PauseAction,
        packetId,
      };
    }
    case MessageType.ReorderAction: {
      const strategy = parts[2];

      return {
        type: MessageType.ReorderAction,
        packetId,
        strategy,
      };
    }
    case MessageType.ReplicateAction: {
      const n = Number.parseInt(parts[2]);

      return {
        type: MessageType.ReplicateAction,
        packetId,
        n,
      };
    }
    case MessageType.RestartAction: {
      return {
        type: MessageType.RestartAction,
        packetId,
      };
    }
    case MessageType.SkipAction: {
      return {
        type: MessageType.SkipAction,
        packetId,
      };
    }
    case MessageType.SocketTcpAction: {
      const addr = parts[2];

      return {
        type: MessageType.SocketTcpAction,
        packetId,
        addr,
      };
    }
    case MessageType.ThrottleActionPass: {
      return {
        type: MessageType.ThrottleActionPass,
        packetId,
      };
    }
    case MessageType.ThrottleActionDelay: {
      return {
        type: MessageType.ThrottleActionDelay,
        packetId,
      };
    }
    default:
      return { type: MessageType.UnknownMessage };
  }
};

export const parseMessage = (message: string): Message[] => {
  const logs = message.split("\r\n");

  return logs.filter((log) => log.startsWith("DEBUG:")).map(parseLog);
};
