  import React, { useEffect, useRef, useState } from "react";
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
    TextField,
    Typography,
  } from "@mui/material";
  import CloseIcon from "@mui/icons-material/Close";
  import { Controller, useForm } from "react-hook-form";
  import { IOptionTypes } from "../interface/types";
  import { MenudrawerWidth } from "../constants/Constants";
  import { createBanner, updateBanner } from "../services/api";
  import AddIcon from "@mui/icons-material/Add";
  import {
    useCreateBanner,
    useUpdateBannerMutation,
  } from "../customRQHooks/Hooks";

  const Bannertitle: IOptionTypes[] = [
    { id: "1", label: "Home", value: "1" },
    { id: "2", label: "MenuCard", value: "2" },
    { id: "3", label: "DiningOut", value: "3" },
    { id: "4", label: "Snacks", value: "4" },
  ];

  const BannerDrawer = ({
    bannerDrawerOpen,
    onSubmit,
    handleClose,
    selectedBanner,
  }) => {
    const [image, setImage] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isEdit, setIsEdit] = useState(selectedBanner);
    const createBannerMutation = useCreateBanner();
    const updateBannerMutation = useUpdateBannerMutation();
    const updateBanner = updateBannerMutation.mutate;


    const {
      control,
      setValue,
      handleSubmit,
      formState: { errors },
      register,
      reset,
    } = useForm();

    const filePosterRef = useRef<HTMLInputElement>(null);

    const handleUploadButtonClick = () => {
      if (filePosterRef.current) {
        filePosterRef.current?.click();
      }
    };

    useEffect(() => {
      // Set initial values for edit mode
      if (selectedBanner) {
        setTitle(selectedBanner.title);
        setDescription(selectedBanner.description);
        setSelectedImage(selectedBanner.image);
        setIsEdit(true); // Set isEdit to true
      } else {
        // Reset fields when not in edit mode
        setTitle("");
        setDescription("");
        setSelectedImage(null);
        setIsEdit(false);
      }
    }, [selectedBanner]);

    useEffect(() => {
      if (selectedBanner && isEdit && Bannertitle) {
        // Make sure Bannertitle is defined before using the find method
        const selectedOption = Bannertitle.find(
          (option) => option.label === selectedBanner.pagetitle
        );
        if (selectedOption) {
          // Set the radio button value to the corresponding option value
          setValue("pagetitle", selectedOption.value);
        }
      }
    }, [selectedBanner, isEdit, Bannertitle, setValue]);

    // const handleRadioChange = (e) => {
    //   setShowAddSubMenu(true);
    //    setSelectedImage(null);
    //   setImage(null);
    //   setTitle("");
    //   setDescription("");
    // };

    const handleImageUpload = async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file = event.target.files?.[0];
      if (file) {
        try {
          setSelectedImage(URL.createObjectURL(file));
          setImage(file);
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("No file selected.");
      }
    };

    // const handleSubmitForm = async (data) => {
    //   try {
    //     const formData = new FormData();
    //     formData.append("pagetitle", data.pagetitle);
    //     formData.append("title", title);
    //     formData.append("description", description);
    //     if (image) {
    //       formData.append("image", image.name);
    //     }

    //     const responseData = await createBanner(formData);
    //     console.log("Banner created successfully:", responseData);

    //      reset({
    //        pagetitle: "", // Reset the radio button selection
    //      });
    //      setTitle(""); // Reset the title state
    //      setDescription(""); // Reset the description state
    //      setImage(null); // Reset the image state
    //      setSelectedImage(null); // Reset the selectedImage state

    //      // Close the drawer
    //      handleClose();
    //   } catch (error) {
    //     // Handle errors, e.g., show error message
    //     // console.error("Error creating banner:", error.message);
    //   }
    // };

    const handleSubmitForm = async (data) => {
      try {
        const formData = new FormData();
         if (data.pagetitle !== undefined) {
           // Only append pagetitle if it exists in the data object
           formData.append("pagetitle", data.pagetitle);
         }
        formData.append("title", title);
        formData.append("description", description);
        if (image) {
          formData.append("image", image);
        }

        let responseData;
        if (selectedBanner) {
          // If selectedBanner exists, update it
          // Call the mutate function without any additional parameters
updateBanner({ id: selectedBanner._id, formData });
        } else {
          responseData = await createBannerMutation.mutate(formData);
          console.log("Banner created successfully:", responseData);
        }

        handleClose(); // Close the drawer after submission
      } catch (error) {
        // Handle errors
        // console.error("Error:", error.message);
      }
    };

    const onSubmitHandler = (data) => {
      handleSubmitForm(data);
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
            {isEdit ? "Edit Banner" : "Add Banner"}
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
                  name="pagetitle"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth>
                      <RadioGroup
                        {...field}
                        row
                        value={
                          field.value ||
                          (selectedBanner ? selectedBanner.pagetitle : "")
                        }
                        onChange={(e) => {
                          field.onChange(e);
                          // handleRadioChange(e);
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

          <Box p={2}>
            <Typography variant="subtitle1" p={1}>
              Upload Image
            </Typography>
            <Button
              variant="outlined"
              onClick={handleUploadButtonClick}
              sx={{ color: "#038265" }}
            >
              <AddIcon />
              Upload Image
            </Button>
            <input
              type="file"
              style={{ display: "none" }}
              ref={filePosterRef}
              onChange={handleImageUpload}
            />

            {selectedImage != null && (
              <img
                src={selectedImage}
                style={{
                  width: "90px",
                  height: "90px",
                }}
              />
            )}
            <Box py={2}>
              <Typography>Title</Typography>
              <TextField
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Box>
            <Box>
              <Typography>Description</Typography>
              <TextField
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Box>
          </Box>
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
        <form
          onSubmit={(e) => {
            handleSubmit(onSubmitHandler)(e);
          }}
        >
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
