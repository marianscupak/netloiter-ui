import { RulesReplacedMessage } from "../../../../server/nl-status/message-types";
import { Button } from "@mui/material";
import { Modal } from "../common/modal";
import { RuleFormFields } from "../forms/rules/rule-form-fields";
import { useCallback, useMemo, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import {
  EditRunConfigFormValues,
  editRunConfigFormValuesSchema,
} from "../forms/edit-run-config/edit-run-config-form-types";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  message: RulesReplacedMessage;
}

export const RulesReplacedEvent = ({ message }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  // Hack to disable all inputs
  const modifiedRules = useMemo(
    () =>
      message.newRules.map((rule) => ({
        ...rule,
        guards: rule.guards.map((guard) => ({ ...guard, loadedId: 0 })),
        actions: rule.actions.map((action) => ({ ...action, loadedId: 0 })),
      })),
    [message.newRules],
  );

  const form = useForm<EditRunConfigFormValues>({
    resolver: zodResolver(editRunConfigFormValuesSchema),
    defaultValues: { rules: modifiedRules },
  });

  const { fields } = useFieldArray({ name: "rules", control: form.control });

  return (
    <div>
      <div>Rules Replaced</div>
      <div className="mt-2">
        <Button variant="contained" onClick={openModal}>
          SEE RULES
        </Button>
      </div>
      <Modal open={modalOpen} onClose={closeModal}>
        <div className="max-h-[calc(100vh-150px)] overflow-auto">
          <FormProvider {...form}>
            {fields.map((value, index) => (
              <div className="p-4 border rounded-[4px] my-2" key={value.id}>
                <RuleFormFields readOnly fieldNamePrefix={`rules.${index}`} />
              </div>
            ))}
          </FormProvider>
        </div>
      </Modal>
    </div>
  );
};
