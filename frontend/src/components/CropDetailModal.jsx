import React from 'react'
import { X, Leaf, Droplets, Shield, Package, Calendar, Target, AlertTriangle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'

const CropDetailModal = ({ crop, isOpen, onClose }) => {
  if (!isOpen || !crop) return null

  const cropDetails = {
    // Wheat
    'Wheat': {
      description: 'Wheat is a cereal grain that is a worldwide staple food. It is suitable for temperate climates and requires well-drained soil.',
      growingSeason: 'Rabi (October - March)',
      soilType: 'Well-drained loamy soil',
      waterRequirement: 'Moderate (500-600mm)',
      pesticides: [
        {
          name: 'Chlorpyrifos 20% EC',
          target: 'Aphids, Thrips',
          quantity: '1.5-2.0 ml per liter',
          applicationTime: 'Early morning or evening',
          safetyNotes: 'Use protective equipment, avoid contact with skin'
        },
        {
          name: 'Imidacloprid 17.8% SL',
          target: 'Sucking pests',
          quantity: '0.5-1.0 ml per liter',
          applicationTime: 'Before flowering',
          safetyNotes: 'Do not apply during flowering to protect bees'
        }
      ],
      herbicides: [
        {
          name: '2,4-D Amine 58% SL',
          target: 'Broadleaf weeds',
          quantity: '1.5-2.0 ml per liter',
          applicationTime: '2-4 leaf stage of wheat',
          safetyNotes: 'Avoid drift to other crops'
        },
        {
          name: 'Clodinafop-propargyl 15% WP',
          target: 'Grassy weeds',
          quantity: '40-50g per acre',
          applicationTime: 'Early post-emergence',
          safetyNotes: 'Apply when weeds are 2-4 leaf stage'
        }
      ],
      fertilizers: [
        {
          name: 'Urea (46% N)',
          quantity: '100-120 kg per acre',
          applicationTime: 'Split application - 50% at sowing, 50% at tillering',
          purpose: 'Nitrogen supply for growth and yield'
        },
        {
          name: 'DAP (18% N, 46% P)',
          quantity: '50-60 kg per acre',
          applicationTime: 'At sowing time',
          purpose: 'Phosphorus for root development'
        },
        {
          name: 'MOP (60% K)',
          quantity: '40-50 kg per acre',
          applicationTime: 'At sowing or early growth stage',
          purpose: 'Potassium for grain quality'
        }
      ],
      expectedYield: '35-45 quintals per acre'
    },
    // Rice
    'Rice': {
      description: 'Rice is the most important staple food for a large part of the world\'s population, especially in Asia.',
      growingSeason: 'Kharif (June - November)',
      soilType: 'Clay loam with good water retention',
      waterRequirement: 'High (1000-1200mm)',
      pesticides: [
        {
          name: 'Monocrotophos 36% SL',
          target: 'Stem borer, Leaf folder',
          quantity: '1.5-2.0 ml per liter',
          applicationTime: 'Early morning',
          safetyNotes: 'Highly toxic, use with extreme caution'
        },
        {
          name: 'Cartap hydrochloride 50% SP',
          target: 'Rice hispa, Leaf folder',
          quantity: '500-750g per acre',
          applicationTime: 'When pest appears',
          safetyNotes: 'Safe for beneficial insects'
        }
      ],
      herbicides: [
        {
          name: 'Butachlor 50% EC',
          target: 'Grassy and broadleaf weeds',
          quantity: '1.5-2.0 liters per acre',
          applicationTime: '3-5 days after transplanting',
          safetyNotes: 'Apply in standing water'
        },
        {
          name: '2,4-D Sodium salt 80% WP',
          target: 'Broadleaf weeds',
          quantity: '625-750g per acre',
          applicationTime: '20-25 days after transplanting',
          safetyNotes: 'Drain water before application'
        }
      ],
      fertilizers: [
        {
          name: 'Urea (46% N)',
          quantity: '120-150 kg per acre',
          applicationTime: 'Split in 3 doses - 25% at transplanting, 50% at tillering, 25% at panicle initiation',
          purpose: 'Nitrogen for vegetative and reproductive growth'
        },
        {
          name: 'SSP (16% P)',
          quantity: '100-125 kg per acre',
          applicationTime: 'At transplanting',
          purpose: 'Phosphorus for root and tiller development'
        },
        {
          name: 'MOP (60% K)',
          quantity: '50-60 kg per acre',
          applicationTime: 'Split application - 50% at transplanting, 50% at panicle initiation',
          purpose: 'Potassium for grain filling and quality'
        }
      ],
      expectedYield: '40-50 quintals per acre'
    },
    // Maize
    'Maize': {
      description: 'Maize is one of the most important cereal crops globally, used for food, feed, and industrial purposes.',
      growingSeason: 'Kharif (June - October)',
      soilType: 'Well-drained sandy loam to clay loam',
      waterRequirement: 'Moderate (500-600mm)',
      pesticides: [
        {
          name: 'Cypermethrin 25% EC',
          target: 'Army worm, Stem borer',
          quantity: '1.0-1.5 ml per liter',
          applicationTime: 'Early morning or evening',
          safetyNotes: 'Moderate toxicity, use protective gear'
        },
        {
          name: 'Thiamethoxam 25% WG',
          target: 'Aphids, Jassids',
          quantity: '0.5-1.0g per liter',
          applicationTime: 'When pest appears',
          safetyNotes: 'Systemic action, long-lasting effect'
        }
      ],
      herbicides: [
        {
          name: 'Atrazine 50% WP',
          target: 'Broadleaf and grassy weeds',
          quantity: '1.0-1.5 kg per acre',
          applicationTime: 'Pre-emergence or early post-emergence',
          safetyNotes: 'Apply to moist soil, avoid contact with crop'
        },
        {
          name: '2,4-D Amine 58% SL',
          target: 'Broadleaf weeds',
          quantity: '1.0-1.5 ml per liter',
          applicationTime: '3-5 leaf stage of maize',
          safetyNotes: 'Do not apply in windy conditions'
        }
      ],
      fertilizers: [
        {
          name: 'Urea (46% N)',
          quantity: '100-120 kg per acre',
          applicationTime: 'Split application - 30% at sowing, 40% at knee-high stage, 30% at tasseling',
          purpose: 'Nitrogen for vegetative growth and grain development'
        },
        {
          name: 'DAP (18% N, 46% P)',
          quantity: '60-80 kg per acre',
          applicationTime: 'At sowing',
          purpose: 'Phosphorus for root development and flowering'
        },
        {
          name: 'MOP (60% K)',
          quantity: '50-60 kg per acre',
          applicationTime: 'At sowing or early growth stage',
          purpose: 'Potassium for stalk strength and grain quality'
        }
      ],
      expectedYield: '45-55 quintals per acre'
    },
    // Cotton
    'Cotton': {
      description: 'Cotton is a fiber crop that is the most important source of natural fiber for the textile industry.',
      growingSeason: 'Kharif (April - December)',
      soilType: 'Well-drained black cotton soil',
      waterRequirement: 'Moderate to high (600-800mm)',
      pesticides: [
        {
          name: 'Acephate 75% SP',
          target: 'Sucking pests, Bollworms',
          quantity: '1.0-1.5g per liter',
          applicationTime: 'Early morning or evening',
          safetyNotes: 'Moderate toxicity, avoid during flowering'
        },
        {
          name: 'Spinosad 45% SC',
          target: 'Bollworms, Spotted bollworm',
          quantity: '0.5-1.0 ml per liter',
          applicationTime: 'When pest appears',
          safetyNotes: 'Safe for beneficial insects, organic option'
        }
      ],
      herbicides: [
        {
          name: 'Pendimethalin 30% EC',
          target: 'Grassy and broadleaf weeds',
          quantity: '1.5-2.0 liters per acre',
          applicationTime: 'Pre-emergence',
          safetyNotes: 'Apply to moist soil, avoid contact with crop'
        },
        {
          name: 'Quizalofop-ethyl 5% EC',
          target: 'Grassy weeds',
          quantity: '400-500 ml per acre',
          applicationTime: 'Post-emergence when weeds are 2-4 leaf stage',
          safetyNotes: 'Do not apply in windy conditions'
        }
      ],
      fertilizers: [
        {
          name: 'Urea (46% N)',
          quantity: '80-100 kg per acre',
          applicationTime: 'Split application - 25% at sowing, 50% at squaring, 25% at flowering',
          purpose: 'Nitrogen for vegetative growth and boll development'
        },
        {
          name: 'DAP (18% N, 46% P)',
          quantity: '50-60 kg per acre',
          applicationTime: 'At sowing',
          purpose: 'Phosphorus for root development and flowering'
        },
        {
          name: 'MOP (60% K)',
          quantity: '40-50 kg per acre',
          applicationTime: 'At sowing and squaring stage',
          purpose: 'Potassium for fiber quality and boll development'
        }
      ],
      expectedYield: '8-12 quintals per acre'
    },
    // Sugarcane
    'Sugarcane': {
      description: 'Sugarcane is a tall perennial grass used for sugar production and biofuel.',
      growingSeason: 'Year-round (October - March for planting)',
      soilType: 'Deep, well-drained loamy soil',
      waterRequirement: 'High (1500-2000mm)',
      pesticides: [
        {
          name: 'Chlorantraniliprole 18.5% SC',
          target: 'Top borer, Internode borer',
          quantity: '200-250 ml per acre',
          applicationTime: 'When pest appears',
          safetyNotes: 'Low toxicity, safe for beneficial insects'
        },
        {
          name: 'Fipronil 5% SC',
          target: 'Termites, White grubs',
          quantity: '1.0-1.5 liters per acre',
          applicationTime: 'At planting or when pest appears',
          safetyNotes: 'Highly toxic to fish and bees'
        }
      ],
      herbicides: [
        {
          name: 'Atrazine 50% WP',
          target: 'Broadleaf and grassy weeds',
          quantity: '1.5-2.0 kg per acre',
          applicationTime: 'Pre-emergence',
          safetyNotes: 'Apply to moist soil, avoid contact with crop'
        },
        {
          name: '2,4-D Amine 58% SL',
          target: 'Broadleaf weeds',
          quantity: '1.0-1.5 ml per liter',
          applicationTime: '3-4 leaf stage of sugarcane',
          safetyNotes: 'Do not apply in windy conditions'
        }
      ],
      fertilizers: [
        {
          name: 'Urea (46% N)',
          quantity: '150-200 kg per acre',
          applicationTime: 'Split application - 25% at planting, 50% at tillering, 25% at grand growth',
          purpose: 'Nitrogen for vegetative growth and cane development'
        },
        {
          name: 'DAP (18% N, 46% P)',
          quantity: '80-100 kg per acre',
          applicationTime: 'At planting',
          purpose: 'Phosphorus for root development and tillering'
        },
        {
          name: 'MOP (60% K)',
          quantity: '80-100 kg per acre',
          applicationTime: 'At planting and tillering stage',
          purpose: 'Potassium for sugar accumulation and cane quality'
        }
      ],
      expectedYield: '800-1000 quintals per acre'
    }
  }

  const details = cropDetails[crop.crop] || {
    description: 'Detailed information for this crop is being updated.',
    growingSeason: 'Varies by region',
    soilType: 'Well-drained soil recommended',
    waterRequirement: 'Moderate',
    pesticides: [],
    herbicides: [],
    fertilizers: [],
    expectedYield: 'Varies by variety and conditions'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Leaf className="w-6 h-6 mr-2 text-green-600" />
            {crop.crop} - Detailed Information
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{details.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Growing Season:</span>
                  <span className="text-gray-700">{details.growingSeason}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Soil Type:</span>
                  <span className="text-gray-700">{details.soilType}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Water Requirement:</span>
                  <span className="text-gray-700">{details.waterRequirement}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Expected Yield:</span>
                  <span className="text-gray-700">{details.expectedYield}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pesticides */}
          {details.pesticides.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-red-600" />
                  Recommended Pesticides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {details.pesticides.map((pesticide, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-red-900">{pesticide.name}</h4>
                        <Badge variant="outline" className="text-red-600 border-red-300">
                          {pesticide.target}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-red-800">Quantity:</span>
                          <p className="text-red-700">{pesticide.quantity}</p>
                        </div>
                        <div>
                          <span className="font-medium text-red-800">Application Time:</span>
                          <p className="text-red-700">{pesticide.applicationTime}</p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium text-red-800">Safety Notes:</span>
                          <p className="text-red-700">{pesticide.safetyNotes}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Herbicides */}
          {details.herbicides.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Droplets className="w-5 h-5 mr-2 text-orange-600" />
                  Recommended Herbicides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {details.herbicides.map((herbicide, index) => (
                    <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-orange-900">{herbicide.name}</h4>
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          {herbicide.target}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-orange-800">Quantity:</span>
                          <p className="text-orange-700">{herbicide.quantity}</p>
                        </div>
                        <div>
                          <span className="font-medium text-orange-800">Application Time:</span>
                          <p className="text-orange-700">{herbicide.applicationTime}</p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium text-orange-800">Safety Notes:</span>
                          <p className="text-orange-700">{herbicide.safetyNotes}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fertilizers */}
          {details.fertilizers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2 text-green-600" />
                  Recommended Fertilizers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {details.fertilizers.map((fertilizer, index) => (
                    <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-green-900">{fertilizer.name}</h4>
                        <Badge variant="outline" className="text-green-600 border-green-300">
                          {fertilizer.purpose}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-green-800">Quantity:</span>
                          <p className="text-green-700">{fertilizer.quantity}</p>
                        </div>
                        <div>
                          <span className="font-medium text-green-800">Application Time:</span>
                          <p className="text-green-700">{fertilizer.applicationTime}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Disclaimer */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">Important Disclaimer:</p>
                <p>These recommendations are general guidelines. Please consult with local agricultural experts, extension services, or certified agronomists before applying any pesticides, herbicides, or fertilizers. Always follow the manufacturer's instructions and local regulations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CropDetailModal
