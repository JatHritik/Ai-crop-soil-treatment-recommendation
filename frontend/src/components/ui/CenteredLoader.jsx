import React from 'react'
import { LoadingSpinner } from './LoadingSpinner'

const CenteredLoader = ({ size = 'lg', message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size={size} />
        <p className="text-ink-600 text-sm font-medium">{message}</p>
      </div>
    </div>
  )
}

export { CenteredLoader }
