// export interface IReview {
//     id: string;
//     user: {
//         name: string;
//         avatar?: string;
//     };
//     rating: number;
//     comment: string;
//     date: string;
// }

// export interface IProduct {
//     id: string;
//     name: string;
//     price: number;
//     originalPrice?: number;
//     description: string;
//     images: string[];
//     category: string;
//     rating: number;
//     reviewCount: number;
//     badge?: "New" | "Sale" | "Trending";
//     stock: number;
//     reviews?: IReview[];
// }

export interface ICategory {
    id: string;
    name: string;
    slug: string;
    image: string;
}

// export interface ICartItem {
//     id: string; // Cart item ID (can be same as product ID)
//     product: IProduct;
//     quantity: number;
// }

// export interface IOrder {
//     id: string;
//     customer: string;
//     total: number;
//     status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
//     date: string;
//     items: number;
// }


export interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    sales_price: number;
    category: string;
    description: string;
    details?: string;
    images: ProductImage[];
    created_at: string;
}

export interface ProductImage {
    url: string;
    is_primary: boolean;
}

export interface IProducts {
    total: number;
    page: number;
    limit: number;
    products: Product[];
}


export interface ProductQueryParams {
    category?: string;
    min_price?: number;
    max_price?: number;
    search?: string;
    page?: number;
    limit?: number;
}