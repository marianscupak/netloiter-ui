import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import {
  CreateScenarioFormValues,
  createScenarioFormValuesSchema,
} from "./create-scenario-form-types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionType,
  RuleType,
  ScenarioType,
} from "../../../../../server/prisma/public";
import { FormTextField } from "../wrapped-inputs/form-text-field";
import { Button, SelectChangeEvent } from "@mui/material";
import { FormSelect } from "../wrapped-inputs/form-select";
import { Select, SelectOption } from "../select";
import { useCallback, useMemo, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { RuleFormFields } from "../rules/rule-form-fields";
import { createRuleFormDefaultValues } from "../rules/create-rule-form";
import { Modal } from "../../common/modal";
import { trpc } from "../../../utils/trpc";
import { useSnackbar } from "../../../utils/snackbar";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "../../../../../server/trpc-routers";
import { useNavigate } from "react-router-dom";
import { CreateActionFormValues } from "../actions/create-action-form-types";
import { CreateGuardFormValues } from "../guards/create-guard-form-types";

const defaultCreateScenarioValues: CreateScenarioFormValues = {
  name: "",
  type: ScenarioType.Sequential,
  defaultAction: ActionType.Finish,
  rules: [createRuleFormDefaultValues],
};

const scenarioTypeOptions: SelectOption[] = [
  { value: ScenarioType.Sequential, label: ScenarioType.Sequential },
];

const defaultActionOptions: SelectOption[] = [
  { value: ActionType.Finish, label: ActionType.Finish },
  { value: ActionType.Drop, label: ActionType.Drop },
  { value: ActionType.Pause, label: ActionType.Pause },
  { value: ActionType.Skip, label: ActionType.Skip },
];

interface Props {
  defaultValues?: CreateScenarioFormValues;
}

export const CreateScenarioForm = ({ defaultValues }: Props) => {
  const form = useForm<CreateScenarioFormValues>({
    defaultValues: defaultValues ?? defaultCreateScenarioValues,
    resolver: zodResolver(createScenarioFormValuesSchema),
    reValidateMode: "onSubmit",
  });

  const {
    fields: rules,
    append: appendRule,
    remove: removeRule,
  } = useFieldArray({
    name: "rules",
    control: form.control,
  });

  const { showSnackbar } = useSnackbar();

  const appendDefaultRule = useCallback(() => {
    appendRule(createRuleFormDefaultValues);
  }, [appendRule]);

  const [loadRuleModalOpen, setLoadActionModalOpen] = useState<boolean>(false);

  const openLoadRuleModal = useCallback(() => {
    setLoadActionModalOpen(true);
  }, []);

  const closeLoadRuleModal = useCallback(() => {
    setLoadActionModalOpen(false);
  }, []);

  const { data: allRules } = trpc.rule.getAll.useQuery();

  const loadRuleOptions = useMemo(
    (): SelectOption[] =>
      allRules
        ? allRules.map(({ name, id }) => ({ value: id, label: name }))
        : [],
    [allRules],
  );

  const onGetRuleDetailError = useCallback(
    (error: TRPCClientErrorLike<AppRouter>) => {
      showSnackbar(error.message, "error");
    },
    [showSnackbar],
  );

  const { mutateAsync: getRuleDetail } = trpc.rule.getRuleDetail.useMutation({
    onError: onGetRuleDetailError,
  });

  const loadRule = useCallback(
    async (event: SelectChangeEvent<unknown>) => {
      const rule = await getRuleDetail({
        id: event.target.value as unknown as number,
      });

      appendRule({
        type: rule.type as RuleType,
        loadedId: rule.id,
        actions: rule.actions as unknown as CreateActionFormValues[],
        guards: rule.guards as unknown as CreateGuardFormValues[],
      });

      closeLoadRuleModal();
    },
    [appendRule, closeLoadRuleModal, getRuleDetail],
  );

  const trpcContext = trpc.useContext();
  const navigate = useNavigate();

  const onSuccess = useCallback(async () => {
    await trpcContext.rule.getAll.invalidate();
    showSnackbar("Scenario created successfully");
    navigate(-1);
  }, [navigate, showSnackbar, trpcContext.rule.getAll]);

  const onError = useCallback(
    (error: TRPCClientErrorLike<AppRouter>) => {
      showSnackbar(error.message, "error");
    },
    [showSnackbar],
  );

  const { mutateAsync: createScenario } =
    trpc.scenario.createScenario.useMutation({ onSuccess, onError });

  const handleSubmit = useCallback(
    async (values: CreateScenarioFormValues) => {
      await createScenario(values);
    },
    [createScenario],
  );

  const onSubmit = useMemo(
    () => form.handleSubmit(handleSubmit),
    [form, handleSubmit],
  );

  return (
    <FormProvider {...form}>
      <div className="bg-dark-gray p-4 w-[80%]">
        <div className="mt-4">
          <FormTextField name="name" label="Name" />
        </div>
        <div className="mt-4">
          <FormSelect name="type" label="Type" options={scenarioTypeOptions} />
        </div>
        <div className="mt-4">
          <FormSelect
            name="defaultAction"
            label="Default action"
            options={defaultActionOptions}
          />
        </div>
        <div className="mt-4">
          <div>Rules</div>
          {rules.map((rule, index) => (
            <div className="p-2 border rounded-[4px] mb-4" key={rule.id}>
              <div className="flex justify-end">
                <div
                  onClick={() => removeRule(index)}
                  className="cursor-pointer"
                >
                  <DeleteIcon color="error" />
                </div>
              </div>
              <RuleFormFields fieldNamePrefix={`rules.${index}`} />
            </div>
          ))}
          <div className="mt-4 flex gap-2">
            <Button onClick={appendDefaultRule} variant="contained">
              ADD RULE
            </Button>
            <Button onClick={openLoadRuleModal} variant="contained">
              LOAD RULE
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="contained" onClick={onSubmit}>
            SAVE
          </Button>
        </div>
      </div>
      <Modal open={loadRuleModalOpen} onClose={closeLoadRuleModal}>
        <Select label="Rule" options={loadRuleOptions} onChange={loadRule} />
      </Modal>
    </FormProvider>
  );
};
