import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosClient } from "./axiosClient";
import type { IProducts, ProductQueryParams, Product } from "@/types/product";
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
    refetchOnMount: false,
    refetchOnWindowFocus: false,

    placeholderData: (previousData) => previousData,
  });
};

export const useGetFeaturedProducts = () => {
  return useQuery<IProducts, AxiosError<ApiErrorResponse>>({
    queryKey: ["featured-products"],

    queryFn: async () => {
      const response = await axiosClient.get("/api/products/get-featured-products");
      return response.data;
    },

    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};


export const useGetProductById = (id: string) => {
  return useQuery<Product, AxiosError<ApiErrorResponse>>({
    queryKey: ["product", id],

    queryFn: async () => {
      const response = await axiosClient.get(
        `/api/products/get-product/${id}`,
      );
      return response.data;
    },

    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,

    placeholderData: (previousData) => previousData,
  });
};

export const useDeleteProductById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosClient.delete(`/api/products/delete-product/${id}`);
    },
    onSuccess: (_data, id: string) => {
      toast.success("Product deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage = error.response?.data.message || error.message;
      toast.error(errorMessage);
    },
  });
};