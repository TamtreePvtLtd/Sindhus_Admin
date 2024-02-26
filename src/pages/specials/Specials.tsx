

import React, { useEffect, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {  useCreateSpecials } from "../../customRQHooks/Hooks";


function Specials() {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const createProductSpecial = useCreateSpecials();
   useEffect(() => {
     // Retrieve image previews from local storage on component mount
     const storedPreviews = localStorage.getItem("imagePreviews");
     if (storedPreviews) {
       setImagePreviews(JSON.parse(storedPreviews));
     }
   }, []);

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

        setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
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

  const handleCancel = () => {
    setImagePreviews([]);
    setImages([]);
  };
  console.log("imagePreviews", imagePreviews);

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
            {imagePreviews.map((preview, index) => (
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
          <Button
            onClick={handleCancel}
            variant="contained"
            color="primary"
            style={{ marginRight: "8px" }}
          >
            Cancel
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default Specials;
