import * as React from "react";
import { Button } from "@mui/material";
import ReactToPrint from "react-to-print";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { ComponentToPrint } from "./componentToBePrinted.component";

export default (props: any) => {
  const { items, basics, page, titleText } = props;

  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef<(() => void) | null>(null);

  const handleOnBeforeGetContent = React.useCallback(() => {
    return new Promise<void>((resolve) => {
      onBeforeGetContentResolve.current = resolve;
      resolve();
    });
  }, []);

  React.useEffect(() => {
    if (typeof onBeforeGetContentResolve.current === "function") {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current]);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const reactToPrintTrigger = React.useCallback(() => {
    return (
      <Button
        type="button"
        variant="contained"
        style={{ textTransform: "none" }}
        endIcon={<LocalPrintshopIcon />}
      >
        Print
      </Button>
    );
  }, []);

  return (
    <div>
      <ReactToPrint
        content={reactToPrintContent}
        onBeforeGetContent={handleOnBeforeGetContent}
        documentTitle={titleText}
        removeAfterPrint
        trigger={reactToPrintTrigger}
      />
      <div style={{ display: "none" }}>
        <ComponentToPrint
          ref={componentRef}
          items={items}
          basics={basics}
          page={page}
        />
      </div>
    </div>
  );
};
