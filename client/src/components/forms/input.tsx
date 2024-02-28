import { styled, OutlinedInput as MuiOutlinedInput } from "@mui/material";

export const OutlinedInput = styled(MuiOutlinedInput)(
  ({ error, disabled }) => ({
    "&.MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#F2F2F3",
      },
      "&:hover fieldset": {
        borderColor: disabled ? undefined : error ? "#D41121" : "#64D22D",
      },
    },
  }),
);
