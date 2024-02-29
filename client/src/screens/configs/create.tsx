import { CreateConfigForm } from "../../components/forms/configs/create-config-form";

export const CreateConfig = () => (
  <div className="p-4 h-full">
    <div className="text-header">Create Config</div>
    <div className="h-full flex justify-center items-center">
      <CreateConfigForm />
    </div>
  </div>
);
