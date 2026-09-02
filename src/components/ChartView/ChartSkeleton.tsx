import { memo } from 'react';
import { Skeleton } from '../UI/Skeleton';

export const ChartSkeleton = memo(() => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs min-h-[420px] flex flex-col justify-between">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="grid grid-cols-5 gap-4 items-end h-64 px-4">
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-60 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
      <div className="flex justify-between pt-4 border-t border-slate-100">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
});

ChartSkeleton.displayName = 'ChartSkeleton';

