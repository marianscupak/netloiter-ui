import { FormTextField } from "../../wrapped-inputs/form-text-field";
import { FormSelect } from "../../wrapped-inputs/form-select";
import { SelectOption } from "../../select";
import { SizeGuardOperation } from "../create-guard-form-types";
import { FieldNamePrefix } from "../../field-name-prefix";

const sizeGuardOperationOptions: SelectOption[] = [
  { value: SizeGuardOperation.Eq, label: SizeGuardOperation.Eq },
  { value: SizeGuardOperation.Lt, label: SizeGuardOperation.Lt },
  { value: SizeGuardOperation.Le, label: SizeGuardOperation.Le },
  { value: SizeGuardOperation.Gt, label: SizeGuardOperation.Gt },
  { value: SizeGuardOperation.Ge, label: SizeGuardOperation.Ge },
];

interface Props extends FieldNamePrefix {
  disabled?: boolean;
}

export const SizeGuardFields = ({ fieldNamePrefix, disabled }: Props) => (
  <div>
    <div className="mt-4">
      <FormTextField
        type="number"
        name={fieldNamePrefix ? `${fieldNamePrefix}.size` : "size"}
        label="Size"
        disabled={disabled}
      />
    </div>
    <div className="mt-4">
      <FormSelect
        name={fieldNamePrefix ? `${fieldNamePrefix}.op` : "op"}
        label="Operation"
        options={sizeGuardOperationOptions}
        disabled={disabled}
      />
    </div>
  </div>
);
