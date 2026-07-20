import type { Product } from "./product";

export interface ICart {
    id?: string;
    product_id?: string;
    quantity?: number;
    price?: number;
}

export interface ICartItemResponse {
    cart_id: string;
    product_id: string;
    quantity: number;
    price: number;
    subtotal: number;
    product: Product;
}

export interface ICartResponse {
    total_items: number;
    total_price: number;
    products: ICartItemResponse[];
}