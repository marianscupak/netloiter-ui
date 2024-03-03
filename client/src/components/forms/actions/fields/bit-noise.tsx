import { FormTextField } from "../../wrapped-inputs/form-text-field";
import { FormSelect } from "../../wrapped-inputs/form-select";
import { SelectOption } from "../../select";
import { BitNoiseStrategy } from "../create-action-form-types";
import { FormNumberWithGenerator } from "../../wrapped-inputs/form-number-with-generator";
import { FieldNamePrefix } from "../../field-name-prefix";
import { useCallback, useMemo, useState } from "react";
import { Checkbox } from "../../checkbox";
import { useFormContext } from "react-hook-form";

const bitNoiseStrategyOptions: SelectOption[] = [
  { label: "Left", value: BitNoiseStrategy.Left },
  { label: "Right", value: BitNoiseStrategy.Right },
  { label: "Random", value: BitNoiseStrategy.Random },
];

interface Props extends FieldNamePrefix {
  disabled?: boolean;
}

export const BitNoiseActionFields = ({ fieldNamePrefix, disabled }: Props) => {
  const { setValue, watch } = useFormContext();

  const [usePercentage, setUsePercentage] = useState(
    watch(
      fieldNamePrefix
        ? `${fieldNamePrefix}.amountOfBitsToSwap`
        : "amountOfBitsToSwap",
    ) === undefined,
  );

  const onUsePercentageChange = useCallback(() => {
    setUsePercentage((old) => !old);

    if (usePercentage) {
      setValue(
        fieldNamePrefix
          ? `${fieldNamePrefix}.percentageOfBitsToSwap`
          : "percentageOfBitsToSwap",
        0,
      );
    } else {
      setValue(
        fieldNamePrefix
          ? `${fieldNamePrefix}.amountOfBitsToSwap`
          : "amountOfBitsToSwap",
        0,
      );
    }
  }, [fieldNamePrefix, setValue, usePercentage]);

  const percentageInput = useMemo(
    () => (
      <FormNumberWithGenerator
        name={
          fieldNamePrefix
            ? `${fieldNamePrefix}.percentageOfBitsToSwap`
            : "percentageOfBitsToSwap"
        }
        label="Percentage of bits to swap"
        disabled={disabled}
        min={0}
        max={1}
        key="percentage"
      />
    ),
    [disabled, fieldNamePrefix],
  );

  const amountInput = useMemo(
    () => (
      <FormNumberWithGenerator
        name={
          fieldNamePrefix
            ? `${fieldNamePrefix}.amountOfBitsToSwap`
            : "amountOfBitsToSwap"
        }
        label="Amount of bits to swap"
        disabled={disabled}
        int
        key="amount"
      />
    ),
    [disabled, fieldNamePrefix],
  );

  return (
    <div>
      <div>
        <Checkbox
          label="Use percentage"
          checked={usePercentage}
          onChange={onUsePercentageChange}
        />
      </div>
      <div className="mt-4">
        {usePercentage ? percentageInput : amountInput}
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
            fieldNamePrefix
              ? `${fieldNamePrefix}.noiseStrategy`
              : "noiseStrategy"
          }
          label="Strategy"
          options={bitNoiseStrategyOptions}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
