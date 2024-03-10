import { useCallback, useMemo, useState } from "react";
import { trpc } from "./trpc";
import { Select, SelectOption } from "../components/forms/select";
import { useSnackbar } from "./snackbar";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "../../../server/trpc-routers";
import { SelectChangeEvent } from "@mui/material";
import { RuleType } from "../../../server/prisma/public";
import { CreateActionFormValues } from "../components/forms/actions/create-action-form-types";
import { CreateGuardFormValues } from "../components/forms/guards/create-guard-form-types";
import { UseFieldArrayAppend } from "react-hook-form";
import { Modal } from "../components/common/modal";
import { CreateRuleFormValues } from "../components/forms/rules/create-rule-form-types";

export const useLoadRuleModal = <
  T extends {
    rules: (Omit<CreateRuleFormValues, "name"> & { loadedId?: number })[];
  },
>(
  // @ts-expect-error Imperfect types
  appendRule: UseFieldArrayAppend<T, "rules">,
) => {
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

  const { showSnackbar } = useSnackbar();

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
        // @ts-expect-error Imperfect types
        type: rule.type as RuleType,
        loadedId: rule.id,
        actions: rule.actions as unknown as CreateActionFormValues[],
        guards: rule.guards as unknown as CreateGuardFormValues[],
      });

      closeLoadRuleModal();
    },
    [appendRule, closeLoadRuleModal, getRuleDetail],
  );

  const modal = useMemo(
    () => (
      <Modal open={loadRuleModalOpen} onClose={closeLoadRuleModal}>
        <Select label="Rule" options={loadRuleOptions} onChange={loadRule} />
      </Modal>
    ),
    [closeLoadRuleModal, loadRule, loadRuleModalOpen, loadRuleOptions],
  );

  return { modal, openLoadRuleModal };
};
