import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import UpdatePasswordDialog from './UpdatePasswordDialog';
import { httpWithoutCredentials } from '../services/http';
import { useSnackBar } from '../context/SnackBarContext';
import ForgotPasswordDialog from './ForgotPasswordDialog';

interface OTPVerificationProps {
  open: boolean;
  onClose: () => void;
  email: string;
}

const OTPVerificationDialog = ({ open, onClose, email}: OTPVerificationProps) => {
  const [otp, setOtp] = useState('');
  const [showUpdatePasswordDialog, setShowUpdatePasswordDialog] = useState(false);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);
  const { updateSnackBarState } = useSnackBar();

  const handleVerifyOTP = async (enteredOTP: string, email: string) => {
    try {
      const response = await httpWithoutCredentials.post('/customer/verify-otp', { otp: enteredOTP, email });
      if (response.status === 200) {
        console.log('OTP verified successfully');
        updateSnackBarState(true, "OTP verified Successfully", "success");
        onClose();
        setShowUpdatePasswordDialog(true)
      } else {
        updateSnackBarState(true, "Failed to send OTP", "error");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.log(error.response.data);
        updateSnackBarState(true, error.response.data.message, "error");
      }
    }
  };


  const handleResendOTP = async () => {
    try {
      await httpWithoutCredentials.post('/customer/resend-otp', { email });
      console.log('Password updated successfully');
      updateSnackBarState(true, "OTP resent Successfully", "success");
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.log(error.response.data);
        updateSnackBarState(true, error.response.data.message, "error");
      }
    }
  };

  const handleForgotPassword = () => {
    onClose();
    setShowForgotPasswordDialog(true);
  }

  return (
    <>
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Verify OTP</DialogTitle>
      <DialogContent>
      <Typography variant="body1" gutterBottom>
          Check the email {email} for a verification code.
        </Typography>
        <Typography variant="body2" color="primary" onClick={handleForgotPassword} style={{ cursor: 'pointer' }}>
        <a style={{ color: 'blue', textDecoration: 'underline' }}>Change email</a>     
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          id="otp"
          label="Enter OTP"
          type="text"
          fullWidth
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

<Typography variant="body2" color="primary" style={{ cursor: 'pointer' }}>
          <a style={{ textDecoration: 'underline' }} onClick={handleResendOTP}>Resend OTP</a>     
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => handleVerifyOTP(otp, email)} color="primary">
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
      {showForgotPasswordDialog && (
        <ForgotPasswordDialog
          open={showForgotPasswordDialog}
          onClose={() => setShowForgotPasswordDialog(false)}
        />
      )}
    </>
  );
};

export default OTPVerificationDialog;
