import { CreateActionForm } from "../../components/forms/actions/create-action-form";
import { BackButton } from "../../components/common/back-button";

export const CreateAction = () => {
  return (
    <div className="p-4 h-full">
      <div className="flex justify-between items-center">
        <div className="text-header">Create Action</div>
        <BackButton />
      </div>
      <div className="min-h-[calc(100vh-100px)] flex justify-center items-center my-4">
        <CreateActionForm />
      </div>
    </div>
  );
};
