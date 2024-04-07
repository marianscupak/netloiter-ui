import { styled, OutlinedInput as MuiOutlinedInput } from "@mui/material";
import { colors } from "../../utils/mui";

export const OutlinedInput = styled(MuiOutlinedInput)(
  ({ error, disabled }) => ({
    "&.MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: colors.white,
      },
      "&:hover fieldset": {
        borderColor: disabled
          ? undefined
          : error
          ? colors.error
          : colors.primary,
      },
    },
  }),
);
