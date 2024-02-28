import { useCallback, useMemo, useState } from "react";
import { FormTextField } from "./form-text-field";
import { ValueGenerator } from "../value-generators";
import { Checkbox } from "../checkbox";
import { useFormContext } from "react-hook-form";

interface Props {
  name: string;
  label: string;
  disabled?: boolean;
}

export const FormNumberWithGenerator = ({ name, label, disabled }: Props) => {
  const { watch } = useFormContext();

  const [useGenerator, setUseGenerator] = useState(
    typeof watch(name) === "object",
  );

  const onCheckboxChange = useCallback(() => {
    setUseGenerator((old) => !old);
  }, []);

  const generatorCheckbox = useMemo(
    () => (
      <Checkbox
        checked={useGenerator}
        onChange={onCheckboxChange}
        label="Generator"
        disabled={disabled}
      />
    ),
    [useGenerator, onCheckboxChange, disabled],
  );

  return (
    <div>
      {useGenerator ? (
        <div className="border rounded-[4px] p-2">
          <div className="flex items-center justify-between">
            <div className="mb-2">{label}</div>
            {generatorCheckbox}
          </div>
          <ValueGenerator name={name} disabled={disabled} />
        </div>
      ) : (
        <div className="flex items-center">
          <div className="flex-grow">
            <FormTextField
              type="number"
              name={name}
              label={label}
              disabled={disabled}
            />
          </div>
          <div className="ml-2">{generatorCheckbox}</div>
        </div>
      )}
    </div>
  );
};
