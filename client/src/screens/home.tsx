import { Button } from "@mui/material";
import { StartNetLoiterModal } from "../components/forms/start-net-loiter";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNlStatusEndpoints } from "../utils/use-nl-status-endpoints";
import { useAtom } from "jotai";
import { statusAtom } from "../state/status";
import { NavLink } from "react-router-dom";
import { useSnackbar } from "../utils/snackbar";

const NL_START_DURATION = 1000;

export const Home = () => {
  const [startOpen, setStartOpen] = useState(false);
  const [status, setStatus] = useAtom(statusAtom);
  const [statusLoading, setStatusLoading] = useState(false);
  const { startNetLoiter, stopNetLoiter, getIsNetLoiterRunning } =
    useNlStatusEndpoints();

  const onOpen = useCallback(() => {
    setStartOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setStartOpen(false);
  }, []);

  const { showSnackbar } = useSnackbar();

  const getIsNlRunning = useCallback(
    async (shouldShowSnackbar?: boolean) => {
      const response = await getIsNetLoiterRunning();
      if (response.status === 200) {
        const { runningFrom: newRunningFrom } = response.data;
        setStatus((oldStatus) => ({
          ...oldStatus,
          runningFrom: newRunningFrom,
        }));

        if (shouldShowSnackbar) {
          if (newRunningFrom) {
            showSnackbar("NetLoiter started successfully");
            setStartOpen(false);
          } else {
            showSnackbar("Failed to start NetLoiter", "error");
          }
        }
        setStatusLoading(false);
      }
    },
    [getIsNetLoiterRunning, setStatus, showSnackbar],
  );

  const onStartNetLoiter = useCallback(async () => {
    setStatusLoading(true);
    await startNetLoiter();
    setTimeout(async () => await getIsNlRunning(true), NL_START_DURATION);
  }, [getIsNlRunning, startNetLoiter]);

  const onStopNetLoiter = useCallback(async () => {
    await stopNetLoiter();
    await getIsNlRunning();
  }, [stopNetLoiter, getIsNlRunning]);

  useEffect(() => {
    getIsNlRunning();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex justify-center items-center h-full">
      {status.runningFrom ? (
        <div>
          <div className="text-header">NetLoiter is up and running</div>
          <div className="mb-2 text-center">
            Running from: {dayjs(status.runningFrom).format("DD. MM. HH:mm:ss")}
          </div>
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
          <div className="text-header">NetLoiter is not running</div>
          <div className="flex justify-center gap-2">
            <Button variant="contained" onClick={onOpen}>
              START
            </Button>
            <Button variant="contained" color="warning">
              SEE LAST RUN
            </Button>
          </div>
        </div>
      )}
      <StartNetLoiterModal
        open={startOpen}
        loading={statusLoading}
        onClose={onClose}
        onStartNetLoiter={onStartNetLoiter}
      />
    </div>
  );
};
