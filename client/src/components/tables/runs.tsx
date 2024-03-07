import { Table, TableCell } from "../common/table";
import {
  Button,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { trpc } from "../../utils/trpc";
import { useCallback } from "react";
import { useSnackbar } from "../../utils/snackbar";
import { NavLink } from "react-router-dom";
import { Run } from "../../../../server/sequelize/models/run";
import dayjs from "dayjs";

interface Props {
  runs: Run[] | undefined;
}

export const RunsTable = ({ runs }: Props) => {
  const { mutateAsync: deleteRunHistory } =
    trpc.runHistory.deleteRunHistory.useMutation();

  const trpcContext = trpc.useContext();

  const { showSnackbar } = useSnackbar();

  const onDelete = useCallback(
    async (id: number) => {
      await deleteRunHistory({ id });
      await trpcContext.runHistory.getAll.invalidate();
      showSnackbar("Run history successfully deleted");
    },
    [deleteRunHistory, showSnackbar, trpcContext.runHistory.getAll],
  );

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {runs?.map((run) => (
            <TableRow key={run.id}>
              <TableCell>
                {dayjs(run.dateTime).format("DD. MM. YYYY HH:mm")}
              </TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <div className="flex gap-2">
                    <NavLink to={`/run-history/${run.id}`}>
                      <Button variant="contained">DETAIL</Button>
                    </NavLink>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => onDelete(run.id)}
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
