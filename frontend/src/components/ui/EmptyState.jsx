import React from 'react'
import { cn } from '../../lib/utils'

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className 
}) => {
  return (
    <div className={cn('empty-state', className)}>
      {Icon && (
        <div className="empty-state-icon">
          <Icon className="w-16 h-16 text-surface-400" />
        </div>
      )}
      <h3 className="empty-state-title">{title}</h3>
      {description && (
        <p className="empty-state-description">{description}</p>
      )}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  )
}

export { EmptyState }
