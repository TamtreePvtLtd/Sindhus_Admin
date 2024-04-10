import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import { IOptionTypes } from "../interface/types";
import { MenudrawerWidth } from "../constants/Constants";

const Bannertitle: IOptionTypes[] = [
  { id: "1", label: "Home", value: "1" },
  { id: "2", label: "MenuCard", value: "2" },
  { id: "3", label: "DiningOut", value: "3" },
  { id: "4", label: "Snacks", value: "4" },
];

const BannerDrawer = ({ bannerDrawerOpen, onSubmit, handleClose }) => {
  const [showAddSubMenu, setShowAddSubMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const drawer = (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        p={2}
      >
        <Typography variant="h6" fontWeight="700" component="div">
          Banner
        </Typography>
        <CloseIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
      </Box>

      <Divider />
      <Container>
        <Grid container>
          <Grid item xs={12} p={2}>
            <Box pt={2}>
              <Typography variant="subtitle1">Banner Title *</Typography>
              <Controller
                name="Bannertitle"
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth>
                    <RadioGroup
                      {...field}
                      row
                      onChange={(e) => {
                        field.onChange(e);
                        setShowAddSubMenu(true);
                      }}
                    >
                      {Bannertitle.map((option) => (
                        <FormControlLabel
                          key={option.id}
                          value={option.value}
                          control={<Radio />}
                          label={option.label}
                        />
                      ))}
                    </RadioGroup>
                    <FormHelperText error>
                      {/* {errors.Bannertitle?.message} */}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </Box>
          </Grid>
        </Grid>
        <Divider />
        {showAddSubMenu && (
          <Box p={2}>
            <Typography variant="subtitle1">Upload Image</Typography>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {selectedImage && (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Uploaded"
                style={{ maxWidth: "20%", marginTop: "10px" }}
              />
            )}
          </Box>
        )}
      </Container>
    </Box>
  );

  return (
    <Drawer
      open={bannerDrawerOpen}
      anchor="right"
      sx={{
        "& .MuiDrawer-paper": {
          width: MenudrawerWidth,
        },
      }}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {drawer}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            padding: "10px",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              color: "#038265",
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              "&:hover": {
                backgroundColor: "#038265",
              },
            }}
          >
            Save
          </Button>
        </Box>
      </form>
    </Drawer>
  );
};

export default BannerDrawer;
