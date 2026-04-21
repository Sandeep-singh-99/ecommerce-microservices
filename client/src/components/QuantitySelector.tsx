import React from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "./ui/button";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  max?: number;
  min?: number;
}

export function QuantitySelector({ quantity, onChange, max = 10, min = 1 }: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center border border-input rounded-md w-fit">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-none rounded-l-md"
        onClick={handleDecrease}
        disabled={quantity <= min}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <div className="w-10 text-center font-medium text-sm">
        {quantity}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-none rounded-r-md"
        onClick={handleIncrease}
        disabled={quantity >= max}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
