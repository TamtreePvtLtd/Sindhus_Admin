import {
  Box,
  Button,
  Divider,
  Drawer,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react"; // Import useEffect for handling side effects
import { PaymentData } from "../interface/snacks";
import { useUpdatePaymentData } from "../customRQHooks/Hooks";
import { useSnackBar } from "../context/SnackBarContext";

interface IProps {
  selectedPaymentData?: PaymentData | null;
  menuDrawerOpen: boolean;
  handleDrawerclose: () => void;
  refetch: () => void;
}

const SnacksDrawer = (props: IProps) => {
  const { handleDrawerclose, menuDrawerOpen, selectedPaymentData, refetch } =
    props;
  const updatePaymentMutation = useUpdatePaymentData();
  const { updateSnackBarState } = useSnackBar();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentData>({
    defaultValues: {
      email: selectedPaymentData?.email,
      phoneNumber: selectedPaymentData?.phoneNumber,
    },
  });

  // Update form values when selectedPaymentData changes
  useEffect(() => {
    if (selectedPaymentData) {
      setValue("email", selectedPaymentData.email);
      setValue("phoneNumber", selectedPaymentData.phoneNumber);
    }
  }, [selectedPaymentData, setValue]);

  const onSubmit = async (data: PaymentData) => {
    console.log("data", data);

    try {
      await updatePaymentMutation.mutateAsync({
        orderNumber: selectedPaymentData?.orderNumber,
        data: {
          ...selectedPaymentData,
          email: data.email,
          phoneNumber: data.phoneNumber,
        },
      });
      handleDrawerclose();
      updateSnackBarState(true, "Order Item updated successfully.", "success");
      refetch();
    } catch (error) {
      updateSnackBarState(true, "Failed to update delivery status.", "error");
    }
  };

  return (
    <Drawer anchor="right" open={menuDrawerOpen} onClose={handleDrawerclose}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        p={2}
      >
        <Typography variant="h6" fontWeight="700" component="div">
          {"Edit Payment"}
        </Typography>
        <CloseIcon
          sx={{ cursor: "pointer" }}
          onClick={() => {
            handleDrawerclose();
          }}
        />
      </Box>

      <Divider />
      <Box p={3} width={300} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box py={1}>
          <Typography variant="subtitle1">Email *</Typography>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                {...field}
                {...register("email", {
                  required: "email is required",
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
        </Box>

        {/* Phone Number */}
        <Box py={1}>
          <Typography variant="subtitle1">Phone Number *</Typography>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <TextField
                type="string"
                variant="outlined"
                fullWidth
                size="small"
                {...register("phoneNumber", {
                  required: "phoneNumber is required",
                })}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
            )}
          />
        </Box>

        <Box py={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Save
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SnacksDrawer;
