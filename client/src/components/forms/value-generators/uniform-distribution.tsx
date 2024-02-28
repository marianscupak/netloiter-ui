import { FormTextField } from "../wrapped-inputs/form-text-field";
import { FormCheckbox } from "../wrapped-inputs/form-checkbox";

interface Props {
  name: string;
  disabled?: boolean;
}

export const UniformDistribution = ({ name, disabled }: Props) => (
  <div>
    <div className="mt-4">
      <FormTextField
        name={`${name}.min`}
        type="number"
        label="Minimum"
        disabled={disabled}
      />
    </div>
    <div className="mt-4">
      <FormTextField
        name={`${name}.max`}
        type="number"
        label="Maximum"
        disabled={disabled}
      />
    </div>
    <div className="mt-4">
      <FormCheckbox name={`${name}.once`} label="Once" disabled={disabled} />
    </div>
  </div>
);
