import React from "react";
import { Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

import { menuStyles as styles } from "../../assets/styles";

interface ListPagePropsInterface {
  path: string;
  text: string;
}

export default function ListPageMenu(props: ListPagePropsInterface) {
  const navigate = useNavigate();

  return (
    <Paper className={`${styles.page_menu} ${styles.m_15}`}>
      <div></div>
      <Button
        style={{ textTransform: "none" }}
        variant="contained"
        onClick={() => navigate(props.path)}
        startIcon={<AddIcon />}
      >
        {props.text}
      </Button>
    </Paper>
  );
}
