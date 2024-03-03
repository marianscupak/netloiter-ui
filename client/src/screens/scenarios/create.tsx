import { CreateScenarioForm } from "../../components/forms/scenarios/create-scenario-form";

export const CreateScenario = () => (
  <div className="p-4 h-full">
    <div className="text-header">Create Scenario</div>
    <div className="min-h-[calc(100vh-100px)] flex justify-center items-center my-4">
      <CreateScenarioForm />
    </div>
  </div>
);
