import { Skeleton } from "@/components/ui/skeleton";

export default function PlanSkeleton() {
    return (
         <div className="space-y-4">
            <Skeleton className="h-8 w-1/2 mx-auto" />
            <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    )
}