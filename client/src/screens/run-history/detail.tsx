import { NavLink, useParams } from "react-router-dom";
import { trpc } from "../../utils/trpc";
import { z } from "zod";
import { Button, CircularProgress } from "@mui/material";
import { PacketEventList } from "../../components/events/packet-event-list";
import {
  Message,
  MessageType,
  messageTypeOptions,
} from "../../../../server/nl-status/message-types";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { statusAtom } from "../../state/status";
import { CreateScenarioFormValues } from "../../components/forms/scenarios/create-scenario-form-types";
import { EventListControls } from "../../components/events/event-list-controls";
import { Pagination } from "../../components/common/pagination";

export const messageTypesInitialValue: MessageType[] = messageTypeOptions.map(
  (option) => option.value as MessageType,
);

export const RunHistoryDetail = () => {
  const [status, setStatus] = useAtom(statusAtom);
  const [originalScenario] = useState(status.scenario);
  const [messageTypeFilter, setMessageFilterType] = useState<MessageType[]>(
    messageTypesInitialValue,
  );
  const [page, setPage] = useState(1);
  const [eventsShown, setEventsShown] = useState(100);

  const onPageChange = useCallback((page: number) => {
    setPage(page);
  }, []);

  const { id: urlId } = useParams();

  const id = useMemo(() => Number.parseInt(z.string().parse(urlId)), [urlId]);

  const { data: runHistory } = trpc.runHistory.getRunHistoryDetail.useQuery({
    id,
    messageTypes:
      messageTypeFilter.length === messageTypesInitialValue.length
        ? undefined
        : messageTypeFilter,
  });

  const { data: messages } = trpc.runHistory.getRunMessages.useQuery({
    id,
    page,
    pageSize: eventsShown,
    messageTypes:
      messageTypeFilter.length === messageTypesInitialValue.length
        ? undefined
        : messageTypeFilter,
  });

  useEffect(() => {
    if (runHistory && !status.scenario) {
      setStatus((oldStatus) => ({
        ...oldStatus,
        scenario: runHistory.scenario as CreateScenarioFormValues,
      }));
    }

    return () => {
      setStatus((oldStatus) => ({ ...oldStatus, scenario: originalScenario }));
    };
  }, [runHistory]); // eslint-disable-line react-hooks/exhaustive-deps

  const onEventsShownChange = useCallback((n: number) => {
    setEventsShown(n);
  }, []);

  const onMessageFilterChange = useCallback((types: MessageType[]) => {
    setMessageFilterType(types);
  }, []);

  return (
    <div className="p-4">
      <div className="text-header">
        Run{" "}
        {runHistory
          ? dayjs(runHistory.dateTime).format("DD. MM. YYYY HH:mm")
          : "History"}
      </div>
      <div className="flex gap-2 mb-2">
        {runHistory?.scenarioId ? (
          <NavLink to={`/scenarios/${runHistory.scenarioId}`}>
            <Button variant="contained">SCENARIO</Button>
          </NavLink>
        ) : null}
        {runHistory?.configId ? (
          <NavLink to={`/configs/${runHistory.configId}`}>
            <Button variant="contained">CONFIG</Button>
          </NavLink>
        ) : null}
      </div>
      <NavLink to={`/run-history/${id}/statistics`}>
        <Button variant="contained" color="warning">
          STATISTICS
        </Button>
      </NavLink>
      <div>
        <div className="w-full">
          <div className="text-subheader mt-6 mb-4">Events</div>
          <EventListControls
            eventsShown={eventsShown}
            onEventsShownChange={onEventsShownChange}
            showMessageTypeFilter
            onMessageTypeFilterChange={onMessageFilterChange}
            messageTypeFilter={messageTypeFilter}
          />
          <Pagination
            count={
              runHistory?.messagesCount
                ? Math.ceil(runHistory.messagesCount / eventsShown)
                : 1
            }
            onChange={onPageChange}
          />
        </div>
        {messages ? (
          <div>
            <PacketEventList
              messages={
                messages.map((message) =>
                  "data" in message ? message.data : message,
                ) as Message[]
              }
            />
          </div>
        ) : (
          <div className="flex justify-center">
            <CircularProgress color="info" size="60px" />
          </div>
        )}
      </div>
    </div>
  );
};
