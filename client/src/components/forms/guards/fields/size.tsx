import { FormTextField } from "../../wrapped-inputs/form-text-field";
import { FormSelect } from "../../wrapped-inputs/form-select";
import { SelectOption } from "../../select";
import { SizeGuardOperation } from "../create-guard-form-types";

const sizeGuardOperationOptions: SelectOption[] = [
  { value: SizeGuardOperation.Eq, label: SizeGuardOperation.Eq },
  { value: SizeGuardOperation.Lt, label: SizeGuardOperation.Lt },
  { value: SizeGuardOperation.Le, label: SizeGuardOperation.Le },
  { value: SizeGuardOperation.Gt, label: SizeGuardOperation.Gt },
  { value: SizeGuardOperation.Ge, label: SizeGuardOperation.Ge },
];

export const SizeGuardFields = () => (
  <div>
    <div className="mt-4">
      <FormTextField type="number" name="size" label="Size" />
    </div>
    <div className="mt-4">
      <FormSelect
        name="op"
        label="Operation"
        options={sizeGuardOperationOptions}
      />
    </div>
  </div>
);
