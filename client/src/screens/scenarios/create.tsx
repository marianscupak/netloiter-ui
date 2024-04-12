import { CreateScenarioForm } from "../../components/forms/scenarios/create-scenario-form";
import { BackButton } from "../../components/common/back-button";

export const CreateScenario = () => (
  <div className="p-4 h-full">
    <div className="flex justify-between items-center">
      <div className="text-header">Create Scenario</div>
      <BackButton />
    </div>
    <div className="min-h-[calc(100vh-100px)] flex justify-center items-center my-4">
      <CreateScenarioForm />
    </div>
  </div>
);
