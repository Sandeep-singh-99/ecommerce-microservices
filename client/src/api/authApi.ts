import type { IAuth } from "@/types/auth";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosClient } from "./axiosClient";
import { toast } from "sonner";
import { useEffect } from "react";

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
        onSuccess: (data: IAuth) => {
            toast.success("Registration successful!");
            queryClient.invalidateQueries({ queryKey: ["authCheck"] });
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
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
        onSuccess: (data: IAuth) => {
            toast.success(data.message || "Login successful!");
            queryClient.invalidateQueries({ queryKey: ["authCheck"] });
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
        }
    })
}


export const useSignOut = () => {
    const queryClient = useQueryClient();
    return useMutation<IAuth, AxiosError<ApiErrorResponse>, void>({
        mutationFn: async () => {
            const response = await axiosClient.post("/auth/logout", {});
            return response.data;
        },
        onSuccess: (data: IAuth) => {
            toast.success(data.message || "Logout successful!");
            queryClient.removeQueries({ queryKey: ["authCheck"] });
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
        }
    });
};

export const useAuthCheck = () => {
    const queryClient = useQueryClient();

    const query = useQuery<IAuth | null, AxiosError<ApiErrorResponse>>({
        queryKey: ["authCheck"],
        queryFn: async () => {
            try {
                const response = await axiosClient.get("/auth/me");
                return response.data;
            } catch (error) {
                const err = error as AxiosError<ApiErrorResponse>;

                if (err.response?.status === 401) {
                    return null;
                }

                throw err;
            }
        },

        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,

        retry: (failureCount, error) => {
            if (error.response?.status === 401) return false;
            return failureCount < 2;
        },

        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });

    useEffect(() => {
        if (query.error) {
            if (query.error.response?.status !== 401) {
                const errorMessage =
                    query.error.response?.data?.message ||
                    query.error.message;

                toast.error(errorMessage);
            }

            queryClient.removeQueries({ queryKey: ["authCheck"] });
        }
    }, [query.error, queryClient]);

    return query;
};