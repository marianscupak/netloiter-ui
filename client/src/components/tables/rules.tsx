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
  rules: RouterOutputs["rule"]["getAll"] | undefined;
}

export const RulesTable = ({ rules }: Props) => {
  const { mutateAsync: deleteRule } = trpc.rule.deleteRule.useMutation();

  const trpcContext = trpc.useContext();

  const { showSnackbar } = useSnackbar();

  const onDelete = useCallback(
    async (id: number) => {
      await deleteRule({ id });
      await trpcContext.rule.getAll.invalidate();
      showSnackbar("Rule successfully deleted");
    },
    [deleteRule, showSnackbar, trpcContext.rule.getAll],
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
          {rules?.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell>{rule.name}</TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => onDelete(rule.id)}
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
