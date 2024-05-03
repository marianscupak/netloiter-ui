import { Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import { trpc } from "../../utils/trpc";
import { RulesTable } from "../../components/tables/rules";

export const Rules = () => {
  const { data: rules } = trpc.rule.getAll.useQuery();

  return (
    <div className="p-4 h-full">
      <div className="text-header">Rules</div>
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div>
          <div className="mb-2">
            <NavLink to="/rules/create">
              <Button variant="contained">Add</Button>
            </NavLink>
          </div>
          <div className="md:w-[500px] w-full">
            <RulesTable rules={rules} />
          </div>
        </div>
      </div>
    </div>
  );
};
