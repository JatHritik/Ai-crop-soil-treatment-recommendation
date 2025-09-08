import React from 'react'
import { cn } from '../../lib/utils'

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn('loading-skeleton', className)}
      {...props}
    />
  )
}

const SkeletonCard = () => (
  <div className="rounded-2xl border border-surface-200 bg-white/80 p-6">
    <div className="space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
      <div className="flex space-x-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  </div>
)

const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    ))}
  </div>
)

export { Skeleton, SkeletonCard, SkeletonTable }
