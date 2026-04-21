import React, { useState } from "react";
import { dummyCategories } from "@/lib/data";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

export function FilterSidebar() {
  const [priceRange, setPriceRange] = useState([0, 1000]);

  return (
    <div className="w-full space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <div className="space-y-3">
          {dummyCategories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox id={`cat-${category.id}`} />
              <Label htmlFor={`cat-${category.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                {category.name} <span className="text-muted-foreground font-normal">({category.productCount})</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Price Range</h3>
          <span className="text-sm text-muted-foreground">${priceRange[0]} - ${priceRange[1]}</span>
        </div>
        <Slider
          defaultValue={[0, 1000]}
          max={2000}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mt-6"
        />
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Rating</h3>
        <RadioGroup defaultValue="all">
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="4" id="r4" />
            <Label htmlFor="r4" className="cursor-pointer">4 Stars & Up</Label>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="3" id="r3" />
            <Label htmlFor="r3" className="cursor-pointer">3 Stars & Up</Label>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="2" id="r2" />
            <Label htmlFor="r2" className="cursor-pointer">2 Stars & Up</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="rall" />
            <Label htmlFor="rall" className="cursor-pointer">All Ratings</Label>
          </div>
        </RadioGroup>
      </div>

      <Button className="w-full">Apply Filters</Button>
    </div>
  );
}
