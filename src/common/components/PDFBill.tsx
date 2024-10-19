import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,

  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  table: { display: "flex", width: "100%", flexDirection: "column" },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    fontWeight: 500,
    marginBottom: 5,
    fontSize: 12, // Increased font size for header
    fontFamily: "Times-Roman", // Changed font family
  },
  cell: {
    flex: 1, // Equal space for each cell
    marginBottom: 5,
    fontSize: 11, // Increased font size for table cells
    fontFamily: "Times-Roman", // Changed font family
  },
  text: {
    fontSize: 11, // Increased font size for regular text
    fontFamily: "Times-Roman", // Changed font family
  },
  totalAmount: {
    marginTop: 20, // Added margin-top for the Total Amount section
    fontSize: 13, // Increased font size for the total amount
    fontWeight: "bold", // Made the total amount bold
  },
  boldText: {
    fontFamily: "Times-Bold", // Use Times-Bold to ensure bold text
  },
  logo: {
    width: 100, // Adjust the width of the logo
    position: "absolute", // Make the logo position absolute
    right: 30, // Position from the right side of the page
    top: 30, // Position from the top of the page
  },
});

const PDFBill = ({ payment, filteredCartItems }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <Image
          style={{ width: 100 }} // Ensure the logo width is set
          src="assets/images/output-onlinepngtools (1).png"
        />
        <Text
          style={{
            marginTop: 10, // Space between the image and text
            fontSize: 12,
            color: "#038265",
            textAlign: "right", // Ensure text alignment is right
          }}
        >
          SINDHU’S
        </Text>
      </View>

      <View>
        {/* Display Order Number with a bold label */}
        <Text style={styles.text}>
          <Text style={styles.boldText}>Order Number: </Text>
          <Text>{payment.orderNumber}</Text>
        </Text>

        {/* Other details */}
        <Text style={[styles.section, styles.text]}>
          Customer Name: {payment.firstName + " " + payment.lastName}
        </Text>
        <Text style={[styles.section, styles.text]}>
          Delivery Option: {payment.deliveryOption}
        </Text>
        <Text style={[styles.section, styles.text]}>
          Address:
          {payment.deliveryOption !== "Pickup"
            ? `${payment.address}, Pincode: ${payment.postalCode}`
            : ""}
        </Text>
        <Text style={[styles.section, styles.text]}>
          Phone: {payment.phoneNumber}
        </Text>
        <Text style={[styles.section, styles.text]}>
          Email: {payment.email}
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
          </View>
          {filteredCartItems.map((item, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.cell}>{item.title}</Text>
              <Text style={styles.cell}>{item.size}</Text>
              <Text style={styles.cell}>{item.quantity}</Text>
            </View>
          ))}
        </View>

        {/* Total Amount */}
        <View>
          <Text style={styles.totalAmount}>
            Total Amount: ${Number(payment.amount / 100).toFixed(2)}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default PDFBill;
