import { CreateRuleForm } from "../../components/forms/rules/create-rule-form";

export const CreateRule = () => (
  <div className="p-4 h-full">
    <div className="text-header">Create Rule</div>
    <div className="min-h-[calc(100vh-100px)] flex justify-center items-center my-4">
      <CreateRuleForm />
    </div>
  </div>
);
