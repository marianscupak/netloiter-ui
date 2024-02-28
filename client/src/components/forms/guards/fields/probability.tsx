import { FormNumberWithGenerator } from "../../wrapped-inputs/form-number-with-generator";
import { FieldNamePrefix } from "../../field-name-prefix";

interface Props extends FieldNamePrefix {
  disabled?: boolean;
}

export const ProbabilityGuardFields = ({
  fieldNamePrefix,
  disabled,
}: Props) => (
  <div>
    <div className="mt-4">
      <FormNumberWithGenerator
        name={fieldNamePrefix ? `${fieldNamePrefix}.prob` : "prob"}
        label="Probability"
        disabled={disabled}
      />
    </div>
  </div>
);
