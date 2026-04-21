import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { dummyProducts, dummyCategories } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { FilterSidebar } from '@/components/FilterSidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CategoryProducts() {
  const { slug } = useParams<{ slug: string }>();
  const [sortBy, setSortBy] = useState("featured");

  const categoryInfo = dummyCategories.find(c => c.slug === slug) || {
    name: slug?.charAt(0).toUpperCase() + slug?.slice(1) || 'Category',
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop"
  };

  // Filter products by category (case-insensitive)
  const products = dummyProducts.filter(p => p.category.toLowerCase() === slug?.toLowerCase());
  
  // Pad if empty just for demo purposes
  const displayProducts = products.length > 0 ? products : dummyProducts.slice(0, 4);

  return (
    <div>
      {/* Category Header Banner */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-slate-900 border-b border-border">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10" />
          <img 
            src={categoryInfo.image} 
            alt={categoryInfo.name} 
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="container relative z-20 h-full flex flex-col justify-end pb-12 px-4 md:px-10">
          <nav className="flex text-sm text-slate-300 mb-4 opacity-80">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/products" className="hover:text-white transition-colors">Categories</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white font-medium">{categoryInfo.name}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            {categoryInfo.name}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-10 py-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <p className="text-muted-foreground">Showing {displayProducts.length} products</p>
          
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden flex-1">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[340px]">
                <SheetHeader className="text-left mb-6">
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Refine your product search</SheetDescription>
                </SheetHeader>
                <FilterSidebar />
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <SlidersHorizontal className="h-4 w-4 hidden md:block text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest Arrivals</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-28">
              <FilterSidebar />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {displayProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
