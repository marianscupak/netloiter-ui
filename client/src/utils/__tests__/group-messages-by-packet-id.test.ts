import { MessageWithPacketId } from "../../../../server/nl-status/message-types";
import { GroupedMessages, groupMessagesByPacketId } from "../common";

describe("group messages by packet ID", () => {
  test("should group messages by packet ID", () => {
    const messages: MessageWithPacketId[] = [
      {
        type: 8,
        packetId: 0,
        sourceIp: "192.168.64.4",
        sourcePort: 22,
        destIp: "192.168.64.1",
        destPort: 55327,
      },
      { type: 2, packetId: 0, ruleIndex: 1 },
      { type: 3, packetId: 0, ruleIndex: 1, failedGuardIndex: 1 },
      { type: 9, packetId: 0 },
      {
        type: 8,
        packetId: 1,
        sourceIp: "127.0.0.1",
        sourcePort: 12,
        destIp: "8.8.8.8",
        destPort: 34,
      },
      { type: 2, packetId: 1, ruleIndex: 1 },
      { type: 3, packetId: 1, ruleIndex: 1, failedGuardIndex: 1 },
      { type: 9, packetId: 1 },
      { type: 9, packetId: 2 },
    ];

    const expectedResult: GroupedMessages = {
      "0": {
        messages: messages.filter((mess) => mess.packetId === 0),
        sourceIp: "192.168.64.4",
        sourcePort: 22,
        destIp: "192.168.64.1",
        destPort: 55327,
      },
      "1": {
        messages: messages.filter((mess) => mess.packetId === 1),
        sourceIp: "127.0.0.1",
        sourcePort: 12,
        destIp: "8.8.8.8",
        destPort: 34,
      },
      "2": {
        messages: [{ type: 9, packetId: 2 }],
      },
    };

    expect(groupMessagesByPacketId(messages)).toEqual(expectedResult);
  });
});
