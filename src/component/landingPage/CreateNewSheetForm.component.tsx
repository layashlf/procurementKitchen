import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { createNewExcelSheet } from "../../services/gapi.services";

interface Props {
  openedState: boolean;
  closeState: Function;
}

export default function CreateNewSheetFormComponent(props: Props) {
  const [open, setOpen] = useState(props.openedState);
  const [formValue, setFormValue] = useState("");
  useEffect(() => {
    setOpen(props.openedState);
  }, [props]);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
    props.closeState();
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    createNewExcelSheet(formValue);
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Enter Financial year to create google Sheet
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            id="year"
            label="Financial Year"
            type="text"
            fullWidth
            value={formValue}
            variant="standard"
            onChange={(event) => {
              setFormValue(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
