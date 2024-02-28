import { FormTextField } from "../../wrapped-inputs/form-text-field";
import { FieldNamePrefix } from "../../field-name-prefix";

interface Props extends FieldNamePrefix {
  disabled?: boolean;
}

export const ICMPGuardFields = ({ fieldNamePrefix, disabled }: Props) => (
  <div>
    <div className="mt-4">
      <FormTextField
        type="number"
        name={fieldNamePrefix ? `${fieldNamePrefix}.icmpType` : "icmpType"}
        label="ICMP Type"
        disabled={disabled}
      />
    </div>
    <div className="mt-4">
      <FormTextField
        type="number"
        name={fieldNamePrefix ? `${fieldNamePrefix}.icmpCode` : "icmpCode"}
        label="ICMP Code"
        disabled={disabled}
      />
    </div>
  </div>
);
