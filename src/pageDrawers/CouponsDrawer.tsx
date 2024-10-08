import React, { useState, useEffect } from "react"; // Import useEffect
import Drawer from "@mui/material/Drawer";
import { useForm, Controller } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import { parseISO } from "date-fns";
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
import {
  useCreateCoupen,
  useGetAllCoupens,
  useUpdateCoupen,
} from "../customRQHooks/Hooks";

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
  availability: boolean;
  startDateWithTime: Date;
  endDateWithTime: Date;
}

const defaultValues = {
  coupenName: "",
  coupenType: "percentage",
  discountAmount: 0,
  minAmount: 0,
  maxAmount: 0,
  availability: true,
} as ICoupen;

const CouponsDrawer: React.FC<IProps> = (props) => {
  const { selectedCoupen, handleCoupenDrawerclose, menuDrawerOpen } = props;
  console.log("selectedCoupen", selectedCoupen);

  const [isEdit, setIsEdit] = useState(!!selectedCoupen);

  const { data: coupens, refetch } = useGetAllCoupens();

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    getValues,
    setValue,
    watch,
    setError,
  } = useForm<IFormInput>({
    defaultValues: {
      coupenName: "",
      coupenType: "percentage",
      discountAmount: 0,
      minAmount: 0,
      maxAmount: 0,
      availability: true,
      startDateWithTime: selectedCoupen?.startDateWithTime || "",
      endDateWithTime: selectedCoupen?.endDateWithTime || "",
    },
    mode: "onSubmit", // Validate only on submit
    reValidateMode: "onChange",
  });

  const createCoupenMutation = useCreateCoupen();
  const coupenUpdateMutation = useUpdateCoupen();

  const coupenType = watch("coupenType");

  // Handle form submission
  const onSubmit = async (data: IFormInput) => {
    try {
      // Check for duplicate coupon name
      const duplicateCoupon = coupens?.items.find(
        (coupon: ICoupen) =>
          coupon.coupenName.toLowerCase() === data.coupenName.toLowerCase()
      );

      if (
        duplicateCoupon &&
        (!isEdit || duplicateCoupon._id !== selectedCoupen?._id)
      ) {
        setError("coupenName", {
          type: "manual",
          message: `"${data.coupenName}" already exists!`,
        });
        return;
      }

      const formData = new FormData();
      formData.append("coupenName", data.coupenName);
      formData.append("coupenType", data.coupenType);
      formData.append("discountAmount", data.discountAmount.toString());
      formData.append("minAmount", data.minAmount.toString());
      formData.append("maxAmount", data.maxAmount.toString());
      formData.append("availability", data.availability.toString());
      formData.append(
        "startDateWithTime",
        format(new Date(data.startDateWithTime), "MM/dd/yyyy HH:mm:ss")
      );
      formData.append(
        "endDateWithTime",
        format(new Date(data.endDateWithTime), "MM/dd/yyyy HH:mm:ss")
      );

      if (!isEdit) {
        await createCoupenMutation.mutateAsync(formData, {
          onSuccess: () => {
            handleCoupenDrawerclose();
            refetch();
            console.log("Coupon added successfully");
          },
          onError: (error: any) => {
            console.error(
              "Error creating coupon:",
              error.response.data.message
            );
          },
        });
      } else {
        formData.append("id", selectedCoupen?._id!);
        await coupenUpdateMutation.mutateAsync(formData, {
          onSuccess: () => {
            handleCoupenDrawerclose();
            refetch();
            console.log("Coupon updated successfully");
          },
          onError: (error: any) => {
            console.error(
              "Error updating coupon:",
              error.response.data.message
            );
          },
        });
      }

      reset({ ...defaultValues });
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

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

      // Correct date parsing
      if (selectedCoupen.startDateWithTime) {
        setValue(
          "startDateWithTime",
          new Date(selectedCoupen.startDateWithTime)
        );
      }
      if (selectedCoupen.endDateWithTime) {
        setValue("endDateWithTime", new Date(selectedCoupen.endDateWithTime));
      }
    }
  }, [selectedCoupen, setValue]);

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
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                {...field}
                {...register("coupenName", {
                  required: "Coupon code is required",
                })}
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
                <Select {...field} value={getValues("coupenType")}>
                  <MenuItem value="Percentage">Percentage</MenuItem>
                  <MenuItem value="Amount">Amount</MenuItem>
                </Select>
              )}
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
                // type="number"
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
                // type="number"
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
                // type="number"
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

        {/* <Box py={1}>
        
          <Controller
            name="startDateWithTime"
            control={control}
            rules={{ required: "Start Date & Time is required" }}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  {...field}
                  label="Start Date & Time"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={!!errors.startDateWithTime}
                      helperText={errors.startDateWithTime?.message}
                    />
                  )}
                />
              </LocalizationProvider>
            )}
          />
        </Box> */}
        <Box py={1}>
          <Controller
            name="startDateWithTime"
            control={control}
            rules={{ required: "Start Date & Time is required" }}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  {...field}
                  label="Start Date & Time"
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      fullWidth: true,
                      size: "small",
                      error: !!errors.startDateWithTime,
                      helperText: errors.startDateWithTime
                        ? errors.startDateWithTime.message
                        : "",
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />
        </Box>

        {/* End Date and Time Picker */}
        <Box py={1}>
          <Controller
            name="endDateWithTime"
            control={control}
            rules={{ required: "End Date & Time is required" }}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  {...field}
                  label="End Date & Time"
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      fullWidth: true,
                      size: "small",
                      error: !!errors.endDateWithTime,
                      helperText: errors.endDateWithTime
                        ? errors.endDateWithTime.message
                        : "",
                    },
                  }}
                />
              </LocalizationProvider>
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
              <Switch
                {...field}
                color="primary"
                checked={!!getValues("availability")}
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
