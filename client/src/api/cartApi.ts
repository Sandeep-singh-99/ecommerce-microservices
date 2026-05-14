import { useMutation, useQueryClient, useQuery, QueryClient } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";
import { AxiosError } from "axios";
import type { ICart } from "@/types/cart";
import { toast } from "sonner";


interface ApiErrorResponse {
    message: string;
}

export const useAddToCart = () => {
    const queryClient = useQueryClient();
    return useMutation<ICart , AxiosError<ApiErrorResponse>, FormData>({
        mutationFn: async (formData: FormData) => {
            const response = await  axiosClient.post("/api/carts/add-cart-item", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            return response.data;
        },
        onSuccess: (data: ICart) => {
            toast.success("Item added to cart!");
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
        }
    })
}


export const useFetchCartProducts = () => {
  return useQuery<ICart, AxiosError<ApiErrorResponse>>({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await axiosClient.get("/api/carts/get-cart-item")
      return response.data;
    },

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  })
}