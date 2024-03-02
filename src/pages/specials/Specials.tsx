import React, { useEffect, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCreateSpecials } from "../../customRQHooks/Hooks";
import imageCompression from "browser-image-compression";

function Specials() {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [images, setImages] = useState<{ images: (string | File)[] }>({
    images: [],
  });

  const createProductSpecial = useCreateSpecials();

  useEffect(() => {
    const storedPreviews = localStorage.getItem("imagePreviews");
    if (storedPreviews) {
      setImagePreviews(JSON.parse(storedPreviews));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("imagePreviews", JSON.stringify(imagePreviews));
  }, [imagePreviews]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;
    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setImagePreviews((prevImages) => [...prevImages, ...urls]);

    if (files) {
      const filesArray: File[] = Array.from(files);
      const validFiles = filesArray.filter(
        (file) =>
          file.type === "image/png" ||
          file.type === "image/jpeg" ||
          file.type === "image/jpg"
      );

      const compressedFiles = await Promise.all(
        validFiles.map((file) => handleCompressFile(file))
      );

      const compressedValidFiles = compressedFiles.filter(
        (compressedFile) => compressedFile !== undefined
      ) as File[];

      setImages((prevProduct) => ({
        ...prevProduct,
        images: [...prevProduct.images, ...compressedValidFiles],
      }));
    } else {
      console.log(
        "Invalid file format. Please select a JPEG or PNG or JPG file."
      );
    }
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    console.log("images", images.images);

    images.images.forEach((image, index) => {
      formData.append(`image_${index}`, image);
    });

    try {
      console.log("formData", formData);
      const response = await createProductSpecial.mutate(formData);
      console.log("Images uploaded successfully", response);
      setImages({ images: [] });
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  async function handleCompressFile(imageFile: File): Promise<File> {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedBlob = await imageCompression(imageFile, options);
      const compressedFile = new File([compressedBlob], imageFile.name, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });

      return compressedFile;
    } catch (error) {
      console.error("Error compressing image:", error);
      throw error; // Rethrow the error to be caught by the caller
    }
  }

  const handleCancel = () => {
    setImagePreviews([]);
    setImages({ images: [] });
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
