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
  configs: RouterOutputs["config"]["getAll"] | undefined;
}

export const ConfigsTable = ({ configs }: Props) => {
  const { mutateAsync: deleteConfig } = trpc.config.deleteConfig.useMutation();

  const trpcContext = trpc.useContext();

  const { showSnackbar } = useSnackbar();

  const onDelete = useCallback(
    async (id: number) => {
      await deleteConfig({ id });
      await trpcContext.config.getAll.invalidate();
      showSnackbar("Config successfully deleted");
    },
    [deleteConfig, showSnackbar, trpcContext.config.getAll],
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
          {configs?.map((config) => (
            <TableRow key={config.id}>
              <TableCell>{config.name}</TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => onDelete(config.id)}
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
