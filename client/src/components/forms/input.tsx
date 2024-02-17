import { styled, OutlinedInput as MuiOutlinedInput } from "@mui/material";

export const OutlinedInput = styled(MuiOutlinedInput)(() => ({
  "&.MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#F2F2F3",
    },
    "&:hover fieldset": {
      borderColor: "#64D22D",
    },
  },
}));
