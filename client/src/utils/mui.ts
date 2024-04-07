import { createTheme } from "@mui/material";

export const colors = {
  primary: "#64D22D",
  warning: "#FFBA1A",
  error: "#D41121",
  white: "#F2F2F3",
  black: "#1F262E",
  purple: "#651fff",
  blue: "#2196f3",
  darkGray: "#414C58",
  gray: "#404040",
} as const;

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
    warning: {
      main: colors.warning,
    },
    error: {
      main: colors.error,
    },
    info: {
      main: colors.white,
    },
    common: { white: colors.white, black: colors.black },
  },
  typography: {
    fontFamily: "Poppins",
  },
});
