import { Button } from "@mui/material";
import { StartNetLoiterModal } from "../components/forms/start-net-loiter/start-net-loiter-modal";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  StartNetLoiterParams,
  useNlStatusEndpoints,
} from "../utils/use-nl-status-endpoints";
import { useAtom } from "jotai";
import { statusAtom } from "../state/status";
import { NavLink, useNavigate } from "react-router-dom";
import { useSnackbar } from "../utils/snackbar";
import { trpc } from "../utils/trpc";
import { useRunningFor } from "../utils/use-running-for";
import { SelectOption } from "../utils/select-option";

const NL_START_DURATION = 1000;

export const Home = () => {
  const [startOpen, setStartOpen] = useState(false);
  const [status, setStatus] = useAtom(statusAtom);
  const [statusLoading, setStatusLoading] = useState(false);
  const { startNetLoiter, stopNetLoiter, getNetLoiterStatus } =
    useNlStatusEndpoints();

  const { data: scenarios } = trpc.scenario.getAll.useQuery();
  const { data: configs } = trpc.config.getAll.useQuery();

  const scenarioOptions = useMemo(
    (): SelectOption[] =>
      scenarios
        ? scenarios.map(({ id, name }) => ({ value: id, label: name }))
        : [],
    [scenarios],
  );

  const configOptions = useMemo(
    (): SelectOption[] =>
      configs
        ? configs.map(({ id, name }) => ({ value: id, label: name }))
        : [],
    [configs],
  );

  const onOpen = useCallback(() => {
    setStartOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setStartOpen(false);
  }, []);

  const { showSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const getIsNlRunning = useCallback(
    async (shouldShowSnackbar?: boolean) => {
      const response = await getNetLoiterStatus();
      if (response.status === 200) {
        setStatus(response.data);

        if (shouldShowSnackbar) {
          if (response.data.runningFrom) {
            navigate("/current-run");
            showSnackbar("NetLoiter started successfully");
            setStartOpen(false);
          } else {
            showSnackbar("Failed to start NetLoiter", "error");
          }
        }
        setStatusLoading(false);
      }
    },
    [getNetLoiterStatus, navigate, setStatus, showSnackbar],
  );

  const onStartNetLoiter = useCallback(
    async (params: StartNetLoiterParams) => {
      setStatusLoading(true);
      await startNetLoiter(params);
      setTimeout(async () => await getIsNlRunning(true), NL_START_DURATION);
    },
    [getIsNlRunning, startNetLoiter],
  );

  const onStopNetLoiter = useCallback(async () => {
    await stopNetLoiter();
    await getIsNlRunning();
  }, [stopNetLoiter, getIsNlRunning]);

  useEffect(() => {
    getIsNlRunning();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { data: lastRun } = trpc.runHistory.getLastRun.useQuery();

  const runningFor = useRunningFor(status.runningFrom);

  return (
    <div className="flex justify-center items-center h-[100vh]">
      {status.runningFrom ? (
        <div>
          <div className="text-header text-center">
            NetLoiter is up and running
          </div>
          <div className="mb-2 text-center">Running for: {runningFor}</div>
          <div className="flex justify-center gap-2">
            <NavLink to="/current-run">
              <Button variant="contained">OVERVIEW</Button>
            </NavLink>
            <Button variant="contained" color="error" onClick={onStopNetLoiter}>
              STOP
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-header text-center">
            NetLoiter is not running
          </div>
          <div className="flex justify-center gap-2">
            <Button variant="contained" onClick={onOpen}>
              START
            </Button>
            {lastRun ? (
              <NavLink to={`/run-history/${"id" in lastRun ? lastRun.id : 0}`}>
                <Button variant="contained" color="warning">
                  SEE LAST RUN
                </Button>
              </NavLink>
            ) : (
              <Button variant="contained" color="warning" disabled>
                SEE LAST RUN
              </Button>
            )}
          </div>
        </div>
      )}
      <StartNetLoiterModal
        open={startOpen}
        loading={statusLoading}
        scenarioOptions={scenarioOptions}
        configOptions={configOptions}
        onClose={onClose}
        onStartNetLoiter={onStartNetLoiter}
      />
    </div>
  );
};
