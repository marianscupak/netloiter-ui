import useWebSocket from "react-use-websocket";
import {
  Message,
  MessageType,
  MessageWithPacketId,
} from "../../../server/nl-status/message-types";
import { useNlStatusEndpoints } from "../utils/use-nl-status-endpoints";
import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Button } from "@mui/material";
import { PacketEventList } from "../components/events/packet-event-list";
import { NavLink } from "react-router-dom";
import { EventListControls } from "../components/events/event-list-controls";

export const CurrentRun = () => {
  const { lastJsonMessage } = useWebSocket<{ messages: Message[] }>(
    "ws://localhost:2022",
  );
  const [runningFrom, setRunningFrom] = useState<Date | false>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const { getNetLoiterStatus, stopNetLoiter } = useNlStatusEndpoints();

  useEffect(() => {
    const call = async () => {
      const response = await getNetLoiterStatus();
      if (response.status === 200) {
        const { runningFrom: newRunningFrom } = response.data;
        setRunningFrom(newRunningFrom);
      }
    };

    call();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [eventsShown, setEventsShown] = useState(100);

  const onEventsShownChange = useCallback((n: number) => {
    setEventsShown(n);
  }, []);

  useEffect(() => {
    if (lastJsonMessage) {
      setMessages((oldMessages) =>
        [...oldMessages, ...lastJsonMessage.messages].slice(eventsShown * -1),
      );
    }
  }, [eventsShown, lastJsonMessage]);

  const [pausedMessages, setPausedMessages] = useState<Message[]>([]);

  const onPause = useCallback(() => {
    setPausedMessages(messages.slice(eventsShown * -1));
  }, [eventsShown, messages]);

  const onResume = useCallback(() => {
    setPausedMessages([]);
  }, []);

  return (
    <div className="p-4">
      <div className="text-header">Current run</div>
      <div className="mb-2">
        Running from:{" "}
        {dayjs(runningFrom || undefined).format("DD. MM. HH:mm:ss")}
      </div>
      <div className="flex gap-2">
        <NavLink to="/current-run/edit-config">
          <Button variant="contained" color="warning">
            EDIT CONFIG
          </Button>
        </NavLink>
        <Button variant="contained" color="error" onClick={stopNetLoiter}>
          STOP
        </Button>
      </div>
      <div className="text-subheader mt-6">Events</div>
      <EventListControls
        eventsShown={eventsShown}
        isPaused={pausedMessages.length !== 0}
        onEventsShownChange={onEventsShownChange}
        onPause={onPause}
        onResume={onResume}
      />
      <PacketEventList
        messages={pausedMessages.length === 0 ? messages : pausedMessages}
      />
    </div>
  );
};
