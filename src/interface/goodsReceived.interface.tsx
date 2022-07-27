export interface goodsReceivedItemInterface {
  deliveredQuantity: string;
  particular: string;
  quantity: string;
  remarks: string;
  serialNo: string;
  unit: string;
  vatAddedUnitPrice: string;
}

export interface goodsReceivedInterface {
  date: string;
  deliveredQuantity: string;
  department: string;
  fiscalYear: string;
  grNumber: string;
  invoiceNumber: string;
  items: goodsReceivedItemInterface[];
  particular: string;
  poNumber: string;
  prNo: string;
  quantity: string;
  remarks: string;
  serialNo: string;
  unit: string;
  vatAddedUnitPrice: string;
  vendor: string;
}
