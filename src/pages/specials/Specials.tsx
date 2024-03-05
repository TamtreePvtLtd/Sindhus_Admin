import React, { useEffect, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCreateSpecials, useDeleteSpecial, useGetSpecials } from "../../customRQHooks/Hooks";
import DeleteIcon from "@mui/icons-material/Delete";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";


function Specials() {
  // const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const createProductSpecial = useCreateSpecials();
  const deleteSpecial = useDeleteSpecial();
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmationIndex, setDeleteConfirmationIndex] = useState<number | null>(null);

  // getProductSpecial() 
  // const { data } = getProductSpecial()

  const { data:imagePreviews, isLoading } = useGetSpecials()
  console.log('first', imagePreviews)


  // useEffect(() => {
  //   // Retrieve image previews from local storage on component mount
  //   const storedPreviews = localStorage.getItem("imagePreviews");
  //   if (storedPreviews) {
  //     setImagePreviews(JSON.parse(storedPreviews));
  //   }
  // }, []);

  useEffect(() => {
    // Save image previews to local storage whenever it changes
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
          const preview = URL.createObjectURL(file); // Generate preview URL
          previews.push(preview);
        }

        // setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
        setImages((prevImages) => [...prevImages, ...imageFiles]);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const handleSave = async () => {
    try {
      if (images.length > 0) {
        const imageData = images.map((image) => ({
          data: URL.createObjectURL(image),
        }));

        await createProductSpecial.mutateAsync({ images: imageData });

        console.log("Images uploaded successfully");

        setImages([]);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };
  const handleMouseEnter = (index: number) => {
    setDeleteIndex(index);
  };

  const handleMouseLeave = () => {
    setDeleteIndex(null);
  };

   const handleDelete = (index: number) => {

    console.log("handleDelete => ", index)
    //  const updatedPreviews = [...imagePreviews];
    //  updatedPreviews.splice(index, 1);
    //  setImagePreviews(updatedPreviews);

    //  const updatedImages = [...images];
    //  updatedImages.splice(index, 1);
    //  setImages(updatedImages);

    console.log('first s', deleteSpecial)
     deleteSpecial.mutate({ id: index })
   };
//   const deleteSpecialMutation = deleteSpecial.mutate;

// const handleDelete = async (index: number) => {
//   try {
//     const specialIdToDelete = /* Extract the specialId from your data structure */;

//     // Assuming deleteSpecialMutation takes a parameter for deletion of type ISpecial
//     deleteSpecialMutation({ specialId: specialIdToDelete });
    
//     // ... rest of the function remains the same ...
//   } catch (error) {
//     console.error("Error deleting image:", error);
//   }
  // };
  
  //  Function to open the dialog
  const openDeleteDialog = (index: string) => {
    setDeleteConfirmationIndex(index);
    setOpenDialog(true);
  };

  // Function to close the dialog
  const closeDeleteDialog = () => {
    setDeleteConfirmationIndex(null);
    setOpenDialog(false);
  };

  return (
    <>
      <Container>
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            mt: 5,
          }}
        >
          <Typography variant="h4" gutterBottom component="div">
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
            {!isLoading && imagePreviews?.data && imagePreviews?.data.map((preview, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  mr: 2,
                  mb: 2,
                  display: "inline-block",
                }}
                onMouseEnter={() => handleMouseEnter(preview._id)}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={preview.images[0]}
                  alt={`Preview ${preview._id}`}
                  style={{ width: 100, height: 100, objectFit: "cover" }}
                />
                {deleteIndex === preview._id && (
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
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            style={{ marginRight: "8px" }}
          >
            Save
          </Button>
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
