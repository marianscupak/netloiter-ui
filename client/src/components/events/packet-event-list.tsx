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

export const PacketEventList = ({ messages }: Props) => {
  const messagesWithPackedIds = useMemo(
    () =>
      messages.filter(
        (message) =>
          message.type !== MessageType.StartingNetLoiter &&
          message.type !== MessageType.UnknownMessage,
      ) as MessageWithPacketId[],
    [messages],
  );

  const groupedEvents = useMemo(
    () =>
      messages.length > 0 ? groupMessagesByPacketId(messagesWithPackedIds) : {},
    [messages.length, messagesWithPackedIds],
  );

  return Object.keys(groupedEvents).map((key) => (
    <div className="my-2" key={key}>
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary>Packet ID: {key}</AccordionSummary>
        <AccordionDetails>
          {groupedEvents[key].map((message, index) => (
            <div className="my-2" key={index}>
              <Event message={message} />
            </div>
          ))}
        </AccordionDetails>
      </Accordion>
    </div>
  ));
};
