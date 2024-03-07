import {
  FormControl,
  MenuItem,
  OutlinedSelectProps,
  Select as MuiSelect,
  SelectChangeEvent,
} from "@mui/material";
import { OutlinedInput } from "./input";
import { withStyles } from "@mui/styles";
import { InputLabel } from "./input-label";

export interface SelectOption {
  label: string;
  value: number | string;
}

export interface SelectProps extends OutlinedSelectProps {
  label: string;
  options: SelectOption[];
  onChange?(event: SelectChangeEvent<unknown>): void;
}

const CustomSelect = withStyles(() => ({
  icon: {
    fill: "#F2F2F3",
  },
}))(MuiSelect);

export const Select = ({
  label,
  options,
  classes: _,
  ...props
}: Omit<SelectProps, "variant">) => (
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
