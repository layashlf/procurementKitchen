import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import TableRow from "@mui/material/TableRow";

import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableCell,
} from "@mui/material";

import PageTitle from "../menu/PageTitle.component";
import paginationLogic from "../../util/pagination";
import { gStyles as styles } from "../../assets/styles";
import ListPageMenu from "../menu/ListPageMenu.component";
import { parseGRBasics } from "../../util/sheetProcessor";
import { ROUTERS } from "../../constants/routers.constant";
import BUTTONS from "../../constants/buttonText.constants";
import PAGE_TITLES from "../../constants/pageTitles.constant";
import CircularProgressComponent from "../loader/Loader.component";
import { PAGINATION } from "../../constants/paginations.constants";
import PaginationComponent from "../Paginations/Pagination.component";
import GoodsReceivedListItem from "./GoodsReceivedListItems.component";
import { SHEETS_NAME_LIST } from "../../constants/sheetsList.constants";
import NoItemsFoundComponent from "../pageNotFound/NoItemsFoundComponent";
import { getAllDataFromSheet } from "../../services/spreadsheet.service";
import { goodsReceivedInterface } from "../../interface/goodsReceived.interface";

const initialStatus = {
  loading: true,
  error: false,
};
const sheetName = SHEETS_NAME_LIST.GOOD_RECEIVED;
let currentPage = 1;

let totalRowsOnPage = 0;
export default function GoodReceivedList() {
  const { GOODS_RECEIVED_BTN_ADD } = BUTTONS.ADD;
  const { GOOD_RECEIVED_LIST } = PAGE_TITLES;

  const TITLE_MENU = {
    TEXT: GOODS_RECEIVED_BTN_ADD,
    PATH: ROUTERS.GOOD_RECEIVED_NEW,
  };
  const { page } = useParams();

  const [pageLimit, setPageLimit] = useState(0);
  const [status, setStatus] = useState(initialStatus);
  const [goodsReceivedFormatted, setgoodsReceivedFormatted] = useState<any>([]);

  const sheetRange = SHEETS_NAME_LIST.GOOD_RECEIVED;
  const data = useSelector((state: any) => state.pageData.sheetData);

  const getTotalRowCountFor = async () => {
    totalRowsOnPage = data[sheetName];
    const upLimit = Math.floor(totalRowsOnPage / PAGINATION.PAGE_PER_ROW);
    let paginatorCount = 0;
    // eslint-disable-next-line no-unused-expressions
    totalRowsOnPage % PAGINATION.PAGE_PER_ROW === 0
      ? (paginatorCount = upLimit)
      : (paginatorCount = upLimit + 1);

    setPageLimit(paginatorCount);
  };

  const handlePageChange = async (value: number) => {
    setStatus({ ...initialStatus, loading: true });
    currentPage = value;
    const { itemStartRow, itemEndRow } = paginationLogic(value);

    try {
      const response = await getAllDataFromSheet(
        sheetRange,
        itemStartRow,
        itemEndRow
      );

      const result = parseGRBasics(response.result.values);
      setgoodsReceivedFormatted(result);
      window.history.replaceState(null, "", `${currentPage}`);
      setStatus({ ...initialStatus, loading: false });
    } catch (error) {
      // eslint-disable-next-line
      console.log(error);
      setStatus({ ...initialStatus, error: true, loading: false });
    }
  };

  useEffect(() => {
    if (page) currentPage = +page;
    handlePageChange(currentPage);

    getTotalRowCountFor();
  }, [data]);

  if (status.loading) return <CircularProgressComponent />;

  const goodsReceivedViews: any = [];
  if (goodsReceivedFormatted.size > 0) {
    goodsReceivedFormatted.forEach(
      (element: goodsReceivedInterface, index: number) => {
        goodsReceivedViews.push(
          <GoodsReceivedListItem
            goodsReceived={element}
            key={index}
            list={"single"}
          />
        );
      }
    );
  } else {
    goodsReceivedViews.push(
      <NoItemsFoundComponent colSpan={6} key={sheetName} />
    );
  }

  return (
    <>
      <PageTitle pageTitle={GOOD_RECEIVED_LIST} />

      <ListPageMenu path={TITLE_MENU.PATH} text={TITLE_MENU.TEXT} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={styles.text_bold}>GR NO</TableCell>
              <TableCell className={styles.text_bold}>PR NO</TableCell>
              <TableCell className={styles.text_bold}>PO NO </TableCell>
              <TableCell className={styles.text_bold}>Date</TableCell>
              <TableCell className={styles.text_bold}>Vendor</TableCell>
              <TableCell
                className={`${styles.text_bold} ${styles.text_align_right}`}
              >
                Grand Total
              </TableCell>
            </TableRow>
          </TableHead>
          {goodsReceivedViews}
        </Table>
      </TableContainer>
      <div className={styles.footer_pagination}>
        <PaginationComponent
          paginationChange={handlePageChange}
          page={currentPage}
          paginationLimit={pageLimit}
          totalRowsOnPage={totalRowsOnPage}
        />
      </div>
    </>
  );
}
