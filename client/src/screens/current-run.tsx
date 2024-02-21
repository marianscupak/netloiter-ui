import useWebSocket from "react-use-websocket";
import {
  Message,
  MessageType,
  MessageWithPacketId,
} from "../../../server/nl-status/message-types";
import { useNlStatusEndpoints } from "../utils/use-nl-status-endpoints";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Button } from "@mui/material";
import { PacketEventList } from "../components/events/packet-event-list";

export const CurrentRun = () => {
  const { lastJsonMessage } = useWebSocket<{ messages: Message[] }>(
    "ws://localhost:2022",
  );
  const [runningFrom, setRunningFrom] = useState<Date | false>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const { getIsNetLoiterRunning, stopNetLoiter } = useNlStatusEndpoints();

  useEffect(() => {
    const call = async () => {
      const response = await getIsNetLoiterRunning();
      if (response.status === 200) {
        const { runningFrom: newRunningFrom } = response.data;
        setRunningFrom(newRunningFrom);
      }
    };

    call();
  }, []);

  useEffect(() => {
    if (lastJsonMessage) {
      console.log(lastJsonMessage);
      setMessages((oldMessages) => [
        ...oldMessages,
        ...lastJsonMessage.messages,
      ]);
    }
  }, [lastJsonMessage]);

  const messagesWithPackedIds = useMemo(
    () =>
      messages.filter(
        (message) =>
          message.type !== MessageType.StartingNetLoiter &&
          message.type !== MessageType.UnknownMessage,
      ) as MessageWithPacketId[],
    [messages],
  );

  return (
    <div className="p-4">
      <div className="text-header">Current run</div>
      <div className="mb-2">
        Running from:{" "}
        {dayjs(runningFrom || undefined).format("DD. MM. HH:mm:ss")}
      </div>
      <Button variant="contained" color="error" onClick={stopNetLoiter}>
        STOP
      </Button>
      <div className="text-subheader mt-6">Events</div>
      <PacketEventList messages={messagesWithPackedIds} />
    </div>
  );
};
