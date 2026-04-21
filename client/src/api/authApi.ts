import type { IAuth } from "@/types/auth";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosClient } from "./axiosClient";
import { toast } from "sonner";

interface ApiErrorResponse {
    message: string;
}

export const useSignUp = () => {
    const queryClient = useQueryClient();
    return useMutation<IAuth, AxiosError<ApiErrorResponse>, FormData>({
        mutationFn: async (formData: FormData) => {
            const response = await  axiosClient.post("/auth/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            return response.data;
        },
        onSuccess: (data) => {
            toast.success("Registration successful!");
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
        }
    })
}

export const useSignIn = () => {
    const queryClient = useQueryClient();
    return useMutation<IAuth, AxiosError<ApiErrorResponse>, FormData>({
        mutationFn: async (formData: FormData) => {
            const response = await  axiosClient.post("/auth/login", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            })
            return response.data;
        },
        onSuccess: (data) => {
            toast.success("Login successful!");
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
        }
    })
}


export const useSignOut = () => {
    const queryClient = useQueryClient();
    return useMutation<void, AxiosError<ApiErrorResponse>, void>({
        mutationFn: async () => {
            await axiosClient.post("/auth/logout", {});
        },
        onSuccess: () => {
            toast.success("Logout successful!");
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
        }
    });
};


export const useAuthCheck = () => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ["authCheck"],
        queryFn: async () => {
            const response = await axiosClient.get("/auth/check", {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            return response.data;
        }
    });
};
