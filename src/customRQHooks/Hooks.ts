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
  getAllBanners,
  deleteBanner,
  updateBanner,
  createBanner,
 } from "../services/api";
import { queryClient } from "../App";
import { IBanner } from "../interface/types";


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
export const useDeleteBanner = () => {
  const queryClient = useQueryClient(); // Import useQueryClient from react-query

  return useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries("banners"); // Invalidate the "banners" query
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

export const useCreateBanner = () => {
  return useMutation({
    mutationFn: createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateBannerMutation = () => {
  return useMutation<IBanner, unknown, { id: string; formData: FormData }>(
    (variables) => updateBanner(variables.id, variables.formData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["banners"] });
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );
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

export const useGetBanners = () => {
  return useQuery<IBanner[], Error>({
    queryKey: "banners",
    queryFn: async () => {
      try {
        const response = await getAllBanners();
        return [response]; 
      } catch (error) {
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });
};



