import { FormNumberWithGenerator } from "../../wrapped-inputs/form-number-with-generator";
import { FieldNamePrefix } from "../../field-name-prefix";

interface Props extends FieldNamePrefix {
  disabled?: boolean;
}

export const ThrottleFields = ({ fieldNamePrefix, disabled }: Props) => (
  <div className="mt-4">
    <FormNumberWithGenerator
      name={fieldNamePrefix ? `${fieldNamePrefix}.limit` : "limit"}
      label="Limit"
      disabled={disabled}
      int
      once
    />
  </div>
);
