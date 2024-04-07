import {
  Checkbox as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import { colors } from "../../utils/mui";

export interface CheckboxProps extends MuiCheckboxProps {
  label?: string;
}

export const Checkbox = ({ label, ...props }: CheckboxProps) => (
  <FormControl>
    <FormControlLabel
      control={<MuiCheckbox sx={{ color: colors.white }} {...props} />}
      label={label}
    />
  </FormControl>
);
