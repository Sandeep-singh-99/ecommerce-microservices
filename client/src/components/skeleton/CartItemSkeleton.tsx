import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-0">
      <div className="shrink-0">
        <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-md" />
      </div>
      
      <div className="flex flex-col flex-grow justify-between py-1">
        <div className="flex justify-between items-start gap-4">
          <div className="w-full">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-5 w-3/4 sm:w-2/3 mb-1" />
            <Skeleton className="h-5 w-1/2 sm:w-1/3" />
          </div>
          <div className="text-right">
            <Skeleton className="h-6 w-16 mb-1" />
            <Skeleton className="h-4 w-12 ml-auto" />
          </div>
        </div>

        <div className="flex justify-between items-end mt-4">
          <div className="flex items-center gap-2">
             <Skeleton className="h-8 w-8 rounded-md" />
             <Skeleton className="h-8 w-12 rounded-md" />
             <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-20 hidden sm:inline-block" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
