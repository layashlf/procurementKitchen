import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import React from "react";

interface PaginationInterface {
  paginationLimit: number;
  paginationChange: Function;
  page?: number;
  totalRowsOnPage?: number;
}

export default function PaginationComponent(props: PaginationInterface) {
  return (
    <Stack spacing={2}>
      <Pagination
        count={props.paginationLimit}
        variant="outlined"
        color="primary"
        page={props.page}
        onChange={(event: React.ChangeEvent<unknown>, page: number) =>
          props.paginationChange(page)
        }
      />
    </Stack>
  );
}
