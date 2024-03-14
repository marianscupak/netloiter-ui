import { Button } from "@mui/material";
import { trpc } from "../../utils/trpc";
import { NavLink } from "react-router-dom";
import { ActionsTable } from "../../components/tables/actions";

export const Actions = () => {
  const { data: actions } = trpc.action.getAll.useQuery();

  return (
    <div className="p-4 h-full">
      <div className="text-header">Actions</div>
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div>
          <div className="mb-2">
            <NavLink to="/actions/create">
              <Button variant="contained">Add</Button>
            </NavLink>
          </div>
          <div className="w-[500px]">
            <ActionsTable actions={actions} />
          </div>
        </div>
      </div>
    </div>
  );
};
