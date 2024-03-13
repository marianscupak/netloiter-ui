import { trpc } from "../../utils/trpc";
import { RunsTable } from "../../components/tables/runs";
import { Run } from "../../../../server/sequelize/models/run";

export const RunHistory = () => {
  const { data: runs } = trpc.runHistory.getAll.useQuery();

  return (
    <div className="p-4 h-full">
      <div className="text-header">Run History</div>
      <div className="flex justify-center items-center h-[100vh]">
        <div className="w-[500px]">
          <RunsTable runs={runs as Run[] | undefined} />
        </div>
      </div>
    </div>
  );
};