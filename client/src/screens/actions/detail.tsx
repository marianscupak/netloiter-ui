import { useParams } from "react-router-dom";
import { trpc } from "../../utils/trpc";
import { z } from "zod";
import { CreateActionForm } from "../../components/forms/actions/create-action-form";
import { CreateActionFormValues } from "../../components/forms/actions/create-action-form-types";

export const ActionDetail = () => {
  const { id } = useParams();

  const { data } = trpc.action.getActionDetailQuery.useQuery({
    id: Number.parseInt(z.string().parse(id)),
  });

  return (
    <div className="p-4 h-full">
      <div className="text-header">{`Action ${data?.name}`}</div>
      <div className="min-h-[calc(100vh-100px)] flex justify-center items-center my-4">
        {data && (
          <CreateActionForm
            defaultValues={data as CreateActionFormValues}
            readOnly
          />
        )}
      </div>
    </div>
  );
};
