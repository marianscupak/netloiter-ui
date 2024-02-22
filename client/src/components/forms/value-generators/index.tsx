import { useFormContext } from "react-hook-form";
import { FormSelect } from "../wrapped-inputs/form-select";
import { SelectOption } from "../select";
import { ValueGeneratorType } from "./types";
import { useEffect, useMemo } from "react";
import { NormalDistribution } from "./normal-distribution";
import { UniformDistribution } from "./uniform-distribution";
import { Sequence } from "./sequence";

interface Props {
  name: string;
}

const generatorTypeOptions: SelectOption[] = [
  { value: ValueGeneratorType.Normal, label: "Normal distribution" },
  { value: ValueGeneratorType.Uniform, label: "Uniform distribution" },
  { value: ValueGeneratorType.Sequence, label: "Sequence" },
];

const DEFAULT_VALUE = ValueGeneratorType.Normal;

export const ValueGenerator = ({ name }: Props) => {
  const { watch, setValue } = useFormContext();

  const inputs = useMemo(() => {
    switch (watch(`${name}.type`)) {
      case ValueGeneratorType.Normal: {
        return <NormalDistribution name={name} />;
      }
      case ValueGeneratorType.Uniform: {
        return <UniformDistribution name={name} />;
      }
      case ValueGeneratorType.Sequence: {
        return <Sequence name={name} />;
      }
    }
  }, [watch(`${name}.type`)]);

  useEffect(() => {
    setValue(`${name}.type`, DEFAULT_VALUE);
  }, []);

  return (
    <div>
      <FormSelect
        name={`${name}.type`}
        label="Type"
        options={generatorTypeOptions}
        defaultValue={DEFAULT_VALUE}
      />
      {inputs}
    </div>
  );
};
