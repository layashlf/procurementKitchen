import Cookies from "universal-cookie";

import { GAPI } from "../constants/gapi.constants";
import { authResultInterface } from "../interface/gapi.interface";
import config from "../config";

import {
  parseGoodsReceivedFromSheets,
  parsePurchaseOrderFromSheets,
} from "../util/sheetProcessor";
import { SHEETS_NAME_LIST } from "../constants/sheetsList.constants";
// import { PAGINATION } from "../constants/paginations.constants";

const { SCOPE, DISCOVERY_DOCS, SCRIPT } = GAPI;
let pickerApiLoaded: boolean = false;

const cookies = new Cookies();

let initCallback: Function;
let oauthToken: string;
let fieldId: string;
let selectedFileId: string;
const clientId: string = config?.clientId || "";
const developerKey: string = config.developerKey || "";
const folderId: string = config.folderId || "";

async function pickerCallback(data: any) {
  if (data.action === window.google.picker.Action.PICKED) {
    selectedFileId = data.docs[0].id;
    fieldId = selectedFileId;
    await cookies.set("sheetId", selectedFileId, { path: "/" });
    initCallback(true);
  }
}

function openPicker() {
  const docsView = new window.google.picker.DocsView().setParent(folderId);
  docsView.setMode("GRID");
  const picker = new window.google.picker.PickerBuilder()
    .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
    .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
    .setAppId(config.googleAppId)
    .setOAuthToken(oauthToken)
    .addView(docsView)
    .setDeveloperKey(config.developerKey)
    .setCallback((data) => pickerCallback(data))
    .build();

  picker.setVisible(true);
}

function createPicker() {
  if (typeof cookies.get("sheetId") === "undefined") {
    if (pickerApiLoaded && oauthToken) {
      openPicker();
    }
  } else {
    fieldId = cookies.get("sheetId");
    initCallback(true);
  }
}

function onAuthApiLoad() {
  window.gapi.auth.checkSessionState({ client_id: clientId }, (state: any) => {
    if (state || window.gapi.auth.getToken() == null) {
      initCallback(false);
    } else {
      oauthToken = window.gapi.auth.getToken().access_token;
      if (oauthToken === undefined) {
        window.gapi.auth.setToken(null);
        window.gapi.auth.signOut();
      }
      createPicker();
    }
  });
}

function onPickerApiLoad() {
  pickerApiLoaded = true;
  createPicker();
}

function initGapis(initializationCallback: Function) {
  initCallback = initializationCallback;
  const script = document.createElement("script");
  script.src = SCRIPT;
  script.onload = () => {
    window.gapi.load("client", () => {
      window.gapi.client
        .init({
          apiKey: developerKey,
          client_id: clientId,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPE,
        })
        .then(
          () => {
            window.gapi.load("auth2", { callback: onAuthApiLoad });
            window.gapi.load("picker", { callback: onPickerApiLoad });
          },
          (error: any) => {
            // eslint-disable-next-line no-console
            console.log("Script on load Error", error);
          }
        );
    });
  };

  document.body.appendChild(script);
}

function handleAuthResult(authResult: authResultInterface) {
  if (authResult && !authResult.error) {
    oauthToken = authResult.access_token;
    cookies.set("accessToken", oauthToken, { path: "/" });
    initCallback(true);
    createPicker();
  } else {
    // eslint-disable-next-line no-console
    console.log("handleAuthResult:", authResult.error);
  }
}

function loadAuthPicker() {
  window.gapi.auth.authorize(
    {
      client_id: clientId,
      scope: SCOPE,
      discoveryDocs: DISCOVERY_DOCS,
      immediate: false,
    },
    handleAuthResult
  );
}

// this was used on prlist and prdetail page
async function fetchPrRequests(
  pageOffset: number | string,
  pageLimit: number | string,
  sheetRange: string
) {
  const prepareSheetRange = `${sheetRange}!A${pageOffset}:${pageLimit}`;
  const requests = await window.gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: fieldId,
    range: prepareSheetRange,
  });

  return requests;
}

function createNewExcelSheet(title: string) {
  window.gapi.client.sheets.spreadsheets
    .create({
      properties: {
        // eslint-disable-next-line object-shorthand
        title: title,
      },
    })
    .then(() => {});
}

async function getTotalRowCount(sheetId: string) {
  const prepareSheetRange = `${sheetId}`;
  let rowCount = 0;
  try {
    const pageCountRequest = await window.gapi.client.sheets.spreadsheets.get({
      spreadsheetId: fieldId,
      ranges: prepareSheetRange,
    });
    rowCount =
      pageCountRequest.result.sheets[0].properties.gridProperties.rowCount;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("total row count error", e);
  }

  return rowCount;
}

async function fetchGoodsReceived(
  pageOffset: number,
  pageLimit: number,
  setgoodsReceivedFormatted: Function,
  sheetRange: string
) {
  const prepareSheetRange = `${sheetRange}!${pageOffset}:${pageLimit}`;
  try {
    const received = await window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: fieldId,
      range: prepareSheetRange,
    });

    const result = parseGoodsReceivedFromSheets(received.result.values);
    setgoodsReceivedFormatted(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

async function fetchOrders(
  pageOffset: number | string,
  pageLimit: number | string,
  setPurchaseOrderFormatted: Function,
  sheetRange: string
) {
  const prepareSheetRange = `${sheetRange}!${pageOffset}:${pageLimit}`;
  try {
    const orders = await window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: fieldId,
      range: prepareSheetRange,
    });
    const result = parsePurchaseOrderFromSheets(orders.result.values);
    setPurchaseOrderFormatted(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

async function getFiscalYearFromTitle() {
  const result = await window.gapi.client.sheets.spreadsheets.get({
    spreadsheetId: fieldId,
  });
  const { title } = result.result.properties;
  return title.split("-")[0];
}

const getTodaysDate = () => {
  return new Date().toISOString().split("T")[0];
};

const getSheetRanges = () => {
  return Object.values(SHEETS_NAME_LIST).map((val) => `${val}!B2:B`);
};

async function getPageProperty() {
  let pageLastRows = {
    [SHEETS_NAME_LIST.PURCHASE_ORDER]: 0,
    [SHEETS_NAME_LIST.PURCHASE_REQUEST]: 0,
    [SHEETS_NAME_LIST.GOOD_RECEIVED]: 0,
    [`next_${SHEETS_NAME_LIST.PURCHASE_ORDER}`]: 0,
    [`next_${SHEETS_NAME_LIST.PURCHASE_REQUEST}`]: 0,
    [`next_${SHEETS_NAME_LIST.GOOD_RECEIVED}`]: 0,
    fiscalYear: "",
    currentDate: "",
    sheetsSelected: false,
  };
  try {
    if (!fieldId) {
      throw new Error("No sheets selected");
    }
    const sheetRanges = getSheetRanges();
    const fiscalYear = await getFiscalYearFromTitle();

    const result = await window.gapi.client.sheets.spreadsheets.values.batchGet(
      {
        spreadsheetId: fieldId,
        ranges: sheetRanges,
      }
    );

    const document = result.result.valueRanges;
    const sheetsCheckList = Object.keys(pageLastRows);
    document.forEach((element) => {
      const sheetsName = element.range.split("!")[0];
      if (sheetsCheckList.includes(sheetsName)) {
        const value = element.values;

        const next = `next_${sheetsName}`;
        let totalRows: number = 0;
        let nextValue: number = 1;
        if (value) {
          totalRows = parseInt(value.length, 10);
          nextValue = parseInt(value[value.length - 1][0], 10) + 1;
        }
        pageLastRows = { ...pageLastRows, [sheetsName]: totalRows };
        pageLastRows = { ...pageLastRows, [next]: nextValue };
      }
    });

    pageLastRows.sheetsSelected = true;
    pageLastRows.fiscalYear = fiscalYear;
    pageLastRows.currentDate = getTodaysDate();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("total row count error", e);
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    return pageLastRows;
  }
}
const purchaseRequestsFormatted = new Map();

export {
  initGapis,
  onAuthApiLoad,
  loadAuthPicker,
  fetchPrRequests,
  purchaseRequestsFormatted,
  openPicker,
  createNewExcelSheet,
  getTotalRowCount,
  fetchGoodsReceived,
  fetchOrders,
  getPageProperty,
};
