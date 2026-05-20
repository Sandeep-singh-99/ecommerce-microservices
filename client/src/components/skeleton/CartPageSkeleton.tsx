import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { CartItemSkeleton } from './CartItemSkeleton';

export function CartPageSkeleton() {
  return (
    <div className="container mx-auto px-4 md:px-10 py-8">
      <Skeleton className="h-9 w-48 mb-8" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 divide-y divide-border">
              <CartItemSkeleton />
              <CartItemSkeleton />
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="border-border/50 shadow-sm sticky top-28">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-12" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-12" />
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center py-2">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-20" />
              </div>

              <div className="pt-4 pb-2">
                <div className="flex space-x-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex flex-col gap-4">
              <Skeleton className="h-12 w-full rounded-md" />
              <div className="flex items-center justify-center text-xs text-muted-foreground gap-1 w-full">
                <ShieldCheck className="h-4 w-4" /> Secure Checkout
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
