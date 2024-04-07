import {
  styled,
  Table as MuiTable,
  TableCell as MuiTableCell,
} from "@mui/material";
import { colors } from "../../utils/mui";

export const Table = styled(MuiTable)({
  backgroundColor: colors.darkGray,
  color: colors.white,
});

export const TableCell = styled(MuiTableCell)({
  color: colors.white,
});
