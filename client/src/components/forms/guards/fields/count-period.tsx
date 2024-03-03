import { FormNumberWithGenerator } from "../../wrapped-inputs/form-number-with-generator";
import { FieldNamePrefix } from "../../field-name-prefix";

interface Props extends FieldNamePrefix {
  disabled?: boolean;
}

export const CountPeriodGuardFields = ({
  fieldNamePrefix,
  disabled,
}: Props) => (
  <div>
    <div className="mt-4">
      <FormNumberWithGenerator
        name={fieldNamePrefix ? `${fieldNamePrefix}.truePeriod` : "truePeriod"}
        label="True period"
        disabled={disabled}
        int
      />
    </div>
    <div className="mt-4">
      <FormNumberWithGenerator
        name={
          fieldNamePrefix ? `${fieldNamePrefix}.falsePeriod` : "falsePeriod"
        }
        label="False period"
        disabled={disabled}
        int
      />
    </div>
  </div>
);
