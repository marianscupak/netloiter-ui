import { FormProvider, useForm } from "react-hook-form";
import {
  CreateConfigFormValues,
  createConfigFormValuesSchema,
  FlowActionType,
} from "./create-config-form-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConfigType } from "../../../../../server/prisma/public";
import { FormTextField } from "../wrapped-inputs/form-text-field";
import { FormSelect } from "../wrapped-inputs/form-select";
import { SelectOption } from "../select";
import { ConfigSpecificFields } from "../guards/config-specific-fields";
import { Button } from "@mui/material";
import { useCallback, useMemo } from "react";
import { trpc } from "../../../utils/trpc";
import { useSnackbar } from "../../../utils/snackbar";
import { useNavigate } from "react-router-dom";

const defaultValues: CreateConfigFormValues = {
  name: "",
  type: ConfigType.nf_mark,
  flows: [{ action: FlowActionType.Catch, ip: "127.0.0.1", port: 3001 }],
};

const configTypeOptions: SelectOption[] = [
  { value: ConfigType.nf_mark, label: "NF Mark" },
  { value: ConfigType.socket, label: "Socket" },
  { value: ConfigType.tc_mark_vlan, label: "TC Mark VLAN" },
];

export const CreateConfigForm = () => {
  const form = useForm<CreateConfigFormValues>({
    defaultValues,
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
      <div className="bg-dark-gray p-4 w-[50%]">
        <div className="mt-4">
          <FormTextField name="name" label="Name" />
        </div>
        <div className="mt-4">
          <FormSelect name="type" label="Mode" options={configTypeOptions} />
        </div>
        <ConfigSpecificFields type={form.watch("type")} />
        <div className="mt-4">
          <Button variant="contained" onClick={onSubmit}>
            SAVE
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};
