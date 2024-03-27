import { FormTextField } from "../wrapped-inputs/form-text-field";
import { FormSelect } from "../wrapped-inputs/form-select";
import { SelectOption } from "../select";
import { SequenceMode } from "./types";

interface Props {
  name: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  int?: boolean;
}

const sequenceModeOptions: SelectOption[] = [
  { value: SequenceMode.Repeat, label: "Repeat" },
  { value: SequenceMode.Keep, label: "Keep" },
  { value: SequenceMode.Reverse, label: "Reverse" },
];

export const Sequence = ({ name, disabled, min, max, int }: Props) => (
  <div>
    <div className="mt-4">
      <FormTextField
        name={`${name}.min`}
        type="number"
        label="Minimum"
        disabled={disabled || min !== undefined}
        InputLabelProps={min !== undefined ? { shrink: true } : undefined}
        int={int}
      />
    </div>
    <div className="mt-4">
      <FormTextField
        name={`${name}.max`}
        type="number"
        label="Maximum"
        disabled={disabled || max !== undefined}
        InputLabelProps={max !== undefined ? { shrink: true } : undefined}
        int={int}
      />
    </div>
    <div className="mt-4">
      <FormTextField
        name={`${name}.step`}
        type="number"
        label="Step"
        disabled={disabled}
        int={int}
      />
    </div>
    <div className="mt-4">
      <FormTextField
        name={`${name}.t`}
        type="number"
        label="Number of calls required to change value"
        disabled={disabled}
        int={int}
      />
    </div>
    <div className="mt-4">
      <FormSelect
        name={`${name}.mode`}
        label="Sequence mode"
        options={sequenceModeOptions}
        disabled={disabled}
      />
    </div>
  </div>
);
