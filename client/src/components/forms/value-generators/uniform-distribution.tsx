import { FormTextField } from "../wrapped-inputs/form-text-field";
import { FormCheckbox } from "../wrapped-inputs/form-checkbox";

interface Props {
  name: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  int?: boolean;
  once?: boolean;
}

export const UniformDistribution = ({
  name,
  disabled,
  min,
  max,
  int,
  once,
}: Props) => (
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
      <FormCheckbox
        name={`${name}.once`}
        label="Once"
        disabled={disabled || once}
      />
    </div>
  </div>
);
