import { SelectOption } from "../select";
import { ActionType } from "../../../../../server/prisma/public";
import { FormSelect } from "../wrapped-inputs/form-select";
import { FormProvider, useForm } from "react-hook-form";
import {
  CreateActionFormValues,
  createActionFormValuesSchema,
} from "./create-action-form-types";
import { FormTextField } from "../wrapped-inputs/form-text-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionSpecificFields } from "./action-specific-fields";
import { useCallback, useMemo } from "react";
import { Button } from "@mui/material";
import { trpc } from "../../../utils/trpc";
import { useSnackbar } from "../../../utils/snackbar";
import { useNavigate } from "react-router-dom";

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

const defaultValues: CreateActionFormValues = {
  type: ActionType.Finish,
  name: "",
};

export const CreateActionForm = () => {
  const form = useForm<CreateActionFormValues>({
    defaultValues,
    resolver: zodResolver(createActionFormValuesSchema),
    reValidateMode: "onSubmit",
  });

  const trpcContext = trpc.useContext();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSuccess = useCallback(async () => {
    await trpcContext.action.getAll.invalidate();
    showSnackbar("Action created successfully");
    navigate(-1);
  }, []);

  const onError = useCallback(() => {
    showSnackbar("Failed to create action", "error");
  }, []);

  const { mutateAsync: createAction } = trpc.action.createAction.useMutation({
    onSuccess,
    onError,
  });

  const handleSubmit = useCallback(
    async (formValues: CreateActionFormValues) => {
      form.clearErrors("type");
      await createAction(formValues);
    },
    [],
  );

  const onSubmitError = useCallback(() => {
    form.clearErrors("type");
  }, []);

  const onSubmit = useMemo(
    () => form.handleSubmit(handleSubmit, onSubmitError),
    [handleSubmit],
  );

  return (
    <FormProvider {...form}>
      <div className="bg-dark-gray p-4 w-[50%]">
        <FormTextField name="name" label="Name" />
        <div className="mt-4">
          <FormSelect name="type" label="Type" options={actionTypeOptions} />
        </div>
        <ActionSpecificFields type={form.watch("type")} />
        <div className="mt-4">
          <Button variant="contained" onClick={onSubmit}>
            SAVE
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};
