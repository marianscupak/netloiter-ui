import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#64D22D",
    },
    warning: {
      main: "#FFBA1A",
    },
    error: {
      main: "#D41121",
    },
    info: {
      main: "#F2F2F3",
    },
    common: { white: "#F2F2F3", black: "#1F262E" },
  },
  typography: {
    fontFamily: "Poppins",
  },
});
