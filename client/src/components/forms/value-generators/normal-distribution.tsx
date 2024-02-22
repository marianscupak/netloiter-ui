import { FormTextField } from "../wrapped-inputs/form-text-field";
import { FormCheckbox } from "../wrapped-inputs/form-checkbox";

interface Props {
  name: string;
}

export const NormalDistribution = ({ name }: Props) => (
  <div>
    <div className="mt-4">
      <FormTextField name={`${name}.min`} type="number" label="Minimum" />
    </div>
    <div className="mt-4">
      <FormTextField name={`${name}.max`} type="number" label="Maximum" />
    </div>
    <div className="mt-2">
      <FormCheckbox name={`${name}.once`} label="Once" />
    </div>
    <div className="mt-2">
      <FormTextField name={`${name}.average`} type="number" label="Average" />
    </div>
    <div className="mt-4">
      <FormTextField
        name={`${name}.deviation`}
        type="number"
        label="Standard deviation"
      />
    </div>
  </div>
);
