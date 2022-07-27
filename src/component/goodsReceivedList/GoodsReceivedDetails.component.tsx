import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageTitle from "../menu/PageTitle.component";
import { gStyles as styles } from "../../assets/styles";
import DetailPageMenu from "../menu/DetailPageMenu.component";
import PAGE_TITLES from "../../constants/pageTitles.constant";
import CircularProgressComponent from "../loader/Loader.component";
import GoodsReceivedListItem from "./GoodsReceivedListItems.component";
import { SHEETS_NAME_LIST } from "../../constants/sheetsList.constants";
import { parseGRBasics, parseGRItems } from "../../util/sheetProcessor";
import {
  clearLookUpSheet,
  getMultiplePageData,
} from "../../services/spreadsheet.service";

const initialStatus = {
  loading: true,
  error: false,
};
let titleText = "";

export default function GoodsReceivedDetails() {
  const { id } = useParams();
  // const [, setData] = useState();
  const [status, setStatus] = useState(initialStatus);
  const [goBasics, setGoBasics] = useState<Map<any, any>>();
  const [goItems, setGoItems] = useState<Map<any, any>>();

  const { TEMP_SHEET_BASIC, TEMP_SHEET_ITEMS } = SHEETS_NAME_LIST;

  const { GOOD_RECEIVED_DETAILS } = PAGE_TITLES;

  const preparePrItemsList = async () => {
    setStatus({ ...initialStatus, loading: true });
    let I;
    let B;
    try {
      const result1 = await getMultiplePageData(
        SHEETS_NAME_LIST.GOOD_RECEIVED,
        `${TEMP_SHEET_BASIC}!A1:Z`,
        id,
        "B"
      );

      const result2 = await getMultiplePageData(
        SHEETS_NAME_LIST.GOOD_RECEIVED_DETAIL,
        `${TEMP_SHEET_ITEMS}!A1:Z`,
        id,
        "A"
      );
      const value1 = [...result1.result.updatedData.values];
      const value2 = [...result2.result.updatedData.values];
      value1.shift();
      value2.shift();
      B = parseGRBasics(value1);
      I = parseGRItems(value2);

      setGoBasics(B);
      setGoItems(I);
      titleText = `PR-${B.get(id)?.prNo}/PO-${B.get(id)?.poNo}/GR-${
        B.get(id).grNo
      }`;

      setStatus({ ...initialStatus, loading: false });
    } catch (error: any) {
      // eslint-disable-next-line
      console.log(error);
      setStatus({ ...initialStatus, error: true, loading: false });
    }
  };

  const handleComponentDestroy = async () => {
    try {
      await clearLookUpSheet([TEMP_SHEET_BASIC, TEMP_SHEET_ITEMS]);
    } catch (e) {
      // eslint-disable-next-line
      console.log(e);
    }
  };

  useEffect(() => {
    handleComponentDestroy();
    preparePrItemsList();
  }, []);
  const goodsReceived = goBasics?.get(id);

  if (status.loading) return <CircularProgressComponent />;

  if (goBasics && goItems)
    return (
      <>
        <PageTitle pageTitle={GOOD_RECEIVED_DETAILS} />

        <div className="container">
          <DetailPageMenu
            titleText={titleText}
            printPageName={SHEETS_NAME_LIST.GOOD_RECEIVED}
            items={goItems.get(id)}
            basics={goBasics.get(id)}
            generatePageName={""}
          />

          <Paper>
            <h3 className={styles.detail_page_header}>Goods Received</h3>
            <div className={styles.detail_page_basic_info_block}>
              <div className={styles.detail_page_basic_info}>
                <div>Procurement Request : {goodsReceived?.prNo}</div>{" "}
                <div> Procurement Order : {goodsReceived?.poNo} </div>
              </div>
              <div className={styles.detail_page_basic_info}>
                <div>Request Date: {goodsReceived?.nepaliDate}</div>
                <div>Fiscal Year: {goodsReceived?.fiscalYear}</div>
              </div>
              <div className={styles.detail_page_basic_info}>
                <div>Department: {goodsReceived?.department}</div>
                <div>Vendor: {goodsReceived?.vendor}</div>
              </div>
              <div className={styles.detail_page_basic_info}>
                <div> Good Received : {goodsReceived?.grNo}</div>
                <div>Invoice : {goodsReceived?.invoiceNumber}</div>
              </div>
            </div>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <colgroup>
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "40%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "5%" }} />
                  <col style={{ width: "5%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                </colgroup>

                <TableHead>
                  <TableRow>
                    <TableCell className={styles.text_bold}>SN</TableCell>
                    <TableCell className={styles.text_bold}>
                      Particular
                    </TableCell>
                    <TableCell
                      className={`${styles.text_bold} ${styles.text_align_right}`}
                    >
                      Ordered Qty
                    </TableCell>
                    <TableCell
                      className={`${styles.text_bold} ${styles.text_align_right}`}
                    >
                      Delivered Qty
                    </TableCell>
                    <TableCell className={styles.text_bold}>Unit</TableCell>

                    <TableCell
                      className={`${styles.text_bold} ${styles.text_align_right}`}
                    >
                      Rate
                    </TableCell>
                    <TableCell
                      className={`${styles.text_bold} ${styles.text_align_right}`}
                    >
                      VAT
                    </TableCell>
                    <TableCell
                      className={`${styles.text_bold} ${styles.text_align_right}`}
                    >
                      Sub Total
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <GoodsReceivedListItem goodsReceived={goItems.get(id)} />
              </Table>
            </TableContainer>
          </Paper>
        </div>
      </>
    );

  return <div />;
}
