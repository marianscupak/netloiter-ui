import { FormSelect } from "../../wrapped-inputs/form-select";
import { SelectOption } from "../../select";
import { BitNoiseLayer, BitNoiseStrategy } from "../create-action-form-types";
import { FormNumberWithGenerator } from "../../wrapped-inputs/form-number-with-generator";
import { FieldNamePrefix } from "../../field-name-prefix";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Checkbox } from "../../checkbox";
import { useFormContext } from "react-hook-form";

const bitNoiseStrategyOptions: SelectOption[] = [
  { label: "Left", value: BitNoiseStrategy.Left },
  { label: "Right", value: BitNoiseStrategy.Right },
  { label: "Random", value: BitNoiseStrategy.Random },
];

const bitNoiseLayerOptions: SelectOption[] = [
  { label: "Layer 2", value: BitNoiseLayer.L2 },
  { label: "Layer 3", value: BitNoiseLayer.L3 },
  { label: "Layer 4", value: BitNoiseLayer.L4 },
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

  useEffect(() => {
    setValue(
      fieldNamePrefix
        ? `${fieldNamePrefix}.usingPercentage`
        : "usingPercentage",
      usePercentage,
    );
  }, [fieldNamePrefix, setValue, usePercentage]);

  const onUsePercentageChange = useCallback(() => {
    setUsePercentage((old) => !old);

    if (usePercentage) {
      setValue(
        fieldNamePrefix
          ? `${fieldNamePrefix}.percentageOfBitsToSwap`
          : "percentageOfBitsToSwap",
        undefined,
      );
    } else {
      setValue(
        fieldNamePrefix
          ? `${fieldNamePrefix}.amountOfBitsToSwap`
          : "amountOfBitsToSwap",
        undefined,
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
          disabled={disabled}
        />
      </div>
      <div className="mt-4">
        {usePercentage ? percentageInput : amountInput}
      </div>
      <div className="mt-4">
        <FormSelect
          name={fieldNamePrefix ? `${fieldNamePrefix}.layer` : "layer"}
          label="Layer"
          options={bitNoiseLayerOptions}
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
