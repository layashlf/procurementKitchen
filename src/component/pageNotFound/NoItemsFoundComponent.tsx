import { TableBody, TableCell, TableRow } from "@mui/material";
import React from "react";

interface Props {
  colSpan: number;
}

export default function NoItemsFoundComponent(props: Props) {
  const items: any = [];
  // const expand = Number(props.colSpan);
  const getRowSell = () => {
    for (let i = 0; i < props.colSpan - 1; i += 1) {
      items.push(<TableCell key={i} />);
    }
    return items;
  };

  return (
    <React.Fragment>
      <TableBody>
        <TableRow key={"test"}>
          <TableCell>No items Found</TableCell>
          {getRowSell()}
        </TableRow>
      </TableBody>
    </React.Fragment>
  );
}
