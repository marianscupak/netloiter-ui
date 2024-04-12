import { useParams } from "react-router-dom";
import { CreateScenarioForm } from "../../components/forms/scenarios/create-scenario-form";
import { trpc } from "../../utils/trpc";
import { z } from "zod";
import { CreateScenarioFormValues } from "../../components/forms/scenarios/create-scenario-form-types";
import { Button } from "@mui/material";
import { useCallback } from "react";
import { downloadFile } from "../../utils/download-file";
import { BackButton } from "../../components/common/back-button";

export const ScenarioDetail = () => {
  const { id } = useParams();

  const { data: scenarioDetail } =
    trpc.scenario.getScenarioDetailQuery.useQuery({
      id: Number.parseInt(z.string().parse(id)),
    });

  const { mutateAsync: parseScenarioForNl } =
    trpc.scenario.parseScenarioForNl.useMutation();

  const exportScenario = useCallback(async () => {
    downloadFile({
      // @ts-expect-error DB enum type mismatch
      data: scenarioDetail ? await parseScenarioForNl(scenarioDetail) : {},
      fileName: `${
        scenarioDetail?.name.replace(new RegExp(" ", "g"), "_") ?? "scenario"
      }.json`,
    });
  }, [scenarioDetail, parseScenarioForNl]);

  return (
    <div className="p-4 h-full">
      <div className="flex justify-between items-center">
        <div className="text-header">{`Scenario ${scenarioDetail?.name}`}</div>
        <BackButton />
      </div>
      <Button variant="contained" color="warning" onClick={exportScenario}>
        EXPORT
      </Button>
      <div className="min-h-[calc(100vh-100px)] flex justify-center items-center my-4">
        {scenarioDetail && (
          <CreateScenarioForm
            defaultValues={scenarioDetail as CreateScenarioFormValues}
            readOnly
          />
        )}
      </div>
    </div>
  );
};
