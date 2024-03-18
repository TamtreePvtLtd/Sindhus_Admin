import React, { useEffect, useState } from "react";
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
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import { useGetSpecials, useDeleteSpecial } from "../../customRQHooks/Hooks";
import CommonDeleteDialog from "../../common/components/CommonDeleteDialog";
import SpecialsDrawer from "../../pageDrawers/SpecialsDrawer";

function SpecialsPage() {
  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmationIndex, setDeleteConfirmationIndex] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [fullscreenImageOpen, setFullscreenImageOpen] = useState(false);
  const { data: imagePreviews, isLoading, refetch } = useGetSpecials();
  const deleteSpecial = useDeleteSpecial();

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleDeleteDialogOpen = (index) => {
    setDeleteConfirmationIndex(index);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteConfirmationIndex(null);
    setDeleteDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmationIndex !== null) {
      deleteSpecial.mutate({ id: deleteConfirmationIndex });
    }
    handleDeleteDialogClose();
  };

  const handleDeleteAllDialogOpen = () => {
    setDeleteConfirmationIndex(null);
    setDeleteDialogOpen(true);
  };

  const handleDeleteAll = () => {
    setDeleteDialogOpen(false);
    if (imagePreviews?.data) {
      imagePreviews.data.forEach((preview) => {
        deleteSpecial.mutate({ id: preview._id });
      });
    }
    refetch();
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setFullscreenImageOpen(true);
  };

  const handleCloseFullscreenImage = () => {
    setSelectedImage(null);
    setFullscreenImageOpen(false);
  };

  return (
    <Box paddingX={"20px"}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "50px",
          margin: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: "1.3rem",
            borderRadius: "50px",
            fontWeight: 800,
          }}
        >
          Special Offers
        </Typography>

        <Button
          variant="outlined"
          size="small"
          onClick={handleDeleteAllDialogOpen}
          sx={{
            color: "#038265",
          }}
        >
          Delete All
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDrawerOpen}
          sx={{
            alignSelf: "flex-end",
          }}
        >
          <AddIcon /> Add Specials
        </Button>
      </Box>

      <Box marginTop="5px">
        <TableContainer style={{ overflowX: "auto" }}>
          <Table aria-label="simple-table">
            <TableHead
              sx={{
                backgroundColor: "#038265",
                color: "white",
                position: "sticky",
                top: 0,
                zIndex: 99,
              }}
            >
              <TableRow>
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
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{
                      backgroundColor: "#038265",
                      color: "white",
                    }}
                  >
                    Image
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ backgroundColor: "#038265", color: "white" }}
                  >
                    Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ backgroundColor: "#038265", color: "white" }}
                  >
                    Created At
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ backgroundColor: "#038265", color: "white" }}
                  >
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {!isLoading &&
                imagePreviews?.data &&
                imagePreviews?.data.map((preview, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <img
                        src={preview.images[0]}
                        alt={`Preview ${preview._id}`}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={() => handleImageClick(preview.images[0])}
                      />
                    </TableCell>
                    <TableCell>{preview.name}</TableCell>
                    <TableCell>
                      {new Date(preview.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleDeleteDialogOpen(preview._id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <CommonDeleteDialog
        dialogOpen={deleteDialogOpen}
        onDialogclose={handleDeleteDialogClose}
        onDelete={
          deleteConfirmationIndex !== null ? handleDelete : handleDeleteAll
        }
        title={
          deleteConfirmationIndex !== null
            ? "Delete Confirmation"
            : "Delete All Confirmation"
        }
        content={
          deleteConfirmationIndex !== null
            ? "Are you sure you want to delete the uploaded image?"
            : "Are you sure you want to delete all uploaded Special Offers"
        }
      />

      <SpecialsDrawer
        open={openDrawer}
        onClose={handleDrawerClose}
        isAdd={false}
      />
      <Box>
        <Box>
          {fullscreenImageOpen && (
            <div
              className="fullscreen-overlay"
              onClick={handleCloseFullscreenImage}
            >
              <img
                src={selectedImage}
                alt="Full screen"
                className="fullscreen-image"
              />
            </div>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default SpecialsPage;
