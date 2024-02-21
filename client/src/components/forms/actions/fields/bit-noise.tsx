import { FormTextField } from "../../wrapped-inputs/form-text-field";
import { FormSelect } from "../../wrapped-inputs/form-select";
import { SelectOption } from "../../select";
import { BitNoiseStrategy } from "../create-action-form-types";

const bitNoiseStrategyOptions: SelectOption[] = [
  { label: "Left", value: BitNoiseStrategy.Left },
  { label: "Right", value: BitNoiseStrategy.Right },
  { label: "Random", value: BitNoiseStrategy.Random },
];

export const BitNoiseActionFields = () => (
  <div>
    <div className="mt-4">
      <FormTextField
        type="number"
        name="percentageOfBitsToSwap"
        label="Percentage of bits to swap"
        error
      />
    </div>
    <div className="mt-4">
      <FormTextField type="number" name="layer" label="Layer" />
    </div>
    <div className="mt-4">
      <FormSelect
        name="noiseStrategy"
        label="Strategy"
        options={bitNoiseStrategyOptions}
      />
    </div>
  </div>
);
