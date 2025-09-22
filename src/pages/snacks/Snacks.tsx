import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  SaveAlt,
  Delete,
  LocalShipping,
  Visibility,
} from "@mui/icons-material";
import { useSnackBar } from "../../context/SnackBarContext";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { cartItems, DownloadData, PaymentData } from "../../interface/snacks";
import { Edit, MailOutline } from "@mui/icons-material";
import {
  useDeleteDeliveredPayment,
  useDeleteOrder,
  useGetCartItems,
  useGetPayment,
  useUpdateDeliveryStatus,
  useUpdateShipment,
} from "../../customRQHooks/Hooks";
import SnacksDrawer from "../../pageDrawers/Snacks";
import { getResendMailItems } from "../../services/api";
import logo from "../../../public/assets/images/output-onlinepngtools (1).png";

import PaginatedHeader from "../../common/components/PaginatedHeader";
import OrderDetailsDrawer from "../../pageDrawers/OrderDetailsDrawer";



function Snacks() {
  const [paymentData, setPaymentData] = useState<PaymentData[]>([]);
  const [cartItemData, setCartItemData] = useState<cartItems[]>([]);
  const [orderNumberFilter, setOrderNumberFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [titleFilter, setTitleFilter] = useState("");
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState("all");
  const { updateSnackBarState } = useSnackBar();
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(
    null
  );
  const [DrawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const updatemutation = useUpdateDeliveryStatus();
  const deleteOrderMutation = useDeleteOrder();
  const deletePaymentMutation = useDeleteDeliveredPayment();
  const updateShipment = useUpdateShipment();

  const { data: cartItem, refetch: cartItemrefetch } = useGetCartItems();
  const { data: paymentItem, refetch: paymentRefetch } = useGetPayment();
  const [shipmentDialogOpen, setShipmentDialogOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [currentOrder, setCurrentOrder] = useState<PaymentData | null>(null);
  const [trackingNumberError, setTrackingNumberError] = useState(false);
  const [trackingUrlError, setTrackingUrlError] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<{
    payment: PaymentData;
    filteredCartItems: any[];
  } | null>(null);

  useEffect(() => {
    if (cartItem) {
      setCartItemData(cartItem);
    }
  }, [cartItem]);

  useEffect(() => {
    if (paymentItem) setPaymentData(paymentItem);
  }, [paymentItem]);

  const handleOpenShipmentDialog = (payment: PaymentData) => {
    setCurrentOrder(payment);
    setTrackingNumber(payment.trackingNumber || "");
    setTrackingUrl(payment.trackingUrl || "");
    setShipmentDialogOpen(true);
  };

  const handleCloseShipmentDialog = () => {
    setShipmentDialogOpen(false);
  };

  const handleSendShipment = async () => {
    setTrackingNumberError(false);
    setTrackingUrlError(false);

    let hasError = false;

    if (!trackingNumber.trim()) {
      setTrackingNumberError(true);
      hasError = true;
    }
    if (!trackingUrl.trim()) {
      setTrackingUrlError(true);
      hasError = true;
    }

    if (hasError) return;
    try {
      await updateShipment.mutateAsync({
        orderNumber: currentOrder?.orderNumber,
        trackingNumber,
        trackingUrl,
        firstName: currentOrder?.firstName,
        email: currentOrder?.email,
      });

      updateSnackBarState(true, "Shipment details sent & saved!", "success");
      paymentRefetch();
      setShipmentDialogOpen(false);
    } catch (err) {
      updateSnackBarState(true, "Failed to send shipment details", "error");
    }
  };

  useEffect(() => {
    if (cartItem) {
      setCartItemData(cartItem);
    }
  }, [cartItem]);

  useEffect(() => {
    if (paymentItem) {
      setPaymentData(paymentItem);
    }
  }, [paymentItem]);

  const handleDrawerclose = () => {
    setDrawerOpen(false);
  };

  const handleDetailsDrawerClose = () => {
    setDetailsDrawerOpen(false);
    setSelectedOrderDetails(null);
  };

  const handleEditClick = (payment: PaymentData) => {
    setSelectedPayment({ ...payment });
    setDrawerOpen(true);
  };

  const handleShowDetails = (
    payment: PaymentData,
    filteredCartItems: any[]
  ) => {
    setSelectedOrderDetails({
      payment,
      filteredCartItems,
    });
    setDetailsDrawerOpen(true);
  };

  const handleSwitchChange = async (orderNumber, cartItem) => {
    console.log("deliveredStatus", cartItem.deliveredStatus);

    const updatedDeliveredStatus =
      cartItem.deliveredStatus == "true" ? "false" : "true";

    try {
      await updatemutation.mutateAsync({
        orderNumber,
        deliveredStatus: updatedDeliveredStatus,
      });

      updateSnackBarState(
        true,
        "Delivery status updated successfully.",
        "success"
      );
      cartItemrefetch();
    } catch (error) {
      updateSnackBarState(true, "Failed to update delivery status.", "error");
    }
  };

  const handleDelete = async (orderNumber) => {
    await deleteOrderMutation.mutateAsync(orderNumber, {
      onSuccess: () => {
        updateSnackBarState(
          true,
          "Order Item and payment removed successfully.",
          "success"
        );
      },
      onError: () => {
        updateSnackBarState(true, "Error while remove Order Item .", "error");
      },
    });
    await deletePaymentMutation.mutateAsync(orderNumber);
    cartItemrefetch();
    paymentRefetch();
  };

  const handleExcelDownload = () => {
    const dataToDownload: DownloadData[] = [];

    filteredPayments.forEach((payment) => {
      const matchingCart = cartItemData.find(
        (cart) => cart.orderNumber === payment.orderNumber
      );

      const filteredCartItems = matchingCart?.cartItems.filter((item) =>
        item.title.toLowerCase().includes(titleFilter.toLowerCase())
      );

      const deliveryStatusMatches =
        deliveryStatusFilter === "all" ||
        (deliveryStatusFilter === "delivered" &&
          matchingCart?.deliveredStatus === "true") ||
        (deliveryStatusFilter === "pending" &&
          matchingCart?.deliveredStatus === "false");

      if (!deliveryStatusMatches) return;

      let firstItemForOrder = true;

      filteredCartItems?.forEach((item) => {
        dataToDownload.push({
          Name: firstItemForOrder
            ? `${payment.firstName} ${payment.lastName}`
            : "",
          "Order Number": firstItemForOrder ? payment.orderNumber : "",
          Address: firstItemForOrder
            ? `${payment.address}, ${payment.postalCode}`
            : "",
          "Phone Number": firstItemForOrder ? payment.phoneNumber : "",
          "Delivery Option": firstItemForOrder ? payment.deliveryOption : "",
          Email: firstItemForOrder ? payment.email : "",
          "Ordered Date": firstItemForOrder
            ? new Date(payment.createdAt).toLocaleDateString()
            : "",
          "Delivery Date": firstItemForOrder
            ? new Date(payment.deliveryDate).toLocaleDateString()
            : "",
          "Item Title": item.title,
          Quantity: item.quantity,
          Size: item.size,
          "Location URL": firstItemForOrder ? `${payment.addressURL} ` : "",
          "Coupon Name": firstItemForOrder ? `${payment.couponName} ` : "",
          "Total Amount without Coupon": firstItemForOrder
            ? `${payment.totalWithoutCoupon} `
            : "",
          "Total Amount with Coupon": firstItemForOrder
            ? `${(payment.amount / 100).toFixed(2)} `
            : "",
          "Delivered Status": firstItemForOrder
            ? matchingCart?.deliveredStatus === "true"
              ? "Delivered"
              : "Pending"
            : "",
          Notes: firstItemForOrder ? payment.notes || "" : "",
        });
        firstItemForOrder = false;
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToDownload);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "filtered_orders.xlsx");
  };

  // Filter logic
  const filteredPayments = paymentData.filter((payment) => {
    const matchingCart = cartItemData.find(
      (cart) => cart.orderNumber === payment.orderNumber
    );

    const matchesDeliveryStatus =
      deliveryStatusFilter === "all" ||
      (deliveryStatusFilter === "delivered" &&
        matchingCart?.deliveredStatus === "true") ||
      (deliveryStatusFilter === "pending" &&
        matchingCart?.deliveredStatus === "false");

    return (
      payment.orderNumber
        .toLowerCase()
        .includes(orderNumberFilter.toLowerCase()) &&
      (payment.firstName.toLowerCase().includes(nameFilter.toLowerCase()) ||
        payment.lastName.toLowerCase().includes(nameFilter.toLowerCase())) &&
      matchesDeliveryStatus
    );
  });

  // Apply pagination to filtered payments
  const paginatedPayments = filteredPayments.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleResendMail = async (payment, item) => {
    const response = await getResendMailItems(item, payment);
    if (response) {
      updateSnackBarState(true, "Mail Resent successfully", "success");
    } else {
      updateSnackBarState(true, "Mail Resent failed", "error");
    }
  };

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        mt={2}
      >
        <Box display="flex" gap="20px">
          <div>
            <Typography variant="subtitle1" gutterBottom>
              Filter by Order Number
            </Typography>
            <TextField
              label="Order Number"
              variant="outlined"
              value={orderNumberFilter}
              onChange={(e) => setOrderNumberFilter(e.target.value.trim())}
            />
          </div>
          <div>
            <Typography variant="subtitle1" gutterBottom>
              Filter by Name (First or Last)
            </Typography>
            <TextField
              label="Name"
              variant="outlined"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value.trim())}
            />
          </div>
          <div>
            <Typography variant="subtitle1" gutterBottom>
              Filter by Item Title
            </Typography>
            <TextField
              label="Item Title"
              variant="outlined"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value.trim())}
            />
          </div>
          <div>
            <Typography variant="subtitle1" gutterBottom>
              Filter by Delivery Status
            </Typography>
            <Select
              value={deliveryStatusFilter}
              onChange={(e) => setDeliveryStatusFilter(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </div>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveAlt />}
          onClick={handleExcelDownload}
        >
          Download Excel
        </Button>
      </Box>
      <Box>
        <PaginatedHeader
          pagetitle="Orders"
          pageInfo={{
            totalItems: filteredPayments.length,
            totalPages: Math.ceil(filteredPayments.length / rowsPerPage),
            pageSize: rowsPerPage,
            page: page,
          }}
          onRowsPerPageChange={setRowsPerPage}
          onPageChange={setPage}
        />
      </Box>

      <TableContainer elevation={0} component={Paper}>
        <Table stickyHeader aria-label="menus-table">
          <TableHead className="table-header">
            <TableRow className="table-header-row">
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Order Number
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Address
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Phone Number
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Delivery Option
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Ordered Date
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Delivery Date
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Location URL
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Notes
              </TableCell>
              {/* <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Item Title
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Size
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Quantity
              </TableCell> */}

              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Total Amount Before Coupon
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Coupon Name
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Total Amount After Coupon
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Fulfilled
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Actions
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Shipment
              </TableCell>

              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Resend Mail
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Details
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPayments.map((payment, paymentIndex) => {
              const matchingCart = cartItemData.find(
                (cart) => cart.orderNumber === payment.orderNumber
              );

              const filteredCartItems = matchingCart?.cartItems.filter((item) =>
                item.title.toLowerCase().includes(titleFilter.toLowerCase())
              );
              console.log("matchingCart", matchingCart);

              return (
                <React.Fragment key={paymentIndex}>
                  {filteredCartItems?.map((item, index) => (
                    <TableRow key={index}>
                      {index === 0 && (
                        <>
                          <TableCell rowSpan={filteredCartItems.length}>
                            {payment.orderNumber}
                          </TableCell>
                          <TableCell rowSpan={filteredCartItems.length}>
                            {payment.firstName + " " + payment.lastName}
                          </TableCell>
                          <TableCell rowSpan={filteredCartItems.length}>
                            {payment.deliveryOption != "Pickup"
                              ? payment.address +
                                ", " +
                                "Pincode:" +
                                payment.postalCode
                              : ""}
                          </TableCell>
                          <TableCell rowSpan={filteredCartItems.length}>
                            {payment.phoneNumber}
                          </TableCell>
                          <TableCell rowSpan={filteredCartItems.length}>
                            {payment.deliveryOption}
                          </TableCell>
                          <TableCell rowSpan={filteredCartItems.length}>
                            {payment.email}
                          </TableCell>
                          <TableCell rowSpan={filteredCartItems.length}>
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell rowSpan={filteredCartItems.length}>
                            {new Date(
                              payment.deliveryDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell rowSpan={filteredCartItems.length}>
                            <a
                              href={payment.addressURL}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {payment.addressURL}
                            </a>
                          </TableCell>
                          <TableCell rowSpan={filteredCartItems.length}>
                            {payment.notes}
                          </TableCell>
                        </>
                      )}
                      {/* <TableCell>{item.title}</TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>{item.quantity}</TableCell> */}

                      {index === 0 && (
                        <>
                          <TableCell rowSpan={filteredCartItems.length}>
                            {Number(payment.totalWithoutCoupon).toFixed(2)}
                          </TableCell>
                          <TableCell rowSpan={filteredCartItems.length}>
                            {payment.couponName}
                          </TableCell>
                          <TableCell rowSpan={filteredCartItems.length}>
                            {Number(payment.amount / 100).toFixed(2)}
                          </TableCell>

                          <TableCell rowSpan={filteredCartItems.length}>
                            <Switch
                              checked={matchingCart?.deliveredStatus === "true"}
                              onChange={() =>
                                handleSwitchChange(
                                  payment.orderNumber,
                                  matchingCart
                                )
                              }
                              // disabled={matchingCart?.deliveredStatus === "true"}
                            />
                          </TableCell>
                          <TableCell rowSpan={filteredCartItems.length}>
                            <Button
                              sx={{ color: theme.palette.primary.main }}
                              startIcon={<Delete />}
                              onClick={() => handleDelete(payment.orderNumber)}
                            ></Button>
                            <Button
                              sx={{ color: theme.palette.primary.main }}
                              startIcon={<Edit />}
                              onClick={() => handleEditClick(payment)}
                            ></Button>
                          </TableCell>
                          <TableCell rowSpan={filteredCartItems.length}>
                            <Button
                              sx={{ color: theme.palette.primary.main }}
                              startIcon={<LocalShipping />}
                              onClick={() => handleOpenShipmentDialog(payment)}
                            >
                              Shipment
                            </Button>
                          </TableCell>

                          <TableCell rowSpan={filteredCartItems.length}>
                            <Button
                              sx={{ color: theme.palette.primary.main }}
                              startIcon={<MailOutline />}
                              onClick={() =>
                                handleResendMail(payment, filteredCartItems)
                              }
                            >
                              Resend Mail
                            </Button>
                          </TableCell>
                          <TableCell rowSpan={filteredCartItems.length}>
                            <Button
                              variant="contained"
                              color="primary"
                              sx={{ whiteSpace: "nowrap" }}
                              // startIcon={<Visibility />}
                              onClick={() =>
                                handleShowDetails(payment, filteredCartItems)
                              }
                            >
                              Show Details
                            </Button>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={shipmentDialogOpen} onClose={handleCloseShipmentDialog}>
        <DialogTitle>Enter Shipment Details</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tracking Number"
            fullWidth
            value={trackingNumber}
            onChange={(e) => {
              setTrackingNumber(e.target.value);
              if (e.target.value.trim() !== "") {
                setTrackingNumberError(false);
              }
            }}
            error={trackingNumberError}
            helperText={
              trackingNumberError ? "Tracking Number is required" : ""
            }
          />

          <TextField
            margin="dense"
            label="Tracking URL"
            fullWidth
            multiline
            minRows={3}
            value={trackingUrl}
            onChange={(e) => {
              setTrackingUrl(e.target.value);
              if (e.target.value.trim() !== "") {
                setTrackingUrlError(false);
              }
            }}
            error={trackingUrlError}
            helperText={trackingUrlError ? "Tracking URL is required" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseShipmentDialog}>Cancel</Button>
          <Button
            onClick={handleSendShipment}
            variant="contained"
            color="primary"
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {DrawerOpen && (
        <SnacksDrawer
          selectedPaymentData={selectedPayment}
          menuDrawerOpen={DrawerOpen}
          handleDrawerclose={handleDrawerclose}
          refetch={paymentRefetch}
        />
      )}

      {detailsDrawerOpen && selectedOrderDetails && (
        <OrderDetailsDrawer
          open={detailsDrawerOpen}
          onClose={handleDetailsDrawerClose}
          payment={selectedOrderDetails.payment}
          filteredCartItems={selectedOrderDetails.filteredCartItems}
        />
      )}
    </div>
  );
}



export default Snacks;
