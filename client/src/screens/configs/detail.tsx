import { useParams } from "react-router-dom";
import { trpc } from "../../utils/trpc";
import { z } from "zod";
import { CreateConfigForm } from "../../components/forms/configs/create-config-form";
import { CreateConfigFormValues } from "../../components/forms/configs/create-config-form-types";
import { useCallback } from "react";
import { downloadFile } from "../../utils/download-file";
import { Button } from "@mui/material";
import { BackButton } from "../../components/common/back-button";

export const ConfigDetail = () => {
  const { id } = useParams();

  const { data } = trpc.config.getConfigDetailQuery.useQuery({
    id: Number.parseInt(z.string().parse(id)),
  });

  const { mutateAsync: parseConfigForNl } =
    trpc.config.parseConfigForNl.useMutation();

  const exportConfig = useCallback(async () => {
    downloadFile({
      // @ts-expect-error DB enum type mismatch
      data: data ? await parseConfigForNl(data) : {},
      fileName: `${
        data?.name.replace(new RegExp(" ", "g"), "_") ?? "config"
      }.json`,
    });
  }, [data, parseConfigForNl]);

  return (
    <div className="p-4 h-full">
      <div className="flex justify-between items-center">
        <div className="text-header">{`Config ${data?.name}`}</div>
        <BackButton />
      </div>
      <Button variant="contained" color="warning" onClick={exportConfig}>
        EXPORT
      </Button>
      <div className="min-h-[calc(100vh-100px)] flex justify-center items-center my-4">
        {data && (
          <CreateConfigForm
            defaultValues={data as CreateConfigFormValues}
            readOnly
          />
        )}
      </div>
    </div>
  );
};
