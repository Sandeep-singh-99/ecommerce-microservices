import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "../ui/card";

export function ProductCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden border-border/50 bg-card flex flex-col">
      {/* Image */}
      <div className="relative aspect-square">
        <Skeleton className="w-full h-full" />
      </div>

      <CardContent className="p-4 flex flex-col gap-2">
        {/* Category */}
        <Skeleton className="h-3 w-20" />

        {/* Title */}
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />

        {/* Rating */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-10" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        {/* Price */}
        <Skeleton className="h-6 w-16" />
      </CardFooter>
    </Card>
  );
}