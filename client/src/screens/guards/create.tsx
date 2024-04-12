import { CreateGuardForm } from "../../components/forms/guards/create-guard-form";
import { BackButton } from "../../components/common/back-button";

export const CreateGuard = () => {
  return (
    <div className="p-4 h-full">
      <div className="flex justify-between items-center">
        <div className="text-header">Create Guard</div>
        <BackButton />
      </div>
      <div className="min-h-[calc(100vh-100px)] flex justify-center items-center my-4">
        <CreateGuardForm />
      </div>
    </div>
  );
};
