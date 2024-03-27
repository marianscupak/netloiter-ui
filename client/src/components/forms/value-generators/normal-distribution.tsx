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

export const NormalDistribution = ({
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
    <div className="mt-2">
      <FormCheckbox
        name={`${name}.once`}
        label="Once"
        disabled={disabled || once}
        checked={once}
      />
    </div>
    <div className="mt-2">
      <FormTextField
        name={`${name}.average`}
        type="number"
        label="Average"
        disabled={disabled}
        int={int}
      />
    </div>
    <div className="mt-4">
      <FormTextField
        name={`${name}.deviation`}
        type="number"
        label="Standard deviation"
        disabled={disabled}
        int={int}
      />
    </div>
  </div>
);
