export interface PaymentData {
  quantity: string;
  _id: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email: string;
  deliveryOption: string;
  amount: number;
  postalCode: number;
  paymentId: string;
  status: string;
  deliveryDate: string;
  createdAt: string;
  orderNumber: string;
  __v: number;
}

export interface CartItemData {
  orderNumber: string;
  _id: string;
  id: string;
  title: string;
  size: string;
  price: number;
  quantity: number;
  totalPrice: number;
  imageUrl: string;
  __v: number;
}

export interface cartItems {
  cartItems: CartItemData[];
  orderNumber: string;
}

export interface DownloadData {
  Name: string;
  "Order Number": string;
  Address: string;
  "Phone Number": string;
  "Delivery Option": string;
  Email: string;
  "Created Date": string;
  "Delivery Date": string;
  "Item Title": string;
  Quantity: number;
}
