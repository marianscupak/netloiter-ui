import { useParams } from "react-router-dom";
import { trpc } from "../../utils/trpc";
import { z } from "zod";
import { CreateConfigForm } from "../../components/forms/configs/create-config-form";
import { CreateConfigFormValues } from "../../components/forms/configs/create-config-form-types";

export const ConfigDetail = () => {
  const { id } = useParams();

  const { data } = trpc.config.getConfigDetailQuery.useQuery({
    id: Number.parseInt(z.string().parse(id)),
  });

  return (
    <div className="p-4 h-full">
      <div className="text-header">{`Config ${data?.name}`}</div>
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
