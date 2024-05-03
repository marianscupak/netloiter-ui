import { Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import { trpc } from "../../utils/trpc";
import { ScenarioTable } from "../../components/tables/scenarios";

export const Scenarios = () => {
  const { data: scenarios } = trpc.scenario.getAll.useQuery();

  return (
    <div className="p-4 h-full">
      <div className="text-header">Scenarios</div>
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div>
          <div className="mb-2">
            <NavLink to="/scenarios/create">
              <Button variant="contained">Add</Button>
            </NavLink>
          </div>
          <div className="md:w-[500px] w-full">
            <ScenarioTable scenarios={scenarios} />
          </div>
        </div>
      </div>
    </div>
  );
};
