import type { IProduct, ICategory, IOrder } from "@/types/product";

export const dummyCategories: ICategory[] = [
  {
    id: "cat_1",
    name: "Mobiles",
    slug: "mobiles",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1170&auto=format&fit=crop",
  },
  {
    id: "cat_2",
    name: "Watches",
    slug: "watches",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1172&auto=format&fit=crop",
  },
  {
    id: "cat_3",
    name: "TV",
    slug: "tv",
    image: "https://images.unsplash.com/photo-1646861039459-fd9e3aabf3fb?w=600&auto=format&fit=crop",
  },
  {
    id: "cat_4",
    name: "Refrigerator",
    slug: "refrigerator",
    image: "https://images.unsplash.com/photo-1721613877687-c9099b698faa?w=600&auto=format&fit=crop",
  },
  {
    id: "cat_5",
    name: "Camera",
    slug: "camera",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop",
  }
];

export const dummyProducts: IProduct[] = [
  {
    id: "prod_1",
    name: "Sony Noise Cancelling Headphones",
    price: 299.99,
    originalPrice: 349.99,
    description: "Industry leading noise cancellation headphones with dual noise sensor technology. Next-level music with Edge-AI, co-developed with Tokyo Music Studios.",
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop"
    ],
    category: "Electronics",
    rating: 4.8,
    reviewCount: 342,
    badge: "Sale",
    stock: 15
  },
  {
    id: "prod_2",
    name: "Nike Air Max 270",
    price: 150.00,
    description: "The Nike Air Max 270 delivers visible air under every step. Updated for modern comfort, it nods to the original, 1991 Air Max 180 with its exaggerated tongue top and heritage tongue logo.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop"
    ],
    category: "Shoes",
    rating: 4.5,
    reviewCount: 128,
    badge: "Trending",
    stock: 42
  },
  {
    id: "prod_3",
    name: "Apple Watch Series 9",
    price: 399.00,
    description: "The most powerful chip in Apple Watch ever. A magical new way to use your Apple Watch without touching the screen. A display that's twice as bright.",
    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop"
    ],
    category: "Watches",
    rating: 4.9,
    reviewCount: 856,
    badge: "New",
    stock: 24
  },
  {
    id: "prod_4",
    name: "Minimalist Leather Backpack",
    price: 85.00,
    originalPrice: 110.00,
    description: "Handcrafted from genuine leather. This minimalist backpack features a spacious main compartment, laptop sleeve, and quick-access front pocket.",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop"
    ],
    category: "Accessories",
    rating: 4.2,
    reviewCount: 45,
    stock: 8
  },
  {
    id: "prod_5",
    name: "Essential Cotton T-Shirt",
    price: 25.00,
    description: "The perfect everyday t-shirt. Made from 100% organic cotton for ultimate comfort and breathability.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"
    ],
    category: "Clothing",
    rating: 4.6,
    reviewCount: 215,
    stock: 150
  },
  {
    id: "prod_6",
    name: "Classic Aviator Sunglasses",
    price: 120.00,
    description: "Timeless aviator design with polarized lenses. 100% UV protection.",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop"
    ],
    category: "Accessories",
    rating: 4.4,
    reviewCount: 89,
    badge: "Trending",
    stock: 32
  },
  {
    id: "prod_7",
    name: "MacBook Pro 14-inch",
    price: 1999.00,
    description: "Supercharged by M3 Pro or M3 Max, MacBook Pro takes its power and efficiency further than ever. With all-day battery life and a beautiful Liquid Retina XDR display.",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop"
    ],
    category: "Electronics",
    rating: 4.9,
    reviewCount: 1042,
    stock: 12
  },
  {
    id: "prod_8",
    name: "Fossil Men's Chronograph",
    price: 145.00,
    originalPrice: 180.00,
    description: "Classic chronograph watch with a genuine leather strap and stainless steel case.",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop"
    ],
    category: "Watches",
    rating: 4.3,
    reviewCount: 67,
    badge: "Sale",
    stock: 20
  }
];

export const dummyOrders: IOrder[] = [
  {
    id: "ORD-1001",
    customer: "John Doe",
    total: 349.99,
    status: "Delivered",
    date: "2024-03-15",
    items: 2
  },
  {
    id: "ORD-1002",
    customer: "Jane Smith",
    total: 129.50,
    status: "Processing",
    date: "2024-03-18",
    items: 1
  },
  {
    id: "ORD-1003",
    customer: "Alex Johnson",
    total: 899.00,
    status: "Shipped",
    date: "2024-03-19",
    items: 3
  },
  {
    id: "ORD-1004",
    customer: "Sarah Williams",
    total: 45.00,
    status: "Pending",
    date: "2024-03-20",
    items: 1
  },
  {
    id: "ORD-1005",
    customer: "Michael Brown",
    total: 210.75,
    status: "Cancelled",
    date: "2024-03-10",
    items: 4
  }
];
