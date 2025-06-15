
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ApplicationsLoadingSkeletonProps {
  count?: number;
}

const ApplicationsLoadingSkeleton = ({ count = 5 }: ApplicationsLoadingSkeletonProps) => {
  return (
    <div className="space-y-4">
      {/* Select all skeleton */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
        <Skeleton className="w-4 h-4" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Application cards skeleton */}
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex items-start gap-3 p-1">
            <div className="pt-2">
              <Skeleton className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-lg border shadow-sm p-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Left side - Agent info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                      <div className="min-w-0 flex-1 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Status and actions */}
                  <div className="flex flex-col sm:items-end gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-9 w-28" />
                  </div>
                </div>

                {/* Operating areas */}
                <div className="mt-3 pt-3 border-t">
                  <div className="flex flex-wrap gap-1">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-18" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between py-4">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-8" />
          <Skeleton className="h-9 w-8" />
          <Skeleton className="h-9 w-8" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
    </div>
  );
};

export default ApplicationsLoadingSkeleton;
