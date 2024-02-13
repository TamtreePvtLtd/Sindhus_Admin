import { NavLink as NavLinkBase } from "react-router-dom";
import React from "react";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { paths } from "../routes/Paths";
import { useNavbarStyle } from "../styles/NavbarStyle";

interface INavbarProps {
  onDrawerToggle(): void;
}

const navItems = [
  {
    label: "Catering Enquiries",
    link: paths.CATERINGENQUIRIES,
  },
  {
    label: "Products",
    link: paths.PRODUCTS,
  },
  {
    label: "Menus",
    link: paths.MENUS,
  },
  {
    label: "Daily Menu",
    link: paths.DININGOUTMENU,
  },
  ,
];
function NavbarDrawer(props: INavbarProps) {
  const { onDrawerToggle } = props;

  const classes = useNavbarStyle();

  const NavLink = React.forwardRef(
    (props: any, ref: React.Ref<HTMLAnchorElement> | undefined) => (
      <NavLinkBase
        style={{
          textDecoration: "none",
        }}
        ref={ref}
        {...props}
        className={props.activeclassname ?? ""}
      />
    )
  );
  return (
    <Box sx={{ textAlign: "start", height: "100%" }} onClick={onDrawerToggle}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        my={0}
        padding={3}
        sx={{
          backgroundColor: "#ece7ee",
        }}
      >
        <Typography color="primary" sx={{ fontWeight: 800 }} fontSize={"large"}>
          Sindhu's Kitchen
        </Typography>
        <ArrowBackIosIcon sx={{ fontSize: "large" }} color="primary" />
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item?.label}
            disablePadding
            component={NavLink}
            to={item?.link}
            activeclassname={({ isActive }) =>
              isActive ? classes.activeLink : ""
            }
            sx={{ justifyContent: "center" }}
          >
            <ListItemButton sx={{ borderRadius: "0 10px 10px 0" }}>
              <Box display={"flex"} alignItems={"center"}>
                <ListItemText
                  sx={{
                    textAlign: "start",
                    marginLeft: "8px",
                    color: "primary.main",
                  }}
                  primary={item?.label.trim()}
                />
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default NavbarDrawer;
