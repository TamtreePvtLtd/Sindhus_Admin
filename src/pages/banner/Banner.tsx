import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BannerDrawer from "../../pageDrawers/BannerDrawer";
import { useGetBanners } from "../../customRQHooks/Hooks";

function Banner() {
  const { data: banners } = useGetBanners();
  const [bannerDrawerOpen, setBannerDrawerOpen] = useState(false);

  const handleOpenDrawer = () => {
    setBannerDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setBannerDrawerOpen(false);
  };

  const handleSubmit = (data) => {
    handleCloseDrawer();
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4">Banner</Typography>
        <Button onClick={handleOpenDrawer} sx={{ float: "right" }}>
          Add Banner image
        </Button>
      </Box>

      <Box sx={{ py: 2, marginLeft: "40px", marginRight: "40px" }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
          }}
        ></Box>
      </Box>

      <Box mt={2}>
        <TableContainer>
          <Table stickyHeader aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    width: "15%",
                    background: (theme) => theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Image
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    width: "20%",
                    background: (theme) => theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Page Title
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    width: "25%",
                    background: (theme) => theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Banner Title
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    width: "25%",
                    background: (theme) => theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Description
                  </Typography>
                </TableCell>

                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    width: "10%",
                    background: (theme) => theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    align="center"
                  >
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {banners! && banners.length > 0 ? (
                banners!.map((banner) => (
                  <TableRow key={banner._id}>
                    <TableCell align="left" sx={{ textAlign: "left" }}>
                      <img
                        src={banner.image}
                        alt="Banner"
                        height="50px"
                        width="50px"
                      />
                    </TableCell>
                    <TableCell align="left">{banner.pageTitle}</TableCell>
                    <TableCell align="left">{banner.title}</TableCell>
                    <TableCell align="left">{banner.description}</TableCell>
                    <TableCell align="left">
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                        <IconButton>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>No banners found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <BannerDrawer
        bannerDrawerOpen={bannerDrawerOpen}
        onSubmit={handleSubmit}
        handleClose={handleCloseDrawer}
      />
    </>
  );
}

export default Banner;


