import React, { useState, useEffect } from "react";  // Import useEffect
import Drawer from "@mui/material/Drawer";
import { useForm, Controller } from "react-hook-form";
import {
  Typography,
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Switch,
  Button,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import { ICoupen } from "../interface/menus";
import { useCreateCoupen, useUpdateCoupen } from "../customRQHooks/Hooks";

interface IProps {
  selectedCoupen: ICoupen | null;
  menuDrawerOpen: boolean;
  handleCoupenDrawerclose: () => void;
}

interface IFormInput {
  coupenName: string;
  coupenType: string;
  discountAmount: number;
  minAmount: number;
  maxAmount: number;
  availability: string;
}

const defaultValues = {
  coupenName: "",
  coupenType: "percentage",
  discountAmount: 0,
  minAmount: 0,
  maxAmount: 0,
  availability: "true",
} as ICoupen;


const CouponsDrawer: React.FC<IProps> = (props) => {
  const { selectedCoupen, handleCoupenDrawerclose, menuDrawerOpen } = props;

  const [isEdit, setIsEdit] = useState(!!selectedCoupen);

  // Initialize form with useForm hook
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    getValues,
    setValue,  
    watch,
  } = useForm<IFormInput>({
    defaultValues: {
      coupenName: "",
      coupenType: "percentage",
      discountAmount: 0,
      minAmount: 0,
      maxAmount: 0,
      availability: "true",
    },
  });

  const createCoupenMutation = useCreateCoupen();
  const coupenUpdateMutation = useUpdateCoupen();

  const coupenType = watch("coupenType");


  // Populate the form if editing
  useEffect(() => {
    if (selectedCoupen && selectedCoupen._id) {
      setIsEdit(!!selectedCoupen._id);
      setValue("coupenName", selectedCoupen.coupenName);
      setValue("coupenType", selectedCoupen.coupenType);
      setValue("discountAmount", selectedCoupen.discountAmount);
      setValue("minAmount", selectedCoupen.minAmount);
      setValue("maxAmount", selectedCoupen.maxAmount);
      setValue("availability", selectedCoupen.availability);
    }
  }, [selectedCoupen, setValue]);

  // Handle form submission
  const onSubmit = async (data: IFormInput) => {
    try {
      const formData = new FormData();
      formData.append("coupenName", data.coupenName);
      formData.append("coupenType", data.coupenType);
      formData.append("discountAmount", data.discountAmount.toString());
      formData.append("minAmount", data.minAmount.toString());
      formData.append("maxAmount", data.maxAmount.toString());
      formData.append("availability", data.availability.toString());

console.log("formData",formData);
      if (!isEdit) {

        await createCoupenMutation.mutateAsync(formData, {
          onSuccess: () => {
            handleCoupenDrawerclose();
            console.log("Coupon added successfully");
          },
          onError: (error: any) => {
            console.error("Error creating coupon:", error.response.data.message);
          },
        });
      } else {
        formData.append("id", selectedCoupen?._id!);
        await coupenUpdateMutation.mutateAsync(formData, {
          onSuccess: () => {
            handleCoupenDrawerclose();
            console.log("Coupon updated successfully");
          },
          onError: (error: any) => {
            console.error("Error updating coupon:", error.response.data.message);
          },
        });
      }
      reset({ ...defaultValues });

    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={menuDrawerOpen}
      onClose={handleCoupenDrawerclose}
    >
            <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        p={2}
      >
        <Typography variant="h6" fontWeight="700" component="div">
          {isEdit ? "Edit Coupon" : "Add Coupon"}
        </Typography>
        <CloseIcon
          sx={{ cursor: "pointer" }}
          onClick={() => {
            handleCoupenDrawerclose();
            setIsEdit(false);
          }}
        />
      </Box>

      <Divider />
      <Box p={3} width={300} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box py={1}>
          <Typography variant="subtitle1">Coupon Code *</Typography>
          <Controller
            name="coupenName"
            control={control}
            render={({ field }) => (
              <TextField variant="outlined" fullWidth size="small" 
              {...register("coupenName")}
              error={!!errors.coupenName}
              helperText={errors.coupenName?.message}
              />
            )}
          />
        </Box>

        {/* Coupon Type (Dropdown) */}
        <Box py={1}>
          <Typography variant="subtitle1">Coupon Type *</Typography>
          <FormControl fullWidth>
            <Controller
              name="coupenType"
              control={control}
              render={({ field }) => (
                <Select {...field} value={getValues("coupenType")}> {/* Ensure value is set */}
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="fixedAmount">Fixed Amount</MenuItem>
                </Select>              )}
            />
          </FormControl>
        </Box>

        {/* Discount Amount */}
        <Box py={1}>
          <Typography variant="subtitle1">Discount Value *</Typography>
          <Controller
            name="discountAmount"
            control={control}
            render={({ field }) => (
              <TextField
                type="number"
                variant="outlined"
                fullWidth
                size="small"
                {...register("discountAmount", {
                  required: "Discount amount is required",
                  validate: (value) =>
                    coupenType === "percentage" && value > 100
                      ? "Percentage discount cannot exceed 100"
                      : true,
                })}
                error={!!errors.discountAmount}
                helperText={errors.discountAmount?.message}
              />
            )}
          />
        </Box>

        {/* Minimum Amount */}
        <Box py={1}>
          <Typography variant="subtitle1">Minimum Purchase *</Typography>
          <Controller
            name="minAmount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                variant="outlined"
                fullWidth
                size="small"
                {...register("minAmount")}
                error={!!errors.minAmount}
                helperText={errors.minAmount?.message}

              />
            )}
          />
        </Box>

        {/* Maximum Amount */}
        <Box py={1}>
          <Typography variant="subtitle1">Maximum Discount *</Typography>
          <Controller
            name="maxAmount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                variant="outlined"
                fullWidth
                size="small"
                {...register("maxAmount")}
                error={!!errors.maxAmount}
                helperText={errors.maxAmount?.message}

              />
            )}
          />
        </Box>

        {/* Availability (Switch) */}
        <Box py={1} display="flex" alignItems="center">
          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
            Availability
          </Typography>
          <Controller
            name="availability"
            control={control}
            render={({ field }) => (
              <Switch {...field} color="primary" checked={!!getValues("availability")}
              /> // Set checked prop based on availability
            )}
          />
        </Box>

        <Box py={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Save Coupon
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CouponsDrawer;
