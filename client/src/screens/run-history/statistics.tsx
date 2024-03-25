import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import dayjs from "dayjs";
import { CircularProgress } from "@mui/material";
import { LineChart, PieChart } from "@mui/x-charts";
import { messageTypeOptions } from "../../../../server/nl-status/message-types";

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

export const RunStatistics = () => {
  const { id: urlId } = useParams();

  const id = useMemo(() => Number.parseInt(z.string().parse(urlId)), [urlId]);

  const { data: runHistory } = trpc.runHistory.getRunHistoryDetail.useQuery({
    id,
  });

  const { data: statistics } = trpc.runHistory.getRunStatistics.useQuery({
    id,
  });

  const normalizedStats = useMemo(() => {
    if (statistics) {
      const times = statistics.packetsByTime.map((p) =>
        dayjs(p.time).set("milliseconds", 0),
      );

      const stats = times.map((time) => {
        const packets =
          statistics.packetsByTime.find((p) =>
            dayjs(p.time).set("milliseconds", 0).isSame(time),
          )?.packetsCount || 0;

        const droppedPackets =
          statistics.packetsDroppedByTime.find((d) =>
            dayjs(d.time).set("milliseconds", 0).isSame(time),
          )?.packetsCount || 0;

        return { packets, droppedPackets };
      });

      return { times, stats };
    }

    return undefined;
  }, [statistics]);

  const normalizedTimes = useMemo(() => {
    if (normalizedStats) {
      const startTime = normalizedStats.times[0];

      return normalizedStats.times.map((time) =>
        time.diff(startTime, "seconds"),
      );
    }

    return undefined;
  }, [normalizedStats]);

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
          <div className="text-subsubheader mt-2">
            {statistics.packetsDroppedCount > 0
              ? `Packets Dropped: ${statistics.packetsDroppedCount} (${
                  Math.round(
                    (statistics.packetsDroppedCount /
                      statistics.packetsProcessed) *
                      10000,
                  ) / 100
                }
                % of total)`
              : "No packets dropped."}
          </div>
          <div className="bg-dark-gray mt-2 border rounded-[4px] p-4">
            <LineChart
              series={[
                {
                  data: normalizedStats?.stats.map((x) => x.packets),
                  color: "#64D22D",
                  label: "Packets processed",
                },
                {
                  data: normalizedStats?.stats.map((x) => x.droppedPackets),
                  color: "#D41121",
                  label: "Packets dropped",
                },
              ]}
              height={400}
              xAxis={[
                {
                  id: "time",
                  data: normalizedTimes,
                  scaleType: "band",
                  label: "Time (s)",
                  labelStyle: { fill: "#F2F2F3" },
                },
              ]}
              sx={chartStyles}
            />
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
