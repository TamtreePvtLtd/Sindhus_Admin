import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: { padding: 10, fontFamily: "Times-Roman" },
  section: { marginBottom: 10 },
  table: { display: "flex", width: "100%", flexDirection: "column" },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderStyle: "solid",
    borderColor: "#000",
    padding: 5,
  },
  header: {
    fontWeight: 500,
    marginBottom: 5,
    fontSize: 14, // Increased font size for header
  },
  cell: {
    flex: 1,
    marginBottom: 5,
    fontSize: 12, // Increased font size for table cells
  },
  text: {
    fontSize: 12, // Increased font size for regular text
    marginBottom: 5,
  },
  totalAmount: {
    marginTop: 20,
    fontSize: 14, // Increased font size for the total amount
      fontWeight: "bold",
    marginLeft:"280px"
  },
  boldText: {
    fontFamily: "Times-Bold",
    fontWeight: "bold",
  },
  logo: {
    width: 50, // Reduced the width of the logo
    height: 50, // Reduced the height of the logo
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20, // Add margin to space out from the rest of the content
  },
});

const PDFBill = ({ payment, filteredCartItems }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerContainer}>
        <Image
          style={styles.logo} // Apply the logo style
          src="assets/images/output-onlinepngtools (1).png"
        />
        <Text
          style={{
            marginTop: 10,
            fontSize: 14, // Adjusted to match increased font size
            color: "#038265",
            textAlign: "center", // Ensure text alignment is center
          }}
        >
          SINDHU’S
        </Text>
      </View>
      <View>
        {/* Display Order Number with a bold label */}
        <Text style={styles.text}>
          <Text>Order Number: </Text>
          <Text style={styles.boldText}>{payment.orderNumber}</Text>
        </Text>

        <Text style={[styles.section, styles.text]}>
          <Text>Customer Name: </Text>
          <Text style={styles.boldText}>
            {payment.firstName + " " + payment.lastName}
          </Text>
        </Text>
        <Text style={[styles.section, styles.text]}>
          Delivery Option: {payment.deliveryOption}
        </Text>
        {payment.deliveryOption !== "Pickup" && (
          <Text style={[styles.section, styles.text]}>
            Address: {`${payment.address}, Pincode: ${payment.postalCode}`}
          </Text>
        )}
        <Text style={[styles.section, styles.text]}>
          Phone: {payment.phoneNumber}
        </Text>
        <Text style={[styles.section, styles.text]}>
          Email: {payment.email}
        </Text>
        <Text style={[styles.section, styles.text]}>
          Coupon Used: {payment.couponName}
        </Text>
        <Text style={[styles.section, styles.text]}>
          Delivery Date: {new Date(payment.deliveryDate).toLocaleDateString()}
        </Text>
        {/* Table for items */}
        <View style={styles.table}>
          <View style={[styles.row, styles.header]}>
            <Text style={styles.cell}>Item</Text>
            <Text style={styles.cell}>Size</Text>
            <Text style={styles.cell}>Quantity</Text>
            <Text style={styles.cell}>Price</Text>
          </View>
          {filteredCartItems.map((item, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.cell}>{item.title}</Text>
              <Text style={styles.cell}>{item.size}</Text>
              <Text style={styles.cell}>{item.quantity}</Text>
              <Text style={styles.cell}>${item.price}</Text>
            </View>
          ))}
        </View>
        {/* Total Amount */}
        {/* <View>
          <Text style={styles.totalAmount}>
            Amount without Coupen: $
            {Number(payment.totalWithoutCoupon).toFixed(2)}
          </Text>
        </View> */}
        <View>
          <Text style={styles.totalAmount}>
            Total Amount with Tax: $ {Number(payment.amount / 100).toFixed(2)}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default PDFBill;
