import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableBody, TableCell, TableRow } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { gStyles as styles } from "../../assets/styles";
import { ROUTERS } from "../../constants/routers.constant";

interface Props {
  goodsReceived?: any;
  key?: number;
  list?: any;
}

export default function GoodsReceivedListItem(props: Props) {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [goodsReceived, setGoodsReceived] = useState(props.goodsReceived);
  const [showRow, setShowRow] = useState<string>("");
  const onItemClicked = () => {
    if (props.list === "single")
      navigate(ROUTERS.GOOD_RECEIVED + goodsReceived.grNo);
  };
  let grandTotal = 0;
  const getGrandTotal = (amount: number) => {
    grandTotal += amount;
  };

  const expandRow = (id: string) => {
    setShowRow(id);
    if (showRow === id) {
      setShowRow("");
    }
  };

  const SingleList = () => {
    return (
      <>
        <TableBody onClick={onItemClicked}>
          <TableRow className={styles.pointer_cursor}>
            <TableCell>{goodsReceived.grNo}</TableCell>
            <TableCell>{goodsReceived.prNo}</TableCell>

            <TableCell>{goodsReceived.poNo}</TableCell>
            <TableCell>{goodsReceived.date}</TableCell>
            <TableCell>{goodsReceived.vendor}</TableCell>

            <TableCell className={styles.text_align_right}>
              {goodsReceived.grandTotal}
            </TableCell>
          </TableRow>
        </TableBody>
      </>
    );
  };

  const DetailedList = () => {
    return (
      <TableBody>
        {goodsReceived.map((element: any, index: number) => (
          <React.Fragment key={index}>
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {element?.serialNo}
              </TableCell>
              <TableCell>{element?.particular}</TableCell>

              <TableCell className={styles.text_align_right}>
                {element?.ordQuantity}
              </TableCell>
              <TableCell className={styles.text_align_right}>
                {element?.delQuantity}
              </TableCell>
              <TableCell>{element?.unit} </TableCell>

              <TableCell className={styles.text_align_right}>
                {element?.rate}
              </TableCell>
              <TableCell className={styles.text_align_right}>
                {element?.VAT}
              </TableCell>
              <TableCell className={styles.text_align_right}>
                <>
                  {element?.subTotal}
                  {getGrandTotal(parseFloat(element?.subTotal))}
                </>
              </TableCell>
              <TableCell
                onClick={() => {
                  expandRow(element.serialNo);
                }}
                style={{ cursor: "pointer" }}
              >
                <ExpandLessIcon
                  color="primary"
                  style={{
                    display: showRow === element.serialNo ? "" : "none",
                  }}
                />
                <ExpandMoreIcon
                  style={{
                    display: showRow === element.serialNo ? "none" : "",
                  }}
                />
              </TableCell>
            </TableRow>

            <TableRow
              style={{ display: showRow === element.serialNo ? "" : "none" }}
              key={`${index}s`}
            >
              <TableCell />
              <TableCell className={styles.text_bold}>
                Serial/MAC/IME No/Code(s):{" "}
              </TableCell>
              <TableCell colSpan={7}>{element.remarks2}</TableCell>
            </TableRow>
            <TableRow
              key={`${index}R`}
              style={{ display: showRow === element.serialNo ? "" : "none" }}
            >
              <TableCell />
              <TableCell className={styles.text_bold}>Remarks:</TableCell>
              <TableCell colSpan={7}> {element.remarks}</TableCell>
            </TableRow>
          </React.Fragment>
        ))}

        <TableRow key={goodsReceived.length}>
          <TableCell />
          <TableCell />

          <TableCell />
          <TableCell />
          <TableCell />
          <TableCell colSpan={2} className={styles.text_bold}>
            Grand Total:
          </TableCell>
          <TableCell className={styles.text_align_right}>
            {grandTotal.toFixed(2)}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  };
  if (props.list === "single") {
    return <SingleList />;
  }
  return <DetailedList />;
}

// const headerWrapperStyle = { display: "flex", justifyContent: "space-between" };
