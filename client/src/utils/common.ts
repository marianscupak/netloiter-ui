import {
  MessageType,
  MessageWithPacketId,
} from "../../../server/nl-status/message-types";

export type GroupedMessages = {
  [key: string]: {
    messages: MessageWithPacketId[];
    sourceIp?: string;
    sourcePort?: number;
    destIp?: string;
    destPort?: number;
  };
};

export const groupMessagesByPacketId = (
  messages: MessageWithPacketId[],
): GroupedMessages =>
  messages.reduce((acc: GroupedMessages, item) => {
    if (!acc[item.packetId]) {
      acc[item.packetId] = { messages: [] };
    }

    let newProp = {
      ...acc[item.packetId],
      messages: [...acc[item.packetId].messages, item],
    };

    if (item.type === MessageType.StartingPacketProcessing) {
      const { sourceIp, sourcePort, destIp, destPort } = item;
      newProp = { ...newProp, sourceIp, sourcePort, destIp, destPort };
    }

    return { ...acc, [item.packetId]: newProp };
  }, {});
