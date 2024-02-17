import {
  FormControl,
  MenuItem,
  Select as MuiSelect,
  SelectProps,
} from "@mui/material";
import { OutlinedInput } from "./input";
import { withStyles } from "@mui/styles";
import { InputLabel } from "./input-label";

export interface SelectOption {
  label: string;
  value: number;
}

interface Props extends SelectProps {
  label: string;
  options: SelectOption[];
}

const CustomSelect = withStyles(() => ({
  icon: {
    fill: "#F2F2F3",
  },
}))(MuiSelect);

export const Select = ({ label, options }: Props) => (
  <FormControl fullWidth variant="outlined">
    <InputLabel id={`${label}-label`}>{label}</InputLabel>
    <CustomSelect
      labelId={`${label}-label`}
      input={<OutlinedInput label={label} />}
      sx={{ color: "#F2F2F3" }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </CustomSelect>
  </FormControl>
);
