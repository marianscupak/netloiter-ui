import { FormNumberWithGenerator } from "../../wrapped-inputs/form-number-with-generator";
import { FieldNamePrefix } from "../../field-name-prefix";

interface Props extends FieldNamePrefix {
  disabled?: boolean;
}

export const EveryNGuardFields = ({ fieldNamePrefix, disabled }: Props) => (
  <div>
    <div className="mt-4">
      <FormNumberWithGenerator
        name={fieldNamePrefix ? `${fieldNamePrefix}.n` : "n"}
        label="N"
        disabled={disabled}
        int
      />
    </div>
  </div>
);
