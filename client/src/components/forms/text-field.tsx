import {
  styled,
  TextField as MuiTextField,
  TextFieldProps,
} from "@mui/material";

const CustomTextField = styled(MuiTextField)(({ error }) => ({
  "& .MuiInputBase-root": {
    color: "#F2F2F3",
  },
  "& .MuiInputLabel-root": {
    color: error ? "#D41121" : "#F2F2F3",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: error ? "#D41121" : "#F2F2F3",
    },
    "&:hover fieldset": {
      borderColor: error ? "#D41121" : "#64D22D",
    },
    "&.Mui-focused fieldset": {
      borderColor: error ? "#D41121" : "#64D22D",
    },
  },
}));

export const TextField = ({ label, ...props }: TextFieldProps) => (
  <CustomTextField
    id={`${label}`}
    label={label}
    fullWidth
    variant="outlined"
    {...props}
  />
);
