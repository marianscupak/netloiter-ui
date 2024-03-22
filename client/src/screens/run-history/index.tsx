import { trpc } from "../../utils/trpc";
import { RunsTable } from "../../components/tables/runs";
import { Run } from "../../../../server/sequelize/models/run";

export const RunHistory = () => {
  const { data: runs } = trpc.runHistory.getAll.useQuery();

  return (
    <div className="p-4 min-h-[100vh]">
      <div className="text-header">Run History</div>
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div className="w-[500px]">
          <RunsTable runs={runs as Run[] | undefined} />
        </div>
      </div>
    </div>
  );
};
