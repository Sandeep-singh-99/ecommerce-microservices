import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosClient } from "./axiosClient";
import type { IProducts, ProductQueryParams } from "@/types/product";
import { toast } from "sonner";

interface ApiErrorResponse {
  message: string;
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<IProducts, AxiosError<ApiErrorResponse>, FormData>({
    mutationFn: async (formData: FormData) => {
      const response = await axiosClient.post(
        "/api/products/create-product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    },
    onSuccess: (data: IProducts) => {
      toast.success("Product created Successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage = error.response?.data.message || error.message;
      toast.error(errorMessage);
    },
  });
};

export const useGetProducts = (params: ProductQueryParams = {}) => {
  return useQuery<IProducts, AxiosError<ApiErrorResponse>>({
    queryKey: ["products", params],

    queryFn: async () => {
      const response = await axiosClient.get("/api/products/get-products", {
        params,
      });
      return response.data;
    },

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,

    placeholderData: (previousData) => previousData,
  });
};

export const useGetCategoryHighlights = () => {
  return useQuery<IProducts, AxiosError<ApiErrorResponse>>({
    queryKey: ["category-highlights"],

    queryFn: async () => {
      const response = await axiosClient.get("/api/products/get-category-highlights");
      return response.data;
    },

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
