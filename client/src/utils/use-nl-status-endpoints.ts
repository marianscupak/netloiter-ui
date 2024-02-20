import { useCallback } from "react";
import { axios } from "./axios";

export const useNlStatusEndpoints = () => {
  const startNetLoiter = useCallback(async () => {
    await axios.get("/start");
  }, []);

  const stopNetLoiter = useCallback(async () => {
    await axios.get("/stop");
  }, []);

  const getIsNetLoiterRunning = useCallback(
    async () => await axios.get<{ runningFrom: Date | false }>("/status"),
    [],
  );

  return {
    startNetLoiter,
    stopNetLoiter,
    getIsNetLoiterRunning,
  };
};
