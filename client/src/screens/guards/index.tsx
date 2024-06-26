import { Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import { GuardsTable } from "../../components/tables/guards";
import { trpc } from "../../utils/trpc";

export const Guards = () => {
  const { data: guards } = trpc.guard.getAll.useQuery();

  return (
    <div className="p-4 h-full">
      <div className="text-header">Guards</div>
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div>
          <div className="mb-2">
            <NavLink to="/guards/create">
              <Button variant="contained">Add</Button>
            </NavLink>
          </div>
          <div className="md:w-[500px] w-full">
            <GuardsTable guards={guards} />
          </div>
        </div>
      </div>
    </div>
  );
};
