import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Badge } from './ui/Badge'

const ObjectDataDisplay = ({ data, title = "Data" }) => {
  if (!data || typeof data !== 'object') {
    return <div className="text-ink-500 italic">No data available</div>
  }

  const renderValue = (value, key) => {
    if (value === null || value === undefined) {
      return <span className="text-ink-500 italic">Not specified</span>
    }
    
    if (typeof value === 'string' || typeof value === 'number') {
      return <span className="text-ink-900">{value}</span>
    }
    
    if (typeof value === 'boolean') {
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-success-100 text-success-800' : 'bg-danger-100 text-danger-800'
        }`}>
          {value ? 'Yes' : 'No'}
        </span>
      )
    }
    
    if (Array.isArray(value)) {
      return (
        <div className="space-y-1">
          {value.map((item, index) => (
            <div key={index} className="flex items-center">
              <span className="w-2 h-2 bg-accent-500 rounded-full mr-2 flex-shrink-0" />
              <span className="text-ink-900">
                {typeof item === 'object' ? '[Object Data]' : String(item)}
              </span>
            </div>
          ))}
        </div>
      )
    }
    
    if (typeof value === 'object') {
      return <ObjectDataDisplay data={value} title="" />
    }
    
    return <span className="text-ink-900">{String(value)}</span>
  }

  const renderObject = (obj, objTitle) => {
    if (!obj || typeof obj !== 'object') return null

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{objTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(obj).map(([key, value]) => (
              <div key={key} className="flex flex-col sm:flex-row sm:items-start">
                <div className="sm:w-1/3 mb-1 sm:mb-0">
                  <span className="font-medium text-ink-700 text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                </div>
                <div className="sm:w-2/3 sm:ml-4">
                  {renderValue(value, key)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // If it's an array, render each item
  if (Array.isArray(data)) {
    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            {typeof item === 'object' ? (
              renderObject(item, `${title} ${index + 1}`)
            ) : (
              <div className="bg-surface-50 border border-surface-200 rounded-lg p-3">
                <span className="text-ink-900">{String(item)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  // If it's an object, render it
  return renderObject(data, title)
}

export { ObjectDataDisplay }

