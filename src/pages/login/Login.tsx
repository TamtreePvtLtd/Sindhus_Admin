import {
  AppBar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { adminLogin, isAuthorized } from "../../services/api";
import { ILoginFormInputs } from "../../interface/customer";
import { useSnackBar } from "../../context/SnackBarContext";
import { useEffect, useState } from "react";
import { paths } from "../../routes/Paths";
import { useAuthContext } from "../../context/AuthContext";
import theme from "../../theme/theme";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

function Login() {
  const navigate = useNavigate();
  const { updateSnackBarState } = useSnackBar();
  const { updateUserData } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormInputs>({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const handleLogin = async (data: ILoginFormInputs) => {
    try {
      const response = await adminLogin(data);
      if (response.data) {
        updateUserData(response.data);
        updateSnackBarState(true, "Login Successfully", "success")
        navigate(paths.ROOT);
      } else {
        console.log("Login failed");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.log(error.response.data);
        updateSnackBarState(true, error.response.data.message, "error");
      }
    }
  };

  const checkAuthorization = async () => {
    setIsLoading(true);
    try {
      const user = await isAuthorized();
      if (!user) {
        setIsLoading(false);
      } else {
        setIsLoading(false);
        updateUserData({ ...user });
        navigate(paths.ROOT);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error checking authorization:", error);
      navigate(paths.LOGIN); 
    }
  };

  useEffect(() => {
    checkAuthorization();
  }, []);


  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      {isLoading != null && !isLoading && (
        <>
          <AppBar sx={{ backgroundColor: "white" }}>
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
              justifyContent: "center",
              alignItems: "center",
              minHeight: "70vh",
              marginTop: "30px",
            }}
          >
            <Box>
              <Typography variant="h5" align="center" gutterBottom>
                <b> Login</b>
              </Typography>
              <form onSubmit={handleSubmit(handleLogin)}>
                <Typography>
                  Email<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  type="email"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message?.toString()}
                  FormHelperTextProps={{
                    sx: { color: "red", marginLeft: "0px" },
                  }}
                  sx={{
                    mt: 0,
                    paddingBottom: "10px",
                  }}
                  required
                />
                <Typography>
                  Password<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message?.toString()}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  required
                  sx={{
                    mt: 0,
                  }}
                />
                <span
                  style={{ float: "right", color: theme.palette.primary.main }}
                >
                  Forgot Password?
                </span>
                    <Link
                      to={paths.REGISTER}
                      style={{ textDecoration: "none", color: theme.palette.primary.main, marginLeft: "10px" }}
                    >
                      Register Now
                    </Link>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ marginTop: 3 }}
                  type="submit"
                >
                  Login
                </Button>
              </form>
            </Box>
          </Box>
        </>
      )}
    </>
  );
}

export default Login;
