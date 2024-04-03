import { FormSelect } from "../../wrapped-inputs/form-select";
import { ReorderStrategy } from "../create-action-form-types";
import { FormNumberWithGenerator } from "../../wrapped-inputs/form-number-with-generator";
import { FieldNamePrefix } from "../../field-name-prefix";
import { SelectOption } from "../../../../utils/select-option";

const reorderStrategyOptions: SelectOption[] = [
  { value: ReorderStrategy.Random, label: "Random" },
  { value: ReorderStrategy.Reverse, label: "Reverse" },
];

interface Props extends FieldNamePrefix {
  disabled?: boolean;
}

export const ReorderFields = ({ fieldNamePrefix, disabled }: Props) => (
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
        name={
          fieldNamePrefix
            ? `${fieldNamePrefix}.reorderStrategy`
            : "reorderStrategy"
        }
        label="Reorder strategy"
        options={reorderStrategyOptions}
        disabled={disabled}
      />
    </div>
  </div>
);
