import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import theme from "../theme/theme";
import AddIcon from "@mui/icons-material/Add";
import { useCreateSpecials } from "../customRQHooks/Hooks";

function SpecialsDrawer({ open, onClose }) {
  const [specialData, setSpecialData] = useState({
    title: "",
    description: "",
    images: [],
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const createProductSpecial = useCreateSpecials();

  const handleInputChange = (field, value) => {
    setSpecialData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

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
      onClose();
    } catch (error) {
      console.error("Error uploading images:", error);
    }
    };
    
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

      localStorage.setItem("imagePreviews", JSON.stringify(imagePreview));
    }, [imagePreview]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Add Special</Typography>
        <Divider sx={{ my: 2 }} />
        <TextField
          label="Title"
          variant="outlined"
          value={specialData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          variant="outlined"
          value={specialData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          multiline
          fullWidth
          rows={4}
          sx={{ mb: 2 }}
        />
        <Button
          component="label"
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{ color: theme.palette.primary.main }}
        >
          Upload Images
          <input
            type="file"
            style={{ display: "none" }}
            onChange={handleImageChange}
            multiple
          />
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          fullWidth
          sx={{ mt: 2 }}
        >
          Save Special
        </Button>
      </Box>
    </Drawer>
  );
}

export default SpecialsDrawer;
