import { FormTextField } from "../../wrapped-inputs/form-text-field";
import { FieldNamePrefix } from "../../field-name-prefix";

interface Props extends FieldNamePrefix {
  disabled?: boolean;
}

export const PortGuardFields = ({ fieldNamePrefix, disabled }: Props) => (
  <div>
    <div className="mt-4">
      <FormTextField
        type="number"
        name={fieldNamePrefix ? `${fieldNamePrefix}.src` : "src"}
        label="Source"
        disabled={disabled}
        int
      />
    </div>
    <div className="mt-4">
      <FormTextField
        type="number"
        name={fieldNamePrefix ? `${fieldNamePrefix}.dest` : "dest"}
        label="Destination"
        disabled={disabled}
        int
      />
    </div>
    <div className="mt-4">
      <FormTextField
        type="number"
        name={fieldNamePrefix ? `${fieldNamePrefix}.any` : "any"}
        label="Any"
        disabled={disabled}
        int
      />
    </div>
  </div>
);
