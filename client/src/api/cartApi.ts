import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";
import { AxiosError } from "axios";
import type { ICart } from "@/types/cart";


interface ApiErrorResponse {
    message: string;
}

export const useAddToCart = () => {
    const queryClient = useQueryClient();
    return useMutation<ICart , AxiosError<ApiErrorResponse>, FormData>({
        mutationFn: async (formData: FormData) => {
            const response = await  axiosClient.post("/cart/add", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            return response.data;
        }
    })
}