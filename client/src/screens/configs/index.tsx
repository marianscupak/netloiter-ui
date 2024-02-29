import { Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import { trpc } from "../../utils/trpc";
import { ConfigsTable } from "../../components/tables/configs";

export const Configs = () => {
  const { data: configs } = trpc.config.getAll.useQuery();

  return (
    <div className="p-4 h-full">
      <div className="text-header">Configs</div>
      <div className="flex justify-center items-center h-full">
        <div>
          <div className="mb-2">
            <NavLink to="/configs/create">
              <Button variant="contained">Add</Button>
            </NavLink>
          </div>
          <div className="w-[500px]">
            <ConfigsTable configs={configs} />
          </div>
        </div>
      </div>
    </div>
  );
};
