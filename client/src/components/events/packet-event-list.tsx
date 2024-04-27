import {
  Message,
  MessageType,
  MessageWithPacketId,
} from "../../../../server/nl-status/message-types";
import { Event } from "./event";
import { useMemo } from "react";
import { groupMessagesByPacketId } from "../../utils/common";
import { AccordionDetails, AccordionSummary } from "@mui/material";
import { Accordion } from "../common/accordion";

interface Props {
  messages: Message[];
}

const messageTypesWithoutPacketIds = [
  MessageType.StartingNetLoiter,
  MessageType.UnknownMessage,
  MessageType.RulesReplaced,
];

export const PacketEventList = ({ messages }: Props) => {
  const messagesWithPackedIds = useMemo(
    () =>
      messages.filter(
        (message) => !messageTypesWithoutPacketIds.includes(message.type),
      ) as MessageWithPacketId[],
    [messages],
  );

  const messagesWithoutPacketIds = useMemo(
    () =>
      messages.filter((message) =>
        messageTypesWithoutPacketIds.includes(message.type),
      ),
    [messages],
  );

  const groupedEvents = useMemo(
    () =>
      messages.length > 0 ? groupMessagesByPacketId(messagesWithPackedIds) : {},
    [messages.length, messagesWithPackedIds],
  );

  return (
    <div>
      {messagesWithoutPacketIds.map((message, index) => (
        <div className="my-2" key={index}>
          <Event message={message} />
        </div>
      ))}
      {Object.keys(groupedEvents).map((key) => (
        <div className="my-2" key={key}>
          <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
            {groupedEvents[key].sourceIp ? (
              <AccordionSummary>
                Source: {groupedEvents[key].sourceIp}
                {groupedEvents[key].sourcePort !== -1
                  ? `:${groupedEvents[key].sourcePort}`
                  : ""}{" "}
                {"->"} Destination: {groupedEvents[key].destIp}
                {groupedEvents[key].destPort !== -1
                  ? `:${groupedEvents[key].destPort}`
                  : ""}
              </AccordionSummary>
            ) : (
              <AccordionSummary>Packet ID: {key}</AccordionSummary>
            )}
            <AccordionDetails>
              {groupedEvents[key].messages.map((message, index) => (
                <div className="my-2" key={index}>
                  <Event message={message} />
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
      ))}
    </div>
  );
};
