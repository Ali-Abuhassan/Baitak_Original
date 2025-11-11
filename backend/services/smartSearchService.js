const OpenAI = require('openai');
const { Category } = require('../models');

// Initialize OpenAI (only if API key is provided)
let openai = null;
const API_KEY = process.env.OPENAI_API_KEY;

if (API_KEY) {
  openai = new OpenAI({
    apiKey: API_KEY,
  });
}

// Category-to-keywords mapping (fallback when OpenAI is not available)
const categoryKeywords = {
  cleaning: ['sofa', 'curtain', 'carpet', 'clean', 'cleaning', 'wash', 'wipe', 'polish', 'dust', 'vacuum', 'steam', 'upholstery', 'rug', 'furniture', 'kitchen', 'bathroom', 'floor', 'window', 'appliance'],
  plumbing: ['plumber', 'leak', 'pipe', 'faucet', 'sink', 'shower', 'toilet', 'water', 'drain', 'clog', 'burst', 'repair', 'installation', 'maintenance'],
  electrical: ['electrician', 'electric', 'wiring', 'socket', 'switch', 'light', 'fan', 'circuit', 'power', 'outlet', 'bulb', 'lamp', 'repair', 'installation'],
  painting: ['paint', 'painting', 'wall', 'ceiling', 'brush', 'roller', 'color', 'finish', 'primer', 'interior', 'exterior', 'stain'],
  carpentry: ['wood', 'furniture', 'cabinet', 'shelf', 'desk', 'table', 'chair', 'carpenter', 'joinery', 'repair', 'installation', 'craft'],
  mounting: ['tv', 'shelf', 'mount', 'install', 'wall', 'picture', 'frame', 'bracket', 'suspension', 'ceiling', 'mirror', 'cabinet'],
};

/**
 * Get category ID for a search term using OpenAI or keyword matching
 * @param {string} searchTerm - User's search query
 * @param {string} language - Language code ('en' or 'ar')
 * @returns {Promise<Object>} - { categoryId, categoryName, confidence }
 */
async function findCategoryForSearch(searchTerm, language = 'en') {
  try {
    // If OpenAI is available, use it for intelligent mapping
    if (openai && searchTerm.length > 2) {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a smart assistant for a home services marketplace. Based on the user's search term, suggest the most relevant service category.

Available categories:
1. Cleaning - household and office cleaning services
2. Plumbing - plumbing repairs and installations
3. Electrical - electrical repairs and installations
4. Painting - interior and exterior painting
5. Carpentry - custom woodwork and furniture
6. Mounting - TV and furniture mounting services

User search term: "${searchTerm}"

Respond with ONLY a JSON object in this format:
{
  "category": "category_name",
  "confidence": "high/medium/low",
  "reasoning": "brief explanation"
}`,
            },
            {
              role: 'user',
              content: searchTerm,
            },
          ],
          max_tokens: 150,
          temperature: 0.3,
        });

        const aiResponse = JSON.parse(response.choices[0].message.content);
        const categoryName = aiResponse.category.toLowerCase();

        // Find category in database
        const category = await Category.findOne({
          where: {
            [require('sequelize').Op.or]: [
              { slug: categoryName },
              { name_en: { [require('sequelize').Op.like]: `%${categoryName}%` } },
              { name_ar: { [require('sequelize').Op.like]: `%${categoryName}%` } },
            ],
          },
        });

        if (category) {
          return {
            categoryId: category.id,
            categoryName: language === 'ar' ? category.name_ar : category.name_en,
            confidence: aiResponse.confidence || 'medium',
            reasoning: aiResponse.reasoning,
          };
        }
      } catch (aiError) {
        console.error('OpenAI error:', aiError);
        // Fall back to keyword matching
      }
    }

    // Fallback: Keyword-based category matching
    const searchLower = searchTerm.toLowerCase();
    
    for (const [categorySlug, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => searchLower.includes(keyword))) {
        const category = await Category.findOne({
          where: { slug: categorySlug },
        });

        if (category) {
          return {
            categoryId: category.id,
            categoryName: language === 'ar' ? category.name_ar : category.name_en,
            confidence: 'medium',
            reasoning: `Matched keywords: ${keywords.filter(k => searchLower.includes(k)).join(', ')}`,
          };
        }
      }
    }

    // No match found
    return {
      categoryId: null,
      categoryName: null,
      confidence: 'low',
      reasoning: 'No matching category found',
    };
  } catch (error) {
    console.error('Error in findCategoryForSearch:', error);
    return {
      categoryId: null,
      categoryName: null,
      confidence: 'low',
      reasoning: 'Error processing search',
    };
  }
}

module.exports = {
  findCategoryForSearch,
  categoryKeywords,
};

