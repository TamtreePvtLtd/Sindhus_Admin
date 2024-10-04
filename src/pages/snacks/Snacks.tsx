import {
  Box,
  Button,
  MenuItem,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { SaveAlt, Delete } from "@mui/icons-material"; // Icon for the download button
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx"; // Import the xlsx library
import { cartItems, DownloadData, PaymentData } from "../../interface/snacks";
import {
  useDeleteDeliveredPayment,
  useDeleteOrder,
  useUpdateDeliveryStatus,
} from "../../customRQHooks/Hooks";

// Define PaymentData and CartItemData interfaces

function Snacks() {
  const [paymentData, setPaymentData] = useState<PaymentData[]>([]);
  const [cartItemData, setCartItemData] = useState<cartItems[]>([]);
  const [orderNumberFilter, setOrderNumberFilter] = useState(""); // For order number filter
  const [nameFilter, setNameFilter] = useState("");
  const [titleFilter, setTitleFilter] = useState(""); // For item title filter
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState("all"); // "all", "delivered", "pending"

  const theme = useTheme();
  const updatemutation = useUpdateDeliveryStatus();
  const deleteOrderMutation = useDeleteOrder();
  const deletePaymentMutation = useDeleteDeliveredPayment();

  const getCartItem = async () => {
    try {
      const response = await fetch("http://localhost:3000/cart/cartItem", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const cartItem = await response.json();
      setCartItemData(cartItem);
    } catch (error) {
      console.error("Error fetching last order number:", error);
    }
  };

  const getPaymentItem = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/payment/transaction",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const paymentData = await response.json();
      setPaymentData(paymentData);
    } catch (error) {
      console.error("Error fetching last order number:", error);
    }
  };

  // Function to handle switch change

  const handleSwitchChange = async (orderNumber, cartItem) => {
    console.log("deliveredStatus", cartItem.deliveredStatus);

    const updatedDeliveredStatus =
      cartItem.deliveredStatus == "true" ? "false" : "true";

    try {
      const response = await updatemutation.mutateAsync({
        orderNumber,
        deliveredStatus: updatedDeliveredStatus,
      });
      console.log("API Response:", response);
      alert("Delivery status updated successfully!");
    } catch (error) {
      alert("Failed to update delivery status.");
    }
  };

  const handleDelete = async (orderNumber) => {
    console.log("orderNumber", orderNumber);

    try {
      await deleteOrderMutation.mutateAsync(orderNumber);
      await deletePaymentMutation.mutateAsync(orderNumber);
      alert("Order deleted successfully!");
    } catch (error) {
      alert("Failed to delete order.");
    }
  };
  // Handle Excel Download
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
            ? `${payment.totalWithCoupon} `
            : "",
          "Delivered Status": firstItemForOrder
            ? matchingCart?.deliveredStatus === "true"
              ? "Delivered"
              : "Pending"
            : "",
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

  useEffect(() => {
    getCartItem();
    getPaymentItem();
  }, []);

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
              Total Amount before Coupon
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
              Total Amount after Coupon
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
                          {new Date(payment.deliveryDate).toLocaleDateString()}
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
                          {Number(payment.totalWithCoupon).toFixed(2)}
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
                            disabled={matchingCart?.deliveredStatus === "true"}
                          />
                        </TableCell>
                        <TableCell rowSpan={filteredCartItems.length}>
                          <Button
                            sx={{ color: theme.palette.primary.main }}
                            startIcon={<Delete />}
                            onClick={() => handleDelete(payment.orderNumber)}
                          ></Button>
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
    </div>
  );
}

export default Snacks;
