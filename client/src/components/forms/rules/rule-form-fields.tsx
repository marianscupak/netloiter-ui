import { FieldNamePrefix } from "../field-name-prefix";
import { FormSelect } from "../wrapped-inputs/form-select";
import { GuardFormFields } from "../guards/fields";
import { ActionFormFields } from "../actions/fields";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Select, SelectOption } from "../select";
import { RuleType } from "../../../../../server/prisma/public";
import { useCallback, useMemo, useState } from "react";
import { Button, SelectChangeEvent } from "@mui/material";
import { trpc } from "../../../utils/trpc";
import { Modal } from "../../common/modal";
import { useSnackbar } from "../../../utils/snackbar";
import DeleteIcon from "@mui/icons-material/Delete";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "../../../../../server/trpc-routers";
import { createGuardFormDefaultValues } from "../guards/create-guard-form";
import { createActionFormDefaultValues } from "../actions/create-action-form";

const ruleTypeOptions: SelectOption[] = [
  { value: RuleType.All, label: RuleType.All },
  { value: RuleType.Any, label: RuleType.Any },
];

export const RuleFormFields = ({ fieldNamePrefix }: FieldNamePrefix) => {
  const { control, watch } = useFormContext();

  const { showSnackbar } = useSnackbar();

  const onGetDetailError = useCallback(
    (error: TRPCClientErrorLike<AppRouter>) => {
      showSnackbar(error.message, "error");
    },
    [showSnackbar],
  );

  const { data: allGuards } = trpc.guard.getAll.useQuery();
  const { mutateAsync: getGuardDetail } = trpc.guard.getGuardDetail.useMutation(
    { onError: onGetDetailError },
  );

  const { data: allActions } = trpc.action.getAll.useQuery();
  const { mutateAsync: getActionDetail } =
    trpc.action.getActionDetail.useMutation({ onError: onGetDetailError });

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
    appendGuard(createGuardFormDefaultValues);
  }, [appendGuard]);

  const appendDefaultAction = useCallback(() => {
    appendAction(createActionFormDefaultValues);
  }, [appendAction]);

  const [loadGuardModalOpen, setLoadGuardModalOpen] = useState<boolean>(false);

  const openLoadGuardModal = useCallback(() => {
    setLoadGuardModalOpen(true);
  }, []);

  const closeLoadGuardModal = useCallback(() => {
    setLoadGuardModalOpen(false);
  }, []);

  const loadGuard = useCallback(
    async (event: SelectChangeEvent<unknown>) => {
      const guard = await getGuardDetail({
        id: event.target.value as unknown as number,
      });

      appendGuard(guard);

      closeLoadGuardModal();
    },
    [appendGuard, closeLoadGuardModal, getGuardDetail],
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

      appendAction(action);

      closeLoadActionModal();
    },
    [appendAction, closeLoadActionModal, getActionDetail],
  );

  const loadActionOptions = useMemo(
    (): SelectOption[] =>
      allActions
        ? allActions.map((action) => ({ value: action.id, label: action.name }))
        : [],
    [allActions],
  );

  const isLoaded = useMemo(
    () =>
      watch(fieldNamePrefix ? `${fieldNamePrefix}.loadedId` : "loadedId") !==
      undefined,
    [fieldNamePrefix, watch],
  );

  return (
    <>
      <div className="mt-4">
        <FormSelect
          name={fieldNamePrefix ? `${fieldNamePrefix}.type` : "type"}
          label="Type"
          options={ruleTypeOptions}
          disabled={isLoaded}
        />
      </div>
      <div className="flex gap-4 mt-4">
        <div className="w-1/2">
          <div>Guards</div>
          {guards.map((guard, index) => (
            <div className="p-2 border rounded-[4px] mb-4" key={guard.id}>
              {!isLoaded && (
                <div className="flex justify-end">
                  <div
                    onClick={() => removeGuard(index)}
                    className="cursor-pointer"
                  >
                    <DeleteIcon color="error" />
                  </div>
                </div>
              )}
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
          {!isLoaded && (
            <div className="mt-4 flex gap-2">
              <Button onClick={appendDefaultGuard} variant="contained">
                ADD GUARD
              </Button>
              <Button onClick={openLoadGuardModal} variant="contained">
                LOAD GUARD
              </Button>
            </div>
          )}
        </div>
        <div className="w-1/2">
          <div>Actions</div>
          {actions.map((action, index) => (
            <div className="p-2 border rounded-[4px] mb-4" key={action.id}>
              {!isLoaded && (
                <div className="flex justify-end">
                  <div
                    onClick={() => removeAction(index)}
                    className="cursor-pointer"
                  >
                    <DeleteIcon color="error" />
                  </div>
                </div>
              )}
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
          {!isLoaded && (
            <div className="mt-4 flex gap-2">
              <Button onClick={appendDefaultAction} variant="contained">
                ADD ACTION
              </Button>
              <Button onClick={openLoadActionModal} variant="contained">
                LOAD ACTION
              </Button>
            </div>
          )}
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
