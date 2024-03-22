import { parseMessage } from "../parse-message";
import { Message, MessageType } from "../message-types";

describe("parse message module", () => {
  test("parses messages", () => {
    const messages =
      "DEBUG: 3,8627,1,1\r\n" +
      "DEBUG: 9,8627\r\n" +
      "\r\n" +
      "DEBUG: 8,8628,192.168.64.1,59878,192.168.64.4,22";

    const expectedResult: Message[] = [
      {
        type: MessageType.AllRuleFailure,
        packetId: 8627,
        ruleIndex: 1,
        failedGuardIndex: 1,
      },
      {
        type: MessageType.EndingPacketProcessing,
        packetId: 8627,
      },
      {
        type: MessageType.StartingPacketProcessing,
        packetId: 8628,
        sourceIp: "192.168.64.1",
        sourcePort: 59878,
        destIp: "192.168.64.4",
        destPort: 22,
      },
    ];

    expect(parseMessage(messages)).toEqual(expectedResult);
  });
});
