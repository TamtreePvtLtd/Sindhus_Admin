import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Link,
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
    marginLeft: "280px",
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
  contactContainer: {
    textAlign: "center",
    paddingTop: 10,
    marginTop: 20, // Adds spacing before contact section
  },
  contactText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
  contactLink: {
    fontSize: 14,
    color: "#038265",
    marginBottom: 5,
  },
  contactHeader: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 10,
    color: "#555",
    textAlign: "center",
  },
  signature: {
    fontSize: 14,
    color: "#038265",
    marginTop: 10,
    textAlign: "center",
  },
});

// PDF Bill Component
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
            <Text style={styles.cell}>Unit Price</Text>
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
        <View>
          {payment.deliveryOption === "Pickup" ? (
            <Text
              style={{
                ...styles.totalAmount, // Use the base totalAmount styles
                marginLeft: "280px", // Set marginLeft to 280px for Pickup
              }}
            >
              Total Amount with Tax: $ {Number(payment.amount / 100).toFixed(2)}
            </Text>
          ) : (
            <Text
              style={{
                ...styles.totalAmount, // Use the base totalAmount styles
                marginLeft: "170px", // Set marginLeft to 200px for Delivery
              }}
            >
              Total Amount with Tax and Delivery Charge: $
              {Number(payment.amount / 100).toFixed(2)}
            </Text>
          )}
        </View>
      </View>

      {/* Contact Us Section */}
      <View style={styles.contactContainer}>
        <Text style={styles.contactHeader}>Contact Us:</Text>
        <Text style={styles.contactText}>
          2700 E Eldorado Pkwy, #203, Little Elm, Texas - 75068
        </Text>
        <Link href="tel:+19402792536" style={styles.contactLink}>
          +1 940-279-2536
        </Link>
        <Link
          href="mailto:sindhuskitchenusa@gmail.com"
          style={styles.contactLink}
        >
          sindhuskitchenusa@gmail.com
        </Link>
        <Link href="http://sindhuskitchen.com" style={styles.contactLink}>
          sindhuskitchen.com
        </Link>
        <Text style={styles.signature}>
          <b>
            Best Regards,
            <br />
            SINDHU'S
          </b>
        </Text>
      </View>
    </Page>
  </Document>
);

export default PDFBill;
