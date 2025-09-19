import React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { logOut } from "../services/api";
import { useSnackBar } from "../context/SnackBarContext";
import Logout from "@mui/icons-material/Logout";
import { paths } from "../routes/Paths";
import CloseIcon from "@mui/icons-material/Close";

const navMenus = [
  { label: "Catering Enquiries", link: paths.CATERINGENQUIRIES },
  { label: "Menus", link: paths.MENUS },
  { label: "Products", link: paths.PRODUCTS },
  { label: "Daily Menu", link: paths.DININGOUTMENU },
  { label: "Specials", link: paths.SPECIALS },
  { label: "Snacks", link: paths.SNACKS },
  { label: "Coupons", link: paths.COUPONS },
  { label: "Distance", link: paths.DISTANCE },
];

function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const open = Boolean(anchorEl);
  const { user, updateUserData } = useAuthContext();
  const { updateSnackBarState } = useSnackBar();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
          updateSnackBarState(true, error.response.data.message, "error");
        }
      });
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      <Box sx={{ marginBottom: "100px" }}>
        <AppBar
          component="nav"
          sx={{ backgroundColor: "white", color: "#038265" }}
        >
          <Toolbar>
            <img
              src="assets/images/output-onlinepngtools (1).png"
              alt="Sindhus-Logo"
              height="50px"
              width="50px"
            />
            <Typography
              sx={{
                padding: "10px",
                fontWeight: 800,
                color: "#038265",
                fontSize: "2rem",
                fontFamily: "Sindhus-Logo-Font",
                cursor: "pointer",
              }}
            >
              SINDHU'S
            </Typography>

            {/* Desktop Menu */}
            <Box
              sx={{
                width: "80%",
                display: { xs: "none", md: "flex" },
                flexGrow: 1,
                justifyContent: "flex-end",
              }}
            >
              {navMenus.map((menu) => (
                <Link
                  key={menu.label}
                  to={menu.link}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    sx={{
                      borderRadius: "50px",
                      fontSize: "large",
                      textTransform: "none",
                      backgroundColor:
                        location.pathname === menu.link
                          ? theme.palette.primary.main
                          : "transparent",
                      color:
                        location.pathname === menu.link ? "white" : "black",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                      px={2}
                    >
                      {menu.label}
                    </Box>
                  </Button>
                </Link>
              ))}
            </Box>

            {/* Mobile Menu - Burger Icon */}
            <Box
              sx={{ display: { xs: "flex", md: "none" }, marginLeft: "auto" }}
            >
              <IconButton onClick={toggleDrawer(true)} color="inherit">
                <MenuIcon />
              </IconButton>
            </Box>

            {user && (
              <Tooltip title="Logout">
                <IconButton
                  onClick={handleMenuClick}
                  size="small"
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar
                    sx={{ width: 28, height: 28, backgroundColor: "#038265" }}
                  >
                    {user?.name ? user.name.toUpperCase()[0] : ""}
                  </Avatar>
                </IconButton>
              </Tooltip>
            )}
          </Toolbar>
        </AppBar>

        {/* Drawer for Mobile Menu */}
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <Box display="flex" justifyContent="flex-end" p={1}>
              <IconButton onClick={toggleDrawer(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <List>
              {navMenus.map((menu) => (
                <ListItem
                  button
                  key={menu.label}
                  component={Link}
                  to={menu.link}
                >
                  <ListItemText primary={menu.label} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
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
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleLogoutClick}>
          <Logout fontSize="small" />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default Navbar;
