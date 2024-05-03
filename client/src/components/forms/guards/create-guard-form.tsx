import { FormProvider, useForm } from "react-hook-form";
import {
  CreateGuardFormValues,
  createGuardFormValuesSchema,
} from "./create-guard-form-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { GuardType } from "../../../../../server/prisma/public";
import { FormTextField } from "../wrapped-inputs/form-text-field";
import { Button } from "@mui/material";
import { trpc } from "../../../utils/trpc";
import { useCallback, useMemo } from "react";
import { useSnackbar } from "../../../utils/snackbar";
import { useNavigate } from "react-router-dom";
import { GuardFormFields } from "./fields";

export const createGuardFormDefaultValues: CreateGuardFormValues = {
  name: "",
  type: GuardType.Count,
  // @ts-expect-error Default value should be empty
  after: undefined,
  // @ts-expect-error Default value should be empty
  duration: undefined,
  invert: false,
};

interface Props {
  defaultValues?: CreateGuardFormValues;
  readOnly?: boolean;
}

export const CreateGuardForm = ({ defaultValues, readOnly }: Props) => {
  const form = useForm<CreateGuardFormValues>({
    defaultValues: defaultValues ?? createGuardFormDefaultValues,
    resolver: zodResolver(createGuardFormValuesSchema),
    reValidateMode: "onSubmit",
  });

  const trpcContext = trpc.useContext();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSuccess = useCallback(async () => {
    await trpcContext.action.getAll.invalidate();
    showSnackbar("Guard created successfully");
    navigate(-1);
  }, [navigate, showSnackbar, trpcContext.action.getAll]);

  const onError = useCallback(() => {
    showSnackbar("Failed to create guard", "error");
  }, [showSnackbar]);

  const { mutateAsync: createGuard } = trpc.guard.createGuard.useMutation({
    onSuccess,
    onError,
  });

  const handleSubmit = useCallback(
    async (formValues: CreateGuardFormValues) => {
      form.clearErrors("type");
      await createGuard(formValues);
    },
    [createGuard, form],
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
      <div className="bg-dark-gray p-4 w-full md:w-[50%]">
        <FormTextField name="name" label="Name" disabled={readOnly} />
        <GuardFormFields />
        {!readOnly && (
          <div className="mt-4">
            <Button variant="contained" onClick={onSubmit}>
              SAVE
            </Button>
          </div>
        )}
      </div>
    </FormProvider>
  );
};
