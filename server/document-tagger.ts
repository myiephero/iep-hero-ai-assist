import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface DocumentTaggingResult {
  category: string;
  tags: string[];
  confidence: number;
  reasoning: string;
}

// Predefined categories for IEP documents
const DOCUMENT_CATEGORIES = [
  'academic', // Academic assessments, goals, curriculum modifications
  'behavioral', // Behavior plans, FBA, social-emotional goals
  'medical', // Medical reports, therapy notes, health plans
  'legal', // IEP documents, compliance reports, legal correspondence
  'administrative', // Meeting notes, scheduling, procedural documents  
  'communication', // Parent correspondence, team communications
  'transition', // Transition planning, post-secondary preparation
  'assessment', // Evaluations, testing reports, progress monitoring
  'services', // Speech therapy, OT, PT, counseling notes
  'advocacy' // Legal advocacy, rights information, dispute documentation
];

// Common IEP-related tags
const COMMON_TAGS = [
  // Academic
  'reading', 'writing', 'math', 'science', 'social-studies', 'curriculum-modification', 
  'accommodation', 'assistive-technology', 'learning-disability', 'dyslexia', 'dyscalculia',
  
  // Behavioral  
  'behavior-plan', 'fba', 'social-skills', 'emotional-regulation', 'autism', 'adhd',
  'sensory-processing', 'anxiety', 'self-advocacy', 'peer-interaction',
  
  // Services
  'speech-therapy', 'occupational-therapy', 'physical-therapy', 'counseling',
  'special-education', 'resource-room', 'inclusion', 'one-on-one-aide',
  
  // Legal/Administrative
  'iep-meeting', 'annual-review', 'triennial-evaluation', 'due-process',
  'mediation', 'complaint', 'idea-compliance', 'fape', 'lre',
  
  // Medical
  'medical-condition', 'medication', 'seizure-disorder', 'hearing-impairment',
  'visual-impairment', 'physical-disability', 'health-plan',
  
  // Transition
  'post-secondary', 'employment', 'independent-living', 'vocational-training',
  'college-prep', 'life-skills'
];

export async function analyzeDocumentForTagging(content: string, documentType: string, filename?: string): Promise<DocumentTaggingResult> {
  try {
    const prompt = `
You are an expert special education document analyst. Analyze the following document and provide intelligent categorization and tagging.

DOCUMENT TYPE: ${documentType}
FILENAME: ${filename || 'Unknown'}
CONTENT: ${content.substring(0, 4000)} // Limit content for API efficiency

Based on the content, provide a JSON response with the following structure:

{
  "category": "Choose the MOST appropriate category from: ${DOCUMENT_CATEGORIES.join(', ')}",
  "tags": [
    "List 3-8 relevant tags. Use tags from this list when applicable: ${COMMON_TAGS.slice(0, 30).join(', ')}"
    "You may also create new specific tags if none of the common ones fit perfectly"
  ],
  "confidence": "Provide a confidence score 1-100 for your categorization",
  "reasoning": "Brief explanation (1-2 sentences) of why you chose this category and these tags"
}

Guidelines:
- Focus on educational and IEP-related content
- Tags should be lowercase, use hyphens for multi-word tags
- Category should reflect the PRIMARY purpose of the document
- Consider both explicit content and implied context
- Higher confidence for documents with clear IEP/educational indicators
- Lower confidence for ambiguous or general documents

Examples:
- IEP document with reading goals → category: "academic", tags: ["reading", "iep-meeting", "learning-disability"]
- Behavior intervention plan → category: "behavioral", tags: ["behavior-plan", "fba", "autism", "social-skills"]
- Speech therapy notes → category: "services", tags: ["speech-therapy", "communication", "language-development"]
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a special education document analysis expert. Provide accurate categorization and tagging for educational documents."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Lower temperature for more consistent categorization
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate and sanitize the result
    return {
      category: DOCUMENT_CATEGORIES.includes(result.category) ? result.category : 'administrative',
      tags: Array.isArray(result.tags) ? result.tags.slice(0, 10) : [], // Limit to 10 tags max
      confidence: Math.min(Math.max(parseInt(result.confidence) || 50, 0), 100), // Ensure 0-100 range
      reasoning: result.reasoning || 'Auto-categorized by AI analysis'
    };

  } catch (error) {
    console.error('Error in document tagging:', error);
    
    // Fallback: Basic categorization based on document type
    const fallbackResult = getFallbackTagging(documentType, content);
    return {
      ...fallbackResult,
      confidence: 25, // Low confidence for fallback
      reasoning: 'Fallback categorization due to AI service error'
    };
  }
}

function getFallbackTagging(documentType: string, content: string): Omit<DocumentTaggingResult, 'confidence' | 'reasoning'> {
  const contentLower = content.toLowerCase();
  
  // Basic keyword-based fallback categorization
  if (contentLower.includes('iep') || contentLower.includes('individualized education program')) {
    return {
      category: 'legal',
      tags: ['iep-meeting', 'special-education']
    };
  }
  
  if (contentLower.includes('behavior') || contentLower.includes('fba')) {
    return {
      category: 'behavioral',
      tags: ['behavior-plan']
    };
  }
  
  if (contentLower.includes('speech') || contentLower.includes('therapy')) {
    return {
      category: 'services',
      tags: ['therapy']
    };
  }
  
  if (documentType === 'assessment' || contentLower.includes('evaluation')) {
    return {
      category: 'assessment',
      tags: ['evaluation']
    };
  }
  
  // Default fallback
  return {
    category: 'administrative',
    tags: ['document']
  };
}

// Function to suggest additional tags based on existing document tags
export async function suggestAdditionalTags(existingTags: string[], documentContent: string): Promise<string[]> {
  try {
    const prompt = `
Based on this document content and existing tags, suggest 2-4 additional relevant tags that might have been missed:

EXISTING TAGS: ${existingTags.join(', ')}
DOCUMENT CONTENT: ${documentContent.substring(0, 2000)}

Suggest tags from this list when applicable: ${COMMON_TAGS.join(', ')}

Return only a JSON array of suggested tag strings. Do not include tags that are already in the existing tags list.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"suggestions":[]}');
    return Array.isArray(result.suggestions) ? result.suggestions.slice(0, 4) : [];
    
  } catch (error) {
    console.error('Error suggesting additional tags:', error);
    return [];
  }
}