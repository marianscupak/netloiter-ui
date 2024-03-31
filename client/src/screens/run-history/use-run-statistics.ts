import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import dayjs from "dayjs";

export const useRunStatistics = ({ live }: { live?: boolean }) => {
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

  const graphSeries = useMemo(
    () =>
      statistics && typeof windowSize === "number"
        ? [
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
          ]
        : [],
    [normalizedStats?.stats, statistics, windowFrom, windowSize],
  );

  return {
    runHistory,
    statistics,
    moveWindowBackward,
    moveWindowForward,
    windowSize,
    windowFrom,
    normalizedTimes,
    onWindowSizeChange,
    graphSeries,
    formattedTimes,
  };
};
