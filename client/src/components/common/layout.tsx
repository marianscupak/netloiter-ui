import { Navigation } from "./navigation";
import { Outlet } from "react-router-dom";
import { useAtom } from "jotai";
import { statusAtom } from "../../state/status";
import { useCallback, useEffect } from "react";
import { useNlStatusEndpoints } from "../../utils/use-nl-status-endpoints";
import { Alert, Snackbar } from "@mui/material";
import {
  SNACKBAR_AUTO_HIDE_DURATION,
  snackbarAtom,
} from "../../utils/snackbar";

export const Layout = () => {
  const [_, setStatus] = useAtom(statusAtom);

  const { getIsNetLoiterRunning } = useNlStatusEndpoints();

  useEffect(() => {
    const call = async () => {
      const response = await getIsNetLoiterRunning();
      if (response.status === 200) {
        const { runningFrom: newRunningFrom } = response.data;
        setStatus((oldStatus) => ({
          ...oldStatus,
          runningFrom: newRunningFrom,
        }));
      }
    };

    call();
  }, []);

  const [snackbar, setSnackbar] = useAtom(snackbarAtom);

  const onCloseSnackbar = useCallback(() => {
    setSnackbar((currentSnackbar) => ({ ...currentSnackbar, open: false }));
  }, []);

  return (
    <div className="bg-gray h-full flex">
      <Navigation />
      <div className="w-full min-h-[100vh]">
        <Outlet />
      </div>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        onClose={onCloseSnackbar}
        autoHideDuration={SNACKBAR_AUTO_HIDE_DURATION}
      >
        <Alert
          onClose={onCloseSnackbar}
          severity={snackbar.snackbarType}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};
