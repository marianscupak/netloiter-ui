import { useCallback, useMemo, useState } from "react";
import { FormTextField } from "./form-text-field";
import { ValueGenerator } from "../value-generators";
import { Checkbox } from "../checkbox";

interface Props {
  name: string;
  label: string;
}

export const FormNumberWithGenerator = ({ name, label }: Props) => {
  const [useGenerator, setUseGenerator] = useState(false);

  const onCheckboxChange = useCallback(() => {
    setUseGenerator((old) => !old);
  }, []);

  const generatorCheckbox = useMemo(
    () => (
      <Checkbox
        checked={useGenerator}
        onChange={onCheckboxChange}
        label="Generator"
      />
    ),
    [useGenerator, onCheckboxChange],
  );

  return (
    <div>
      {useGenerator ? (
        <div className="border rounded-[4px] p-2">
          <div className="flex items-center justify-between">
            <div className="mb-2">{label}</div>
            {generatorCheckbox}
          </div>
          <ValueGenerator name={name} />
        </div>
      ) : (
        <div className="flex items-center">
          <div className="flex-grow">
            <FormTextField type="number" name={name} label={label} />
          </div>
          <div className="ml-2">{generatorCheckbox}</div>
        </div>
      )}
    </div>
  );
};
