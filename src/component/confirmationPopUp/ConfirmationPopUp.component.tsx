import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

interface Props {
  headerMessage: string;
  bodyMessage: string;
  handleClose?: any;
  open: boolean;
  secondButtonText?: string;
  secondButtonPath?: string;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmationPopUp(props: Props) {
  const handleClose = () => {
    props.handleClose();
  };
  const navigate = useNavigate();

  return (
    <>
      <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{ color: "#2ecc71" }}>
          {props.headerMessage}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {props.bodyMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {props.secondButtonText !== "" ? (
            <Button
              style={{ textTransform: "none" }}
              variant={props.secondButtonText === "" ? "outlined" : "contained"}
              onClick={() => {
                navigate(props.secondButtonPath as string);
              }}
            >
              {props.secondButtonText}
            </Button>
          ) : (
            <div></div>
          )}
          <Button
            style={{ textTransform: "none" }}
            onClick={handleClose}
            variant={props.secondButtonText !== "" ? "outlined" : "contained"}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
