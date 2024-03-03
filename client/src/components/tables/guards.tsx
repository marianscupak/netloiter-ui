import { Table, TableCell } from "../common/table";
import {
  Button,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { RouterOutputs } from "../../../../server/trpc-routers";
import { trpc } from "../../utils/trpc";
import { useCallback } from "react";
import { useSnackbar } from "../../utils/snackbar";
import { NavLink } from "react-router-dom";

interface Props {
  guards: RouterOutputs["guard"]["getAll"] | undefined;
}

export const GuardsTable = ({ guards }: Props) => {
  const { mutateAsync: deleteGuard } = trpc.guard.deleteGuard.useMutation();

  const trpcContext = trpc.useContext();

  const { showSnackbar } = useSnackbar();

  const onDelete = useCallback(
    async (id: number) => {
      await deleteGuard({ id });
      await trpcContext.guard.getAll.invalidate();
      showSnackbar("Guard successfully deleted");
    },
    [deleteGuard, showSnackbar, trpcContext.guard.getAll],
  );

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {guards?.map((guard) => (
            <TableRow key={guard.id}>
              <TableCell>{guard.name}</TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <div className="flex gap-2">
                    <NavLink to={`/guards/${guard.id}`}>
                      <Button variant="contained">DETAIL</Button>
                    </NavLink>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => onDelete(guard.id)}
                    >
                      DELETE
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
