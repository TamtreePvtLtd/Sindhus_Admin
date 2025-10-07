import { string } from "yup";

export interface PaymentData {
  url: string;
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
  totalWithCoupon: string;
  couponName: string;
  totalWithoutCoupon: string;
  addressURL: string;
  notes: string;
  __v: number;
  trackingNumber?: string;
  trackingUrl?: string;
  shippingAmount?: number;
  taxAmount?: number;
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
  deliveredStatus: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

export interface DownloadData {
  Name: string;
  "Order Number": string;
  Address: string;
  "Phone Number": string;
  "Delivery Option": string;
  Email: string;
  "Ordered Date": string;
  "Delivery Date": string;
  "Item Title": string;
  Quantity: number;
  Size: string;
  "Delivered Status": string;
  "Location URL": string;
  "Coupon Name": string;
  "After Coupon / Discount": string;
  Notes: string;
  Amount: string;
  "Tax Amount": string;
  "Shipping Amount": string;
  "Paid Amount": string;
}

export interface DistanceBasedDeliveryCharge {
  _id?: string;
  amount: string;
  uptoDistance: string;
}
export interface UpdateShipmentInput {
  orderNumber?: string;
  trackingNumber: string;
  trackingUrl: string;
  firstName?: string;
  email?: string;
}
