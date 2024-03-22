import useWebSocket from "react-use-websocket";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { statusAtom } from "../state/status";
import { ScenarioType } from "../../../server/prisma/public";
import { useRunningFor } from "../utils/use-running-for";
import { RunDetail } from "../components/run-detail";

export const CurrentRun = () => {
  const { lastJsonMessage } = useWebSocket<{
    messagesCount: number;
    runId: number;
  }>("ws://localhost:2022");
  const [{ scenario, runningFrom }] = useAtom(statusAtom);
  const [messagesCount, setMessagesCount] = useState(0);
  const [runId, setRunId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (lastJsonMessage) {
      setMessagesCount(lastJsonMessage.messagesCount);
      setRunId(lastJsonMessage.runId);
    }
  }, [lastJsonMessage]);

  const runningFor = useRunningFor(runningFrom);

  return (
    <div className="p-4">
      <div className="text-header">Current run</div>
      <div className="mb-2">
        {runningFrom ? `Running for: ${runningFor}` : "Not Running"}
      </div>
      {runId !== undefined && (
        <RunDetail
          id={runId}
          showEditConfigButton={scenario?.type === ScenarioType.SequentialHTTP}
          messagesCount={messagesCount}
          showStopButton
        />
      )}
    </div>
  );
};
