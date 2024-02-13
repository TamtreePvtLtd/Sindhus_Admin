import React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import NavbarDrawer from "../pageDrawers/NavbarDrawer";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { logOut } from "../services/api";
import { useSnackBar } from "../context/SnackBarContext";
import Logout from "@mui/icons-material/Logout";

function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isNavBarOpen, setNavBarOpen] = React.useState(false);

  const { user, updateUserData } = useAuthContext();
  const { updateSnackBarState } = useSnackBar();

  console.log(user);

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setNavBarOpen((prevState) => !prevState);
  };

  const handleLogoutClick = async () => {
    await logOut()
      .then((response) => {
        if (response.status) {
          updateUserData(null);

          handleClose();
          navigate("/login");
        }
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          console.log(error.response.data);
          updateSnackBarState(true, error.response.data.message, "error");
        }
      });
  };

  return (
    <>
      <Box display={"flex"} flexGrow={1}>
        <AppBar component="nav">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <img
                src="assets\images\sindhus-logo.png"
                alt="Sindhus-Logo"
                height="50px"
                width="50px"
              />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  color: "red",
                  fontWeight: "bolder",
                }}
              >
                Sindhu's Kitchen
              </Typography>
            </Box>
            <Stack
              flexDirection={"row"}
              flexGrow={1}
              alignItems={"center"}
              justifyContent={"flex-end"}
              gap={2}
              sx={{
                cursor: "pointer",
              }}
            >
              {user && (
                <IconButton
                  onClick={handleMenuClick}
                  size="small"
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar sx={{ width: 28, height: 28 }}>
                    {user?.name ? user.name.toUpperCase()[0] : ""}
                  </Avatar>
                </IconButton>
              )}
            </Stack>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Box component="nav">
          <Drawer
            variant="temporary"
            open={isNavBarOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            PaperProps={{
              style: {
                boxSizing: "border-box",
                width: isSmallScreen ? "60vw" : "20vw",
              },
            }}
          >
            <NavbarDrawer onDrawerToggle={handleDrawerToggle} />
          </Drawer>
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            "& .MuiAvatar-root": {
              width: 25,
              height: 25,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleLogoutClick}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
export default Navbar;
