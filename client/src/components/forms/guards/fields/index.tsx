import { FormSelect } from "../../wrapped-inputs/form-select";
import { GuardSpecificFields } from "../guard-specific-fields";
import { FormCheckbox } from "../../wrapped-inputs/form-checkbox";
import { useFormContext } from "react-hook-form";
import { SelectOption } from "../../select";
import { GuardType } from "../../../../../../server/prisma/public";
import { FieldNamePrefix } from "../../field-name-prefix";
import { useMemo } from "react";

const guardTypeOptions: SelectOption[] = [
  { value: GuardType.Count, label: GuardType.Count },
  { value: GuardType.CountPeriod, label: GuardType.CountPeriod },
  { value: GuardType.EveryN, label: GuardType.EveryN },
  { value: GuardType.ICMP, label: GuardType.ICMP },
  { value: GuardType.IP, label: GuardType.IP },
  { value: GuardType.Port, label: GuardType.Port },
  { value: GuardType.Prob, label: GuardType.Prob },
  { value: GuardType.Protocol, label: GuardType.Protocol },
  { value: GuardType.Size, label: GuardType.Size },
  { value: GuardType.Time, label: GuardType.Time },
  { value: GuardType.TimePeriod, label: GuardType.TimePeriod },
];

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
