import { MessageWithPacketId } from "../../../server/nl-status/message-types";

export const groupMessagesByPacketId = (
  messages: MessageWithPacketId[],
): { [key: string]: MessageWithPacketId[] } =>
  messages.reduce((acc: any, item) => {
    if (!acc[item.packetId]) {
      acc[item.packetId] = [];
    }

    const newProp = [...acc[item.packetId], item];

    return { ...acc, [item.packetId]: newProp };
  }, {});
