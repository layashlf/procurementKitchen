import Cookies from "universal-cookie";

const cookies = new Cookies();
const sheetsId: string = cookies.get("sheetId");

function handleErrors(response) {
  if (response.status === 403 || response.status === 401) {
    window.location.replace("/");
  }
  // if (response.status === 404) {
  //   if (typeof sheetsId === "undefined") {
  //     window.location.reload();
  //   }
  // }
  return false;
}

/* eslint-disable no-unused-vars */
/**
 * Save data to Google sheet
 *
 * @param data data that needs to be saved on Google Sheet
 * @param sheetName specific page on the Google Sheet where data will be saved
 * @param sheetsId Google sheets id
 * @returns
 */
async function addDataToSheet(formData, sheetName) {
  const result = await window.gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: sheetsId,
    valueInputOption: "USER_ENTERED",
    range: sheetName,
    resource: { values: formData },
  });
  handleErrors(result);

  return result;
}

async function getAllDataFromSheet(
  sheetName: string,
  startRow: number,
  endRow: number
): Promise<any> {
  const prepareSheetRange = `${sheetName}!A${startRow}:${endRow}`;
  let result;
  try {
    const requests = await window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: sheetsId,
      range: prepareSheetRange,
    });
    result = requests;
  } catch (e) {
    handleErrors(e);
  }
  return result;
}

async function getDataFromDifferentSheets(sheetName: string[]) {
  let result;
  try {
    const sName = Object.values(sheetName).map((val) => `${val}!A2:Z`);

    result = await window.gapi.client.sheets.spreadsheets.values.batchGet({
      spreadsheetId: sheetsId,
      ranges: sName,
    });

    result = result.result.valueRanges;
  } catch (e) {
    handleErrors(e);
  }
  return result;
}

async function getMultiplePageData(
  sheetName: string,
  tempSheet: string,
  searchValue: string = "",
  column: string = "A",
  offset: number = -1,
  limit: number = -1
) {
  let result;
  try {
    const baseQuery = `=query('${sheetName}'!A:Z, "Select * Where  `;
    let searchSymbol = ` contains ${searchValue}`;
    let offsetQuery = "";
    let limitQuery = "";
    let colSelector = "A";

    if (searchValue !== "") {
      searchSymbol = `=${searchValue}`;
    }

    if (offset > -1) {
      offsetQuery = ` Offset ${offset} `;
    }

    if (limit > -1) {
      limitQuery = ` limit ${limit} `;
    }

    if (column !== "A") {
      colSelector = column;
    }

    const query = `${baseQuery} ${colSelector} ${searchSymbol} ${offsetQuery} ${limitQuery}")`;

    const body = {
      values: [[query]],
    };

    result = await window.gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: sheetsId,
      range: tempSheet,
      valueInputOption: "USER_ENTERED",
      resource: body,
      includeValuesInResponse: true,
    });
  } catch (e) {
    handleErrors(e);
  }
  return result;
}

async function clearLookUpSheet(sheetNames) {
  let requests;
  try {
    requests = await window.gapi.client.sheets.spreadsheets.values.batchClear({
      spreadsheetId: sheetsId,
      ranges: sheetNames,
    });
  } catch (e) {
    handleErrors(e);
  }
  return requests;
}

export {
  addDataToSheet,
  getAllDataFromSheet,
  getDataFromDifferentSheets,
  getMultiplePageData,
  clearLookUpSheet,
};
