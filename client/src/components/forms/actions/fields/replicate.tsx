import { FormNumberWithGenerator } from "../../wrapped-inputs/form-number-with-generator";
import { FieldNamePrefix } from "../../field-name-prefix";
import { FormSelect } from "../../wrapped-inputs/form-select";
import { SelectOption } from "../../select";
import { ActionType } from "../../../../../../server/prisma/public";

const replicateActionOptions: SelectOption[] = [
  { value: ActionType.Finish, label: ActionType.Finish },
  { value: ActionType.Drop, label: ActionType.Drop },
  { value: ActionType.Pause, label: ActionType.Pause },
  { value: ActionType.Skip, label: ActionType.Skip },
];

interface Props extends FieldNamePrefix {
  disabled?: boolean;
}

export const ReplicateFields = ({ fieldNamePrefix, disabled }: Props) => (
  <div>
    <div className="mt-4">
      <FormNumberWithGenerator
        name={fieldNamePrefix ? `${fieldNamePrefix}.count` : "count"}
        label="Count"
        disabled={disabled}
        int
      />
    </div>
    <div className="mt-4">
      <FormSelect
        name={fieldNamePrefix ? `${fieldNamePrefix}.action` : "action"}
        label="Action"
        disabled={disabled}
        options={replicateActionOptions}
      />
    </div>
  </div>
);
