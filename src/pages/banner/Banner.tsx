import { useState } from "react";
import {
  Box,
  Button,
  Container,
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
import { useDeleteBanner, useGetBanners } from "../../customRQHooks/Hooks";
import AddIcon from "@mui/icons-material/Add";


function Banner() {
  const { data: responseData } = useGetBanners();
   const deleteBannerMutation = useDeleteBanner();
 const banners =
   responseData && responseData.length > 0 ? responseData[0].data : [];
console.log("data",responseData)

  const [bannerDrawerOpen, setBannerDrawerOpen] = useState(false);
   const [selectedBanner, setSelectedBanner] = useState(null);

 const handleOpenDrawer = () => {
   setSelectedBanner(null);
   setBannerDrawerOpen(true);
 };

  const handleCloseDrawer = () => {
    setBannerDrawerOpen(false);
  };

  const handleSubmit = (data) => {
    handleCloseDrawer();
  };

 const handleEditBanner = (banner) => {
   setSelectedBanner(banner); // Set selectedBanner when editing
   setBannerDrawerOpen(true);
 };
  const handleDeleteBanner = async (id) => {
    try {
      await deleteBannerMutation.mutateAsync(id);
      console.log("Banner deleted successfully");
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between",padding:"10px" }}>
        <Typography variant="h4">Banner</Typography>
        <Button variant="contained" onClick={handleOpenDrawer} sx={{ float: "right" }}>
          <AddIcon /> Add Banner
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
              {banners.length > 0 ? (
                banners.map((banner) => (
                  <TableRow key={banner._id}>
                    <TableCell align="left" sx={{ textAlign: "left" }}>
                      <img src={banner.image} height="100px" width="100px" />
                    </TableCell>
                    <TableCell align="left">{banner.pagetitle}</TableCell>
                    <TableCell align="left">{banner.title}</TableCell>
                    <TableCell align="left">{banner.description}</TableCell>
                    <TableCell align="left">
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <IconButton onClick={() => handleEditBanner(banner)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteBanner(banner._id)}
                        >
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
        selectedBanner={selectedBanner}
      />
    </>
  );
}

export default Banner;


