import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Box, Button, TextField, Toolbar, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignupCredentials } from "../../services/api";
import { paths } from "../../routes/Paths";
import { ISignUp } from "../../interface/customer";
import { useAuthContext } from "../../context/AuthContext";
import { useSnackBar } from "../../context/SnackBarContext";
import CustomSnackBar from "../../common/components/CustomSnackBar";

interface SignProps {
  onSign?(): void;
  requiredHeading?: boolean;
  onRegisterLinkClick?(): void;
}

interface ISignUpFormFields {
  phoneNumber?: string;
  password: string;
  confirmPassword: string;
  email: string;
  name: string;
}

const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required()
    .typeError("Please enter the PhoneNumber")
    .matches(
      /[6-9]{1}[0-9 ]{4}[0-9 ]{4}[0-9]{1}/,
      "Please enter a valid phone number"
    )
    .max(10),
  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .required("confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
  name: yup.string().required("Please enter Name"),
});

const Signup = ({ onSign, requiredHeading, onRegisterLinkClick }: SignProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserData } = useAuthContext();
  const { updateSnackBarState } = useSnackBar();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const { state } = location;
  const isNavbarLogin = state?.fromNavbarLogin || false;
  const isSignupLogin = state?.fromSignupLogin || false;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUpFormFields>({
    resolver: yupResolver(schema) as any,
    mode: "all"
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSign = async (data: ISignUpFormFields) => {
    console.log("data", data);
    if (data) {
      setIsLoading(true);
      var signUpFormData = {
        ...data,
      } as ISignUp;
      await SignupCredentials(signUpFormData)
        .then((response) => {
          if (response.data) {
            updateUserData({
              ...response.data,
            });
            if (!isNavbarLogin && !isSignupLogin) {
              if (onSign) onSign();
            } else {
              navigate(paths.ROOT);
            }
          }
          setShowSnackbar(true);
          updateSnackBarState(true, "Signup Successfully", "success");
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            console.log(error.response.data);
          }
        });
    }
  };

  return (
    <div style={{ paddingTop: "64px" }}> {/* Add padding top to accommodate the fixed AppBar */}
      <AppBar sx={{ backgroundColor: "white", position: "fixed", top: 0, zIndex: 9999 }}>
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexGrow: 0,
            }}
          >
            <Link
              to={paths.ROOT}
              style={{ textDecoration: "none", display: "flex" }}
            >
              <img
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "55%",
                  backgroundColor: "white",
                  paddingRight: "1.5px",
                }}
                src="assets\images\sindhus-logo.png"
                alt=""
              />
            </Link>
            <Typography
              sx={{
                fontFamily: "Sindhus-Logo-Font",
                fontWeight: 800,
                fontSize: "2rem",
                color: "#57ccb5",
              }}
            >
              SINDHU'S
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          marginX: "10px", // Adjust padding top to prevent content from being hidden behind the fixed AppBar
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          <b>Register</b>
        </Typography>
        <form onSubmit={handleSubmit(handleSign)}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "300px",
            }}
          >
            <TextField
              label="Full Name"
              variant="outlined"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message?.toString() || ""}
              required
            />
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              {...register("email")}
              error={!!errors.email}
              helperText={(errors.email || (register("email"), true)) && errors.email?.message}
              required
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              type="tel"
              {...register("phoneNumber")}
              error={!!errors.phoneNumber}
              helperText={(errors.phoneNumber || (register("phoneNumber"), true)) && errors.phoneNumber?.message}
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={(errors.password || (register("password"), true)) && errors.password?.message}
              required
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={(errors.confirmPassword || (register("confirmPassword"), true)) && errors.confirmPassword?.message}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
            >
              Submit
            </Button>
          </Box>
        </form>
        <Typography variant="body1" align="center" marginTop={"10px"}>
          Already have an account?{" "}
          <Link to={paths.LOGIN} onClick={() => {
                  onRegisterLinkClick && onRegisterLinkClick();}} style={{ textDecoration: "none" }}>
            Log in
          </Link>
        </Typography>
      </Box>
      {showSnackbar && <CustomSnackBar />}
    </div>
  );
};

export default Signup;
