import { useParams } from "react-router-dom";
import { trpc } from "../../utils/trpc";
import { z } from "zod";
import { CreateRuleForm } from "../../components/forms/rules/create-rule-form";
import { CreateRuleFormValues } from "../../components/forms/rules/create-rule-form-types";
import { BackButton } from "../../components/common/back-button";

export const RuleDetail = () => {
  const { id } = useParams();

  const { data } = trpc.rule.getRuleDetailQuery.useQuery({
    id: Number.parseInt(z.string().parse(id)),
  });

  return (
    <div className="p-4 h-full">
      <div className="flex justify-between items-center">
        <div className="text-header">{`Rule ${data?.name}`}</div>
        <BackButton />
      </div>
      <div className="min-h-[calc(100vh-100px)] flex justify-center items-center my-4">
        {data && (
          <CreateRuleForm
            defaultValues={data as CreateRuleFormValues}
            readOnly
          />
        )}
      </div>
    </div>
  );
};
