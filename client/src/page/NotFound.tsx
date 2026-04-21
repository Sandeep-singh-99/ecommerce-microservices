import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="relative mb-8">
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-500/20 to-primary/20">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <ShoppingBag className="h-20 w-20 text-violet-500 animate-bounce" />
        </div>
      </div>
      <h2 className="text-3xl font-bold mb-4 tracking-tight">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md text-lg">
        Oops! We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps never existed.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="rounded-full px-8">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
        <Button variant="outline" asChild size="lg" className="rounded-full px-8">
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>
    </div>
  );
}
