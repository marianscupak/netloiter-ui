import { CreateGuardForm } from "../../components/forms/guards/create-guard-form";

export const CreateGuard = () => {
  return (
    <div className="p-4 h-full">
      <div className="text-header">Create Guard</div>
      <div className="min-h-[calc(100vh-100px)] flex justify-center items-center my-4">
        <CreateGuardForm />
      </div>
    </div>
  );
};
