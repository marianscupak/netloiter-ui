import { FormProvider, useForm } from "react-hook-form";
import {
  CreateRuleFormValues,
  createRuleFormValuesSchema,
} from "./create-rule-form-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RuleType } from "../../../../../server/prisma/public";
import { FormTextField } from "../wrapped-inputs/form-text-field";
import { Button } from "@mui/material";
import { useCallback, useMemo } from "react";
import { RuleFormFields } from "./rule-form-fields";
import { trpc } from "../../../utils/trpc";
import { useSnackbar } from "../../../utils/snackbar";
import { useNavigate } from "react-router-dom";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "../../../../../server/trpc-routers";
import { createGuardFormDefaultValues } from "../guards/create-guard-form";
import { createActionFormDefaultValues } from "../actions/create-action-form";

export const createRuleFormDefaultValues: CreateRuleFormValues = {
  type: RuleType.All,
  name: "",
  guards: [createGuardFormDefaultValues],
  actions: [createActionFormDefaultValues],
};

export const CreateRuleForm = () => {
  const form = useForm<CreateRuleFormValues>({
    resolver: zodResolver(createRuleFormValuesSchema),
    defaultValues: createRuleFormDefaultValues,
  });

  const trpcContext = trpc.useContext();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSuccess = useCallback(async () => {
    await trpcContext.rule.getAll.invalidate();
    showSnackbar("Rule created successfully");
    navigate(-1);
  }, [navigate, showSnackbar, trpcContext.rule.getAll]);

  const onError = useCallback(
    (error: TRPCClientErrorLike<AppRouter>) => {
      showSnackbar(error.message, "error");
    },
    [showSnackbar],
  );

  const { mutateAsync: createRule } = trpc.rule.createRule.useMutation({
    onSuccess,
    onError,
  });

  const handleSubmit = useCallback(
    async (values: CreateRuleFormValues) => {
      await createRule(values);
    },
    [createRule],
  );

  const onSubmit = useMemo(
    () => form.handleSubmit(handleSubmit),
    [form, handleSubmit],
  );

  return (
    <FormProvider {...form}>
      <div className="bg-dark-gray p-4 w-[80%]">
        <FormTextField name="name" label="Name" />
        <RuleFormFields />
        <div className="mt-4">
          <Button variant="contained" onClick={onSubmit}>
            SAVE
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};
