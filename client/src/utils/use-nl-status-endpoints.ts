import { useCallback } from "react";
import { axios } from "./axios";
import { Status } from "../state/status";
import { trpc } from "./trpc";
import { BaseAction } from "../components/forms/actions/create-action-form-types";

export interface StartNetLoiterParams {
  scenarioId?: number;
  configId: number;
  defaultAction?: BaseAction;
}

export const useNlStatusEndpoints = () => {
  const { mutateAsync: getScenarioDetail } =
    trpc.scenario.getScenarioDetail.useMutation();

  const { mutateAsync: getConfigDetail } =
    trpc.config.getConfigDetail.useMutation();

  const startNetLoiter = useCallback(
    async ({ defaultAction, scenarioId, configId }: StartNetLoiterParams) => {
      const config = await getConfigDetail({ id: configId });
      if (scenarioId) {
        const scenario = await getScenarioDetail({ id: scenarioId });

        await axios.post("/start", { scenario, config });
      } else if (defaultAction) {
        await axios.post("/start", { config, defaultAction });
      }
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
