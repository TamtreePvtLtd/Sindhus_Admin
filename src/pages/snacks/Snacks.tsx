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
} from "@mui/material";
import { SaveAlt, Delete } from "@mui/icons-material";
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
} from "../../customRQHooks/Hooks";
import SnacksDrawer from "../../pageDrawers/Snacks";
import { getResendMailItems } from "../../services/api";
import logo from "../../../public/assets/images/output-onlinepngtools (1).png";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFBill from "../../common/components/PDFBill";

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

  const { data: cartItem, refetch: cartItemrefetch } = useGetCartItems();
  const { data: paymentItem, refetch: paymentRefetch } = useGetPayment();

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

  const handleEditClick = (payment: PaymentData) => {
    setSelectedPayment({ ...payment });
    setDrawerOpen(true);
  };

  // Function to handle switch change
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
  // Handle Excel Download
  const handleExcelDownload = () => {
    // Prepare data for Excel
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
      // Track whether it's the first item for the order
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
        // Set the flag to false after processing the first item for the order
        firstItemForOrder = false;
      });
    });

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataToDownload);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    // Generate Excel file and trigger download
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

        {/* Button for Excel Download */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveAlt />}
          onClick={handleExcelDownload} // Add your download handler here
        >
          Download Excel
        </Button>
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
              <TableCell
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
              </TableCell>

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
                Resend Mail
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Bill
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.map((payment, paymentIndex) => {
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
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>{item.quantity}</TableCell>

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
                              startIcon={<MailOutline />} // Use the MailOutline icon
                              onClick={() =>
                                handleResendMail(payment, filteredCartItems)
                              } // Add your resend mail handler here
                            >
                              Resend Mail
                            </Button>
                          </TableCell>
                          <TableCell rowSpan={filteredCartItems.length}>
                            <PDFDownloadLink
                              document={
                                <PDFBill
                                  payment={payment}
                                  filteredCartItems={filteredCartItems}
                                />
                              }
                              fileName={`invoice_${payment.orderNumber}.pdf`}
                            >
                              {({ blob, url, loading, error }) => {
                                if (loading)
                                  return <span>Loading document...</span>;
                                if (error)
                                  return <span>Error loading document</span>;
                                return (
                                  <Button variant="contained" color="primary">
                                    print&nbsp;Order
                                  </Button>
                                );
                              }}
                            </PDFDownloadLink>
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

      {DrawerOpen && (
        <SnacksDrawer
          selectedPaymentData={selectedPayment}
          menuDrawerOpen={DrawerOpen}
          handleDrawerclose={handleDrawerclose}
          refetch={paymentRefetch}
        />
      )}
    </div>
  );
}

export default Snacks;
