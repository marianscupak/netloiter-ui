import { FormNumberWithGenerator } from "../../wrapped-inputs/form-number-with-generator";
import { FieldNamePrefix } from "../../field-name-prefix";

interface Props extends FieldNamePrefix {
  disabled?: boolean;
}

export const CountGuardFields = ({ fieldNamePrefix, disabled }: Props) => (
  <div>
    <div className="mt-4">
      <FormNumberWithGenerator
        name={fieldNamePrefix ? `${fieldNamePrefix}.after` : "after"}
        label="After"
        disabled={disabled}
        int
      />
    </div>
    <div className="mt-4">
      <FormNumberWithGenerator
        name={fieldNamePrefix ? `${fieldNamePrefix}.duration` : "duration"}
        label="Duration"
        disabled={disabled}
        int
      />
    </div>
  </div>
);
