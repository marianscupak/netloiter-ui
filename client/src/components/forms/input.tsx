import { styled, OutlinedInput as MuiOutlinedInput } from "@mui/material";

export const OutlinedInput = styled(MuiOutlinedInput)(({ error }) => ({
  "&.MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#F2F2F3",
    },
    "&:hover fieldset": {
      borderColor: error ? "#D41121" : "#64D22D",
    },
  },
}));
