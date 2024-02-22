import { FormTextField } from "../wrapped-inputs/form-text-field";
import { FormCheckbox } from "../wrapped-inputs/form-checkbox";

interface Props {
  name: string;
}

export const UniformDistribution = ({ name }: Props) => (
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
  </div>
);
