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

  console.log(statistics);

  return (
    <div className="p-4">
      <div className="text-header">
        Run{" "}
        {runHistory
          ? dayjs(runHistory.dateTime).format("DD. MM. YYYY HH:mm")
          : "History"}{" "}
        Statistics
      </div>
      {statistics ? (
        <div>
          <div className="text-subheader">
            Packets Processed: {statistics.packetsProcessed}
          </div>
          <div className="bg-dark-gray mt-2 border rounded-[4px] p-4">
            <LineChart
              series={[
                {
                  data: statistics.packetsByTime.map((x) => x.packetsCount),
                  color: "#64D22D",
                },
              ]}
              height={400}
              xAxis={[
                {
                  id: "time",
                  data: statistics.packetsByTime.map((x) =>
                    dayjs(x.time).format("HH:mm:ss"),
                  ),
                  scaleType: "band",
                },
              ]}
              sx={chartStyles}
            />
          </div>
          {statistics.packetsDroppedCount > 0 ? (
            <div className="mt-4">
              <div className="text-subheader">
                Packets Dropped: {statistics.packetsDroppedCount} (
                {Math.round(
                  (statistics.packetsDroppedCount /
                    statistics.packetsProcessed) *
                    10000,
                ) / 100}
                % of total)
              </div>
              <div className="bg-dark-gray mt-2 border rounded-[4px] p-4">
                <LineChart
                  series={[
                    {
                      data: statistics.packetsDroppedByTime.map(
                        (x) => x.packetsCount,
                      ),
                      color: "#64D22D",
                    },
                  ]}
                  height={400}
                  xAxis={[
                    {
                      id: "time",
                      data: statistics.packetsDroppedByTime.map((x) =>
                        dayjs(x.time).format("HH:mm:ss"),
                      ),
                      scaleType: "band",
                    },
                  ]}
                  sx={chartStyles}
                />
              </div>
            </div>
          ) : (
            <div className="mt-4 text-subheader">No packets dropped.</div>
          )}
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
