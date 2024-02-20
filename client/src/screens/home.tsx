import { Alert, Button, Snackbar } from "@mui/material";
import { StartNetLoiterModal } from "../components/forms/start-net-loiter";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { axios } from "../utils/axios";
import useWebSocket from "react-use-websocket";
import { useNlStatusEndpoints } from "../utils/use-nl-status-endpoints";

const NL_START_DURATION = 1000;

export const Home = () => {
  const [startOpen, setStartOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState<
    "success" | "error" | undefined
  >(undefined);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [runningFrom, setRunningFrom] = useState<Date | false>(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const { startNetLoiter, stopNetLoiter, getIsNetLoiterRunning } =
    useNlStatusEndpoints();

  const onOpen = useCallback(() => {
    setStartOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setStartOpen(false);
  }, []);

  const getIsNlRunning = useCallback(async (showSnackbar?: boolean) => {
    const response = await getIsNetLoiterRunning();
    if (response.status === 200) {
      const { runningFrom: newRunningFrom } = response.data;
      setRunningFrom(newRunningFrom);

      if (showSnackbar) {
        if (newRunningFrom) {
          setSnackbarMessage("NetLoiter started successfully");
          setSnackbarOpen("success");
          setStartOpen(false);
        } else {
          setSnackbarMessage("Failed to start NetLoiter");
          setSnackbarOpen("error");
        }
      }
      setStatusLoading(false);
    }
  }, []);

  const onStartNetLoiter = useCallback(async () => {
    setStatusLoading(true);
    await startNetLoiter();
    setTimeout(async () => await getIsNlRunning(true), NL_START_DURATION);
  }, []);

  const onStopNetLoiter = useCallback(async () => {
    await stopNetLoiter();
    await getIsNlRunning();
  }, []);

  useEffect(() => {
    getIsNlRunning();
  }, []);

  return (
    <div className="flex justify-center items-center h-full">
      {runningFrom ? (
        <div>
          <div className="text-header">NetLoiter is up and running</div>
          <div className="mb-2 text-center">
            Running from: {dayjs(runningFrom).format("DD. MM. HH:mm:ss")}
          </div>
          <div className="flex justify-center gap-2">
            <Button variant="contained">OVERVIEW</Button>
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
      <Snackbar
        open={Boolean(snackbarOpen)}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(undefined)}
        autoHideDuration={5000}
      >
        <Alert
          onClose={() => setSnackbarOpen(undefined)}
          severity={snackbarOpen}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};
