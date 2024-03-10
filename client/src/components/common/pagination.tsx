import {
  Pagination as MuiPagination,
  PaginationItem,
  styled,
} from "@mui/material";
import { ChangeEvent, useCallback } from "react";

interface Props {
  count: number;
  onChange?(value: number): void;
}

const CustomPaginationItem = styled(PaginationItem)({ color: "white" });

export const Pagination = ({ count, onChange }: Props) => {
  const innerOnChange = useCallback(
    (_: ChangeEvent<unknown>, value: number) => {
      onChange?.(value);
    },
    [onChange],
  );

  return (
    <MuiPagination
      count={count}
      color="primary"
      onChange={innerOnChange}
      renderItem={(item) => <CustomPaginationItem {...item} />}
    />
  );
};
