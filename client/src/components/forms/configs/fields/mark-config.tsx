import { useFieldArray, useFormContext } from "react-hook-form";
import { Flow } from "./flow";
import { Button } from "@mui/material";
import { useCallback } from "react";
import { FlowActionType } from "../create-config-form-types";

const defaultFlow = { action: FlowActionType.Catch };

export const MarkConfigFields = () => {
  const { control } = useFormContext();

  const {
    fields: flows,
    append: appendFlow,
    remove: removeFlow,
  } = useFieldArray({
    name: "flows",
    control,
  });

  const appendDefaultFlow = useCallback(() => {
    appendFlow(defaultFlow);
  }, [appendFlow]);

  return (
    <div>
      <div className="mt-4">Flows</div>
      <div>
        {flows.map((flow, index) => (
          <Flow
            key={flow.id}
            fieldNamePrefix={`flows.${index}`}
            remove={() => removeFlow(index)}
          />
        ))}
        <div className="mt-4">
          <Button variant="contained" onClick={appendDefaultFlow}>
            ADD FLOW
          </Button>
        </div>
      </div>
    </div>
  );
};
