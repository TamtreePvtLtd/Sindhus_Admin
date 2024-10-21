import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Link,
} from "@react-pdf/renderer";

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
    fontSize: 14,
  },
  cell: {
    flex: 1,
    marginBottom: 5,
    fontSize: 12, 
  },
  text: {
    fontSize: 12, 
    marginBottom: 5,
  },
  totalAmount: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: "280px",
  },
  boldText: {
    fontFamily: "Times-Bold",
    fontWeight: "bold",
  },
  logo: {
    width: 50,
    height: 50, 
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20, 
  },
  contactContainer: {
    textAlign: "center",
    paddingTop: 10,
    marginTop: 20, 
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

const PDFBill = ({ payment, filteredCartItems }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerContainer}>
        <Image
          style={styles.logo}
          src="assets/images/output-onlinepngtools (1).png"
        />
        <Text
          style={{
            marginTop: 10,
            fontSize: 14,
            color: "#038265",
            textAlign: "center",
          }}
        >
          SINDHU’S
        </Text>
      </View>
      <View>
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
        {payment.couponName && (
          <Text style={[styles.section, styles.text]}>
            Coupon Used: {payment.couponName}
          </Text>
        )}

        <Text style={[styles.section, styles.text]}>
          Delivery Date: {new Date(payment.deliveryDate).toLocaleDateString()}
        </Text>

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

        <View>
          {payment.deliveryOption === "Pickup" ? (
            <Text
              style={{
                ...styles.totalAmount,
                marginLeft: "280px",
              }}
            >
              Total Amount with Tax: $ {Number(payment.amount / 100).toFixed(2)}
            </Text>
          ) : (
            <Text
              style={{
                ...styles.totalAmount,
                marginLeft: "170px",
              }}
            >
              Total Amount with Tax and Delivery Charge: $
              {Number(payment.amount / 100).toFixed(2)}
            </Text>
          )}
        </View>
      </View>

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
