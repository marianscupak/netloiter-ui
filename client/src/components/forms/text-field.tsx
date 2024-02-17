import {
  styled,
  TextField as MuiTextField,
  TextFieldProps,
} from "@mui/material";

const CustomTextField = styled(MuiTextField)({
  "& .MuiInputBase-root": {
    color: "#F2F2F3",
  },
  "& .MuiInputLabel-root": {
    color: "#F2F2F3",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#F2F2F3",
    },
    "&:hover fieldset": {
      borderColor: "#64D22D",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#64D22D",
    },
  },
});

export const TextField = ({ label }: TextFieldProps) => (
  <CustomTextField id={`${label}`} label={label} fullWidth variant="outlined" />
);
