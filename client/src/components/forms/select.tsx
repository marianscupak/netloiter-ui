import {
  FormControl,
  MenuItem,
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
} from "@mui/material";
import { OutlinedInput } from "./input";
import { withStyles } from "@mui/styles";
import { InputLabel } from "./input-label";

export interface SelectOption {
  label: string;
  value: number | string;
}

export interface SelectProps extends MuiSelectProps {
  label: string;
  options: SelectOption[];
}

const CustomSelect = withStyles(() => ({
  icon: {
    fill: "#F2F2F3",
  },
}))(MuiSelect);

export const Select = ({ label, options, ...props }: SelectProps) => (
  <FormControl fullWidth variant="outlined">
    <InputLabel id={`${label}-label`} error={props.error}>
      {label}
    </InputLabel>
    <CustomSelect
      labelId={`${label}-label`}
      input={<OutlinedInput label={label} error={props.error} />}
      sx={{ color: "#F2F2F3" }}
      defaultValue={props.defaultValue ?? ""}
      {...props}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </CustomSelect>
  </FormControl>
);
