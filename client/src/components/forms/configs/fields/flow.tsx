import { FormSelect } from "../../wrapped-inputs/form-select";
import { SelectOption } from "../../select";
import { FlowActionType } from "../create-config-form-types";
import { Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { Modal } from "../../../common/modal";
import { Checkbox } from "../../checkbox";
import { FormTextField } from "../../wrapped-inputs/form-text-field";
import { FieldNamePrefix } from "../../field-name-prefix";
import { FormCheckbox } from "../../wrapped-inputs/form-checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormContext } from "react-hook-form";

const flowActionTypeOptions: SelectOption[] = [
  { value: FlowActionType.Catch, label: "Catch" },
  { value: FlowActionType.Ignore, label: "Ignore" },
];

interface FlowParameter {
  name: string;
  enabled: boolean;
  label: string;
  type: "boolean" | "string" | "number";
}

const flowParameters: FlowParameter[] = [
  { name: "all", type: "boolean", enabled: false, label: "All" },
  { name: "ip", type: "string", enabled: false, label: "IP" },
  { name: "port", type: "number", enabled: false, label: "Port" },
  {
    name: "dstPort",
    type: "number",
    enabled: false,
    label: "Destination Port",
  },
  { name: "protocol", type: "number", enabled: false, label: "Protocol" },
  { name: "icmpType", type: "number", enabled: false, label: "ICMP Type" },
];

const FlowParameter = ({
  name,
  fieldNamePrefix,
  label,
  type,
  readOnly,
}: FlowParameter & FieldNamePrefix & { readOnly?: boolean }) => {
  switch (type) {
    case "string":
      return (
        <FormTextField
          name={`${fieldNamePrefix}.${name}`}
          label={label}
          disabled={readOnly}
        />
      );
    case "number":
      return (
        <FormTextField
          name={`${fieldNamePrefix}.${name}`}
          label={label}
          type="number"
          disabled={readOnly}
        />
      );
    case "boolean":
      return (
        <FormCheckbox
          name={`${fieldNamePrefix}.${name}`}
          label={label}
          disabled={readOnly}
        />
      );
  }
};

interface Props extends FieldNamePrefix {
  readOnly?: boolean;
  remove(): void;
}

export const Flow = ({ fieldNamePrefix, readOnly, remove }: Props) => {
  const { watch, setValue } = useFormContext();

  const values = useMemo(
    () => watch(fieldNamePrefix ?? ""),
    [fieldNamePrefix, watch],
  );

  const [parametersModalOpen, setParametersModalOpen] = useState(false);
  const [parametersShown, setParametersShown] = useState(
    flowParameters.map((param) =>
      Object.keys(values).includes(param.name)
        ? { ...param, enabled: true }
        : param,
    ),
  );

  const openParametersModal = useCallback(
    () => setParametersModalOpen(true),
    [],
  );

  const closeParametersModal = useCallback(
    () => setParametersModalOpen(false),
    [],
  );

  const onParameterToggle = useCallback(
    (name: string) => () => {
      if (parametersShown.find((x) => x.name === name)?.enabled) {
        setValue(`${fieldNamePrefix}.${name}`, undefined);
      }
      setParametersShown((old) =>
        old.map((param) =>
          param.name === name ? { ...param, enabled: !param.enabled } : param,
        ),
      );
    },
    [fieldNamePrefix, parametersShown, setValue],
  );

  return (
    <div className="p-2 border rounded-[4px] mb-4">
      {!readOnly && (
        <div className="flex justify-end">
          <div onClick={remove} className="cursor-pointer">
            <DeleteIcon color="error" />
          </div>
        </div>
      )}
      <div className="mt-4">
        <FormSelect
          name={`${fieldNamePrefix}.action`}
          label="Action"
          options={flowActionTypeOptions}
          disabled={readOnly}
        />
        {parametersShown.map((param) =>
          param.enabled ? (
            <div key={param.name} className="mt-4">
              <FlowParameter
                {...param}
                fieldNamePrefix={fieldNamePrefix}
                readOnly={readOnly}
              />
            </div>
          ) : null,
        )}
      </div>
      {!readOnly && (
        <Button onClick={openParametersModal}>EDIT PARAMETERS</Button>
      )}
      <Modal open={parametersModalOpen} onClose={closeParametersModal}>
        <div>
          <div>Parameters</div>
          {parametersShown.map(({ name, enabled, label }) => (
            <div key={name}>
              <Checkbox
                label={label}
                onChange={onParameterToggle(name)}
                checked={enabled}
              />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
