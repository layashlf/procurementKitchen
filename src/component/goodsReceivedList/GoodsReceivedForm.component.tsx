import React, { useEffect, useState } from "react";
import {
  Button,
  Paper,
  TextField,
  FormGroup,
  FormLabel,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import SaveIcon from "@mui/icons-material/Save";
import { useLocation, useNavigate } from "react-router-dom";

import { gStyles } from "../../assets/styles/index";
import PageTitle from "../menu/PageTitle.component";
import FormPageMenu from "../menu/FormPageMenu.component";
import { CALC } from "../../constants/calculations.constants";
import { prepareGRFormData } from "../../services/form.service";
import { addDataToSheet } from "../../services/spreadsheet.service";
import { parseGRBasics, parseGRItems } from "../../util/sheetProcessor";
import { SHEETS_NAME_LIST } from "../../constants/sheetsList.constants";
import PrintComponentComponent from "../print/PrintComponent.component";
import ConfirmationPopUp from "../confirmationPopUp/ConfirmationPopUp.component";
import {
  GOODS_RECEIVED_SUCCESS_BODY_MESSAGE,
  GOODS_RECEIVED_SUCCESS_HEADER_MESSAGE,
} from "../../constants/messages.constant";
import PAGE_TITLES from "../../constants/pageTitles.constant";
import BUTTONS from "../../constants/buttonText.constants";
import { ROUTERS } from "../../constants/routers.constant";

interface items {
  serialNo: number;
  particular: string;
  ordQuantity: number;
  delQuantity: number;
  rate: number;
  unit: number;
  discount: number;
  vatTotal: number;
  subTotal: number;
  remarks2: string;
  remarks: string;
}

const initialItems = {
  delQuantity: 1,
  discount: 0,
  ordQuantity: 1,
  particular: "",
  rate: 0,
  remarks: "",
  remarks2: "",
  serialNo: 1,
  subTotal: 0,
  totalAmount: 0,
  unit: "",
  vatTotal: 0,
};

const initialState = {
  prNo: "",
  fiscalYear: "",
  date: "",
  nepaliDate: "",
  requester: "",
  department: "",
  poNo: "",
  vendor: "",
  grNo: "",
  invoiceNumber: "",
  items: [{ ...initialItems }],
};
let id = "";
let titleText = "";
let secondPath: string = "";

function generateStateFromProps(props) {
  if (props !== null && props !== undefined) {
    const mappedItems = props.items.map((purchaseOrderItem) => {
      return {
        ...initialItems,
        ordQuantity: purchaseOrderItem.quantity,
        rate: purchaseOrderItem.rate,
        serialNo: purchaseOrderItem.serialNo,
        particular: purchaseOrderItem.particular,
        vatTotal: purchaseOrderItem.vatTotal,
        subTotal: purchaseOrderItem.subTotal,
        totalAmount: purchaseOrderItem.subTotal,
      };
    });

    return {
      ...initialState,
      date: props.basics.date,
      nepaliDate: props.basics.nepaliDate,
      department: props.basics.department,
      prNo: props.basics.prNo,
      poNo: props.basics.poNo,
      vendor: props.basics.vendor,
      fiscalYear: props.basics.fiscalYear,
      items: mappedItems,
    };
  }
  return initialState;
}

export default function GoodsReceivedComponent() {
  const data = useSelector((state: any) => state.pageData.sheetData);

  const next = `next_${SHEETS_NAME_LIST.GOOD_RECEIVED}`;
  initialState.grNo = data[next];
  initialState.fiscalYear = data.fiscalYear;
  initialState.date = data.currentDate;

  const { state } = useLocation();
  const navigate = useNavigate();

  const formattedValues = generateStateFromProps(state);
  const [formValues, setFormValue] = useState(formattedValues);
  const [open, setOpen] = React.useState(false);

  const [loading, setLoading] = useState(false);
  const [showPrintButton, setShowPrintButton] = useState(false);
  const [GRBasics, setGRBasics] = useState<any>();
  const [GRItems, setGRItems] = useState<any>();

  const { GOOD_RECEIVED_FORM } = PAGE_TITLES;
  const { GOODS_RECEIVED_BTN_VIEW } = BUTTONS.VIEW;
  const { GOOD_RECEIVED } = ROUTERS;

  useEffect(() => {}, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormValue({ ...formValues, [name]: value });
  };

  const getVatAmount = (element: { rate: number; ordQuantity: number }) => {
    let vatAmount: number =
      (CALC.VAT / 100) * (element.rate * element.ordQuantity);

    vatAmount = Number(vatAmount);
    return Number(vatAmount.toFixed(2));
  };

  const getSubTotalAfterDiscount = (element: {
    rate: number;
    ordQuantity: number;
    vatTotal: number;
    discount: number;
  }) => {
    const amount: number = element.rate * element.ordQuantity;

    const subTotal: number = Number(
      element.vatTotal + (amount - (element.discount / 100) * amount)
    );
    return subTotal.toFixed(2);
  };

  const getSubTotal = (element: {
    vatTotal: number;
    rate: number;
    ordQuantity: number;
    discount: number;
  }) => {
    const amount = element.rate * element.ordQuantity;
    const subTotal = (amount + Number(element.vatTotal)).toFixed(2);
    if (element.discount > 0) {
      return getSubTotalAfterDiscount(element);
    }
    return subTotal;
  };

  const handleChangeForItems = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: any
  ) => {
    const { name, value } = event.target;
    const currentItem = formValues.items.at(index);
    currentItem[name] = value;
    if (name === "rate" || name === "ordQuantity" || name === "discount") {
      currentItem.vatTotal = getVatAmount(currentItem);
      currentItem.subTotal = getSubTotal(currentItem);
    }
    if (name === "vatTotal") {
      if (currentItem.vatTotal === "") {
        currentItem.vatTotal = 0;
      }
      currentItem.subTotal = getSubTotal(currentItem);
    }
    setFormValue({ ...formValues });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const { grBasics, grItems } = prepareGRFormData(formValues);

    id = formValues.grNo;
    secondPath = `${GOOD_RECEIVED}${id}`;
    titleText = `PR-${formValues.prNo}/PO-${formValues.poNo}/GR-${formValues.grNo}`;

    const gi = parseGRItems(grItems);
    const gb = parseGRBasics(grBasics);
    setGRBasics(gb);
    setGRItems(gi);
    const grBasicsResult = await addDataToSheet(
      grBasics,
      SHEETS_NAME_LIST.GOOD_RECEIVED
    );

    const grItemsResult = await addDataToSheet(
      grItems,
      SHEETS_NAME_LIST.GOOD_RECEIVED_DETAIL
    );

    Promise.all([grBasicsResult, grItemsResult])
      .then(() => {
        handleClickOpen();
        setLoading(false);
        setShowPrintButton(true);
      })
      .catch((error: any) => {
        // eslint-disable-next-line
        console.log(error);
        setLoading(false);
        setShowPrintButton(false);
      });
  };

  const buildItemRows = (element: items, index: number) => {
    return (
      <div key={index}>
        <FormGroup row={true}>
          <TextField
            disabled={true}
            style={{ flex: 0.8, margin: 7, display: "none" }}
            name="serialNo"
            label="Serial Number"
            type="number"
            value={element.serialNo}
            onChange={(e) => handleChangeForItems(e, index)}
          />
          <Tooltip title="Serial Number" placement="top">
            <FormLabel className={gStyles.form_listing}>
              {element.serialNo}
            </FormLabel>
          </Tooltip>
          <Tooltip title="Particulars" placement="top">
            <TextField
              style={{ flex: 1.06, margin: 7 }}
              name="particular"
              label="Particular"
              type="text"
              value={element.particular}
              onChange={(e) => handleChangeForItems(e, index)}
              required={true}
            />
          </Tooltip>
          <Tooltip title="Ordered Quantity" placement="top">
            <TextField
              style={{ flex: 0.25, margin: 7 }}
              name="ordQuantity"
              label="Ordered Qty"
              type="number"
              value={element.ordQuantity}
              onChange={(e) => handleChangeForItems(e, index)}
              required={true}
            />
          </Tooltip>
          <Tooltip title="Delivered Quantity" placement="top">
            <TextField
              style={{ flex: 0.25, margin: 7 }}
              name="delQuantity"
              label="Delivered Qty"
              type="number"
              value={element.delQuantity}
              onChange={(e) => handleChangeForItems(e, index)}
              required={true}
            />
          </Tooltip>
          <Tooltip title="Rate" placement="top">
            <TextField
              style={{ flex: 0.52, margin: 7 }}
              name="rate"
              label="Rate"
              type="number"
              value={element.rate}
              onChange={(e) => handleChangeForItems(e, index)}
              required={true}
            />
          </Tooltip>
        </FormGroup>
        <FormGroup row={true}>
          <FormLabel
            className={`${gStyles.form_listing} ${gStyles.transparent}`}
          ></FormLabel>
          <Tooltip title="Unit" placement="top">
            <TextField
              style={{ flex: 1, margin: 7 }}
              name="unit"
              label="Unit"
              type="text"
              value={element.unit}
              onChange={(e) => handleChangeForItems(e, index)}
              required={true}
            />
          </Tooltip>
          <Tooltip title="Discount %" placement="top">
            <TextField
              style={{ flex: 1, margin: 7 }}
              name="discount"
              label="Discount % "
              type="number"
              value={element.discount}
              onChange={(e) => handleChangeForItems(e, index)}
              required={true}
            />
          </Tooltip>
          <Tooltip title="Total Amount Including Vat" placement="top">
            <TextField
              style={{ flex: 1, margin: 7 }}
              name="vatTotal"
              label="VAT "
              type="number"
              value={element.vatTotal}
              onChange={(e) => handleChangeForItems(e, index)}
              required={true}
            />
          </Tooltip>
          <Tooltip title="Price After Discount & VAT" placement="top">
            <TextField
              style={{ flex: 1, margin: 7 }}
              name="subTotal"
              label="Total Amount "
              type="number"
              value={element.subTotal}
              onChange={(e) => handleChangeForItems(e, index)}
              required={true}
            />
          </Tooltip>
        </FormGroup>

        <FormGroup row={true}>
          <FormLabel
            className={`${gStyles.form_listing} ${gStyles.transparent}`}
          ></FormLabel>

          <TextField
            style={{ flex: 2, margin: 7 }}
            // className={gStyles.form_basicInfo_line2}
            name="remarks2"
            label="Serial, MAC, IME No.,
            Part or Item Code(s)"
            type="text"
            value={element.remarks2}
            onChange={(e) => handleChangeForItems(e, index)}
          />
          <TextField
            style={{ flex: 2, margin: 7 }}
            // className={gStyles.form_basicInfo_line2}
            name="remarks"
            label="Remarks"
            type="text"
            value={element.remarks}
            onChange={(e) => handleChangeForItems(e, index)}
          />
        </FormGroup>

        <hr style={{ width: "100%", marginTop: "0", border: "0px" }} />
      </div>
    );
  };

  return (
    <>
      <PageTitle pageTitle={GOOD_RECEIVED_FORM} />

      <div className="container">
        <FormPageMenu />

        <Paper>
          <form className={gStyles.form} onSubmit={handleSubmit}>
            <div className={gStyles.form_heading}>New Good Received</div>
            <div className={gStyles.form_basicInfo}>
              <TextField
                className={gStyles.form_basicInfo_line2}
                name="grNo"
                label="GR Number"
                type="text"
                value={formValues.grNo}
                onChange={(e) => handleChange(e)}
                required={true}
              />
              <TextField
                style={{ marginTop: 16, flex: 1, margin: 8 }}
                name="prNo"
                label="PR Number"
                type="text"
                value={formValues.prNo}
                onChange={(e) => handleChange(e)}
                required={true}
              />
              <TextField
                className={gStyles.form_basicInfo_line2}
                name="poNo"
                label="PO Number"
                type="text"
                value={formValues.poNo}
                onChange={(e) => handleChange(e)}
                required={true}
              />
            </div>

            <div className={gStyles.form_basicInfo}>
              <TextField
                className={gStyles.form_basicInfo_line2}
                name="nepaliDate"
                label="Nepali Date"
                type="text"
                required
                value={formValues.nepaliDate}
                onChange={(e) => handleChange(e)}
              />
              <TextField
                className={gStyles.form_basicInfo_line2}
                name="fiscalYear"
                label="Fiscal Year"
                type="text"
                value={formValues.fiscalYear}
                onChange={(e) => handleChange(e)}
              />

              <TextField
                className={gStyles.form_basicInfo_line2}
                name="date"
                label="Date"
                type="text"
                required
                value={formValues.date}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className={gStyles.form_basicInfo}>
              <TextField
                className={gStyles.form_basicInfo_line2}
                name="department"
                label="Department"
                type="text"
                value={formValues.department}
                required
                onChange={(e) => handleChange(e)}
              />
              <TextField
                className={gStyles.form_basicInfo_line2}
                name="vendor"
                label="Vendor"
                type="text"
                value={formValues.vendor}
                onChange={(e) => handleChange(e)}
                required={true}
              />
              <TextField
                className={gStyles.form_basicInfo_line2}
                name="invoiceNumber"
                label="Invoice"
                type="text"
                value={formValues.invoiceNumber}
                onChange={(e) => handleChange(e)}
                required={true}
              />
            </div>
            <div className={gStyles.form_heading}>Items</div>

            {formValues.items.map((element, index) => {
              return buildItemRows(element, index);
            })}
            <div className={gStyles.footer_button}>
              {showPrintButton ? (
                <>
                  <Button
                    disabled={loading}
                    type="button"
                    variant="outlined"
                    style={{ marginRight: 16 }}
                    onClick={() => {
                      navigate("/");
                    }}
                    startIcon={<HomeIcon />}
                  >
                    Home
                  </Button>

                  <PrintComponentComponent
                    data={formValues}
                    items={GRItems.get(id)}
                    basics={GRBasics.get(id)}
                    page={SHEETS_NAME_LIST.GOOD_RECEIVED}
                    titleText={titleText}
                  />
                </>
              ) : (
                <>
                  <Button
                    style={{ marginRight: 16 }}
                    disabled={loading}
                    variant="outlined"
                    onClick={() => {
                      formValues.items.push({
                        ...initialItems,
                        serialNumber: formValues.items.length + 1,
                      });

                      setFormValue({ ...formValues });
                    }}
                    startIcon={<AddIcon />}
                  >
                    Add Item
                  </Button>

                  <Button
                    disabled={loading}
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                  >
                    {loading ? <CircularProgress /> : "Submit"}
                  </Button>
                </>
              )}
            </div>
          </form>
        </Paper>

        <ConfirmationPopUp
          open={open}
          headerMessage={GOODS_RECEIVED_SUCCESS_HEADER_MESSAGE}
          bodyMessage={GOODS_RECEIVED_SUCCESS_BODY_MESSAGE}
          handleClose={handleClose}
          secondButtonText={GOODS_RECEIVED_BTN_VIEW}
          secondButtonPath={secondPath}
        />
      </div>
    </>
  );
}
