import { FormTextField } from "../../wrapped-inputs/form-text-field";
import { FormSelect } from "../../wrapped-inputs/form-select";
import { SelectOption } from "../../select";
import { BitNoiseStrategy } from "../create-action-form-types";
import { FormNumberWithGenerator } from "../../wrapped-inputs/form-number-with-generator";
import { FieldNamePrefix } from "../../field-name-prefix";

const bitNoiseStrategyOptions: SelectOption[] = [
  { label: "Left", value: BitNoiseStrategy.Left },
  { label: "Right", value: BitNoiseStrategy.Right },
  { label: "Random", value: BitNoiseStrategy.Random },
];

interface Props extends FieldNamePrefix {
  disabled?: boolean;
}

export const BitNoiseActionFields = ({ fieldNamePrefix, disabled }: Props) => (
  <div>
    <div className="mt-4">
      <FormNumberWithGenerator
        name={
          fieldNamePrefix
            ? `${fieldNamePrefix}.percentageOfBitsToSwap`
            : "percentageOfBitsToSwap"
        }
        label="Percentage of bits to swap"
        disabled={disabled}
      />
    </div>
    <div className="mt-4">
      <FormTextField
        type="number"
        name={fieldNamePrefix ? `${fieldNamePrefix}.layer` : "layer"}
        label="Layer"
        disabled={disabled}
      />
    </div>
    <div className="mt-4">
      <FormSelect
        name={
          fieldNamePrefix ? `${fieldNamePrefix}.noiseStrategy` : "noiseStrategy"
        }
        label="Strategy"
        options={bitNoiseStrategyOptions}
        disabled={disabled}
      />
    </div>
  </div>
);
