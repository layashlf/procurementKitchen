/* eslint-disable no-useless-escape */
import { CALC } from "../constants/calculations.constants";
import { IprBasics } from "../interface/PurchaseRequest.interface";

const purchaseOrdersFormatted = new Map();
const PRBasicsFormatted = new Map();
const PRItemsFormatted = new Map();
const POItemsFormatted = new Map();
const POBasicFormatted = new Map();
const GRBasicFormatted = new Map();
const GRItemsFormatted = new Map();
const goodsReceived = new Map();

const EXP = /^$/;
const validate = (text) => {
  return EXP.test(text);
};

function parsePurchaseOrderFromSheets(values: any) {
  purchaseOrdersFormatted.clear();
  if (typeof values !== "undefined" && values.length > 0) {
    values.forEach((element: any) => {
      const constructedElement = {
        fiscalYear: element[0],
        poNumber: element[1],
        prNo: element[2],
        date: element[3],
        nepaliDate: element[4],
        vendor: element[5],
        department: element[6],
        serialNo: element[7],
        particular: element[8],
        quantity: element[9],
        rate: element[10].replace(/\,/g, ""),
        total: element[11].replace(/\,/g, ""),
        vatTotal: element[12].replace(/\,/g, ""),
        subTotal: element[13].replace(/\,/g, ""),
        grandTotal: element[14].replace(/\,/g, ""),
        items: [
          {
            serialNo: "",
            particular: "",
            quantity: "",
            rate: "",
            total: "",
            vatTotal: "",
            subTotal: 0,
            grandTotal: 0,
          },
        ],
      };
      if (!purchaseOrdersFormatted.has(constructedElement.poNumber)) {
        constructedElement.items = [
          {
            serialNo: constructedElement.serialNo,
            particular: constructedElement.particular,
            quantity: constructedElement.quantity,
            rate: constructedElement.rate,
            total: constructedElement.total,
            vatTotal: constructedElement.vatTotal,
            subTotal: constructedElement.subTotal,
            grandTotal: constructedElement.grandTotal,
          },
        ];
        purchaseOrdersFormatted.set(
          constructedElement.poNumber,
          constructedElement
        );
      } else {
        const existingElement = purchaseOrdersFormatted.get(
          constructedElement.poNumber
        );
        existingElement.items.push({
          serialNo: constructedElement.serialNo,
          particular: constructedElement.particular,
          quantity: constructedElement.quantity,
          rate: constructedElement.rate,
          total: constructedElement.total,
          vatTotal: constructedElement.vatTotal,
          subTotal: constructedElement.subTotal,
          grandTotal: constructedElement.grandTotal,
        });
        purchaseOrdersFormatted.set(
          constructedElement.poNumber,
          existingElement
        );
      }
    });
  }
  return purchaseOrdersFormatted;
}

function parseGoodsReceivedFromSheets(values: []) {
  goodsReceived.clear();
  if (typeof values !== "undefined" && values.length > 0) {
    values.forEach((element: any) => {
      const constructedElement = {
        fiscalYear: element[0],
        grNumber: element[1],
        prNo: element[2],
        poNumber: element[3],
        invoiceNumber: element[4],
        date: element[5],
        nepaliDate: element[6],
        vendor: element[7],
        department: element[8],
        serialNo: element[9],
        particular: element[10],
        ordQuantity: element[11],
        delQuantity: element[11],
        // deliveredQuantity: element[12],
        rate: element[13],
        unit: element[14],
        vatAddedUnitPrice: element[14].replace(/\,/g, ""),
        subTotal: element[16],
        grandTotal: element[17],
        remarks: element[18],
        remarks2: element[19],
        items: [{}],
      };

      if (!goodsReceived.has(constructedElement.grNumber)) {
        constructedElement.items = [
          {
            serialNo: constructedElement.serialNo,
            particular: constructedElement.particular,
            ordQuantity: constructedElement.ordQuantity,
            delQuantity: constructedElement.ordQuantity,
            rate: constructedElement.rate,
            vatAddedUnitPrice: constructedElement.vatAddedUnitPrice,
            remarks: constructedElement.remarks,
            remarks2: constructedElement.remarks2,
            // deliveredQuantity: constructedElement.deliveredQuantity,
            unit: constructedElement.unit,
            subTotal: constructedElement.subTotal,
          },
        ];
        goodsReceived.set(constructedElement.grNumber, constructedElement);
      } else {
        const existingElement = goodsReceived.get(constructedElement.grNumber);
        existingElement.items.push({
          serialNo: constructedElement.serialNo,
          particular: constructedElement.particular,
          ordQuantity: constructedElement.ordQuantity,
          delQuantity: constructedElement.ordQuantity,
          rate: constructedElement.rate,
          vatAddedUnitPrice: constructedElement.vatAddedUnitPrice,
          remarks: constructedElement.remarks,
          remarks2: constructedElement.remarks2,
          unit: constructedElement.unit,

          // deliveredQuantity: constructedElement.deliveredQuantity,
        });
        goodsReceived.set(constructedElement.grNumber, existingElement);
      }
    });
  }

  return goodsReceived;
}

function parsePRBasics(values: (string | number)[]): Map<number, IprBasics> {
  PRBasicsFormatted.clear();
  if (typeof values !== "undefined" && values.length > 0) {
    values.forEach((element: any) => {
      const dataSetPrepared = {
        fiscalYear: element[0],
        prNo: element[1],
        date: element[2],
        nepaliDate: element[3],
        requestedBy: element[4],
        requestedDate: element[3],
        department: element[5],
        grandTotal: element[6],
      };
      PRBasicsFormatted.set(dataSetPrepared.prNo, dataSetPrepared);
    });
  }
  return PRBasicsFormatted;
}

function parsePRItems(values: any) {
  PRItemsFormatted.clear();
  if (typeof values !== "undefined" && values.length > 0) {
    const newArray: any = [];

    values.forEach((element: any) => {
      const currentItems = {
        prNo: element[0],
        serialNo: element[1],
        particular: element[2],
        quantity: element[3],
        rate: element[4],
        total: element[5],
        subTotal: element[6],
      };

      if (!PRItemsFormatted.has(currentItems.prNo)) {
        newArray.push(currentItems);

        PRItemsFormatted.set(currentItems.prNo, newArray);
      } else {
        const existingItem = PRItemsFormatted.get(currentItems.prNo);
        existingItem.push(currentItems);
        PRItemsFormatted.set(currentItems.prNo, existingItem);
      }
    });
  }
  return PRItemsFormatted;
}

function parsePOBasics(values: any) {
  POBasicFormatted.clear();
  if (typeof values !== "undefined" && values.length > 0) {
    values.forEach((element: any) => {
      const dataSetPrepared = {
        fiscalYear: element[0],
        poNo: element[1],
        prNo: element[2],
        date: element[3],
        nepaliDate: element[4],
        vendor: element[5],
        department: element[6],
        grandTotal: element[7],
      };
      POBasicFormatted.set(dataSetPrepared.poNo, dataSetPrepared);
    });
  }
  return POBasicFormatted;
}

function parsePOItems(values: any) {
  POItemsFormatted.clear();
  if (typeof values !== "undefined" && values.length > 0) {
    const newArray: any = [];
    values.forEach((element: any) => {
      // eslint-disable-next-line
      const vTotal =
        (parseFloat(element[4]) * parseFloat(element[5]) * CALC.VAT) / 100;

      const currentItems = {
        poNo: element[0],
        prNo: element[1],
        serialNo: element[2],
        particular: element[3],
        quantity: element[4],
        rate: element[5],
        total: element[6],
        vatTotal: element[7],
        subTotal: element[8],
      };
      if (!POItemsFormatted.has(currentItems.poNo)) {
        newArray.push(currentItems);
        POItemsFormatted.set(currentItems.poNo, newArray);
      } else {
        const existingItem = POItemsFormatted.get(currentItems.poNo);
        existingItem.push(currentItems);
        POItemsFormatted.set(currentItems.poNo, existingItem);
      }
    });
  }
  return POItemsFormatted;
}

function parseGRBasics(values: any) {
  GRBasicFormatted.clear();
  if (typeof values !== "undefined" && values.length > 0) {
    values.forEach((element: any) => {
      const dataSetPrepared = {
        fiscalYear: element[0],
        grNo: element[1],
        poNo: element[2],
        prNo: element[3],
        invoiceNumber: element[4],
        date: element[5],
        nepaliDate: element[6],
        vendor: element[7],
        department: element[8],
        grandTotal: element[9],
      };
      GRBasicFormatted.set(dataSetPrepared.grNo, dataSetPrepared);
    });
  }
  return GRBasicFormatted;
}

function parseGRItems(values: any) {
  GRItemsFormatted.clear();
  if (typeof values !== "undefined" && values.length > 0) {
    const newArray: any = [];

    values.forEach((element: any) => {
      const currentItems = {
        grNo: element[0],
        poNo: element[1],
        prNo: element[2],
        serialNo: element[3],
        particular: element[4],
        ordQuantity: element[5],
        delQuantity: element[6],
        rate: element[7],
        unit: element[8],
        VAT: element[9],
        subTotal: element[10],
        remarks: validate(element[11]) ? "--" : element[11],
        remarks2: validate(element[12]) ? "--" : element[12],
      };
      if (!GRItemsFormatted.has(currentItems.grNo)) {
        newArray.push(currentItems);

        GRItemsFormatted.set(currentItems.grNo, newArray);
      } else {
        const existingItem = GRItemsFormatted.get(currentItems.grNo);
        existingItem.push(currentItems);
        GRItemsFormatted.set(currentItems.grNo, existingItem);
      }
    });
  }
  return GRItemsFormatted;
}

export {
  parseGoodsReceivedFromSheets,
  goodsReceived,
  purchaseOrdersFormatted,
  parsePurchaseOrderFromSheets,
  parsePRBasics,
  parsePRItems,
  PRItemsFormatted,
  PRBasicsFormatted,
  parsePOBasics,
  parsePOItems,
  POItemsFormatted,
  POBasicFormatted,
  parseGRBasics,
  parseGRItems,
};
