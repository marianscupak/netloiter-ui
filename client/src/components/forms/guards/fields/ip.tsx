import { FormTextField } from "../../wrapped-inputs/form-text-field";
import { FieldNamePrefix } from "../../field-name-prefix";

interface Props extends FieldNamePrefix {
  disabled?: boolean;
}

export const IPGuardFields = ({ fieldNamePrefix, disabled }: Props) => (
  <div>
    <div className="mt-4">
      <FormTextField
        name={fieldNamePrefix ? `${fieldNamePrefix}.src` : "src"}
        label="Source"
        disabled={disabled}
      />
    </div>
    <div className="mt-4">
      <FormTextField
        name={fieldNamePrefix ? `${fieldNamePrefix}.dest` : "dest"}
        label="Destination"
        disabled={disabled}
      />
    </div>
    <div className="mt-4">
      <FormTextField
        name={fieldNamePrefix ? `${fieldNamePrefix}.any` : "any"}
        label="Any"
        disabled={disabled}
      />
    </div>
  </div>
);
