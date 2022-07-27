import React from "react";
import { Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { menuStyles as styles } from "../../assets/styles";

export default function FormPageMenu() {
  const navigate = useNavigate();

  return (
    <Paper className={styles.page_menu}>
      <Button
        variant="outlined"
        onClick={() => navigate(-1)}
        startIcon={<ArrowBackIcon />}
      >
        Back
      </Button>
    </Paper>
  );
}
