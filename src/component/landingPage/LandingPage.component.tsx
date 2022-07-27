/* eslint-disable no-unused-vars */
import Cookies from "universal-cookie";
import { Box, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation, matchPath } from "react-router-dom";

import { updatePageData } from "../../storage/actions";
import { ROUTERS } from "../../constants/routers.constant";
import { landingStyles as styles } from "../../assets/styles";
import CircularProgressComponent from "../loader/Loader.component";
import { openPicker, getPageProperty } from "../../services/gapi.services";

const cookies = new Cookies();

export const gettingSheetPrimaryData = async () => {
  const res = await getPageProperty();
  return res;
};

export function LandingPageComponent() {
  const {
    PURCHASE_REQUEST_PAGE,
    PURCHASE_REQUEST,
    PURCHASE_ORDER_PAGE,
    PURCHASE_ORDER,
    GOOD_RECEIVED_PAGE,
    GOOD_RECEIVED,
    SELECT_SHEET,
  } = ROUTERS;
  const [value, setValue] = useState(PURCHASE_REQUEST_PAGE);
  const [pageUrl, setPageUrl] = useState(PURCHASE_REQUEST_PAGE);

  const data = useSelector((state: any) => state.pageData.sheetData);
  const loading = useSelector((state: any) => state.pageData.loading);

  const dispatch = useDispatch<any>();
  const sheetId = cookies.get("sheetId");

  const gettingSheetPrimaryData1 = async () => {
    dispatch(updatePageData());
  };

  const handleSelectFile = () => {
    openPicker();
  };

  function useRouteMatch(patterns: readonly string[]) {
    const { pathname } = useLocation();
    for (let i = 0; i < patterns.length; i += 1) {
      const pattern = patterns[i];
      const possibleMatch = matchPath(pattern, pathname);
      if (possibleMatch !== null) {
        return possibleMatch;
      }
    }

    return null;
  }

  const routeMatch = useRouteMatch([
    PURCHASE_REQUEST_PAGE,
    PURCHASE_ORDER_PAGE,
    GOOD_RECEIVED_PAGE,
    SELECT_SHEET,
  ]);
  const currentTab = routeMatch?.pattern?.path || PURCHASE_REQUEST_PAGE;
  useEffect(() => {
    gettingSheetPrimaryData1();
  }, [sheetId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if (loading) {
    return (
      <header className="welcome_text">
        <CircularProgressComponent />
      </header>
    );
  }

  return (
    <>
      <div className={styles.tab_menu}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          className={styles.tab_header_style}
        >
          {/* <Tab
            style={{ textTransform: "none" }}
            value={PURCHASE_REQUEST_PAGE}
            label="Purchase Requests"
            to={`${PURCHASE_REQUEST}page/1`}
            component={Link}
            disabled={!data.sheetsSelected}
          />
          <Tab
            style={{ textTransform: "none" }}
            value={PURCHASE_ORDER_PAGE}
            label="Purchase Orders"
            to={`${PURCHASE_ORDER}page/1`}
            component={Link}
            disabled={!data.sheetsSelected}
          /> */}
          <Tab
            style={{ textTransform: "none" }}
            value={GOOD_RECEIVED_PAGE}
            label="Goods Received"
            to={`${GOOD_RECEIVED}page/1`}
            component={Link}
            disabled={!data.sheetsSelected}
          />
          <Tab
            className={styles.select_picker}
            onClick={handleSelectFile}
            value={SELECT_SHEET}
            label="Select Different Spreadsheet"
          />
        </Tabs>
      </div>
      <Box className="container">
        <Outlet context={[pageUrl, setPageUrl]} />
      </Box>
    </>
  );
}
