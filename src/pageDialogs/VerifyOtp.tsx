import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import UpdatePasswordDialog from './UpdatePasswordDialog';


interface OTPVerificationProps {
    open: boolean;
    onClose: () => void;
    onVerify: (otp: string, email: string) => void;
    email: string
  }

const OTPVerificationDialog = ({ open, onClose, onVerify, email }: OTPVerificationProps) => {
  const [otp, setOtp] = useState('');
  const [showUpdatePasswordDialog, setShowUpdatePasswordDialog] = useState(false);

  const handleVerifyOTP = () => {
    onVerify(otp, email);
    onClose();
    setShowUpdatePasswordDialog(true);
  };

  return (
    <>
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Verify OTP</DialogTitle>
      <DialogContent>
      <TextField 
          margin="dense"
          id="email"
          label="Email"
          type="text"
          fullWidth
          value={email}
          disabled 
        />
        <TextField
          autoFocus
          margin="dense"
          id="otp"
          label="OTP"
          type="text"
          fullWidth
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleVerifyOTP} color="primary">
          Verify OTP
        </Button>
      </DialogActions>
    </Dialog>
    {showUpdatePasswordDialog && (
                <UpdatePasswordDialog
                    open={showUpdatePasswordDialog}
                    onClose={() => setShowUpdatePasswordDialog(false)}
                    email={email}
                />
            )}
    </>
  );
};

export default OTPVerificationDialog;
