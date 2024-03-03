import { useAtom } from "jotai";
import { statusAtom } from "../state/status";

export const EditConfig = () => {
  const [status] = useAtom(statusAtom);

  console.log(status);

  return (
    <div className="p-4 h-full">
      <div className="text-header">Edit Current Run Configuration</div>
    </div>
  );
};
