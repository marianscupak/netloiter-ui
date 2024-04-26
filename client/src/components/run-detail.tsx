import { useAtom } from "jotai";
import { statusAtom } from "../state/status";
import { useCallback, useEffect, useState } from "react";
import { Message, MessageType } from "../../../server/nl-status/message-types";
import { trpc } from "../utils/trpc";
import { CreateScenarioFormValues } from "./forms/scenarios/create-scenario-form-types";
import { NavLink } from "react-router-dom";
import { Button, Chip, CircularProgress } from "@mui/material";
import { EventListControls } from "./events/event-list-controls";
import { Pagination } from "./common/pagination";
import { PacketEventList } from "./events/packet-event-list";
import { messageTypesInitialValue } from "../screens/run-history/detail";
import { useNlStatusEndpoints } from "../utils/use-nl-status-endpoints";

interface Props {
  id: number;
  showStopButton?: boolean;
  showEditConfigButton?: boolean;
  messagesCount?: number;
  liveStats?: boolean;
}

export const RunDetail = ({
  id,
  showStopButton,
  showEditConfigButton,
  messagesCount,
  liveStats,
}: Props) => {
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
      if ("scenario" in runHistory) {
        setStatus((oldStatus) => ({
          ...oldStatus,
          scenario: runHistory.scenario as CreateScenarioFormValues,
        }));
      }
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

  const { stopNetLoiter } = useNlStatusEndpoints();

  const onStopNetLoiter = useCallback(async () => {
    await stopNetLoiter();
    setStatus((prev) => ({ ...prev, runningFrom: false }));
  }, [setStatus, stopNetLoiter]);

  return (
    <div>
      <div className="flex gap-2 mb-2 items-center">
        {runHistory?.scenarioId && (
          <NavLink to={`/scenarios/${runHistory.scenarioId}`}>
            <Button variant="contained">SCENARIO</Button>
          </NavLink>
        )}
        {runHistory?.configId && (
          <NavLink to={`/configs/${runHistory.configId}`}>
            <Button variant="contained">CONFIG</Button>
          </NavLink>
        )}
        {runHistory?.defaultAction && (
          <Chip
            label={`Default Action: ${runHistory.defaultAction}`}
            color="primary"
            style={{ fontSize: 14, fontWeight: 500 }}
          />
        )}
      </div>
      <div className="flex gap-2">
        <NavLink
          to={
            liveStats
              ? `/current-run/${id}/statistics`
              : `/run-history/${id}/statistics`
          }
        >
          <Button variant="contained" color="warning">
            STATISTICS
          </Button>
        </NavLink>
        {showEditConfigButton && (
          <NavLink to="/current-run/edit-config">
            <Button variant="contained" color="warning">
              EDIT CONFIG
            </Button>
          </NavLink>
        )}
      </div>
      {showStopButton && (
        <div className="mt-2">
          {showStopButton && (
            <Button variant="contained" color="error" onClick={onStopNetLoiter}>
              STOP
            </Button>
          )}
        </div>
      )}
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
              messagesCount
                ? Math.ceil(messagesCount / eventsShown)
                : runHistory?.messagesCount
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
