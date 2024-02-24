import { CreateGuardForm } from "../../components/forms/guards/create-guard-form";

export const CreateGuard = () => {
  return (
    <div className="p-4 h-full">
      <div className="text-header">Create Guard</div>
      <div className="h-full flex justify-center items-center">
        <CreateGuardForm />
      </div>
    </div>
  );
};
