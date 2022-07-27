import { SHEET_DATA_SET } from "../actionTypes";
import { SHEETS_NAME_LIST } from "../../constants/sheetsList.constants";

const initialState = {
  sheetData: {
    [SHEETS_NAME_LIST.PURCHASE_ORDER]: 0,
    [SHEETS_NAME_LIST.PURCHASE_REQUEST]: 0,
    [SHEETS_NAME_LIST.GOOD_RECEIVED]: 0,
    [`next_${SHEETS_NAME_LIST.PURCHASE_ORDER}`]: 0,
    [`next_${SHEETS_NAME_LIST.PURCHASE_REQUEST}`]: 0,
    [`next_${SHEETS_NAME_LIST.GOOD_RECEIVED}`]: 0,
    fiscalYear: "",
    sheetsSelected: false,
  },
  loading: false,
};

// eslint-disable-next-line default-param-last
export default (state = initialState, action: any) => {
  switch (action.type) {
    case SHEET_DATA_SET: {
      return {
        ...state,
        sheetData: action.payload,
      };
    }
    case "LOADING": {
      return {
        ...state,
        loading: action.payload,
      };
    }
    default:
      return state;
  }
};
