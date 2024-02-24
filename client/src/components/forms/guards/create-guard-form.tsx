import { FormProvider, useForm } from "react-hook-form";
import {
  CreateGuardFormValues,
  createGuardFormValuesSchema,
} from "./create-guard-form-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { GuardType } from "../../../../../server/prisma/public";
import { SelectOption } from "../select";
import { FormTextField } from "../wrapped-inputs/form-text-field";
import { FormSelect } from "../wrapped-inputs/form-select";
import { Button } from "@mui/material";
import { GuardSpecificFields } from "./guard-specific-fields";
import { FormCheckbox } from "../wrapped-inputs/form-checkbox";
import { trpc } from "../../../utils/trpc";
import { useCallback, useMemo } from "react";
import { useSnackbar } from "../../../utils/snackbar";
import { useNavigate } from "react-router-dom";

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

const defaultValues: CreateGuardFormValues = {
  name: "",
  type: GuardType.Count,
  after: 5,
  count: 5,
  invert: false,
};

export const CreateGuardForm = () => {
  const form = useForm<CreateGuardFormValues>({
    defaultValues,
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
  }, []);

  const onError = useCallback(() => {
    showSnackbar("Failed to create guard", "error");
  }, []);

  const { mutateAsync: createGuard } = trpc.guard.createGuard.useMutation({
    onSuccess,
    onError,
  });

  const handleSubmit = useCallback(
    async (formValues: CreateGuardFormValues) => {
      form.clearErrors("type");
      await createGuard(formValues);
    },
    [form],
  );

  const onSubmitError = useCallback(() => {
    form.clearErrors("type");
  }, [form]);

  const onSubmit = useMemo(
    () => form.handleSubmit(handleSubmit, onSubmitError),
    [form, handleSubmit],
  );

  return (
    <FormProvider {...form}>
      <div className="bg-dark-gray p-4 w-[50%]">
        <FormTextField name="name" label="Name" />
        <div className="mt-4">
          <FormSelect name="type" label="Type" options={guardTypeOptions} />
        </div>
        <GuardSpecificFields type={form.watch("type")} />
        <div className="mt-4">
          <FormCheckbox name="invert" label="Invert" />
        </div>
        <div className="mt-4">
          <Button variant="contained" onClick={onSubmit}>
            SAVE
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};
