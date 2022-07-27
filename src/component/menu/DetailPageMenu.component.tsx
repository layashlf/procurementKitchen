import React from "react";
import { Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { menuStyles as styles } from "../../assets/styles";
import PrintComponentComponent from "../print/PrintComponent.component";

interface dMenuProps {
  generatePageName: string;
  basics: any;
  items: any;
  printPageName: string;
  titleText: string;
  buttonText?: string;
}
export default function DetailPageMenu(props: dMenuProps) {
  const navigate = useNavigate();
  return (
    <Paper className={styles.page_menu}>
      <Button
        variant="outlined"
        onClick={() => navigate(-1)}
        style={{ textTransform: "none" }}
        startIcon={<ArrowBackIcon />}
      >
        Back
      </Button>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {props.generatePageName !== "" ? (
          <div style={{ paddingRight: "10px" }}>
            <Button
              variant="outlined"
              onClick={() =>
                navigate(props.generatePageName, {
                  state: {
                    basics: props.basics,
                    items: props.items,
                  },
                })
              }
              style={{ textTransform: "none" }}
            >
              {props.buttonText}
            </Button>
          </div>
        ) : (
          <></>
        )}

        <PrintComponentComponent
          items={props.items}
          basics={props.basics}
          page={props.printPageName}
          titleText={props.titleText}
        />
      </div>
    </Paper>
  );
}
