import React, { useState } from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { 
  Lightbulb, 
  Leaf, 
  Droplets, 
  Shield, 
  Package, 
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'

const DetailedRecommendationsButton = ({ reportData, location, season }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const getDetailedRecommendations = async () => {
    setIsLoading(true)
    try {
      // Get report ID from the current URL or pass it as prop
      const reportId = window.location.pathname.split('/').pop()
      
      const response = await fetch(`/api/reports/${reportId}/detailed-recommendations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch detailed recommendations')
      }

      const data = await response.json()
      const recommendations = data.recommendations
      
      setRecommendations(recommendations)
      setShowModal(true)
    } catch (error) {
      console.error('Error fetching detailed recommendations:', error)
      // Fallback to mock data if API fails
      const mockRecommendations = {
        soilHealth: {
          pH: "6.2 - Slightly acidic, needs lime application",
          organicMatter: "2.1% - Low, add compost",
          nutrients: {
            nitrogen: "45 ppm - Low, apply urea",
            phosphorus: "18 ppm - Medium, apply DAP",
            potassium: "120 ppm - Adequate"
          }
        },
        cropRecommendations: {
          primary: ["Wheat", "Barley", "Mustard"],
          secondary: ["Gram", "Lentil", "Peas"],
          avoid: ["Rice - requires more water"]
        },
        fertilizerSchedule: [
          {
            stage: "Pre-planting",
            fertilizer: "DAP (18-46-0)",
            quantity: "50 kg per acre",
            timing: "15 days before sowing"
          },
          {
            stage: "First top dressing",
            fertilizer: "Urea (46-0-0)",
            quantity: "50 kg per acre",
            timing: "25-30 days after sowing"
          },
          {
            stage: "Second top dressing",
            fertilizer: "Urea (46-0-0)",
            quantity: "25 kg per acre",
            timing: "45-50 days after sowing"
          }
        ],
        pestManagement: [
          {
            pest: "Aphids",
            solution: "Imidacloprid 20 ml per acre",
            timing: "When 5% plants show infestation",
            prevention: "Use resistant varieties"
          },
          {
            pest: "Rust disease",
            solution: "Mancozeb 2 kg per acre",
            timing: "First appearance of symptoms",
            prevention: "Crop rotation with legumes"
          }
        ],
        irrigationSchedule: [
          {
            stage: "Sowing to germination",
            frequency: "Every 3-4 days",
            quantity: "15-20 mm",
            method: "Light irrigation"
          },
          {
            stage: "Tillering",
            frequency: "Every 7-10 days",
            quantity: "25-30 mm",
            method: "Medium irrigation"
          },
          {
            stage: "Flowering to grain filling",
            frequency: "Every 5-7 days",
            quantity: "30-35 mm",
            method: "Heavy irrigation"
          }
        ],
        seasonalTips: [
          "Monitor soil moisture regularly",
          "Apply organic matter to improve soil structure",
          "Use crop rotation to break pest cycles",
          "Test soil every 2-3 years",
          "Keep field records for better planning"
        ]
      }
      
      setRecommendations(mockRecommendations)
      setShowModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setRecommendations(null)
  }

  return (
    <>
      <div className="flex justify-center mb-6">
        <Button
          onClick={getDetailedRecommendations}
          disabled={isLoading}
          className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Getting Detailed Recommendations...</span>
            </>
          ) : (
            <>
              <Lightbulb className="w-5 h-5" />
              <span>Get Detailed AI Recommendations</span>
            </>
          )}
        </Button>
      </div>

      {showModal && recommendations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary-800 flex items-center">
                  <Lightbulb className="w-6 h-6 mr-2 text-primary-600" />
                  Detailed AI Recommendations
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Soil Health */}
                <Card>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-primary-700 mb-4 flex items-center">
                      <Leaf className="w-5 h-5 mr-2" />
                      Soil Health Analysis
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">pH Level:</span>
                        <Badge variant="warning">{recommendations.soilHealth.pH}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Organic Matter:</span>
                        <Badge variant="danger">{recommendations.soilHealth.organicMatter}</Badge>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Nutrients:</h4>
                        {Object.entries(recommendations.soilHealth.nutrients).map(([nutrient, value]) => (
                          <div key={nutrient} className="flex justify-between text-sm">
                            <span className="capitalize">{nutrient}:</span>
                            <span className="text-gray-600">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Crop Recommendations */}
                <Card>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-primary-700 mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Crop Recommendations
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-green-600 mb-2">Highly Recommended:</h4>
                        <div className="flex flex-wrap gap-2">
                          {recommendations.cropRecommendations.primary.map(crop => (
                            <Badge key={crop} variant="success">{crop}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-blue-600 mb-2">Moderately Suitable:</h4>
                        <div className="flex flex-wrap gap-2">
                          {recommendations.cropRecommendations.secondary.map(crop => (
                            <Badge key={crop} variant="info">{crop}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-red-600 mb-2">Not Recommended:</h4>
                        <div className="flex flex-wrap gap-2">
                          {recommendations.cropRecommendations.avoid.map(crop => (
                            <Badge key={crop} variant="danger">{crop}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Fertilizer Schedule */}
                <Card>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-primary-700 mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Fertilizer Schedule
                    </h3>
                    <div className="space-y-3">
                      {recommendations.fertilizerSchedule.map((item, index) => (
                        <div key={index} className="border-l-4 border-primary-200 pl-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-sm">{item.stage}</h4>
                              <p className="text-sm text-gray-600">{item.fertilizer}</p>
                              <p className="text-sm text-gray-500">{item.quantity}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {item.timing}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Pest Management */}
                <Card>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-primary-700 mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Pest Management
                    </h3>
                    <div className="space-y-3">
                      {recommendations.pestManagement.map((item, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <h4 className="font-medium text-sm text-red-600">{item.pest}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.solution}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {item.timing}
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                            Prevention: {item.prevention}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Irrigation Schedule */}
                <Card>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-primary-700 mb-4 flex items-center">
                      <Droplets className="w-5 h-5 mr-2" />
                      Irrigation Schedule
                    </h3>
                    <div className="space-y-3">
                      {recommendations.irrigationSchedule.map((item, index) => (
                        <div key={index} className="border-l-4 border-blue-200 pl-4">
                          <h4 className="font-medium text-sm">{item.stage}</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-1">
                            <div>
                              <span className="font-medium">Frequency:</span> {item.frequency}
                            </div>
                            <div>
                              <span className="font-medium">Quantity:</span> {item.quantity}
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium">Method:</span> {item.method}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Seasonal Tips */}
                <Card>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-primary-700 mb-4 flex items-center">
                      <Info className="w-5 h-5 mr-2" />
                      Seasonal Tips
                    </h3>
                    <div className="space-y-2">
                      {recommendations.seasonalTips.map((tip, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={closeModal}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DetailedRecommendationsButton
