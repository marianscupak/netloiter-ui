import { FormSelect } from "../../wrapped-inputs/form-select";
import { useFormContext } from "react-hook-form";
import { SelectOption } from "../../select";
import { ActionType } from "../../../../../../server/prisma/public";
import { ActionSpecificFields } from "../action-specific-fields";
import { useMemo } from "react";
import { FieldNamePrefix } from "../../field-name-prefix";

const actionTypeOptions: SelectOption[] = [
  { value: ActionType.BitNoise, label: ActionType.BitNoise },
  { value: ActionType.Delay, label: ActionType.Delay },
  { value: ActionType.Drop, label: ActionType.Drop },
  { value: ActionType.Finish, label: ActionType.Finish },
  { value: ActionType.Pause, label: ActionType.Pause },
  { value: ActionType.Reorder, label: ActionType.Reorder },
  { value: ActionType.Replicate, label: ActionType.Replicate },
  { value: ActionType.Restart, label: ActionType.Restart },
  { value: ActionType.Skip, label: ActionType.Skip },
  { value: ActionType.SocketTcp, label: ActionType.SocketTcp },
  { value: ActionType.Throttle, label: ActionType.Throttle },
];

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
