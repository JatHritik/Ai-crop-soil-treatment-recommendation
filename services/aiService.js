const OpenAI = require('openai');

// Initialize OpenAI only if API key is available
let openai = null;
if (process.env.OPEN_AI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
    timeout: 30000, // 30 seconds timeout
    maxRetries: 3,
  });
}

// AI response cache to avoid reprocessing similar content
const aiCache = new Map();
const AI_CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Generate cache key for AI analysis
const generateAICacheKey = (reportData) => {
  const crypto = require('crypto');
  const keyData = {
    district: reportData.district,
    state: reportData.state,
    area: reportData.area,
    season: reportData.season,
    textHash: crypto.createHash('md5').update(reportData.extractedText || '').digest('hex')
  };
  return crypto.createHash('md5').update(JSON.stringify(keyData)).digest('hex');
};

// Check if AI cache entry is valid
const isAICacheValid = (cacheEntry) => {
  return cacheEntry && (Date.now() - cacheEntry.timestamp) < AI_CACHE_TTL;
};

// Function to validate if content is soil-related
const validateSoilContent = (extractedText) => {
  const soilKeywords = [
    'soil', 'मिट्टी', 'land', 'जमीन', 'fertility', 'उर्वरता', 'nutrient', 'पोषक',
    'nitrogen', 'नाइट्रोजन', 'phosphorus', 'फॉस्फोरस', 'potassium', 'पोटैशियम',
    'pH', 'acidity', 'अम्लता', 'alkaline', 'क्षारीय', 'organic matter', 'कार्बनिक पदार्थ',
    'crop', 'फसल', 'agriculture', 'कृषि', 'farming', 'खेती', 'yield', 'उत्पादन',
    'irrigation', 'सिंचाई', 'fertilizer', 'उर्वरक', 'compost', 'कंपोस्ट',
    'drainage', 'जल निकासी', 'erosion', 'कटाव', 'texture', 'बनावट',
    'moisture', 'नमी', 'temperature', 'तापमान', 'climate', 'जलवायु',
    'seed', 'बीज', 'planting', 'रोपण', 'harvest', 'कटाई', 'season', 'मौसम',
    'kharif', 'खरीफ', 'rabi', 'रबी', 'zaid', 'जायद', 'monsoon', 'मानसून',
    'rainfall', 'वर्षा', 'drought', 'सूखा', 'flood', 'बाढ़', 'pest', 'कीट',
    'disease', 'रोग', 'weed', 'खरपतवार', 'analysis', 'विश्लेषण', 'test', 'परीक्षण',
    'laboratory', 'प्रयोगशाला', 'sample', 'नमूना', 'report', 'रिपोर्ट'
  ];

  const text = extractedText.toLowerCase();
  const foundKeywords = soilKeywords.filter(keyword => 
    text.includes(keyword.toLowerCase())
  );

  // If less than 3 soil-related keywords found, consider it invalid
  return {
    isValid: foundKeywords.length >= 3,
    foundKeywords: foundKeywords,
    score: foundKeywords.length
  };
};

const analyzeWithAI = async (reportData) => {
  try {
    // Check cache first
    const cacheKey = generateAICacheKey(reportData);
    if (aiCache.has(cacheKey)) {
      const cacheEntry = aiCache.get(cacheKey);
      if (isAICacheValid(cacheEntry)) {
        console.log('🤖 Using cached AI analysis result');
        return cacheEntry.data;
      } else {
        // Remove expired cache entry
        aiCache.delete(cacheKey);
      }
    }

    // First validate if the content is soil-related
    const validation = validateSoilContent(reportData.extractedText);
    
    if (!validation.isValid) {
      console.log('Content validation failed - not soil-related enough');
      const errorResult = {
        recommendations: [
          {
            crop: "No Recommendations Available",
            suitability: 0,
            reason: "⚠️ Invalid Report: The uploaded document does not contain sufficient soil-related content. Please upload a valid soil analysis report that includes information about soil properties, nutrients, crops, or agricultural data."
          }
        ],
        soilHealth: "❌ Unable to analyze: Document does not contain soil-related information.",
        cropSuitability: "❌ Unable to analyze: Document does not contain agricultural or crop-related information.",
        nutrients: {
          nitrogen: "N/A",
          phosphorus: "N/A", 
          potassium: "N/A",
          pH: "N/A"
        },
        overallScore: 0,
        additionalTips: [
          "Please upload a valid soil analysis report",
          "The document should contain soil-related keywords like: soil, nutrients, crops, agriculture, pH, etc.",
          "Found only " + validation.score + " soil-related keywords (minimum 3 required)",
          "Keywords found: " + (validation.foundKeywords.length > 0 ? validation.foundKeywords.join(', ') : 'None')
        ],
        validationError: true,
        validationScore: validation.score,
        foundKeywords: validation.foundKeywords,
        timestamp: new Date().toISOString()
      };
      
      // Cache error results too (for shorter time)
      aiCache.set(cacheKey, {
        data: errorResult,
        timestamp: Date.now(),
      });
      
      return errorResult;
    }

    console.log('Content validation passed - proceeding with AI analysis');
    console.log('Found soil keywords:', validation.foundKeywords);

    // Check if OpenAI is available
    if (!openai) {
      console.log('OpenAI API key not provided, returning mock analysis');
      const mockResult = {
        recommendations: [
          {
            crop: "Rice",
            suitability: 95,
            reason: "Mock analysis: Rice is highly suitable for this region. The soil has excellent water retention capacity, good organic matter content, and the climate supports rice cultivation. Expected yield: 4-5 tons/hectare."
          },
          {
            crop: "Wheat", 
            suitability: 88,
            reason: "Mock analysis: Wheat is very suitable for this area. The soil pH is optimal (6.5-7.0) and has good nutrient availability. Proper irrigation and nutrient management will ensure good yields of 3-4 tons/hectare."
          },
          {
            crop: "Maize",
            suitability: 82,
            reason: "Mock analysis: Maize is well-suited for this region. The soil has good drainage and adequate nutrients. With proper spacing and fertilizer application, expect yields of 6-8 tons/hectare."
          },
          {
            crop: "Soybean",
            suitability: 78,
            reason: "Mock analysis: Soybean is suitable for this area. The soil has good nitrogen-fixing capacity and adequate phosphorus. Proper inoculation and spacing will yield 2-3 tons/hectare."
          },
          {
            crop: "Cotton",
            suitability: 75,
            reason: "Mock analysis: Cotton can be grown successfully with proper soil preparation. The region's climate and soil conditions support cotton cultivation. Expected yield: 1.5-2 tons/hectare of cotton lint."
          }
        ],
        soilHealth: "Mock analysis: Soil appears to be in good condition based on basic parameters.",
        cropSuitability: "Mock analysis: Suitable for common crops in the region.",
        nutrients: {
          nitrogen: "Normal",
          phosphorus: "Normal", 
          potassium: "Normal",
          pH: "6.5-7.0"
        },
        overallScore: 75,
        additionalTips: [
          "This is a mock analysis. Configure OpenAI API key for detailed AI-powered recommendations.",
          "Consider soil testing for accurate nutrient analysis.",
          "Consult local agricultural extension services for region-specific advice."
        ]
      };
      
      // Cache mock results
      aiCache.set(cacheKey, {
        data: mockResult,
        timestamp: Date.now(),
      });
      
      return mockResult;
    }

    const { district, state, area, season, extractedText } = reportData;

    const prompt = `
As an expert agricultural consultant specializing in Indian agriculture, analyze the following soil report data and provide comprehensive recommendations:

LOCATION: ${area}, ${district}, ${state}
SEASON: ${season}
SOIL REPORT DATA: ${extractedText || 'No specific soil data provided'}

Please provide detailed analysis and recommendations in the following JSON format:

{
  "recommendations": [
    {
      "crop": "Crop Name",
      "suitability": 95,
      "reason": "Detailed reason why this crop is suitable including soil compatibility, climate requirements, market potential, and expected yield"
    }
  ],
  "fertilizers": [
    {
      "name": "Specific Fertilizer Name",
      "quantity": "Exact amount per hectare",
      "applicationTime": "Specific timing (e.g., 'Before sowing', '30 days after sowing')",
      "purpose": "What nutrient deficiency it addresses and expected benefit",
      "applicationMethod": "How to apply (broadcasting, drilling, foliar spray)"
    }
  ],
  "herbicides": [
    {
      "name": "Specific Herbicide Name",
      "quantity": "Exact amount per hectare",
      "applicationTime": "When to apply for maximum effectiveness",
      "targetWeeds": ["Specific weed names common in the region"],
      "safetyNotes": "Important safety and application notes"
    }
  ],
  "pesticides": [
    {
      "name": "Specific Pesticide Name",
      "quantity": "Exact amount per hectare",
      "applicationTime": "When to apply based on pest lifecycle",
      "targetPests": ["Specific pest names common in the region"],
      "safetyNotes": "Important safety and application notes"
    }
  ],
  "soilDeficiencies": [
    {
      "nutrient": "Specific Nutrient Name",
      "currentLevel": "Current level if available",
      "recommendedLevel": "Optimal level needed",
      "solution": "Specific treatment to address the deficiency",
      "quantity": "Exact amount needed per hectare",
      "timeline": "How long it will take to see improvement"
    }
  ],
  "overallScore": 78,
  "additionalTips": [
    "Specific farming tips for the region and season",
    "Water management recommendations",
    "Crop rotation suggestions",
    "Market timing advice"
  ]
}

Important Instructions:
1. Provide TOP 5 crop recommendations suitable for ${season} season in ${state}, ${district}
2. Consider local climate, soil conditions, water availability, and market demand
3. Give specific fertilizer, herbicide, and pesticide names commonly available in India
4. Provide exact quantities in kg/hectare or liters/hectare
5. Consider organic and sustainable farming practices where possible
6. Include safety guidelines for chemical applications
7. Factor in current market prices and profitability
8. Consider crop rotation and soil health improvement

Analyze thoroughly and provide actionable, region-specific recommendations.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are Dr. Rajesh Kumar, a leading agricultural scientist with 25+ years of experience in Indian agriculture, soil science, and crop management. You have deep knowledge of regional farming practices, local crops, fertilizers, pesticides available in Indian markets, and sustainable farming techniques. Provide expert recommendations based on scientific principles and practical farming experience."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.2
    });

    const analysisText = completion.choices[0].message.content;
    
    try {
      // Extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        
        // Cache successful AI analysis
        aiCache.set(cacheKey, {
          data: analysis,
          timestamp: Date.now(),
        });
        
        return analysis;
      } else {
        // If no JSON found, return the text as a simple analysis
        return {
          recommendations: [
            {
              crop: "General Crops",
              suitability: 75,
              reason: "AI analysis completed. Please review the detailed recommendations below for specific crop suitability."
            }
          ],
          soilHealth: "Analysis completed based on provided data.",
          cropSuitability: "Suitable crops identified for the region and season.",
          nutrients: {
            nitrogen: "Normal",
            phosphorus: "Normal", 
            potassium: "Normal",
            pH: "6.5-7.0"
          },
          overallScore: 75,
          additionalTips: [analysisText],
          rawAnalysis: analysisText
        };
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Return a fallback analysis instead of throwing an error
      return {
        recommendations: [
          {
            crop: "General Crops",
            suitability: 70,
            reason: "AI analysis completed with some parsing issues. Basic recommendations available."
          }
        ],
        soilHealth: "Analysis completed based on provided data.",
        cropSuitability: "Suitable crops identified for the region and season.",
        nutrients: {
          nitrogen: "Normal",
          phosphorus: "Normal", 
          potassium: "Normal",
          pH: "6.5-7.0"
        },
        overallScore: 75,
        additionalTips: [analysisText || "Analysis completed but formatting may be incomplete."],
        rawAnalysis: analysisText
      };
    }

  } catch (error) {
    console.error('AI Analysis error:', error);
    // Return a fallback analysis instead of throwing an error
    return {
      recommendations: [
        {
          crop: "General Crops",
          suitability: 65,
          reason: "AI analysis encountered an error, but basic analysis is available. Please consult local agricultural experts for detailed recommendations."
        }
      ],
      soilHealth: "Analysis completed with limited data due to processing error.",
      cropSuitability: "Basic crop recommendations available for the region and season.",
      nutrients: {
        nitrogen: "Normal",
        phosphorus: "Normal", 
        potassium: "Normal",
        pH: "6.5-7.0"
      },
      overallScore: 70,
      additionalTips: [
        "Analysis completed with some limitations due to processing error.",
        "Please consult local agricultural experts for detailed recommendations.",
        "Consider soil testing for more accurate nutrient analysis."
      ],
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Cache management functions
const getAICacheStats = () => {
  return {
    cacheSize: aiCache.size,
    cacheEntries: Array.from(aiCache.keys()),
  };
};

const clearAICache = () => {
  aiCache.clear();
  console.log('🗑️ AI analysis cache cleared');
};

const cleanupAICache = () => {
  const now = Date.now();
  for (const [key, entry] of aiCache.entries()) {
    if (!isAICacheValid(entry)) {
      aiCache.delete(key);
    }
  }
  console.log(`🧹 AI cache cleanup completed. Entries: ${aiCache.size}`);
};

// Clean up cache periodically
setInterval(cleanupAICache, 30 * 60 * 1000); // Every 30 minutes

// Function to get detailed recommendations
const getDetailedRecommendations = async (reportData, location, season) => {
  try {
    if (!openai) {
      console.log('OpenAI API key not provided, returning mock detailed recommendations');
      return getMockDetailedRecommendations(location, season);
    }

    const prompt = `
    As an agricultural expert, provide detailed recommendations for a farmer in ${location.district}, ${location.state}, ${location.area} for ${season} season.
    
    Based on the soil analysis data: ${JSON.stringify(reportData)}
    
    Provide comprehensive recommendations including:
    1. Detailed soil health analysis with specific pH, nutrient levels, and organic matter
    2. Specific crop recommendations with reasons
    3. Detailed fertilizer schedule with quantities and timing
    4. Pest and disease management strategies
    5. Irrigation schedule and water management
    6. Seasonal farming tips and best practices
    7. Economic considerations and cost-benefit analysis
    8. Technology recommendations for modern farming
    
    Format the response as a structured JSON object with detailed information for each category.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert agricultural consultant with deep knowledge of Indian farming practices, soil science, and crop management. Provide practical, actionable recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error getting detailed recommendations:', error);
    return getMockDetailedRecommendations(location, season);
  }
};

// Mock detailed recommendations function
const getMockDetailedRecommendations = (location, season) => {
  return {
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
    ],
    economicAnalysis: {
      estimatedCost: "₹15,000-20,000 per acre",
      expectedYield: "35-45 quintals per acre",
      profitMargin: "₹25,000-35,000 per acre",
      roi: "150-200%"
    },
    technologyRecommendations: [
      "Use soil moisture sensors for efficient irrigation",
      "Implement precision farming techniques",
      "Use mobile apps for pest identification",
      "Consider drone technology for crop monitoring"
    ]
  };
};

module.exports = { 
  analyzeWithAI, 
  getDetailedRecommendations,
  getAICacheStats, 
  clearAICache,
  cleanupAICache
};