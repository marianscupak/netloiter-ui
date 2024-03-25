import { FormSelect } from "../../wrapped-inputs/form-select";
import { GuardSpecificFields } from "../guard-specific-fields";
import { FormCheckbox } from "../../wrapped-inputs/form-checkbox";
import { useFormContext } from "react-hook-form";
import { FieldNamePrefix } from "../../field-name-prefix";
import { useMemo } from "react";
import { guardTypeOptions } from "../create-guard-form-types";

export const GuardFormFields = ({ fieldNamePrefix }: FieldNamePrefix) => {
  const { watch } = useFormContext();

  const isLoaded = useMemo(
    () =>
      watch(fieldNamePrefix ? `${fieldNamePrefix}.loadedId` : "loadedId") !==
      undefined,
    [fieldNamePrefix, watch],
  );

  return (
    <>
      <div className="mt-4">
        <FormSelect
          name={fieldNamePrefix ? `${fieldNamePrefix}.type` : "type"}
          label="Type"
          options={guardTypeOptions}
          disabled={isLoaded}
        />
      </div>
      <GuardSpecificFields
        type={watch(fieldNamePrefix ? `${fieldNamePrefix}.type` : "type")}
        fieldNamePrefix={fieldNamePrefix}
        disabled={isLoaded}
      />
      <div className="mt-4">
        <FormCheckbox
          name={fieldNamePrefix ? `${fieldNamePrefix}.invert` : "invert"}
          label="Invert"
          disabled={isLoaded}
        />
      </div>
    </>
  );
};
