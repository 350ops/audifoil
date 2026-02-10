import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded-lg bg-border/50', className)} />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-secondary p-4">
      <Skeleton className="mb-3 h-40 w-full rounded-xl" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="mb-2 h-4 w-1/2" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}

export function SkeletonTripCard() {
  return (
    <div className="rounded-2xl border border-border bg-secondary p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div>
            <Skeleton className="mb-1 h-5 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <div>
          <Skeleton className="mb-1 h-6 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}
