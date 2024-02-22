import {
  Checkbox as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
  FormControl,
  FormControlLabel,
} from "@mui/material";

export interface CheckboxProps extends MuiCheckboxProps {
  label?: string;
}

export const Checkbox = ({ label, ...props }: CheckboxProps) => (
  <FormControl>
    <FormControlLabel
      control={<MuiCheckbox sx={{ color: "#F2F2F3" }} {...props} />}
      label={label}
    />
  </FormControl>
);
