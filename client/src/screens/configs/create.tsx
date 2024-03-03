import { CreateConfigForm } from "../../components/forms/configs/create-config-form";

export const CreateConfig = () => (
  <div className="p-4 h-full">
    <div className="text-header">Create Config</div>
    <div className="min-h-[calc(100vh-100px)] flex justify-center items-center my-4">
      <CreateConfigForm />
    </div>
  </div>
);
