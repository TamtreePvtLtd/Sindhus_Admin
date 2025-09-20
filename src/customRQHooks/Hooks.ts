import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  createProduct,
  deleteProduct,
  getProductsByMenuId,
  updateProduct,
  getAllDiningOutMenuWithProducts,
  getAllEnquiries,
  getAllMenus,
  deleteEnquiry,
  createMenu,
  updateMenu,
  deleteMenu,
  createSpecials,
  getSpecials,
  deleteSpecial,
  deleteAllSpecial,
  getAllProduct,
  getAllCoupens,
  deleteCoupen,
  createCoupen,
  updateCoupen,
  deleteDiningOutProduct,
  getPayments,
  getCartItems,
  updateDeliveryStatus,
  deleteOrder,
  deleteDeliveredPayment,
  getDistanceBasedDeliveryCharge,
  createDistanceBasedCharge,
  updateDistanceBasedCharge,
  deleteDistanceBasedCharge,
  updatePaymentData,
  updateAvailability,
  updateHideProduct,
  updateShipment,
} from "../services/api";
import { queryClient } from "../App";

export const useGetAllEnquiry = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ["enquiries"],
    queryFn: () => getAllEnquiries(page, pageSize),
    refetchOnWindowFocus: false,
  });
};

export const useGetAllMenus = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ["menus"],
    queryFn: () => getAllMenus(page, pageSize),
    refetchOnWindowFocus: false,
  });
};

export const useGetAllDiningOutMenuWithProducts = () => {
  return useQuery({
    queryKey: ["diningOut"],
    queryFn: () => getAllDiningOutMenuWithProducts(),
    refetchOnWindowFocus: false,
  });
};

export const useDeleteEnquiry = () => {
  return useMutation({
    mutationFn: deleteEnquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
export const useCreateMenu = () => {
  return useMutation({
    mutationFn: createMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
export const useCreateCoupen = () => {
  return useMutation({
    mutationFn: createCoupen,
    onSuccess: (data) => {
      console.log("Coupon created successfully:", data); // Log the success response

      queryClient.invalidateQueries({ queryKey: ["coupen"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useCreateSpecials = () => {
  return useMutation({
    mutationFn: createSpecials,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specials"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useGetSpecials = () => {
  return useQuery({
    queryKey: ["specials"],
    queryFn: () => getSpecials(),
    refetchOnWindowFocus: false,
  });
};

export const useGetProducts = (menuId: string, subMenuIds: string[]) => {
  return useQuery({
    queryKey: ["products", menuId, subMenuIds],
    queryFn: () => getProductsByMenuId(menuId, subMenuIds),
    refetchOnWindowFocus: false,
  });
};

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteSpecial = () => {
  return useMutation({
    mutationFn: deleteSpecial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specials"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
export const useDeleteAllSpecial = () => {
  return useMutation({
    mutationFn: deleteAllSpecial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specials"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateMenu = () => {
  return useMutation({
    mutationFn: updateMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
export const useUpdateCoupen = () => {
  return useMutation({
    mutationFn: updateCoupen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupen"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteMenu = () => {
  return useMutation({
    mutationFn: deleteMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
export const useChangeisResponseStatus = () => {
  return useMutation({
    mutationFn: useChangeisResponseStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isResponse"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useGetAllProduct = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => getAllProduct(page, pageSize),
    refetchOnWindowFocus: false,
  });
};

export const useGetAllCoupens = (page?: number, pageSize?: number) => {
  return useQuery({
    queryKey: ["coupens"],
    queryFn: () => getAllCoupens(page, pageSize),
    refetchOnWindowFocus: false,
  });
};

export const useDeleteCoupen = () => {
  return useMutation({
    mutationFn: deleteCoupen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupens"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteDiningoutMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDiningOutProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diningout"] });
      console.log("Products removed successfully");
    },
    onError: (error) => {
      console.log("Error while clearing the products", error);
    },
  });
};
export const useGetPayment = () => {
  return useQuery({
    queryKey: ["payments"],
    queryFn: () => getPayments(),
    refetchOnWindowFocus: false,
  });
};
export const useGetCartItems = () => {
  return useQuery({
    queryKey: ["cartItems"],
    queryFn: () => getCartItems(),
    refetchOnWindowFocus: false,
  });
};

export const useUpdateDeliveryStatus = () => {
  const queryClient = useQueryClient();
  return useMutation(updateDeliveryStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation(updateAvailability, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
export const useUpdateHideProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(updateHideProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
export const useDeleteDeliveredPayment = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteDeliveredPayment, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useGetDistanceBasedDeliveryCharge = () => {
  return useQuery({
    queryKey: ["distance"],
    queryFn: () => getDistanceBasedDeliveryCharge(),
    refetchOnWindowFocus: false,
  });
};

export const useCreateDistanceBasedCharge = () => {
  return useMutation({
    mutationFn: createDistanceBasedCharge,
    onSuccess: (data) => {
      console.log("Coupon created successfully:", data); // Log the success response

      queryClient.invalidateQueries({ queryKey: ["distance"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateDistanceBasedCharge = () => {
  return useMutation({
    mutationFn: updateDistanceBasedCharge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["distance"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteDistanceBasedCharge = () => {
  return useMutation({
    mutationFn: deleteDistanceBasedCharge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["distance"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdatePaymentData = () => {
  const queryClient = useQueryClient();
  return useMutation(updatePaymentData, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentData"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateShipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    },
    onError: (error) => {
      console.error("Error updating shipment:", error);
    },
  });
};

// export const useGetResendMailItem = (cartItem, paymentData) => {
//   return useQuery({
//     queryKey: ["mailItems", cartItem, paymentData],
//     queryFn: () => getResendMailItems(cartItem, paymentData),
//     refetchOnWindowFocus: false,
//   });
// };
