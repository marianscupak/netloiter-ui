import { atom, useAtom } from "jotai";
import { AlertColor } from "@mui/material";
import { useCallback } from "react";

interface SnackbarAtom {
  snackbarType: AlertColor;
  message: string;
  open: boolean;
}

export const SNACKBAR_AUTO_HIDE_DURATION = 5000;

export const snackbarAtom = atom<SnackbarAtom>({
  snackbarType: "success",
  message: "",
  open: false,
});

export const useSnackbar = () => {
  const [, setSnackbar] = useAtom(snackbarAtom);

  const showSnackbar = useCallback(
    (message: string, snackbarType: AlertColor = "success") => {
      setSnackbar({ message, snackbarType, open: true });
    },
    [setSnackbar],
  );

  return { showSnackbar };
};
