import { CreateRuleForm } from "../../components/forms/rules/create-rule-form";

export const CreateRule = () => (
  <div className="p-4 h-full">
    <div className="text-header">Create Rule</div>
    <div className="h-full flex justify-center items-center">
      <CreateRuleForm />
    </div>
  </div>
);
