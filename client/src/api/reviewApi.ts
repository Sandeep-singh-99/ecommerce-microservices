import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosClient } from "./axiosClient";
import { toast } from "sonner";

interface ApiErrorResponse {
  message: string;
}

export interface ReviewResponse {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface RatingBreakdown {
  stars: number;
  count: number;
  percentage: number;
}

export interface ProductRatingResponse {
  product_id: string;
  average_rating: number;
  total_ratings: number;
  breakdown: RatingBreakdown[];
}

export interface ReviewListResponse {
  reviews: ReviewResponse[];
}

export const useGetProductRating = (productId: string) => {
  return useQuery<ProductRatingResponse, AxiosError<ApiErrorResponse>>({
    queryKey: ["product-rating", productId],
    queryFn: async () => {
      const response = await axiosClient.get(`/review/${productId}/rating`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!productId,
  });
};

export const useGetProductComments = (productId: string, skip = 0, limit = 10) => {
  return useQuery<ReviewListResponse, AxiosError<ApiErrorResponse>>({
    queryKey: ["product-comments", productId, skip, limit],
    queryFn: async () => {
      const response = await axiosClient.get(`/review/${productId}/comments`, {
        params: { skip, limit },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!productId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      rating,
      comment,
    }: {
      productId: string;
      rating: number;
      comment?: string;
    }) => {
      const response = await axiosClient.post(`/review/${productId}`, {
        rating,
        comment,
      });
      return response.data;
    },
    onSuccess: (_data, { productId }) => {
      toast.success("Review submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["product-rating", productId] });
      queryClient.invalidateQueries({ queryKey: ["product-comments", productId] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage = error.response?.data?.message || "Failed to submit review";
      toast.error(errorMessage);
    },
  });
};
