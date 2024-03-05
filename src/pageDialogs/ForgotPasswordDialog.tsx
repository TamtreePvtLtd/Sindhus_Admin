import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { httpWithoutCredentials } from '../services/http';
import OTPVerificationDialog from './VerifyOtp';
import { useState } from 'react';
import { useSnackBar } from '../context/SnackBarContext';
import CustomSnackBar from '../common/components/CustomSnackBar';

interface ForgotPasswordForm {
    email: string;
  }

 

  const schema = yup.object().shape({
    email: yup.string().email('Please enter a valid email address').required('Email is required')
  });

const ForgotPasswordDialog = ({ open, onClose }) => {
  const { updateSnackBarState } = useSnackBar();
 const [showSnackbar, setShowSnackbar] = useState(false);
  const [email, setEmail] = useState('');
  const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const handleSendOTP = async (data: ForgotPasswordForm) => {
    try {
      await httpWithoutCredentials.post('/customer/request-otp', { email: data.email });
      console.log('OTP sent successfully');
      setEmail(data.email);
      onClose();
      setShowSnackbar(true)
          updateSnackBarState(true, "OTP sent Successfully", "success")
      setOpenVerifyDialog(true); 
    } catch (error:any) {
      if (error.response && error.response.data) {
        console.log(error.response.data);
        updateSnackBarState(true, error.response.data.message, "error");
}
    }
  };

  const handleVerifyOTP = async (enteredOTP: string, email: string) => {
    try {
      const response = await httpWithoutCredentials.post('/customer/verify-otp', { otp: enteredOTP, email });
      if (response.status === 200) {
        console.log('OTP verified successfully');
        setShowSnackbar(true)
          updateSnackBarState(true, "OTP verified Successfully", "success")
      } else {
        updateSnackBarState(true, "Failed to send OTP" , "error")
      }
    } catch (error:any) {
      if (error.response && error.response.data) {
        console.log(error.response.data);
        updateSnackBarState(true, error.response.data.message, "error"); 
    }
  };
}

  return (
    <>
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Forgot Password</DialogTitle>
      <DialogContent>
        <Box padding={1}>
          <TextField
            {...register('email')}
            label="Email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(handleSendOTP)}>Send OTP</Button>
      </DialogActions>
    </Dialog>
    {showSnackbar && <CustomSnackBar />}
    <OTPVerificationDialog
        open={openVerifyDialog}
        onClose={() => setOpenVerifyDialog(false)}
        onVerify={handleVerifyOTP} email={email}     />
    </>
  );
};

export default ForgotPasswordDialog;
