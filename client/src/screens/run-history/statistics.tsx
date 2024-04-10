import dayjs from "dayjs";
import { Button, CircularProgress } from "@mui/material";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { TextField } from "../../components/forms/text-field";
import { LineGraph } from "../../components/graphs/line-graph";
import { PieGraph } from "../../components/graphs/pie-graph";
import { useRunStatistics } from "./use-run-statistics";
import { NetworkGraph } from "../../components/graphs/network-graph";

interface Props {
  live?: boolean;
}

export const RunStatistics = ({ live }: Props) => {
  const {
    runHistory,
    statistics,
    windowFrom,
    moveWindowForward,
    moveWindowBackward,
    onWindowSizeChange,
    windowSize,
    normalizedTimes,
    formattedTimes,
    graphSeries,
    flows,
  } = useRunStatistics({ live });

  return (
    <div className="p-4">
      <div className="text-header">
        Run{" "}
        {runHistory
          ? dayjs(runHistory.dateTime).format("DD. MM. YYYY HH:mm:ss")
          : "History"}{" "}
        Statistics
      </div>
      {statistics ? (
        <div>
          <div className="text-subsubheader mt-4">
            Packets Processed: {statistics.packetsProcessed}
          </div>
          {statistics.packetsFinishedCount > 0 && (
            <div className="text-subsubheader mt-2">
              {`Packets Finished: ${statistics.packetsFinishedCount} (${
                Math.round(
                  (statistics.packetsFinishedCount /
                    statistics.packetsProcessed) *
                    10000,
                ) / 100
              }
                % of total)`}
            </div>
          )}
          {statistics.packetsDroppedCount > 0 && (
            <div className="text-subsubheader mt-2">
              {`Packets Dropped: ${statistics.packetsDroppedCount} (${
                Math.round(
                  (statistics.packetsDroppedCount /
                    statistics.packetsProcessed) *
                    10000,
                ) / 100
              }
                % of total)`}
            </div>
          )}
          {statistics.packetsSkippedCount > 0 && (
            <div className="text-subsubheader mt-2">
              {`Packets Skipped: ${statistics.packetsSkippedCount} (${
                Math.round(
                  (statistics.packetsSkippedCount /
                    statistics.packetsProcessed) *
                    10000,
                ) / 100
              }
                % of total)`}
            </div>
          )}
          {statistics.packetsPausedCount > 0 && (
            <div className="text-subsubheader mt-2">
              {`Packets Paused: ${statistics.packetsPausedCount} (${
                Math.round(
                  (statistics.packetsPausedCount /
                    statistics.packetsProcessed) *
                    10000,
                ) / 100
              }
                % of total)`}
            </div>
          )}
          <div className="bg-dark-gray mt-2 border rounded-[4px] p-4">
            <div className="flex gap-2">
              <Button
                variant="contained"
                onClick={moveWindowBackward}
                disabled={windowFrom === 0 || typeof windowSize === "string"}
              >
                <ArrowLeft />
              </Button>
              <Button
                variant="contained"
                onClick={moveWindowForward}
                disabled={
                  typeof windowSize === "string" ||
                  !normalizedTimes?.at(windowFrom + windowSize)
                }
              >
                <ArrowRight />
              </Button>
              <TextField
                type="number"
                label="Window size"
                size="small"
                value={windowSize}
                onChange={onWindowSizeChange}
              />
            </div>
            {typeof windowSize === "number" &&
              (graphSeries[0].data?.length ?? 0) > 0 && (
                <LineGraph
                  windowFrom={windowFrom}
                  windowSize={windowSize}
                  graphSeries={graphSeries}
                  formattedTimes={formattedTimes}
                />
              )}
          </div>
        </div>
      ) : (
        <div className="w-full h-[calc(100vh-100px)] flex justify-center items-center">
          <CircularProgress size={100} />
        </div>
      )}
      {flows ? (
        <div>
          <div className="text-subheader mt-4">Network Flows</div>
          <NetworkGraph flows={flows} />
        </div>
      ) : (
        <CircularProgress />
      )}
      {statistics ? (
        <div className="mt-4">
          <div className="text-subheader mb-4">Message Types</div>
          <PieGraph messageCountByType={statistics.messageCountByType} />
        </div>
      ) : null}
    </div>
  );
};
