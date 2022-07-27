export interface itemInterface {
  quantity: number;
  rate: number;
  particular: string;
  serialNo: number;
}

export interface formInterFace {
  prNo: string;
  fiscalYear: string;
  date: string;
  nepaliDate: string;
  requestedBy: string;
  department: string;
  items: itemInterface[];
}

export interface IpRProps {
  prItems?: any;
  prBasics: any;
  key: any;
  list?: string;
}

export interface PurchaseItemsInterface {
  particular: string;
  quantity: string;
  rate: string;
  serialNo: string;
  prNo: string;
  total: string;
}
export interface IprBasics {
  date: string;
  department: string;
  fiscalYear: string;
  grandTotal: number;
  nepaliDate: string;
  prNo: number;
  requestedBy: string;
  requestedDate: string;
}

export interface IprItems {
  particular: string;
  prNo: number;
  quantity: number;
  rate: number;
  serialNo: number;
  subTotal: number;
  total: number;
}
