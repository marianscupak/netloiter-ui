import { FormSelect } from "../../wrapped-inputs/form-select";
import { useFormContext } from "react-hook-form";
import { ActionSpecificFields } from "../action-specific-fields";
import { useMemo } from "react";
import { FieldNamePrefix } from "../../field-name-prefix";
import { actionTypeOptions } from "../create-action-form-types";

export const ActionFormFields = ({ fieldNamePrefix }: FieldNamePrefix) => {
  const { watch } = useFormContext();

  const typeFieldName = useMemo(
    () => (fieldNamePrefix ? `${fieldNamePrefix}.type` : "type"),
    [fieldNamePrefix],
  );

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
          name={typeFieldName}
          label="Type"
          options={actionTypeOptions}
          disabled={isLoaded}
        />
      </div>
      <ActionSpecificFields
        type={watch(typeFieldName)}
        fieldNamePrefix={fieldNamePrefix}
        disabled={isLoaded}
      />
    </>
  );
};
