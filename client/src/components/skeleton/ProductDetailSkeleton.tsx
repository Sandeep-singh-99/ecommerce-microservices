import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 md:px-10 py-8">
      {/* Breadcrumbs Skeleton */}
      <div className="flex items-center space-x-2 mb-8">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images Skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, idx) => (
              <Skeleton key={idx} className="aspect-square w-full rounded-xl" />
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="flex flex-col">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-10 w-1/2 mb-4" />

          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-5 w-24" />
          </div>

          <div className="flex items-end gap-3 mb-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-6 w-16 mb-1" />
            <Skeleton className="h-6 w-16 mb-2" />
          </div>

          <div className="space-y-2 mb-8">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>

          <Separator className="mb-8" />

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-12 w-32" />
            </div>
            <div className="flex flex-col gap-2 flex-1 justify-end">
              <Skeleton className="h-12 w-full" />
            </div>
            <div className="flex items-end">
              <Skeleton className="h-12 w-12" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-xl border border-border/50">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center p-2 gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="mb-20">
        <div className="flex gap-6 mb-8 border-b border-border pb-[1px]">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-6 w-24 mb-2" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    </div>
  );
}
