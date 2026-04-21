export interface IReview {
    id: string;
    user: {
        name: string;
        avatar?: string;
    };
    rating: number;
    comment: string;
    date: string;
}

export interface IProduct {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    description: string;
    images: string[];
    category: string;
    rating: number;
    reviewCount: number;
    badge?: "New" | "Sale" | "Trending";
    stock: number;
    reviews?: IReview[];
}

export interface ICategory {
    id: string;
    name: string;
    slug: string;
    image: string;
    productCount: number;
}

export interface ICartItem {
    id: string; // Cart item ID (can be same as product ID)
    product: IProduct;
    quantity: number;
}

export interface IOrder {
    id: string;
    customer: string;
    total: number;
    status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
    date: string;
    items: number;
}
