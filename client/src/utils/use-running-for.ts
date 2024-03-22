import { useEffect, useState } from "react";
import { formatDuration } from "./format-duration";
import dayjs from "dayjs";

export const useRunningFor = (runningFrom: Date | false) => {
  const [runningFor, setRunningFor] = useState("");

  useEffect(() => {
    if (runningFrom) {
      setRunningFor(formatDuration(dayjs().diff(runningFrom)));
    }
    const interval = setInterval(() => {
      if (runningFrom) {
        setRunningFor(formatDuration(dayjs().diff(runningFrom)));
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return runningFor;
};
