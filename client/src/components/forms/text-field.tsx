import {
  styled,
  TextField as MuiTextField,
  TextFieldProps,
} from "@mui/material";
import { colors } from "../../utils/mui";

const CustomTextField = styled(MuiTextField)(({ error, disabled }) => ({
  "& .MuiInputBase-root": {
    color: colors.white,
  },
  "& .MuiInputLabel-root": {
    color: error ? colors.error : colors.white,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: error ? colors.error : colors.white,
    },
    "&:hover fieldset": {
      borderColor: disabled ? undefined : error ? colors.error : colors.primary,
    },
    "&.Mui-focused fieldset": {
      borderColor: error ? colors.error : colors.primary,
    },
  },
}));

export const TextField = ({ label, ...props }: TextFieldProps) => (
  <CustomTextField label={label} fullWidth variant="outlined" {...props} />
);
