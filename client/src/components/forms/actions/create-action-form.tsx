import { ActionType } from "../../../../../server/prisma/public";
import { FormProvider, useForm } from "react-hook-form";
import {
  CreateActionFormValues,
  createActionFormValuesSchema,
} from "./create-action-form-types";
import { FormTextField } from "../wrapped-inputs/form-text-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo } from "react";
import { Button } from "@mui/material";
import { trpc } from "../../../utils/trpc";
import { useSnackbar } from "../../../utils/snackbar";
import { useNavigate } from "react-router-dom";
import { ActionFormFields } from "./fields";

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
  }, [navigate, showSnackbar, trpcContext.action.getAll]);

  const onError = useCallback(() => {
    showSnackbar("Failed to create action", "error");
  }, [showSnackbar]);

  const { mutateAsync: createAction } = trpc.action.createAction.useMutation({
    onSuccess,
    onError,
  });

  const handleSubmit = useCallback(
    async (formValues: CreateActionFormValues) => {
      form.clearErrors("type");
      await createAction(formValues);
    },
    [createAction, form],
  );

  const onSubmitError = useCallback(() => {
    form.clearErrors("type");
  }, [form]);

  const onSubmit = useMemo(
    () => form.handleSubmit(handleSubmit, onSubmitError),
    [form, handleSubmit, onSubmitError],
  );

  return (
    <FormProvider {...form}>
      <div className="bg-dark-gray p-4 w-[50%]">
        <FormTextField name="name" label="Name" />
        <ActionFormFields />
        <div className="mt-4">
          <Button variant="contained" onClick={onSubmit}>
            SAVE
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};
