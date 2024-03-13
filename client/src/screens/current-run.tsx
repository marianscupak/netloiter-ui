import useWebSocket from "react-use-websocket";
import { Message } from "../../../server/nl-status/message-types";
import { useNlStatusEndpoints } from "../utils/use-nl-status-endpoints";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { Button } from "@mui/material";
import { PacketEventList } from "../components/events/packet-event-list";
import { NavLink } from "react-router-dom";
import { EventListControls } from "../components/events/event-list-controls";
import { useAtom } from "jotai";
import { statusAtom } from "../state/status";
import { ScenarioType } from "../../../server/prisma/public";
import { Modal } from "../components/common/modal";
import { CreateScenarioForm } from "../components/forms/scenarios/create-scenario-form";
import { CreateConfigForm } from "../components/forms/configs/create-config-form";

export const CurrentRun = () => {
  const { lastJsonMessage } = useWebSocket<{ messages: Message[] }>(
    "ws://localhost:2022",
  );
  const [runningFrom, setRunningFrom] = useState<Date | false>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [{ scenario, config }] = useAtom(statusAtom);

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

  const [eventsShown, setEventsShown] = useState(1000);

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

  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);

  const openScenarioModal = useCallback(() => {
    setScenarioModalOpen(true);
  }, []);

  const closeScenarioModal = useCallback(() => {
    setScenarioModalOpen(false);
  }, []);

  const [configModalOpen, setConfigModalOpen] = useState(false);

  const openConfigModal = useCallback(() => {
    setConfigModalOpen(true);
  }, []);

  const closeConfigModal = useCallback(() => {
    setConfigModalOpen(false);
  }, []);

  return (
    <div className="p-4">
      <div className="text-header">Current run</div>
      <div className="mb-2">
        {runningFrom
          ? `Running from: ${dayjs(runningFrom).format("DD. MM. HH:mm:ss")}`
          : "Not Running"}
      </div>
      <div className="flex gap-2 mb-2">
        <Button variant="contained" onClick={openScenarioModal}>
          SCENARIO
        </Button>
        <Button variant="contained" onClick={openConfigModal}>
          CONFIG
        </Button>
      </div>
      <div className="flex gap-2">
        {scenario?.type === ScenarioType.SequentialHTTP && (
          <NavLink to="/current-run/edit-config">
            <Button variant="contained" color="warning">
              EDIT CONFIG
            </Button>
          </NavLink>
        )}
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
        showPause
      />
      <PacketEventList
        messages={pausedMessages.length === 0 ? messages : pausedMessages}
      />
      <Modal open={scenarioModalOpen} onClose={closeScenarioModal}>
        <div className="max-h-[calc(100vh-150px)] overflow-auto">
          <div className="w-full flex justify-center">
            <CreateScenarioForm defaultValues={scenario} readOnly />
          </div>
        </div>
      </Modal>
      <Modal open={configModalOpen} onClose={closeConfigModal}>
        <div className="max-h-[calc(100vh-150px)] overflow-auto">
          <div className="w-full flex justify-center">
            <CreateConfigForm defaultValues={config} readOnly />
          </div>
        </div>
      </Modal>
    </div>
  );
};
