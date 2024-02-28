import { FormNumberWithGenerator } from "../../wrapped-inputs/form-number-with-generator";
import { FormCheckbox } from "../../wrapped-inputs/form-checkbox";
import { FieldNamePrefix } from "../../field-name-prefix";

interface Props extends FieldNamePrefix {
  disabled?: boolean;
}

export const TimePeriodGuardFields = ({ fieldNamePrefix, disabled }: Props) => (
  <div>
    <div className="mt-4">
      <FormNumberWithGenerator
        name={fieldNamePrefix ? `${fieldNamePrefix}.truePeriod` : "truePeriod"}
        label="True period"
        disabled={disabled}
      />
    </div>
    <div className="mt-4">
      <FormNumberWithGenerator
        name={
          fieldNamePrefix ? `${fieldNamePrefix}.falsePeriod` : "falsePeriod"
        }
        label="False period"
        disabled={disabled}
      />
    </div>
    <div className="mt-4">
      <FormCheckbox
        name={fieldNamePrefix ? `${fieldNamePrefix}.instant` : "instant"}
        label="Instant"
        disabled={disabled}
      />
    </div>
  </div>
);
