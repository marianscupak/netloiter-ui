import { FormTextField } from "../../wrapped-inputs/form-text-field";
import { FormSelect } from "../../wrapped-inputs/form-select";
import { SelectOption } from "../../select";
import { ReorderStrategy } from "../create-action-form-types";

const reorderStrategyOptions: SelectOption[] = [
  { value: ReorderStrategy.Random, label: "Random" },
  { value: ReorderStrategy.Reverse, label: "Reverse" },
];

export const ReorderFields = () => (
  <div>
    <div className="mt-4">
      <FormTextField type="number" name="count" label="Count" />
    </div>
    <div className="mt-4">
      <FormSelect
        name="reorderStrategy"
        label="Reorder strategy"
        options={reorderStrategyOptions}
      />
    </div>
  </div>
);
