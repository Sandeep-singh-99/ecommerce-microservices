import { Skeleton } from "@/components/ui/skeleton";

export function CategoryCardSkeleton() {
  return (
    <div className="relative overflow-hidden aspect-4/5 rounded-2xl">
      {/* Image */}
      <Skeleton className="w-full h-full" />

      {/* Overlay text */}
      <div className="absolute bottom-0 p-6 w-full">
        <Skeleton className="h-6 w-2/3 mb-2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}