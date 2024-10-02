import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import { useForm, Controller } from "react-hook-form";
import { Typography, Box, TextField, Button, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface IProps {
  selectedDistance: { uptoMiles: number; amount: number } | null;
  drawerOpen: boolean;
  handleDrawerClose: () => void;
}

interface IFormInput {
  uptoMiles: number;
  amount: number;
}

const defaultValues = {
  uptoMiles: 0,
  amount: 0,
};

const DistanceDrawer: React.FC<IProps> = (props) => {
  const { selectedDistance, handleDrawerClose, drawerOpen } = props;

  const [isEdit, setIsEdit] = useState(!!selectedDistance);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm<IFormInput>({
    defaultValues,
  });

  // Populate form fields if editing
  useEffect(() => {
    if (selectedDistance) {
      setIsEdit(true);
      setValue("uptoMiles", selectedDistance.uptoMiles);
      setValue("amount", selectedDistance.amount);
    }
  }, [selectedDistance, setValue]);

  // Handle form submission
  const onSubmit = async (data: IFormInput) => {
    console.log(isEdit ? "Editing Distance" : "Adding Distance", data);

    // Logic to save the data goes here (API call or local state update)

    handleDrawerClose();
    reset(defaultValues); // Reset form after submission
  };

  return (
    <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        p={2}
      >
        <Typography variant="h6" fontWeight="700" component="div">
          {isEdit ? "Edit Distance" : "Add Distance"}
        </Typography>
        <CloseIcon
          sx={{ cursor: "pointer" }}
          onClick={() => {
            handleDrawerClose();
            setIsEdit(false);
          }}
        />
      </Box>

      <Divider />
      <Box p={3} width={300} component="form" onSubmit={handleSubmit(onSubmit)}>
        {/* UptoMiles Field */}
        <Box py={1}>
          <Typography variant="subtitle1">Upto Miles *</Typography>
          <Controller
            name="uptoMiles"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                variant="outlined"
                fullWidth
                size="small"
                error={!!errors.uptoMiles}
                helperText={errors.uptoMiles ? "This field is required" : ""}
              />
            )}
            rules={{ required: true }}
          />
        </Box>

        {/* Amount Field */}
        <Box py={1}>
          <Typography variant="subtitle1">Amount *</Typography>
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                variant="outlined"
                fullWidth
                size="small"
                error={!!errors.amount}
                helperText={errors.amount ? "This field is required" : ""}
              />
            )}
            rules={{ required: true }}
          />
        </Box>

        {/* Save Button */}
        <Box py={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {isEdit ? "Save Changes" : "Add Distance"}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default DistanceDrawer;
