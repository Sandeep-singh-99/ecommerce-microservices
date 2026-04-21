import React from "react";
import { Link } from "react-router-dom";
import type { ICategory } from "@/types/product";
import { Card } from "./ui/card";

export function CategoryCard({ category }: { category: ICategory }) {
  return (
    <Link to={`/category/${category.slug}`} className="group block">
      <Card className="relative overflow-hidden aspect-[4/5] border-0 rounded-2xl">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
          <h3 className="text-white text-2xl font-bold tracking-tight mb-1 group-hover:text-violet-400 transition-colors">
            {category.name}
          </h3>
          <p className="text-gray-300 text-sm font-medium">
            {category.productCount} Products
          </p>
        </div>
      </Card>
    </Link>
  );
}
