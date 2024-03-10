import { useAtom } from "jotai";
import { statusAtom } from "../state/status";
import { EditRunConfigForm } from "../components/forms/edit-run-config/edit-run-config-form";

export const EditConfig = () => {
  const [{ scenario }] = useAtom(statusAtom);

  return (
    <div className="p-4 h-full">
      <div className="text-header">Edit Current Run Rules</div>
      {scenario && <EditRunConfigForm scenario={scenario} />}
    </div>
  );
};
