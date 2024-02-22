import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface IProps {
  dialogOpen: boolean;
  onDialogclose(): void;
  onSave(): void;
  title: string;
  content: string;
}
import CloseIcon from "@mui/icons-material/Close";

function CommonSaveDialog(props: IProps) {
  const { dialogOpen, onDialogclose, onSave, title, content } = props;
  return (
    <>
      <Dialog open={dialogOpen} onClose={onDialogclose}>
        <DialogTitle>
          {title}
          <CloseIcon
            onClick={onDialogclose}
            sx={{ cursor: "pointer", float: "right" }}
          />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDialogclose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={onSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CommonSaveDialog;
