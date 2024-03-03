import { Button, CircularProgress } from "@mui/material";
import { SelectOption } from "../select";
import { Modal } from "../../common/modal";
import { NavLink } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  StartNetLoiterFormValues,
  startNetLoiterFormValuesSchema,
} from "./start-net-loiter-form-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSelect } from "../wrapped-inputs/form-select";

interface Props {
  open: boolean;
  loading: boolean;
  scenarioOptions: SelectOption[];
  configOptions: SelectOption[];
  onClose(): void;
  onStartNetLoiter(scenarioId: number, configId: number): void;
}

export const StartNetLoiterModal = ({
  open,
  loading,
  scenarioOptions,
  configOptions,
  onClose,
  onStartNetLoiter,
}: Props) => {
  const form = useForm<StartNetLoiterFormValues>({
    resolver: zodResolver(startNetLoiterFormValuesSchema),
    reValidateMode: "onSubmit",
  });

  const handleSubmit = useCallback(
    ({ scenarioId, configId }: StartNetLoiterFormValues) => {
      onStartNetLoiter(scenarioId, configId);
    },
    [onStartNetLoiter],
  );

  const onSubmit = useMemo(
    () => form.handleSubmit(handleSubmit),
    [form, handleSubmit],
  );

  return (
    <Modal open={open} onClose={onClose}>
      <FormProvider {...form}>
        <div className="text-header">Start NetLoiter</div>
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
