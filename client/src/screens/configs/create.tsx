import { CreateConfigForm } from "../../components/forms/configs/create-config-form";
import { BackButton } from "../../components/common/back-button";

export const CreateConfig = () => (
  <div className="p-4 h-full">
    <div className="flex justify-between items-center">
      <div className="text-header">Create Config</div>
      <BackButton />
    </div>
    <div className="min-h-[calc(100vh-100px)] flex justify-center items-center my-4">
      <CreateConfigForm />
    </div>
  </div>
);
