import { FormTextField } from "../wrapped-inputs/form-text-field";
import { FormSelect } from "../wrapped-inputs/form-select";
import { SelectOption } from "../select";
import { SequenceMode } from "./types";
import { FormCheckbox } from "../wrapped-inputs/form-checkbox";

interface Props {
  name: string;
}

const sequenceModeOptions: SelectOption[] = [
  { value: SequenceMode.Repeat, label: "Repeat" },
  { value: SequenceMode.Keep, label: "Keep" },
  { value: SequenceMode.Reverse, label: "Reverse" },
];

export const Sequence = ({ name }: Props) => (
  <div>
    <div className="mt-4">
      <FormTextField name={`${name}.min`} type="number" label="Minimum" />
    </div>
    <div className="mt-4">
      <FormTextField name={`${name}.max`} type="number" label="Maximum" />
    </div>
    <div className="mt-4">
      <FormCheckbox name={`${name}.once`} label="Once" />
    </div>
    <div className="mt-4">
      <FormTextField name={`${name}.step`} type="number" label="Step" />
    </div>
    <div className="mt-4">
      <FormSelect
        name={`${name}.mode`}
        label="Sequence mode"
        options={sequenceModeOptions}
      />
    </div>
  </div>
);
