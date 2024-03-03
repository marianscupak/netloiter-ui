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
  actions: RouterOutputs["action"]["getAll"] | undefined;
}

export const ActionsTable = ({ actions }: Props) => {
  const { mutateAsync: deleteAction } = trpc.action.deleteAction.useMutation();

  const trpcContext = trpc.useContext();

  const { showSnackbar } = useSnackbar();

  const onDelete = useCallback(
    async (id: number) => {
      await deleteAction({ id });
      await trpcContext.action.getAll.invalidate();
      showSnackbar("Action successfully deleted");
    },
    [deleteAction, showSnackbar, trpcContext.action.getAll],
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
          {actions?.map((action) => (
            <TableRow key={action.id}>
              <TableCell>{action.name}</TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <div className="flex gap-2">
                    <NavLink to={`/actions/${action.id}`}>
                      <Button variant="contained">DETAIL</Button>
                    </NavLink>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => onDelete(action.id)}
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
