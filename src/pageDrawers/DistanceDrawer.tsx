import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import { useForm, Controller } from "react-hook-form";
import { Typography, Box, TextField, Button, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  useCreateDistanceBasedCharge,
  useUpdateDistanceBasedCharge,
} from "../customRQHooks/Hooks";
import { DistanceBasedDeliveryCharge } from "../interface/snacks";

interface IProps {
  selectedDistance: DistanceBasedDeliveryCharge | null;
  drawerOpen: boolean;
  handleDrawerClose: () => void;
  refetch: () => void;
}

const defaultValues: DistanceBasedDeliveryCharge = {
  uptoDistance: "0",
  amount: "0",
};

const DistanceDrawer: React.FC<IProps> = (props) => {
  const { selectedDistance, handleDrawerClose, drawerOpen, refetch } = props;

  const [isEdit, setIsEdit] = useState(!!selectedDistance);

  const createDistanceBasedCharge = useCreateDistanceBasedCharge();
  const distanceUpdateMutation = useUpdateDistanceBasedCharge();

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm<DistanceBasedDeliveryCharge>({
    defaultValues,
  });

  // Populate form fields if editing
  useEffect(() => {
    if (selectedDistance) {
      setIsEdit(!!selectedDistance._id);
      setValue("uptoDistance", selectedDistance.uptoDistance);
      setValue("amount", selectedDistance.amount);
    }
  }, [selectedDistance, setValue]);

  // Handle form submission
  const onSubmit = async (data: DistanceBasedDeliveryCharge) => {
    console.log(isEdit ? "Editing Distance" : "Adding Distance", data);
    const formData = new FormData();
    formData.append("amount", data.amount);
    formData.append("uptoDistance", data.uptoDistance); // Ensure you're using uptoDistance

    if (!isEdit) {
      console.log("formData", formData);

      await createDistanceBasedCharge.mutateAsync(formData, {
        onSuccess: () => {
          handleDrawerClose();
          console.log("Distance charge added successfully");
        },
        onError: (error: any) => {
          console.error(
            "Error creating distance charge:",
            error.response.data.message
          );
        },
      });
      refetch();
    } else {
      formData.append("id", selectedDistance?._id!);
      await distanceUpdateMutation.mutateAsync(formData, {
        onSuccess: () => {
          handleDrawerClose();
          console.log("Distance Based charge updated successfully");
        },
        onError: (error: any) => {
          console.error(
            "Error updating distance charge:",
            error.response.data.message
          );
        },
      });
    }

    reset({ ...defaultValues }); // Reset form after submission
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
        <Box py={1}>
          <Typography variant="subtitle1">Upto Distance *</Typography>
          <Controller
            name="uptoDistance"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                fullWidth
                size="small"
                error={!!errors.uptoDistance}
                helperText={errors.uptoDistance ? "This field is required" : ""}
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
