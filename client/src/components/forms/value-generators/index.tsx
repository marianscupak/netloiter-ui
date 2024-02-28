import { useFormContext } from "react-hook-form";
import { FormSelect } from "../wrapped-inputs/form-select";
import { SelectOption } from "../select";
import { ValueGeneratorType } from "./types";
import { useMemo } from "react";
import { NormalDistribution } from "./normal-distribution";
import { UniformDistribution } from "./uniform-distribution";
import { Sequence } from "./sequence";

interface Props {
  name: string;
  disabled?: boolean;
}

const generatorTypeOptions: SelectOption[] = [
  { value: ValueGeneratorType.Normal, label: "Normal distribution" },
  { value: ValueGeneratorType.Uniform, label: "Uniform distribution" },
  { value: ValueGeneratorType.Sequence, label: "Sequence" },
];

const DEFAULT_VALUE = ValueGeneratorType.Normal;

export const ValueGenerator = ({ name, disabled }: Props) => {
  const { watch } = useFormContext();

  const inputs = useMemo(() => {
    switch (watch(`${name}.type`)) {
      case ValueGeneratorType.Normal: {
        return <NormalDistribution name={name} disabled={disabled} />;
      }
      case ValueGeneratorType.Uniform: {
        return <UniformDistribution name={name} disabled={disabled} />;
      }
      case ValueGeneratorType.Sequence: {
        return <Sequence name={name} disabled={disabled} />;
      }
    }
  }, [disabled, name, watch]);

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
