import { Button, CircularProgress } from "@mui/material";
import { Modal } from "../../common/modal";
import { NavLink } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  StartNetLoiterFormValues,
  startNetLoiterFormValuesSchema,
} from "./start-net-loiter-form-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSelect } from "../wrapped-inputs/form-select";
import { SelectOption } from "../../../utils/select-option";
import { StartNetLoiterParams } from "../../../utils/use-nl-status-endpoints";
import { defaultActionOptions } from "../actions/create-action-form-types";

interface Props {
  open: boolean;
  loading: boolean;
  scenarioOptions: SelectOption[];
  configOptions: SelectOption[];
  onClose(): void;
  onStartNetLoiter(params: StartNetLoiterParams): void;
}

export const StartNetLoiterModal = ({
  open,
  loading,
  scenarioOptions,
  configOptions,
  onClose,
  onStartNetLoiter,
}: Props) => {
  const [usingDefaultAction, setUsingDefaultAction] = useState(false);

  const form = useForm<StartNetLoiterFormValues>({
    resolver: zodResolver(startNetLoiterFormValuesSchema),
    reValidateMode: "onSubmit",
  });

  const handleSubmit = useCallback(
    ({ configId, ...values }: StartNetLoiterFormValues) => {
      if ("scenarioId" in values) {
        onStartNetLoiter({ scenarioId: values.scenarioId, configId });
      } else {
        onStartNetLoiter({ defaultAction: values.defaultAction, configId });
      }
    },
    [onStartNetLoiter],
  );

  const onSubmit = useMemo(
    () => form.handleSubmit(handleSubmit),
    [form, handleSubmit],
  );

  const toggleUsingDefaultAction = useCallback(() => {
    setUsingDefaultAction((x) => {
      if (x) {
        form.unregister("scenarioId");
      } else {
        form.unregister("defaultAction");
      }

      return !x;
    });
  }, [form]);

  return (
    <Modal open={open} onClose={onClose}>
      <FormProvider {...form}>
        <div className="flex gap-4">
          <div className="text-header w-[70%]">Start NetLoiter</div>
          <div className="w-[30%] ml-auto">
            <Button
              variant="outlined"
              className="w-full h-full"
              color="warning"
              onClick={toggleUsingDefaultAction}
            >
              {usingDefaultAction ? "USE SCENARIO" : "USE DEFAULT ACTION"}
            </Button>
          </div>
        </div>
        {usingDefaultAction ? (
          <div className="w-full my-4">
            <FormSelect
              name="defaultAction"
              label="Default Action"
              options={defaultActionOptions}
            />
          </div>
        ) : (
          <div className="flex w-full gap-4 my-4">
            <div className="w-[70%]">
              <FormSelect
                name="scenarioId"
                label="Scenario"
                options={scenarioOptions}
              />
            </div>
            <NavLink to="/scenarios/create" className="w-[30%]">
              <Button variant="outlined" className="w-full h-full">
                NEW SCENARIO
              </Button>
            </NavLink>
          </div>
        )}
        <div className="flex w-full gap-4">
          <div className="w-[70%]">
            <FormSelect
              name="configId"
              label="Config"
              options={configOptions}
            />
          </div>
          <NavLink to="/configs/create" className="w-[30%]">
            <Button variant="outlined" className="w-full h-full">
              NEW CONFIG
            </Button>
          </NavLink>
        </div>
        <div className="mt-4">
          <Button variant="contained" onClick={onSubmit} disabled={loading}>
            {loading ? <CircularProgress color="info" size="24px" /> : "START"}
          </Button>
        </div>
      </FormProvider>
    </Modal>
  );
};
