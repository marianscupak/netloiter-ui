import { FormTextField } from "../../wrapped-inputs/form-text-field";
import { FieldNamePrefix } from "../../field-name-prefix";

interface Props extends FieldNamePrefix {
  disabled?: boolean;
}

export const ProtocolGuardFields = ({ fieldNamePrefix, disabled }: Props) => (
  <div>
    <div className="mt-4">
      <FormTextField
        name={fieldNamePrefix ? `${fieldNamePrefix}.id` : "id"}
        label="Protocol ID"
        disabled={disabled}
      />
    </div>
  </div>
);
