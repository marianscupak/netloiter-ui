import { useParams } from "react-router-dom";
import { CreateScenarioForm } from "../../components/forms/scenarios/create-scenario-form";
import { trpc } from "../../utils/trpc";
import { z } from "zod";
import { CreateScenarioFormValues } from "../../components/forms/scenarios/create-scenario-form-types";

export const ScenarioDetail = () => {
  const { id } = useParams();

  const { data } = trpc.scenario.getScenarioDetailQuery.useQuery({
    id: Number.parseInt(z.string().parse(id)),
  });

  return (
    <div className="p-4 h-full">
      <div className="text-header">{`Scenario ${data?.name}`}</div>
      <div className="min-h-[calc(100vh-100px)] flex justify-center items-center my-4">
        {data && (
          <CreateScenarioForm
            defaultValues={data as CreateScenarioFormValues}
            readOnly
          />
        )}
      </div>
    </div>
  );
};
