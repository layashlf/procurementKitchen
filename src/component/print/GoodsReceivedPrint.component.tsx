import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { logo } from "../../assets/images";
import { printStyles as styles } from "../../assets/styles";

export default function GoodsReceivedPrint(props: any) {
  const { basics, items } = props;

  const data = basics;
  // eslint-disable-next-line
  const getSubTotal = (element: any): number => {
    const res = element.rate * element.ordQuantity;

    return res;
  };

  return (
    <div>
      <div className={styles.page_header}>
        <div className={styles.header_image}>
          <img className={styles.image} src={logo} />
        </div>
        <div className={styles.address_text}>
          <p>Leapfrog Technology Nepal Pvt. Ltd. </p>
          <p>Charkhal Addda Dillibazar, Kathmandu </p>
          <p>Tel: 014519766 </p>
        </div>
      </div>
      <h1 className={styles.page_title}>GOODS RECEIVED NOTES</h1>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <p>GR No: {data?.grNo}</p>
          <p>
            P.R. / P.O. No: {data?.fiscalYear}-{data?.poNo}
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <p>Goods received Date: {data?.nepaliDate}</p>
          <p>Invoice No:: -{data?.invoiceNumber}</p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            flex: 2,
            flexWrap: "wrap",
            wordWrap: "break-word",
            lineHeight: "30px",
          }}
        >
          <p>Supplier Detail: {data?.vendor}</p>
        </div>
        <div> </div>
      </div>
      <div>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <colgroup>
              <col style={{ width: "5%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "40%" }} />

              <col style={{ width: "5%" }} />
              <col style={{ width: "5%" }} />
              <col style={{ width: "5%" }} />
              <col style={{ width: "5%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell className={styles.table_header_small}>SN</TableCell>
                <TableCell className={styles.table_header_small}>
                  Particular
                </TableCell>
                <TableCell className={styles.table_header_small}>
                  Serial, MAC, IME No. , Part or Item CodeS
                </TableCell>
                <TableCell className={styles.table_header}>Unit</TableCell>
                <TableCell className={styles.table_header_small}>
                  Order Qty
                </TableCell>
                <TableCell className={styles.table_header_small}>
                  Delivered Qty
                </TableCell>
                <TableCell className={styles.table_header_small}>
                  Unit Price Incl.VAT
                </TableCell>
                <TableCell className={styles.table_header_small}>
                  Remarks
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={styles.table_row_border}>
              {items?.map((element: any, index: number) => {
                return (
                  <TableRow key={index} className={styles.table_row_border}>
                    <TableCell>{element.serialNo}</TableCell>
                    <TableCell className={styles.table_row_border}>
                      {element.particular}
                    </TableCell>
                    <TableCell className={styles.table_row_border}>
                      {element.remarks2}
                    </TableCell>
                    <TableCell className={styles.table_row_border}>
                      {element.unit}
                    </TableCell>
                    <TableCell className={styles.table_row_border}>
                      {element.ordQuantity}
                    </TableCell>
                    <TableCell className={styles.table_row_border}>
                      {element.delQuantity}
                    </TableCell>
                    <TableCell className={styles.table_row_border}>
                      {element.rate}
                    </TableCell>
                    <TableCell className={styles.table_row_border}>
                      {element.remarks}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 10,
          justifyContent: "space-around",
        }}
      >
        <div
          style={{
            flexDirection: "column",
          }}
        >
          <p>Requested By:...............................</p>
          <p>Name................................</p>
        </div>

        <div
          style={{
            flexDirection: "column",
          }}
        >
          <p>Checked & Verified By:................................</p>
          <p>Name:................................</p>
        </div>
      </div>
    </div>
  );
}
