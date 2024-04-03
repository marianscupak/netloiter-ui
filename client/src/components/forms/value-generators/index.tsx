import { useFormContext } from "react-hook-form";
import { FormSelect } from "../wrapped-inputs/form-select";
import { ValueGeneratorType } from "./types";
import { NormalDistribution } from "./normal-distribution";
import { UniformDistribution } from "./uniform-distribution";
import { Sequence } from "./sequence";
import { useEffect } from "react";
import { SelectOption } from "../../../utils/select-option";

interface Props {
  name: string;
  disabled?: boolean;
  int?: boolean;
  min?: number;
  max?: number;
  once?: boolean;
}

const generatorTypeOptions: SelectOption[] = [
  { value: ValueGeneratorType.Normal, label: "Normal distribution" },
  { value: ValueGeneratorType.Uniform, label: "Uniform distribution" },
  { value: ValueGeneratorType.Sequence, label: "Sequence" },
];

const DEFAULT_VALUE = ValueGeneratorType.Normal;

export const ValueGenerator = ({
  name,
  disabled,
  int,
  min,
  max,
  once,
}: Props) => {
  const { watch, setValue } = useFormContext();

  useEffect(() => {
    if (min !== undefined) {
      setValue(`${name}.min`, min);
    }
    if (max !== undefined) {
      setValue(`${name}.max`, max);
    }
    if (once) {
      setValue(`${name}.once`, once);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const inputs = (() => {
    switch (watch(`${name}.type`) ?? DEFAULT_VALUE) {
      case ValueGeneratorType.Normal: {
        return (
          <NormalDistribution
            name={name}
            disabled={disabled}
            min={min}
            max={max}
            once={once}
          />
        );
      }
      case ValueGeneratorType.Uniform: {
        return (
          <UniformDistribution
            name={name}
            disabled={disabled}
            min={min}
            max={max}
            once={once}
          />
        );
      }
      case ValueGeneratorType.Sequence: {
        return <Sequence name={name} disabled={disabled} min={min} max={max} />;
      }
    }
  })();

  useEffect(() => {
    setValue(`${name}.int`, int);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <FormSelect
        name={`${name}.type`}
        label="Type"
        options={generatorTypeOptions}
        defaultValue={watch(`${name}.type`) ?? DEFAULT_VALUE}
        disabled={disabled}
      />
      {inputs}
    </div>
  );
};
