import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";
import { AxiosError } from "axios";
import type { ICart, ICartResponse } from "@/types/cart";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/hooks";
import { setCart } from "@/redux/slice/cartSlice";
import { useEffect } from "react";


interface ApiErrorResponse {
    message: string;
}

export const useAddToCart = () => {
    const queryClient = useQueryClient();
    return useMutation<ICart , AxiosError<ApiErrorResponse>, { product_id: string; quantity: number; price: number }>({
        mutationFn: async (data) => {
            const response = await axiosClient.post("/api/carts/add-cart-item", data)
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


export const useFetchCartProducts = (enabled: boolean = true) => {
  const dispatch = useAppDispatch();
  const query = useQuery<ICartResponse, AxiosError<ApiErrorResponse>>({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await axiosClient.get("/api/carts/get-cart-items")
      return response.data;
    },
    enabled,

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (query.data && query.data.products) {
      const items = query.data.products.map(p => ({
        id: p.product_id,
        product: p.product as any, // Cast because the backend returns a Product, which we alias to IProduct
        quantity: p.quantity
      }));
      dispatch(setCart(items));
    } else if (query.data && query.data.products?.length === 0) {
      dispatch(setCart([]));
    }
  }, [query.data, dispatch]);

  return query;
}


export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation<ICart, AxiosError<ApiErrorResponse>, string>({
    mutationFn: async (product_id: string) => {
      const response = await axiosClient.delete(`/api/carts/delete-cart-item/${product_id}`)
      return response.data;
    },
    onSuccess: (data: ICart) => {
      toast.success("Item deleted from cart!");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  })
}