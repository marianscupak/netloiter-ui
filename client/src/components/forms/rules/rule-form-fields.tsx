import { FieldNamePrefix } from "../field-name-prefix";
import { FormSelect } from "../wrapped-inputs/form-select";
import { GuardFormFields } from "../guards/fields";
import { ActionFormFields } from "../actions/fields";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Select, SelectOption } from "../select";
import {
  GuardType,
  RuleType,
  ActionType,
} from "../../../../../server/prisma/public";
import { useCallback, useMemo, useState } from "react";
import { defaultAction, defaultGuard } from "./create-rule-form";
import { Button, SelectChangeEvent } from "@mui/material";
import { trpc } from "../../../utils/trpc";
import { Modal } from "../../common/modal";
import { useSnackbar } from "../../../utils/snackbar";
import DeleteIcon from "@mui/icons-material/Delete";

const ruleTypeOptions: SelectOption[] = [
  { value: RuleType.All, label: RuleType.All },
  { value: RuleType.Any, label: RuleType.Any },
];

export const RuleFormFields = ({ fieldNamePrefix }: FieldNamePrefix) => {
  const { control } = useFormContext();

  const { data: allGuards } = trpc.guard.getAll.useQuery();
  const { mutateAsync: getGuardDetail } =
    trpc.guard.getGuardDetail.useMutation();

  const { data: allActions } = trpc.action.getAll.useQuery();
  const { mutateAsync: getActionDetail } =
    trpc.action.getActionDetail.useMutation();

  const {
    fields: guards,
    append: appendGuard,
    remove: removeGuard,
  } = useFieldArray({
    name: fieldNamePrefix ? `${fieldNamePrefix}.guards` : "guards",
    control,
  });

  const {
    fields: actions,
    append: appendAction,
    remove: removeAction,
  } = useFieldArray({
    name: fieldNamePrefix ? `${fieldNamePrefix}.actions` : "actions",
    control,
  });

  const appendDefaultGuard = useCallback(() => {
    appendGuard(defaultGuard);
  }, [appendGuard]);

  const appendDefaultAction = useCallback(() => {
    appendAction(defaultAction);
  }, [appendAction]);

  const [loadGuardModalOpen, setLoadGuardModalOpen] = useState<boolean>(false);

  const openLoadGuardModal = useCallback(() => {
    setLoadGuardModalOpen(true);
  }, []);

  const closeLoadGuardModal = useCallback(() => {
    setLoadGuardModalOpen(false);
  }, []);

  const { showSnackbar } = useSnackbar();

  const loadGuard = useCallback(
    async (event: SelectChangeEvent<unknown>) => {
      const guard = await getGuardDetail({
        id: event.target.value as unknown as number,
      });

      if (guard) {
        const formGuard: {
          invert: boolean;
          loadedId: number;
          type: GuardType;
        } = {
          // @ts-expect-error Guard data type hard to infer
          ...guard.data,
          type: guard.type as GuardType,
          invert: guard.invert,
          loadedId: guard.id,
        };

        appendGuard(formGuard);
      } else {
        showSnackbar("Failed to load guard", "error");
      }

      closeLoadGuardModal();
    },
    [appendGuard, closeLoadGuardModal, getGuardDetail, showSnackbar],
  );

  const loadGuardOptions = useMemo(
    (): SelectOption[] =>
      allGuards
        ? allGuards.map((guard) => ({ value: guard.id, label: guard.name }))
        : [],
    [allGuards],
  );

  const [loadActionModalOpen, setLoadActionModalOpen] =
    useState<boolean>(false);

  const openLoadActionModal = useCallback(() => {
    setLoadActionModalOpen(true);
  }, []);

  const closeLoadActionModal = useCallback(() => {
    setLoadActionModalOpen(false);
  }, []);

  const loadAction = useCallback(
    async (event: SelectChangeEvent<unknown>) => {
      const action = await getActionDetail({
        id: event.target.value as unknown as number,
      });

      if (action) {
        const formAction: { loadedId: number; type: ActionType } = {
          // @ts-expect-error Action data type hard to infer
          ...action.data,
          type: action.type as ActionType,
          loadedId: action.id,
        };

        appendAction(formAction);
      } else {
        showSnackbar("Failed to load action", "error");
      }

      closeLoadActionModal();
    },
    [appendAction, closeLoadActionModal, getActionDetail, showSnackbar],
  );

  const loadActionOptions = useMemo(
    (): SelectOption[] =>
      allActions
        ? allActions.map((action) => ({ value: action.id, label: action.name }))
        : [],
    [allActions],
  );

  return (
    <>
      <div className="mt-4">
        <FormSelect
          name={fieldNamePrefix ? `${fieldNamePrefix}.type` : "type"}
          label="Type"
          options={ruleTypeOptions}
        />
      </div>
      <div className="flex gap-4 mt-4">
        <div className="w-1/2">
          <div>Guards</div>
          {guards.map((guard, index) => (
            <div className="p-2 border rounded-[4px] mb-4" key={guard.id}>
              <div className="flex justify-end">
                <div
                  onClick={() => removeGuard(index)}
                  className="cursor-pointer"
                >
                  <DeleteIcon color="error" />
                </div>
              </div>
              <GuardFormFields
                key={guard.id}
                fieldNamePrefix={
                  fieldNamePrefix
                    ? `${fieldNamePrefix}.guards.${index}`
                    : `guards.${index}`
                }
              />
            </div>
          ))}
          <div className="mt-4 flex gap-2">
            <Button onClick={appendDefaultGuard} variant="contained">
              ADD GUARD
            </Button>
            <Button onClick={openLoadGuardModal} variant="contained">
              LOAD GUARD
            </Button>
          </div>
        </div>
        <div className="w-1/2">
          <div>Actions</div>
          {actions.map((action, index) => (
            <div className="p-2 border rounded-[4px] mb-4" key={action.id}>
              <div className="flex justify-end">
                <div
                  onClick={() => removeAction(index)}
                  className="cursor-pointer"
                >
                  <DeleteIcon color="error" />
                </div>
              </div>
              <ActionFormFields
                key={action.id}
                fieldNamePrefix={
                  fieldNamePrefix
                    ? `${fieldNamePrefix}.actions.${index}`
                    : `actions.${index}`
                }
              />
            </div>
          ))}
          <div className="mt-4 flex gap-2">
            <Button onClick={appendDefaultAction} variant="contained">
              ADD ACTION
            </Button>
            <Button onClick={openLoadActionModal} variant="contained">
              LOAD ACTION
            </Button>
          </div>
        </div>
        <Modal open={loadGuardModalOpen} onClose={closeLoadGuardModal}>
          <Select
            label="Guard"
            options={loadGuardOptions}
            onChange={loadGuard}
          />
        </Modal>
        <Modal open={loadActionModalOpen} onClose={closeLoadActionModal}>
          <Select
            label="Action"
            options={loadActionOptions}
            onChange={loadAction}
          />
        </Modal>
      </div>
    </>
  );
};
