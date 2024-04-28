import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import dayjs from "dayjs";
import { colors } from "../../utils/mui";

const STATS_REFETCH_PERIOD = z.coerce
  .number()
  .optional()
  .parse(import.meta.env.VITE_REFETCH_PERIOD);

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
    { refetchInterval: live ? STATS_REFETCH_PERIOD : undefined },
  );

  const { data: flows } = trpc.runHistory.getRunFlows.useQuery(
    { id },
    { refetchInterval: live ? STATS_REFETCH_PERIOD : undefined },
  );

  const normalizedTimes = useMemo(() => {
    if (statistics && statistics.packetsByTime.length > 0) {
      let startTime = dayjs(statistics.packetsByTime[0].time);
      let endTime = dayjs(statistics.packetsByTime[0].time);

      statistics.packetsByTime.forEach((packet) => {
        const packetTime = dayjs(packet.time);
        if (packetTime.isBefore(startTime)) {
          startTime = packetTime;
        }
        if (packetTime.isAfter(endTime)) {
          endTime = packetTime;
        }
      });

      startTime = startTime.set("milliseconds", 0);
      endTime = endTime.set("milliseconds", 0);

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
      const packetsByTimeMap = new Map(
        statistics.packetsByTime.map((packet) => [
          dayjs(packet.time).set("millisecond", 0).valueOf(),
          packet.packetsCount,
        ]),
      );
      const droppedByTimeMap = new Map(
        statistics.packetsDroppedByTime.map((packet) => [
          dayjs(packet.time).set("millisecond", 0).valueOf(),
          packet.packetsCount,
        ]),
      );
      const finishedByTimeMap = new Map(
        statistics.packetsFinishedByTime.map((packet) => [
          dayjs(packet.time).set("millisecond", 0).valueOf(),
          packet.packetsCount,
        ]),
      );
      const pausedByTimeMap = new Map(
        statistics.packetsPausedByTime.map((packet) => [
          dayjs(packet.time).set("millisecond", 0).valueOf(),
          packet.packetsCount,
        ]),
      );
      const skippedByTimeMap = new Map(
        statistics.packetsSkippedByTime.map((packet) => [
          dayjs(packet.time).set("millisecond", 0).valueOf(),
          packet.packetsCount,
        ]),
      );

      const stats = normalizedTimes.map((time) => {
        const timeValue = time.valueOf();
        const packets = packetsByTimeMap.get(timeValue) || 0;
        const droppedPackets = droppedByTimeMap.get(timeValue) || 0;
        const finishedPackets = finishedByTimeMap.get(timeValue) || 0;
        const pausedPackets = pausedByTimeMap.get(timeValue) || 0;
        const skippedPackets = skippedByTimeMap.get(timeValue) || 0;

        return {
          packets,
          droppedPackets:
            statistics.packetsDroppedCount > 0 ? droppedPackets : null,
          finishedPackets:
            statistics.packetsFinishedCount > 0 ? finishedPackets : null,
          pausedPackets:
            statistics.packetsPausedCount > 0 ? pausedPackets : null,
          skippedPackets:
            statistics.packetsSkippedCount > 0 ? skippedPackets : null,
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

    if (!isNaN(value) && value <= 200) {
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
              color: colors.primary,
              label: "Packets processed",
            },
            ...(statistics.packetsDroppedCount > 0
              ? [
                  {
                    data: normalizedStats?.stats
                      .map((x) => x.droppedPackets)
                      .slice(windowFrom, windowFrom + windowSize),
                    color: colors.error,
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
                    color: colors.warning,
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
                    color: colors.purple,
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
                    color: colors.blue,
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
    flows,
  };
};
