import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import type { IProduct } from "@/types/product";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { RatingStars } from "./RatingStars";
import { useAppDispatch } from "@/hooks/hooks";
import { addToCart } from "@/redux/slice/cartSlice";
import { toast } from "sonner";

export default function ProductCard({ product }: { product: IProduct }) {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product detail
    dispatch(addToCart({ product }));
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link to={`/products/${product.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg border-border/50 hover:border-violet-500/30 bg-card flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-muted/20">
          {product.badge && (
            <Badge className="absolute top-3 left-3 z-10" variant={product.badge === "Sale" ? "destructive" : "default"}>
              {product.badge}
            </Badge>
          )}
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {/* Overlay add to cart button on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              className="translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </div>
        </div>
        <CardContent className="p-4 flex-grow flex flex-col gap-2">
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{product.category}</div>
          <h3 className="font-semibold text-lg line-clamp-2 leading-tight group-hover:text-violet-500 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-auto pt-2">
            <RatingStars rating={product.rating} size={14} />
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-end gap-2">
            <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through mb-0.5">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
