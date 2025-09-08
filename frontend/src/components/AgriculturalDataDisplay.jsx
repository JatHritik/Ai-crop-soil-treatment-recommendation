import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Badge } from './ui/Badge'
import { 
  Droplets, 
  Shield, 
  Leaf, 
  AlertTriangle, 
  Calendar, 
  Target,
  Package,
  Clock,
  MapPin
} from 'lucide-react'

const AgriculturalDataDisplay = ({ data }) => {
  if (!data || typeof data !== 'object') {
    return null
  }

  // Debug logging to see what data we're getting
  console.log('AgriculturalDataDisplay received data:', data)
  console.log('Data type:', typeof data)
  console.log('Data keys:', Object.keys(data))

  const renderItem = (item, index) => {
    if (!item || typeof item !== 'object') return null

    return (
      <div key={index} className="bg-white border border-surface-200 rounded-lg p-4 space-y-3">
        {item.name && (
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold text-ink-900 text-lg">{item.name}</h4>
            {item.quantity && (
              <Badge variant="secondary" className="bg-accent-100 text-accent-800">
                {item.quantity}
              </Badge>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {item.purpose && (
            <div className="flex items-start space-x-2">
              <Target className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-ink-700">Purpose:</span>
                <p className="text-ink-900 text-sm">{item.purpose}</p>
              </div>
            </div>
          )}

          {item.quantity && (
            <div className="flex items-start space-x-2">
              <Package className="w-4 h-4 text-accent-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-ink-700">Quantity:</span>
                <p className="text-ink-900 text-sm">{item.quantity}</p>
              </div>
            </div>
          )}

          {item.applicationTime && (
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-info-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-ink-700">Application Time:</span>
                <p className="text-ink-900 text-sm">{item.applicationTime}</p>
              </div>
            </div>
          )}

          {item.applicationMethod && (
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-ink-700">Method:</span>
                <p className="text-ink-900 text-sm">{item.applicationMethod}</p>
              </div>
            </div>
          )}

          {item.targetWeeds && (
            <div className="flex items-start space-x-2">
              <Leaf className="w-4 h-4 text-danger-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-ink-700">Target Weeds:</span>
                <p className="text-ink-900 text-sm">{item.targetWeeds}</p>
              </div>
            </div>
          )}

          {item.targetPests && (
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-warning-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-ink-700">Target Pests:</span>
                <p className="text-ink-900 text-sm">{item.targetPests}</p>
              </div>
            </div>
          )}

          {item.safetyNotes && (
            <div className="flex items-start space-x-2 md:col-span-2">
              <AlertTriangle className="w-4 h-4 text-warning-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-ink-700">Safety Notes:</span>
                <p className="text-ink-900 text-sm">{item.safetyNotes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderDeficiencyItem = (item, index) => {
    if (!item || typeof item !== 'object') return null

    return (
      <div key={index} className="bg-white border border-surface-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-ink-900 text-lg">{item.nutrient}</h4>
          <div className="flex space-x-2">
            <Badge variant="outline" className="text-danger-600 border-danger-200">
              Current: {item.currentLevel}
            </Badge>
            <Badge variant="outline" className="text-success-600 border-success-200">
              Recommended: {item.recommendedLevel}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {item.quantity && (
            <div className="flex items-start space-x-2">
              <Package className="w-4 h-4 text-accent-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-ink-700">Quantity Needed:</span>
                <p className="text-ink-900 text-sm">{item.quantity}</p>
              </div>
            </div>
          )}

          {item.solution && (
            <div className="flex items-start space-x-2">
              <Droplets className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-ink-700">Solution:</span>
                <p className="text-ink-900 text-sm">{item.solution}</p>
              </div>
            </div>
          )}

          {item.timeline && (
            <div className="flex items-start space-x-2 md:col-span-2">
              <Clock className="w-4 h-4 text-info-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-ink-700">Expected Improvement:</span>
                <p className="text-ink-900 text-sm">{item.timeline}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // If the data doesn't have the expected structure, don't show anything
  if (!data.herbicides && !data.pesticides && !data.fertilizers && !data.soilDeficiencies) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Agricultural Recommendations Header */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-6 border border-primary-200">
        <h3 className="text-2xl font-bold text-ink-900 mb-2 flex items-center">
          <Leaf className="w-6 h-6 mr-3 text-primary-600" />
          Agricultural Recommendations
        </h3>
        <p className="text-ink-700">AI-powered recommendations for optimal crop cultivation</p>
      </div>

      <div className="space-y-6">
          {/* Herbicides */}
          {data.herbicides && Array.isArray(data.herbicides) && data.herbicides.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Droplets className="w-5 h-5 text-danger-600" />
              <span>Herbicides</span>
            </CardTitle>
            <CardDescription>
              Recommended herbicides for weed control
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.herbicides.map((item, index) => renderItem(item, index))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pesticides */}
      {data.pesticides && Array.isArray(data.pesticides) && data.pesticides.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-warning-600" />
              <span>Pesticides</span>
            </CardTitle>
            <CardDescription>
              Recommended pesticides for pest control
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.pesticides.map((item, index) => renderItem(item, index))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fertilizers */}
      {data.fertilizers && Array.isArray(data.fertilizers) && data.fertilizers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Leaf className="w-5 h-5 text-success-600" />
              <span>Fertilizers</span>
            </CardTitle>
            <CardDescription>
              Recommended fertilizers for soil improvement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.fertilizers.map((item, index) => renderItem(item, index))}
            </div>
          </CardContent>
        </Card>
      )}

          {/* Soil Deficiencies */}
          {data.soilDeficiencies && Array.isArray(data.soilDeficiencies) && data.soilDeficiencies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-danger-600" />
                  <span>Soil Deficiencies</span>
                </CardTitle>
                <CardDescription>
                  Identified nutrient deficiencies and solutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.soilDeficiencies.map((item, index) => renderDeficiencyItem(item, index))}
                </div>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  )
}

export { AgriculturalDataDisplay }
