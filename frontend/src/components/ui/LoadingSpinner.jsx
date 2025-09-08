import React from 'react'
import { cn } from '../../lib/utils'

const LoadingSpinner = ({ className, size = 'md', ...props }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-surface-200 border-t-accent-500',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}

export { LoadingSpinner }
