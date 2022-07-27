import { SHEET_DATA_SET } from "../actionTypes";
import { getPageProperty } from "../../services/gapi.services";

export const saveData = (res: any) => {
  return (dispatch) => {
    dispatch({
      type: SHEET_DATA_SET,
      payload: res,
    });
  };
};

export const setLoading = (res: any) => {
  return (dispatch) => {
    dispatch({
      type: "LOADING",
      payload: res,
    });
  };
};

export const updatePageData = () => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    const res = await getPageProperty();
    dispatch(saveData(res));
    dispatch(setLoading(false));
  };
};
