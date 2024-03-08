import React, { useEffect, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  useCreateSpecials,
  useDeleteSpecial,
  useGetSpecials,
} from "../../customRQHooks/Hooks";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";


function Specials() {
  const theme = useTheme();
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const createProductSpecial = useCreateSpecials();
  const deleteSpecial = useDeleteSpecial();
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmationIndex, setDeleteConfirmationIndex] = useState<
    number | null
  >(null);

  let { data: imagePreviews, isLoading } = useGetSpecials();

  useEffect(() => {
    let storedPreviews = localStorage.getItem("imagePreviews");
    if (storedPreviews) {
      try {
        const parsedPreviews = JSON.parse(storedPreviews);
        setImagePreview(parsedPreviews.data);
      } catch (error) {
        console.error("Error parsing stored previews:", error);
      }
    } else {
      setImagePreview([]);
      console.log("No stored previews found in localStorage.");
    }
  }, []);

  useEffect(() => {
    setImagePreview([]);

    localStorage.setItem("imagePreviews", JSON.stringify(imagePreviews));
  }, [imagePreviews]);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const files: FileList | null = event.target.files;

      if (files) {
        const imageFiles: File[] = Array.from(files);
        const previews: string[] = [];

        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const preview = URL.createObjectURL(file);
          previews.push(preview);
        }

        setImagePreview((prevPreviews) => [...prevPreviews, ...previews]);
        setImages((prevImages) => [...prevImages, ...imageFiles]);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();

    images.forEach((image, index) => {
      formData.append(`image_${index}`, image);
    });

    try {
      const response = await createProductSpecial.mutate(formData);
      setImagePreview([]);
      setImages([]);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  // const handleSave = async () => {
  //   try {
  //     if (images.length > 0) {
  //       const imageData = images.map((image) => ({
  //         data: URL.createObjectURL(image),
  //       }));

  //       await createProductSpecial.mutateAsync({ images: imageData });

  //       console.log("Images uploaded successfully");

  //       setImages([]);
  //     }
  //   } catch (error) {
  //     console.error("Error uploading images:", error);
  //   }
  // };
  const handleMouseEnter = (index: number) => {
    setDeleteIndex(index);
  };

  const handleMouseLeave = () => {
    setDeleteIndex(null);
  };

  const handleDelete = (index: number) => {
    deleteSpecial.mutate({ id: index });
  };

  const openDeleteDialog = (index: string) => {
    setDeleteConfirmationIndex(index);
    setOpenDialog(true);
  };

  const closeDeleteDialog = () => {
    setDeleteConfirmationIndex(null);
    setOpenDialog(false);
  };

  return (
    <>
      <Container>
        <Box
          sx={{
            width: '100%',
            textAlign: "center",
            mt: 5,
            justifyContent: 'center'
          }}
        >
          <Typography sx={{
            display: 'flex',
            fontSize: '1.5rem',
            borderRadius: '50px',
            textAlign: 'center',
            width: '25%',
            // backgroundColor: theme.palette.primary.main,
            // color: 'white',
            padding: '10px',
            justifyContent: 'center',
            margin: 'auto',
            mt: 5,
          }}>
            Special Offers
          </Typography>
          <Box sx={{ mt: 5 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<AddIcon />}
            >
              Upload Images
              <input
                type="file"
                style={{ display: "none" }}
                onChange={handleImageChange}
                multiple
              />
            </Button>
          </Box>
          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {imagePreview &&
              imagePreview.map((preview, index) => (
                <Box key={index} sx={{ mr: 2, mb: 2 }}>
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                  />
                </Box>
              ))}
          </Box>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            style={{ marginRight: "8px" }}
          >
            Save
          </Button>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {!isLoading &&
              imagePreviews?.data &&
              imagePreviews?.data.map((preview, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    mr: 2,
                    mb: 2,
                    display: "inline-block",
                  }}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={preview.images[0]}
                    alt={`Preview ${preview._id}`}
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                  />
                  {deleteIndex === index && (
                    <Button
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                      onClick={() => openDeleteDialog(preview._id)}
                      size="small"
                    >
                      <DeleteIcon sx={{ color: "#57ccb5" }} />
                    </Button>
                  )}
                </Box>
              ))}
          </Box>
        </Box>
        {/* Dialog should be outside the loop */}
        <Dialog open={openDialog} onClose={closeDeleteDialog}>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the uploaded image?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (deleteConfirmationIndex !== null) {
                  handleDelete(deleteConfirmationIndex);
                }
                closeDeleteDialog();
              }}
              color="primary"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default Specials;
