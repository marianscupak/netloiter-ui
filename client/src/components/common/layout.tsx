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
  const [, setStatus] = useAtom(statusAtom);

  const { getNetLoiterStatus } = useNlStatusEndpoints();

  useEffect(() => {
    const call = async () => {
      const response = await getNetLoiterStatus();
      if (response.status === 200) {
        setStatus(response.data);
      }
    };

    call();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [snackbar, setSnackbar] = useAtom(snackbarAtom);

  const onCloseSnackbar = useCallback(() => {
    setSnackbar((currentSnackbar) => ({ ...currentSnackbar, open: false }));
  }, [setSnackbar]);

  return (
    <div className="bg-gray h-full flex flex-col lg:flex-row">
      <Navigation />
      <div className="flex-grow min-h-[100vh]">
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
