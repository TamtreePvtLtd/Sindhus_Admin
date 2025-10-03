// OrderDetailsDrawer.tsx
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { PDFDownloadLink, BlobProviderParams } from "@react-pdf/renderer";
import CloseIcon from "@mui/icons-material/Close";

import { useState } from "react";
import { PaymentData } from "../interface/snacks";
import PDFBill from "../common/components/PDFBill";


interface OrderDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  payment: PaymentData;
  filteredCartItems: any[];
}

const OrderDetailsDrawer = ({
  open,
  onClose,
  payment,
  filteredCartItems,
}: OrderDetailsDrawerProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate saving process
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          minHeight: "80vh",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle>
        Order Details - #{payment.orderNumber}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            Customer Information
          </Typography>
          <Typography>
            <strong>Name:</strong> {payment.firstName} {payment.lastName}
          </Typography>
          <Typography>
            <strong>Email:</strong> {payment.email}
          </Typography>
          <Typography>
            <strong>Phone:</strong> {payment.phoneNumber}
          </Typography>
          <Typography>
            <strong>Delivery Option:</strong> {payment.deliveryOption}
          </Typography>
          {payment.deliveryOption !== "Pickup" && (
            <>
              <Typography>
                <strong>Address:</strong> {payment.address}
              </Typography>
              <Typography>
                <strong>Postal Code:</strong> {payment.postalCode}
              </Typography>
              <Typography>
                <strong>Location URL:</strong>{" "}
                <a
                  href={payment.addressURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {payment.addressURL}
                </a>
              </Typography>
            </>
          )}
          <Typography>
            <strong>Notes:</strong> {payment.notes || "N/A"}
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            Order Information
          </Typography>
          <Typography>
            <strong>Order Date:</strong>{" "}
            {new Date(payment.createdAt).toLocaleDateString()}
          </Typography>
          <Typography>
            <strong>Delivery Date:</strong>{" "}
            {new Date(payment.deliveryDate).toLocaleDateString()}
          </Typography>
          <Typography>
            <strong>Coupon Applied:</strong> {payment.couponName || "None"}
          </Typography>
          <Typography>
            <strong>Total Before Coupon:</strong> $
            {Number(payment.totalWithoutCoupon).toFixed(2)}
          </Typography>
          <Typography>
            <strong>Total After Coupon:</strong> $
            {Number(payment.amount / 100).toFixed(2)}
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            Order Items
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCartItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      ${item.price.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <PDFDownloadLink
          document={
            <PDFBill payment={payment} filteredCartItems={filteredCartItems} />
          }
          fileName={`invoice_${payment.orderNumber}.pdf`}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            Print Order
          </Button>
        </PDFDownloadLink>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDrawer;
