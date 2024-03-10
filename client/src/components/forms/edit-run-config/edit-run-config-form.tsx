import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { CreateScenarioFormValues } from "../scenarios/create-scenario-form-types";
import {
  EditRunConfigFormValues,
  editRunConfigFormValuesSchema,
} from "./edit-run-config-form-types";
import { zodResolver } from "@hookform/resolvers/zod";
import DeleteIcon from "@mui/icons-material/Delete";
import { RuleFormFields } from "../rules/rule-form-fields";
import { Button } from "@mui/material";
import { useCallback, useMemo } from "react";
import { createRuleFormDefaultValues } from "../rules/create-rule-form";
import { useLoadRuleModal } from "../../../utils/use-load-rule-modal";
import { trpc } from "../../../utils/trpc";
import { useSnackbar } from "../../../utils/snackbar";
import { useNavigate } from "react-router-dom";

interface Props {
  scenario: CreateScenarioFormValues;
}

export const EditRunConfigForm = ({ scenario }: Props) => {
  const form = useForm<EditRunConfigFormValues>({
    resolver: zodResolver(editRunConfigFormValuesSchema),
    defaultValues: { rules: scenario.rules },
  });

  const {
    fields: rules,
    remove: removeRule,
    append: appendRule,
  } = useFieldArray({
    name: "rules",
    control: form.control,
  });

  const addDefaultRule = useCallback(() => {
    appendRule(createRuleFormDefaultValues);
  }, [appendRule]);

  const { openLoadRuleModal, modal } = useLoadRuleModal(appendRule);

  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSuccess = useCallback(() => {
    navigate(-1);
    showSnackbar("Successfully changed rules");
  }, [navigate, showSnackbar]);

  const onError = useCallback(() => {
    showSnackbar("Failed to change rules", "error");
  }, [showSnackbar]);

  const { mutateAsync: editRunConfig } =
    trpc.runHistory.editRunConfig.useMutation({ onSuccess, onError });

  const onSubmit = useCallback(
    async (values: EditRunConfigFormValues) => {
      await editRunConfig(values);
    },
    [editRunConfig],
  );

  const handleSubmit = useMemo(
    () => form.handleSubmit(onSubmit),
    [form, onSubmit],
  );

  return (
    <FormProvider {...form}>
      <div className="text-subheader">Rules</div>
      <div className="p-4 bg-dark-gray">
        {rules.map((rule, index) => (
          <div className="p-4 mb-4 border rounded-[4px]" key={rule.id}>
            <div className="flex justify-end">
              <div onClick={() => removeRule(index)} className="cursor-pointer">
                <DeleteIcon color="error" />
              </div>
            </div>
            <RuleFormFields fieldNamePrefix={`rules.${index}`} />
          </div>
        ))}
        <div className="mt-4 flex gap-2">
          <Button onClick={addDefaultRule} variant="contained">
            ADD RULE
          </Button>
          <Button onClick={openLoadRuleModal} variant="contained">
            LOAD RULE
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <Button variant="contained" onClick={handleSubmit}>
          SAVE
        </Button>
      </div>
      {modal}
    </FormProvider>
  );
};
