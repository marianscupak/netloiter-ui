import { CreateActionForm } from "../../components/forms/actions/create-action-form";

export const CreateAction = () => {
  return (
    <div className="p-4 h-full">
      <div className="text-header">Create Action</div>
      <div className="h-full flex justify-center items-center">
        <CreateActionForm />
      </div>
    </div>
  );
};
