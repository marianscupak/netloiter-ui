import { CreateRuleForm } from "../../components/forms/rules/create-rule-form";
import { BackButton } from "../../components/common/back-button";

export const CreateRule = () => (
  <div className="p-4 h-full">
    <div className="flex justify-between items-center">
      <div className="text-header">Create Rule</div>
      <BackButton />
    </div>
    <div className="min-h-[calc(100vh-100px)] flex justify-center items-center my-4">
      <CreateRuleForm />
    </div>
  </div>
);
