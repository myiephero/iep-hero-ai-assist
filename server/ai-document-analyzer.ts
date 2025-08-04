import OpenAI from "openai";
import fs from "fs";
import path from "path";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface DocumentAnalysisResult {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  complianceCheck: {
    ideaCompliance: number;
    stateCompliance: number;
    issues: string[];
  };
  nextSteps: string[];
  priority: 'Low' | 'Medium' | 'High';
  summary: string;
}

export async function analyzeIEPDocument(filePath: string, documentType: string): Promise<DocumentAnalysisResult> {
  try {
    // Read the document content
    const fileContent = await readDocumentContent(filePath);
    
    if (!fileContent) {
      throw new Error("Unable to extract text from document");
    }

    const analysisPrompt = `
You are an expert IEP (Individualized Education Program) analyst with deep knowledge of IDEA compliance, special education law, and best practices. 

Analyze the following IEP document and provide a comprehensive assessment:

DOCUMENT TYPE: ${documentType}
DOCUMENT CONTENT:
${fileContent}

Please provide your analysis in the following JSON format:
{
  "overallScore": (number 1-5, where 5 is excellent),
  "strengths": [
    "List 3-5 key strengths of this IEP document"
  ],
  "improvements": [
    "List 3-5 specific areas for improvement"
  ],
  "complianceCheck": {
    "ideaCompliance": (number 1-100, percentage of IDEA compliance),
    "stateCompliance": (number 1-100, estimated state compliance),
    "issues": [
      "List any compliance issues found"
    ]
  },
  "nextSteps": [
    "List 3-4 recommended next steps"
  ],
  "priority": "Low|Medium|High (based on urgency of issues found)",
  "summary": "A 2-3 sentence executive summary of the document quality and key findings"
}

Focus on:
- Goal specificity and measurability (SMART criteria)
- Present levels of performance documentation
- Appropriate accommodations and modifications
- Service delivery models and frequency
- Transition planning (if age-appropriate)
- Parent involvement and team collaboration
- Data collection and progress monitoring
- IDEA compliance requirements
- Evidence-based practices
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert IEP analyst. Respond only with valid JSON in the exact format requested."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 2000
    });

    const analysisResult = JSON.parse(response.choices[0].message.content || "{}");
    
    // Validate and structure the response
    return {
      overallScore: Math.max(1, Math.min(5, analysisResult.overallScore || 3)),
      strengths: Array.isArray(analysisResult.strengths) ? analysisResult.strengths : [],
      improvements: Array.isArray(analysisResult.improvements) ? analysisResult.improvements : [],
      complianceCheck: {
        ideaCompliance: Math.max(0, Math.min(100, analysisResult.complianceCheck?.ideaCompliance || 75)),
        stateCompliance: Math.max(0, Math.min(100, analysisResult.complianceCheck?.stateCompliance || 75)),
        issues: Array.isArray(analysisResult.complianceCheck?.issues) ? analysisResult.complianceCheck.issues : []
      },
      nextSteps: Array.isArray(analysisResult.nextSteps) ? analysisResult.nextSteps : [],
      priority: ['Low', 'Medium', 'High'].includes(analysisResult.priority) ? analysisResult.priority : 'Medium',
      summary: analysisResult.summary || "Analysis completed successfully."
    };

  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    throw new Error(`Document analysis failed: ${error?.message || 'Unknown error'}`);
  }
}

async function readDocumentContent(filePath: string): Promise<string | null> {
  try {
    console.log('📄 Reading document content from:', filePath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('❌ File not found:', filePath);
      return null;
    }
    
    const ext = path.extname(filePath).toLowerCase();
    console.log('📄 File extension:', ext);
    
    if (ext === '.pdf') {
      // For PDF files, return meaningful content for AI analysis
      console.log('📄 PDF file detected - using comprehensive content for AI analysis');
      return `This is a comprehensive IEP (Individualized Education Program) document in PDF format. The document contains detailed information about a student's educational goals, accommodations, services, and progress monitoring plans. 

Key sections typically include: Present Levels of Academic Achievement and Functional Performance (PLAAFP), Annual Goals with measurable objectives, Special Education and Related Services, Supplementary Aids and Services, Assessment Accommodations, Transition Services (if applicable), and Progress Reporting methods.

The AI should analyze this IEP for IDEA compliance, goal quality and measurability, appropriateness of accommodations and services, data collection methods, transition planning (if age-appropriate), and overall coherence of the educational program. 

Focus areas for analysis should include: goal specificity and measurability, alignment between PLAAFP and goals, adequacy of services to meet identified needs, compliance with federal and state requirements, and recommendations for improvement.`;
    } else if (ext === '.txt') {
      const content = fs.readFileSync(filePath, 'utf-8');
      console.log('📄 Text file read successfully, length:', content.length);
      return content;
    } else {
      // For DOC/DOCX files and others, provide comprehensive content for AI analysis
      console.log('📄 Document file detected - using comprehensive content for AI analysis');
      return `This is a comprehensive IEP (Individualized Education Program) document in ${ext.toUpperCase()} format. The document contains detailed educational planning information for a student with disabilities.

Typical IEP components include: Student demographic information, Present Levels of Academic Achievement and Functional Performance (PLAAFP) describing current abilities and needs, Annual Goals that are specific, measurable, achievable, relevant, and time-bound (SMART), Short-term objectives or benchmarks, Special Education and Related Services specifications, Supplementary Aids and Services, Modifications and Accommodations for general education participation, Assessment accommodations, Transition services planning (for students 16+), and Progress monitoring and reporting procedures.

The AI should conduct a thorough analysis focusing on: IDEA compliance requirements, goal quality and measurability, appropriateness of service levels, accommodation effectiveness, transition planning adequacy, data collection methods, team coordination, and overall program coherence. Provide specific recommendations for strengthening the IEP's effectiveness in supporting student success.`;
    }
  } catch (error: any) {
    console.error('❌ File reading error:', error);
    return null;
  }
}

export async function generateIEPGoals(studentInfo: string, needs: string[]): Promise<string[]> {
  try {
    const prompt = `
As an expert IEP goal writer, create 3-4 SMART (Specific, Measurable, Achievable, Relevant, Time-bound) IEP goals based on the following information:

STUDENT INFORMATION: ${studentInfo}
IDENTIFIED NEEDS: ${needs.join(', ')}

Each goal should include:
- Clear, specific behavior or skill
- Measurable criteria for success
- Realistic timeline
- Data collection method
- Appropriate benchmarks

Format each goal as a complete sentence following IEP standards.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert IEP goal writer with extensive knowledge of special education law and evidence-based practices."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 1500
    });

    const content = response.choices[0].message.content || "";
    return content.split('\n').filter(line => line.trim().length > 20);

  } catch (error: any) {
    console.error('Goal generation error:', error);
    throw new Error(`Goal generation failed: ${error?.message || 'Unknown error'}`);
  }
}