import axios from "axios";
import {
  ILoginFormInputs,
  ILoginResponse,
  ISignUp,
  IUser,
} from "../interface/customer";
import { IMenu } from "../interface/menus";
import { cartItems, PaymentData } from "../interface/snacks";
import { ICoupen } from "../interface/menus";
import {
  ICateringEnquiries,
  IDiningOutMenuData,
  IPaginationResult,
  IProduct,
  IProductWithMenu,
  IProductPageMenuDropDown,
  ISpecial,
} from "../interface/types";
import {
  httpWithCredentials,
  httpWithMultipartFormData,
  httpWithoutCredentials,
} from "./http";

const getAllEnquiries = async (page: number, pageSize: number) => {
  try {
    const response = await httpWithCredentials.get<
      IPaginationResult<ICateringEnquiries>
    >("/enquiry/getAllEnquiries", {
      params: {
        page,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};

const getAllMenus = async (page?: number, pageSize?: number) => {
  try {
    const response = await httpWithCredentials.get<IPaginationResult<IMenu>>(
      "/menu/adminGetAllMenus",
      {
        params: {
          page,
          pageSize,
        },
      }
    );

    return response.data;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};

const getAllMenusForAddProduct = async () => {
  try {
    const response = await httpWithCredentials.get<IProductPageMenuDropDown[]>(
      "/menu/adminGetAllMenusForAddProduct"
    );
    return response.data;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};

const getProductsByMenuId = async (menuId: any, subMenuId: any) => {
  try {
    const response = await httpWithCredentials.get<IProduct[]>(
      "/product/getProductsByMenuId",
      { params: { menuId: menuId, subMenuId: subMenuId } }
    );

    return response.data;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};

const createProduct = async (formData) => {
  try {
    const response = await httpWithMultipartFormData.post(
      "/product/createProduct",
      formData
    );

    return response.data;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};

const updateProduct = async (formData) => {
  try {
    var productId = formData.get("producId");
    const response = await httpWithMultipartFormData.put(
      `/product/updateProduct/${productId}`,
      formData
    );
    return response;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};

const deleteProduct = async (product: IProduct) => {
  try {
    var id = product._id;
    const response = await httpWithCredentials.delete(
      `/product/deleteProduct/${id}`
    );
    return response;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};
const deleteSpecial = async (specials: ISpecial) => {
  try {
    var id = specials.id;
    const response = await httpWithCredentials.delete(
      `/specials/deleteSpecial/${id}`
    );
    return response;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};
const deleteAllSpecial = async () => {
  try {
    const response = await httpWithCredentials.delete(
      `/specials/deleteAllSpecials`
    );
    return response;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};

const deleteDiningOutProduct = async (mainMenuId) => {
  try {
    const response = await httpWithCredentials.delete(
      `/diningOut/deleteDiningOutProduct/${mainMenuId}`
    );
    return response;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};

const getAllDiningOutMenuWithProducts = async () => {
  try {
    const response = await httpWithCredentials.get<IProductWithMenu[]>(
      "/diningOut/getAllDiningOutProductswithMenuData"
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};

const createDiningOutProduct = async (requestData: {
  menu: { menuId: string; productIds: string[] }[];
}) => {
  try {
    const response = await httpWithCredentials.post<IDiningOutMenuData[]>(
      "/diningOut/createDiningOutProduct",
      requestData
    );
    return response.data;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};

const getAllDiningOutId = async () => {
  try {
    const response = await httpWithCredentials.get<IDiningOutMenuData[]>(
      "/diningOut/getAllDiningOutMenuWithProductDatas"
    );

    return response.data;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};

const updateDiningOutProduct = async (
  diningOutId: string,
  requestData: {
    menu: { menuId: string; productIds: string[] }[];
  }
) => {
  try {
    const response = httpWithCredentials.put<IDiningOutMenuData>(
      `diningOut/updateDiningOutProduct/${diningOutId}`,
      requestData
    );

    return response;
  } catch (error) {
    throw error;
  }
};

const SignupCredentials = async (credential: ISignUp) => {
  try {
    const response = await httpWithCredentials.post<ILoginResponse>(
      "/customer/signup",
      credential
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const adminLogin = async (credential: ILoginFormInputs) => {
  try {
    const response = await httpWithCredentials.post<ILoginResponse>(
      "/customer/adminLogin",
      credential
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const isAuthorized = async () => {
  try {
    const response = await httpWithCredentials.get<IUser>(
      "/customer/isAuthorized"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const logOut = async () => {
  try {
    const response = await httpWithCredentials.get<ILoginResponse>(
      "/customer/logout"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteEnquiry = async (enquiryId: string) => {
  try {
    const response = await httpWithCredentials.delete(
      `enquiry/deleteEnquiry/${enquiryId}`
    );

    return response.data;
  } catch (error) {
    const message = (error as Error).message;
    throw new Error(message);
  }
};

const createMenu = async (newMenu: FormData) => {
  console.log('new menu', newMenu);

  try {
    var response = await httpWithMultipartFormData.post<IMenu>(
      "/menu/createMenu",
      newMenu
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
const updateMenu = async (updateMenu: FormData) => {
  try {
    var id = updateMenu.get("id");
    var response = await httpWithMultipartFormData.put<IMenu>(
      `menu/updateMenu/${id}`,
      updateMenu
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createCoupen = async (newCoupen: { [key: string]: any }) => { // Specify the type accordingly
  try {
    console.log('newCoupen', newCoupen);

    var response = await httpWithMultipartFormData.post<ICoupen>(
      "/coupen/createCoupen",
      newCoupen,
      {
        headers: {
          'Content-Type': 'application/json', // Set the correct content type for JSON
        },
      }

    );
    console.log('response', response);

    return response.data;
  } catch (error) {
    throw error;
  }
};
const updateCoupen = async (updateCoupen: { [key: string]: any }) => {
  try {
    var id = updateCoupen.get("id");
    var response = await httpWithMultipartFormData.put<ICoupen>(
      `coupen/updateCoupen/${id}`,
      updateCoupen,
      {
        headers: {
          'Content-Type': 'application/json', // Set the correct content type for JSON
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};



const createSpecials = async (formData) => {
  try {
    const response = await httpWithMultipartFormData.post<string[]>(
      "specials/createSpecials",
      formData
    );
    console.log("response", response.data);

    return response.data;
  } catch (error) {
    throw error;
  }
};

const getSpecials = async () => {
  try {
    const response = await httpWithoutCredentials.get<string>(
      "/specials/getAllSpecials"
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllProduct = async (page: number, pageSize: number) => {
  try {
    const response = await httpWithoutCredentials.get<
      IPaginationResult<IProduct>
    >("/product/adminGetAllProduct", {
      params: {
        page,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteMenu = async (menuId: string) => {
  try {
    var response = await httpWithCredentials.delete(
      `menu/deleteMenu/${menuId}`
    );
    return response.data;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};

const changeisResponseStatus = async (enquiryId: any) => {
  try {
    const response = await httpWithCredentials.put(
      `/enquiry/changeEnquiryisResponseStatus/${enquiryId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return "Internal server error";
  }
};

const getPayments = async () => {
  try {
    const response = await httpWithoutCredentials.get<PaymentData[]>(
      "/payment/transaction")
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllCoupens = async (page?: number, pageSize?: number) => {
  try {
    const response = await httpWithCredentials.get<IPaginationResult<ICoupen>>(
      "/coupen/getAllCoupens",
      {
        params: {
          page,
          pageSize,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const getCartItems = async () => {
  try {
    const response = await httpWithoutCredentials.get<cartItems[]>(
      "/cart/cartItem"
    );

    return response.data;
  } catch (error) {
    throw error;
    var message = (error as Error).message;
    throw new Error(message);
  }
};

const deleteCoupen = async (id: string) => {
  try {
    var response = await httpWithCredentials.delete(
      `/coupen/deleteCoupen/${id}`
    );
    return response.data;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};

const updateDeliveryStatus = async ({ orderNumber, deliveredStatus }) => {
  console.log("api order number update", orderNumber);

  try {
    const response = await httpWithoutCredentials.put(
      `/cart/cartItem/${orderNumber}`,
      { deliveredStatus },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.log("Error updating delivery status:", error);
    throw error; // Re-throwing the error helps in debugging
  }
};

const deleteOrder = async (orderNumber) => {
  console.log("api order number delete", orderNumber);

  try {
    const response = await httpWithoutCredentials.delete(
      `/cart/cartItem/${orderNumber}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteDeliveredPayment = async (orderNumber) => {
  console.log("api order number delete", orderNumber);

  try {
    const response = await httpWithoutCredentials.delete(
      `/payment/transaction/${orderNumber}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  deleteDeliveredPayment,
  deleteOrder,
  updateDeliveryStatus,
  getCartItems,
  getPayments,
  getAllProduct,
  getSpecials,
  deleteSpecial,
  getAllEnquiries,
  getAllMenus,
  getProductsByMenuId,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllMenusForAddProduct,
  adminLogin,
  isAuthorized,
  logOut,
  SignupCredentials,
  getAllDiningOutMenuWithProducts,
  createDiningOutProduct,
  getAllDiningOutId,
  updateDiningOutProduct,
  deleteMenu,
  createMenu,
  deleteEnquiry,
  updateMenu,
  createSpecials,
  changeisResponseStatus,
  deleteAllSpecial,
  deleteDiningOutProduct,
  getAllCoupens,
  deleteCoupen,
  updateCoupen,
  createCoupen
};
