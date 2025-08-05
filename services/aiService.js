// services/aiService.js
// ===============================
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const analyzeWithAI = async (reportData) => {
  try {
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
      max_tokens: 3000,
      temperature: 0.2
    });

    const analysisText = completion.choices[0].message.content;
    
    try {
      // Extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return analysis;
      } else {
        throw new Error('No JSON found in AI response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      throw new Error('Failed to parse AI analysis');
    }

  } catch (error) {
    console.error('AI Analysis error:', error);
    throw new Error(`AI Analysis failed: ${error.message}`);
  }
};

module.exports = { analyzeWithAI };