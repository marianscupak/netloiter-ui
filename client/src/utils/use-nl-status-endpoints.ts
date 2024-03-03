import { useCallback } from "react";
import { axios } from "./axios";
import { Status } from "../state/status";
import { trpc } from "./trpc";

export const useNlStatusEndpoints = () => {
  const { mutateAsync: getScenarioDetail } =
    trpc.scenario.getScenarioDetail.useMutation();

  const { mutateAsync: getConfigDetail } =
    trpc.config.getConfigDetail.useMutation();

  const startNetLoiter = useCallback(
    async (scenarioId: number, configId: number) => {
      const scenario = await getScenarioDetail({ id: scenarioId });
      const config = await getConfigDetail({ id: configId });

      await axios.post("/start", { scenario, config });
    },
    [getConfigDetail, getScenarioDetail],
  );

  const stopNetLoiter = useCallback(async () => {
    await axios.get("/stop");
  }, []);

  const getNetLoiterStatus = useCallback(
    async () => await axios.get<Status>("/status"),
    [],
  );

  return {
    startNetLoiter,
    stopNetLoiter,
    getNetLoiterStatus,
  };
};
