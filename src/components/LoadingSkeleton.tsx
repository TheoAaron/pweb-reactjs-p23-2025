import { Skeleton } from '@/components/ui/skeleton';

export const BookCardSkeleton = () => (
  <div className="glass-card rounded-2xl p-6 space-y-4">
    <Skeleton className="h-48 w-full rounded-xl shimmer" />
    <Skeleton className="h-6 w-3/4 shimmer" />
    <Skeleton className="h-4 w-1/2 shimmer" />
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-24 shimmer" />
      <Skeleton className="h-10 w-28 shimmer" />
    </div>
  </div>
);

export const BookDetailSkeleton = () => (
  <div className="max-w-6xl mx-auto p-6 space-y-8">
    <Skeleton className="h-8 w-32 shimmer" />
    <div className="grid md:grid-cols-2 gap-8">
      <Skeleton className="h-96 w-full rounded-2xl shimmer" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-full shimmer" />
        <Skeleton className="h-6 w-2/3 shimmer" />
        <Skeleton className="h-24 w-full shimmer" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-20 shimmer" />
          <Skeleton className="h-20 shimmer" />
          <Skeleton className="h-20 shimmer" />
          <Skeleton className="h-20 shimmer" />
        </div>
        <Skeleton className="h-12 w-full shimmer" />
      </div>
    </div>
  </div>
);

export const TransactionSkeleton = () => (
  <div className="glass-card rounded-2xl p-6 space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <Skeleton className="h-6 w-32 shimmer" />
        <Skeleton className="h-4 w-48 shimmer" />
      </div>
      <Skeleton className="h-8 w-24 shimmer" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-12 shimmer" />
      <Skeleton className="h-12 shimmer" />
    </div>
    <Skeleton className="h-6 w-full shimmer" />
  </div>
);
