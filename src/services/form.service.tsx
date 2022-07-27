const EXP = /^$/;
const validate = (text) => {
  return EXP.test(text);
};
/**
 * Prepare Data gathered from the form to be sent for storage.
 *
 * @param data Data collected from Purchase Request Form
 * @returns
 */

function preparePrFormData(data) {
  let totalAmount = 0;
  const prBasics = [
    [
      data.fiscalYear,
      data.prNo,
      data.date,
      data.nepaliDate,
      data.requestedBy,
      data.department,
    ],
  ];

  const prItems = data.items.map(
    (element: {
      rate: number;
      quantity: number;
      serialNo: any;
      particular: any;
    }) => {
      const amount = element.rate * element.quantity;
      totalAmount += amount;
      return [
        data.prNo,
        element.serialNo,
        element.particular,
        element.quantity,
        element.rate,
        element.rate * element.quantity,
        amount,
      ];
    }
  );
  prBasics[0].push(totalAmount);
  return [prBasics, prItems];
}

/**
 * Prepare Data gathered from the form to be sent for storage.
 *
 * @param data Data collected from Purchase Order Form
 * @returns
 */
function preparePoFormData(data) {
  let totalAmount = 0;
  const poBasics = [
    [
      data.fiscalYear,
      data.poNo,
      data.prNo,
      data.date,
      data.nepaliDate,
      data.vendor,
      data.department,
    ],
  ];

  const poItems = data.items.map((element) => {
    totalAmount += parseFloat(element.subTotal);
    // const subTotal = element.rate * element.quantity + element.vatTotal;

    return [
      data.poNo,
      data.prNo,
      element.serialNo,
      element.particular,
      element.quantity,
      element.rate,
      element.rate * element.quantity,
      element.vatTotal,
      element.subTotal,
      totalAmount,
    ];
  });
  poBasics[0].push(totalAmount);
  return { poBasics, poItems };
}

/**
 * Prepare Data gathered from the form to be sent for storage.
 *
 * @param data Data collected from Goods Received Order Form
 * @returns
 */
function prepareGRFormData(data) {
  let totalAmount = 0;
  const grBasics = [
    [
      data.fiscalYear,
      data.grNo,
      data.poNo,
      data.prNo,
      data.invoiceNumber,
      data.date,
      data.nepaliDate,
      data.vendor,
      data.department,
    ],
  ];

  const grItems = data.items.map((element) => {
    const subTotal =
      parseFloat(element.vatTotal) +
      parseFloat(element.rate) * parseFloat(element.delQuantity);
    totalAmount += subTotal;

    return [
      data.grNo,
      data.prNo,
      data.poNo,
      element.serialNo,
      element.particular,
      element.ordQuantity,
      element.delQuantity,
      element.rate,
      element.unit,
      element.vatTotal,
      subTotal,
      validate(element.remarks) ? "--" : element.remarks,
      validate(element.remarks2) ? "--" : element.remarks2,
      element.discount,
    ];
  });
  grBasics[0].push(totalAmount);
  return { grBasics, grItems };
}

// eslint-disable-next-line import/prefer-default-export
export { preparePrFormData, preparePoFormData, prepareGRFormData };
