import React from "react";
import Drawer from "@mui/material/Drawer";
import { useForm, Controller } from "react-hook-form";
import {
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Button,
} from "@mui/material";

interface IProps {
  menuDrawerOpen: boolean;
  handleMenuDrawerclose: () => void;
}

interface IFormInput {
  couponName: string;
  couponType: string;
  discountAmount: number;
  minAmount: number;
  maxAmount: number;
  availability: boolean;
}

const CouponsDrawer: React.FC<IProps> = (props) => {
  const {
    control,
    handleSubmit,
  } = useForm<IFormInput>({
    defaultValues: {
      couponName: "",
      couponType: "percentage",
      discountAmount: 0,
      minAmount: 0,
      maxAmount: 0,
      availability: true,
    },
  });

  const onSubmit = (data: IFormInput) => {
    console.log(data);
  };

  return (
    <Drawer
      anchor="right"
      open={props.menuDrawerOpen}
      onClose={props.handleMenuDrawerclose}
    >
      <Box p={3} width={300} component="form" onSubmit={handleSubmit(onSubmit)}>
        {/* Coupon Name */}
        <Box py={1}>
          <Typography variant="subtitle1">Coupon Name *</Typography>
          <Controller
            name="couponName"
            control={control}
            render={({ field }) => (
              <TextField {...field} variant="outlined" fullWidth size="small" />
            )}
          />
        </Box>

        {/* Coupon Type (Dropdown) */}
        <Box py={1}>
          <Typography variant="subtitle1">Coupon Type *</Typography>
          <FormControl fullWidth>
            <Controller
              name="couponType"
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="dollar">Dollar</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Box>

        {/* Discount Amount */}
        <Box py={1}>
          <Typography variant="subtitle1">Discount Amount *</Typography>
          <Controller
            name="discountAmount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                variant="outlined"
                fullWidth
                size="small"
              />
            )}
          />
        </Box>

        {/* Minimum Amount */}
        <Box py={1}>
          <Typography variant="subtitle1">Minimum Amount *</Typography>
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
              />
            )}
          />
        </Box>

        {/* Maximum Amount */}
        <Box py={1}>
          <Typography variant="subtitle1">Maximum Amount *</Typography>
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
              <Switch {...field} color="primary" />
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
