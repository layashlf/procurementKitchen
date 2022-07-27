import { PAGINATION } from "../constants/paginations.constants";

/**
 *
 * @param value |number
 * get the current page as value
 *
 * @returns {itemStartRow,itemEndRow}
 */
export default function paginationLogic(value: number): {
  itemStartRow: number;
  itemEndRow: number;
} {
  const currentPage = value;
  const itemStartRow =
    (currentPage - 1) * PAGINATION.PAGE_PER_ROW + PAGINATION.START_ROW;
  const itemEndRow = itemStartRow + PAGINATION.PAGE_PER_ROW - 1;

  return {
    itemStartRow,
    itemEndRow,
  };
}
