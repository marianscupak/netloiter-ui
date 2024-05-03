import { FormProvider, useForm } from "react-hook-form";
import {
  CreateConfigFormValues,
  createConfigFormValuesSchema,
  FlowActionType,
} from "./create-config-form-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConfigMode } from "../../../../../server/prisma/public";
import { FormTextField } from "../wrapped-inputs/form-text-field";
import { FormSelect } from "../wrapped-inputs/form-select";
import { ConfigSpecificFields } from "./config-specific-fields";
import { Button } from "@mui/material";
import { useCallback, useMemo } from "react";
import { trpc } from "../../../utils/trpc";
import { useSnackbar } from "../../../utils/snackbar";
import { useNavigate } from "react-router-dom";
import { SelectOption } from "../../../utils/select-option";

const createConfigDefaultValues: CreateConfigFormValues = {
  name: "",
  mode: ConfigMode.nf_mark,
  flows: [{ action: FlowActionType.Catch }],
  ignoreComm: true,
};

const configTypeOptions: SelectOption[] = [
  { value: ConfigMode.nf_mark, label: "NF Mark" },
  { value: ConfigMode.socket, label: "Socket" },
  { value: ConfigMode.tc_mark_vlan, label: "TC Mark VLAN" },
];

interface Props {
  defaultValues?: CreateConfigFormValues;
  readOnly?: boolean;
}

export const CreateConfigForm = ({ defaultValues, readOnly }: Props) => {
  const form = useForm<CreateConfigFormValues>({
    defaultValues: defaultValues ?? createConfigDefaultValues,
    resolver: zodResolver(createConfigFormValuesSchema),
    reValidateMode: "onSubmit",
  });

  const trpcContext = trpc.useContext();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSuccess = useCallback(async () => {
    await trpcContext.config.getAll.invalidate();
    showSnackbar("Config created successfully");
    navigate(-1);
  }, [navigate, showSnackbar, trpcContext.config.getAll]);

  const onError = useCallback(() => {
    showSnackbar("Failed to create config", "error");
  }, [showSnackbar]);

  const { mutateAsync: createConfig } = trpc.config.createConfig.useMutation({
    onSuccess,
    onError,
  });

  const handleSubmit = useCallback(
    async (values: CreateConfigFormValues) => {
      await createConfig(values);
    },
    [createConfig],
  );

  const onSubmit = useMemo(
    () => form.handleSubmit(handleSubmit),
    [form, handleSubmit],
  );

  return (
    <FormProvider {...form}>
      <div className="bg-dark-gray p-4 w-full md:w-[50%]">
        <div className="mt-4">
          <FormTextField name="name" label="Name" disabled={readOnly} />
        </div>
        <div className="mt-4">
          <FormSelect
            name="mode"
            label="Mode"
            options={configTypeOptions}
            disabled={readOnly}
          />
        </div>
        <ConfigSpecificFields type={form.watch("mode")} readOnly={readOnly} />
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
