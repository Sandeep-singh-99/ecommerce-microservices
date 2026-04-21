import React from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import type { ICartItem } from "@/types/product";
import { useAppDispatch } from "@/hooks/hooks";
import { removeFromCart, updateQuantity } from "@/redux/slice/cartSlice";
import { QuantitySelector } from "./QuantitySelector";
import { Button } from "./ui/button";

export function CartItemCard({ item }: { item: ICartItem }) {
  const dispatch = useAppDispatch();
  const { product, quantity } = item;

  const handleQuantityChange = (newQuantity: number) => {
    dispatch(updateQuantity({ id: product.id, quantity: newQuantity }));
  };

  const handleRemove = () => {
    dispatch(removeFromCart(product.id));
  };

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-0">
      <Link to={`/products/${product.id}`} className="shrink-0">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted/20 rounded-md overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
      
      <div className="flex flex-col flex-grow justify-between py-1">
        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {product.category}
            </div>
            <Link to={`/products/${product.id}`}>
              <h3 className="font-semibold text-base sm:text-lg line-clamp-2 hover:text-violet-500 transition-colors">
                {product.name}
              </h3>
            </Link>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg sm:text-xl">${product.price.toFixed(2)}</div>
            {product.originalPrice && (
              <div className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-end mt-4">
          <QuantitySelector quantity={quantity} onChange={handleQuantityChange} />
          
          <div className="flex items-center gap-4">
            <span className="font-semibold hidden sm:inline-block">
              Total: ${(product.price * quantity).toFixed(2)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={handleRemove}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
