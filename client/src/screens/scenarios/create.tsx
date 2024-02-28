import { CreateScenarioForm } from "../../components/forms/scenarios/create-scenario-form";

export const CreateScenario = () => (
  <div className="p-4 h-full">
    <div className="text-header">Create Scenario</div>
    <div className="h-full flex justify-center items-center">
      <CreateScenarioForm />
    </div>
  </div>
);
