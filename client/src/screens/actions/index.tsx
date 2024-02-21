import {
  Button,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Table, TableCell } from "../../components/common/table";
import { trpc } from "../../utils/trpc";
import { NavLink } from "react-router-dom";

export const Actions = () => {
  const { data: actions } = trpc.action.getAll.useQuery();

  return (
    <div className="p-4 h-full">
      <div className="text-header">Actions</div>
      <div className="flex justify-center items-center h-full">
        <div>
          <div className="mb-2">
            <NavLink to="/actions/create">
              <Button variant="contained">Add</Button>
            </NavLink>
          </div>
          <div className="w-[500px]">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {actions?.map((action) => (
                    <TableRow key={action.id}>
                      <TableCell>{action.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
