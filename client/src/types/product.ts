export interface ICategory {
  id: string;
  name: string;
  slug: string;
  image: string;
}

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
