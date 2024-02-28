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

interface Props {
  scenarios: RouterOutputs["scenario"]["getAll"] | undefined;
}

export const ScenarioTable = ({ scenarios }: Props) => {
  const { mutateAsync: deleteScenario } =
    trpc.scenario.deleteScenario.useMutation();

  const trpcContext = trpc.useContext();

  const { showSnackbar } = useSnackbar();

  const onDelete = useCallback(
    async (id: number) => {
      await deleteScenario({ id });
      await trpcContext.scenario.getAll.invalidate();
      showSnackbar("Scenario successfully deleted");
    },
    [deleteScenario, showSnackbar, trpcContext.scenario.getAll],
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
          {scenarios?.map((scenario) => (
            <TableRow key={scenario.id}>
              <TableCell>{scenario.name}</TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => onDelete(scenario.id)}
                  >
                    DELETE
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
