import { useParams } from "react-router-dom";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import dayjs from "dayjs";
import { Button, CircularProgress } from "@mui/material";
import { LineChart, PieChart } from "@mui/x-charts";
import { messageTypeOptions } from "../../../../server/nl-status/message-types";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { TextField } from "../../components/forms/text-field";

const chartStyles = {
  "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
    fill: "#F2F2F3",
  },
  "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
    fill: "#F2F2F3",
  },
  "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
    stroke: "#F2F2F3",
  },
  "& .MuiChartsAxis-left .MuiChartsAxis-line": {
    stroke: "#F2F2F3",
  },
  "& .MuiChartsAxis-tick": {
    stroke: "#F2F2F3",
  },
};

interface Props {
  live?: boolean;
}

export const RunStatistics = ({ live }: Props) => {
  const [windowFrom, setWindowFrom] = useState(0);
  const [windowSize, setWindowSize] = useState<number | string>(20);
  const { id: urlId } = useParams();

  const id = useMemo(() => Number.parseInt(z.string().parse(urlId)), [urlId]);

  const { data: runHistory } = trpc.runHistory.getRunHistoryDetail.useQuery({
    id,
  });

  const { data: statistics } = trpc.runHistory.getRunStatistics.useQuery(
    {
      id,
    },
    { refetchInterval: live ? 5000 : undefined },
  );

  const normalizedTimes = useMemo(() => {
    if (statistics) {
      const startTime = dayjs(
        statistics.packetsByTime.reduce((previous, current) =>
          previous.time < current.time ? previous : current,
        ).time,
      ).set("milliseconds", 0);
      const endTime = dayjs(
        statistics.packetsByTime.reduce((previous, current) =>
          previous.time > current.time ? previous : current,
        ).time,
      ).set("milliseconds", 0);

      const times = [];
      let currentTime = startTime;
      while (currentTime <= endTime) {
        times.push(currentTime);
        currentTime = currentTime.add(1, "second");
      }

      return times;
    }

    return undefined;
  }, [statistics]);

  const normalizedStats = useMemo(() => {
    if (statistics && normalizedTimes) {
      const stats = normalizedTimes.map((time) => {
        const packets =
          statistics.packetsByTime.find((p) =>
            dayjs(p.time).set("milliseconds", 0).isSame(time),
          )?.packetsCount || 0;

        const droppedPackets =
          statistics.packetsDroppedCount > 0
            ? statistics.packetsDroppedByTime.find((d) =>
                dayjs(d.time).set("milliseconds", 0).isSame(time),
              )?.packetsCount || 0
            : null;

        const finishedPackets =
          statistics.packetsFinishedCount > 0
            ? statistics.packetsFinishedByTime.find((d) =>
                dayjs(d.time).set("milliseconds", 0).isSame(time),
              )?.packetsCount || 0
            : null;

        const pausedPackets =
          statistics.packetsPausedCount > 0
            ? statistics.packetsPausedByTime.find((d) =>
                dayjs(d.time).set("milliseconds", 0).isSame(time),
              )?.packetsCount || 0
            : null;

        const skippedPackets =
          statistics.packetsSkippedCount > 0
            ? statistics.packetsSkippedByTime.find((d) =>
                dayjs(d.time).set("milliseconds", 0).isSame(time),
              )?.packetsCount || 0
            : null;

        return {
          packets,
          droppedPackets,
          finishedPackets,
          pausedPackets,
          skippedPackets,
        };
      });

      return { stats };
    }

    return undefined;
  }, [normalizedTimes, statistics]);

  const moveWindowForward = useCallback(() => {
    if (normalizedTimes && typeof windowSize === "number") {
      setWindowFrom((old) =>
        Math.min(old + windowSize, normalizedTimes.length - windowSize),
      );
    }
  }, [normalizedTimes, windowSize]);

  const moveWindowBackward = useCallback(() => {
    if (typeof windowSize === "number") {
      setWindowFrom((old) => Math.max(old - windowSize, 0));
    }
  }, [windowSize]);

  const onWindowSizeChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const eventValue = e.target.value;
    if (eventValue === "") {
      setWindowSize("");
    }

    const value = Number.parseInt(eventValue);

    if (!isNaN(value)) {
      setWindowSize(value);
    }
  }, []);

  const formattedTimes = useMemo(() => {
    if (normalizedTimes) {
      const startTime = normalizedTimes[0];

      return normalizedTimes.map((time) => time.diff(startTime, "seconds"));
    }

    return undefined;
  }, [normalizedTimes]);

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
            {typeof windowSize === "number" && (
              <LineChart
                series={[
                  {
                    data: normalizedStats?.stats
                      .map((x) => x.packets)
                      .slice(windowFrom, windowFrom + windowSize),
                    color: "#64D22D",
                    label: "Packets processed",
                  },
                  ...(statistics.packetsDroppedCount > 0
                    ? [
                        {
                          data: normalizedStats?.stats
                            .map((x) => x.droppedPackets)
                            .slice(windowFrom, windowFrom + windowSize),
                          color: "#D41121",
                          label: "Packets dropped",
                        },
                      ]
                    : []),
                  ...(statistics.packetsPausedCount > 0
                    ? [
                        {
                          data: normalizedStats?.stats
                            .map((x) => x.pausedPackets)
                            .slice(windowFrom, windowFrom + windowSize),
                          color: "#FFBA1A",
                          label: "Packets paused",
                        },
                      ]
                    : []),
                  ...(statistics.packetsSkippedCount > 0
                    ? [
                        {
                          data: normalizedStats?.stats
                            .map((x) => x.skippedPackets)
                            .slice(windowFrom, windowFrom + windowSize),
                          color: "#651fff",
                          label: "Packets skipped",
                        },
                      ]
                    : []),
                  ...(statistics.packetsFinishedCount > 0
                    ? [
                        {
                          data: normalizedStats?.stats
                            .map((x) => x.finishedPackets)
                            .slice(windowFrom, windowFrom + windowSize),
                          color: "#2196f3",
                          label: "Packets finished",
                        },
                      ]
                    : []),
                ]}
                height={400}
                xAxis={[
                  {
                    id: "time",
                    data: formattedTimes?.slice(
                      windowFrom,
                      windowFrom + windowSize,
                    ),
                    scaleType: "band",
                    label: "Time (s)",
                    labelStyle: { fill: "#F2F2F3" },
                  },
                ]}
                sx={chartStyles}
              />
            )}
          </div>
          <div className="mt-4">
            <div className="text-subheader mb-4">Message Types</div>
            <PieChart
              series={[
                {
                  data: statistics.messageCountByType.map(
                    ({ messagesCount, type }) => ({
                      id: type,
                      value: messagesCount,
                      label: `${messageTypeOptions.find(
                        ({ value }) =>
                          value === Number.parseInt(type as unknown as string),
                      )?.label}: ${messagesCount}`,
                    }),
                  ),
                },
              ]}
              height={400}
            />
          </div>
        </div>
      ) : (
        <div className="w-full h-[calc(100vh-100px)] flex justify-center items-center">
          <CircularProgress size={100} />
        </div>
      )}
    </div>
  );
};
