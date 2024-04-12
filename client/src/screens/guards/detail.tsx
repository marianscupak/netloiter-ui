import { useParams } from "react-router-dom";
import { trpc } from "../../utils/trpc";
import { z } from "zod";
import { CreateGuardFormValues } from "../../components/forms/guards/create-guard-form-types";
import { CreateGuardForm } from "../../components/forms/guards/create-guard-form";
import { BackButton } from "../../components/common/back-button";

export const GuardDetail = () => {
  const { id } = useParams();

  const { data } = trpc.guard.getGuardDetailQuery.useQuery({
    id: Number.parseInt(z.string().parse(id)),
  });

  return (
    <div className="p-4 h-full">
      <div className="flex justify-between items-center">
        <div className="text-header">{`Guard ${data?.name}`}</div>
        <BackButton />
      </div>
      <div className="min-h-[calc(100vh-100px)] flex justify-center items-center my-4">
        {data && (
          <CreateGuardForm
            defaultValues={data as CreateGuardFormValues}
            readOnly
          />
        )}
      </div>
    </div>
  );
};
