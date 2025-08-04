import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  FileText, 
  Target, 
  Users, 
  Calendar, 
  BarChart3,
  Download,
  Share2,
  Crown,
  Sparkles,
  BookOpen,
  ClipboardList,
  Settings,
  Zap
} from "lucide-react";

interface IEPToolsProps {
  isHeroPlan: boolean;
  userId: string;
}

export function IEPTools({ isHeroPlan, userId }: IEPToolsProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [templateType, setTemplateType] = useState("goals");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const tools = [
    {
      id: "goal-generator",
      title: "IEP Goal Generator",
      description: "AI-powered IEP goal creation with measurable objectives",
      icon: <Target className="w-6 h-6" />,
      color: "blue",
      premium: true
    },
    {
      id: "template-builder",
      title: "Template Builder", 
      description: "Create custom IEP document templates",
      icon: <FileText className="w-6 h-6" />,
      color: "green",
      premium: true
    },
    {
      id: "progress-analyzer",
      title: "Progress Analyzer",
      description: "AI analysis of student progress and recommendations",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "purple",
      premium: true
    },
    {
      id: "meeting-prep",
      title: "Meeting Prep Assistant",
      description: "Prepare for IEP meetings with AI-generated talking points",
      icon: <Users className="w-6 h-6" />,
      color: "orange",
      premium: true
    },
    {
      id: "compliance-checker",
      title: "Compliance Checker",
      description: "Ensure IEP compliance with state and federal regulations",
      icon: <ClipboardList className="w-6 h-6" />,
      color: "red",
      premium: true
    },
    {
      id: "accommodation-builder",
      title: "Accommodation Builder",
      description: "Generate appropriate accommodations and modifications",
      icon: <Settings className="w-6 h-6" />,
      color: "teal",
      premium: true
    }
  ];

  const handleGenerateContent = async (toolId: string) => {
    setIsGenerating(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const templates = {
        "goal-generator": `ANNUAL GOAL: By [DATE], when given grade-level reading passages, [STUDENT NAME] will read with 95% accuracy and answer comprehension questions with 80% accuracy across 4 out of 5 consecutive trials as measured by curriculum-based assessments.

BENCHMARKS/SHORT-TERM OBJECTIVES:
1. By [DATE], [STUDENT NAME] will decode grade-level words with 90% accuracy
2. By [DATE], [STUDENT NAME] will identify main ideas with 75% accuracy  
3. By [DATE], [STUDENT NAME] will answer inferential questions with 70% accuracy

EVALUATION CRITERIA: Weekly progress monitoring using curriculum-based measurements
EVALUATION PROCEDURES: Data collection sheets, work samples, teacher observation`,

        "template-builder": `IEP MEETING AGENDA TEMPLATE

1. INTRODUCTIONS & TEAM ROLES
2. REVIEW OF CURRENT PERFORMANCE
   - Academic Achievement
   - Functional Performance
   - Progress on Current Goals
3. DISCUSSION OF NEEDS
4. GOAL DEVELOPMENT/REVISION
5. PLACEMENT DECISIONS
6. RELATED SERVICES
7. ACCOMMODATIONS & MODIFICATIONS
8. TRANSITION PLANNING (if applicable)
9. NEXT STEPS & MEETING CLOSURE`,

        "progress-analyzer": `PROGRESS ANALYSIS REPORT

STUDENT: [Name]
REPORTING PERIOD: [Dates]

GOAL PERFORMANCE SUMMARY:
✅ Reading Comprehension: 78% - ON TRACK
⚠️ Math Problem Solving: 62% - NEEDS ATTENTION  
✅ Social Skills: 85% - EXCEEDING

RECOMMENDATIONS:
• Increase visual supports for math concepts
• Consider peer tutoring for reading fluency
• Continue current social skills interventions

DATA TRENDS: Consistent growth in reading, plateau in math requires intervention adjustment.`
      };

      setGeneratedContent(templates[toolId as keyof typeof templates] || "Content generated successfully!");
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const HeroPlanUpgrade = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Crown className="w-8 h-8 text-yellow-400" />
      </div>
      <h3 className="text-white font-semibold mb-2">Hero Plan Feature</h3>
      <p className="text-blue-200 text-sm mb-4">
        Unlock AI-powered IEP tools and templates
      </p>
      <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white">
        Upgrade to Hero Plan
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Card 
            key={tool.id} 
            className={`bg-white/10 backdrop-blur-lg border-white/20 cursor-pointer transition-all duration-300 hover:bg-white/15 ${
              activeTool === tool.id ? 'ring-2 ring-blue-400' : ''
            }`}
            onClick={() => isHeroPlan ? setActiveTool(tool.id) : null}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center`}>
                  {tool.icon}
                </div>
                {tool.premium && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                    HERO
                  </Badge>
                )}
              </div>
              <CardTitle className="text-white text-lg">{tool.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-200 text-sm mb-4">{tool.description}</p>
              {isHeroPlan ? (
                <Button 
                  variant="ghost" 
                  className="w-full text-blue-400 hover:text-blue-300 hover:bg-white/10"
                  onClick={() => handleGenerateContent(tool.id)}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Use Tool
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  className="w-full text-gray-400 cursor-not-allowed" 
                  disabled
                >
                  Hero Plan Required
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Tool Content */}
      {activeTool && isHeroPlan && (
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                {tools.find(t => t.id === activeTool)?.title}
              </CardTitle>
              <Button 
                variant="ghost" 
                onClick={() => setActiveTool(null)}
                className="text-white hover:text-gray-300"
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedContent ? (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <pre className="text-white text-sm whitespace-pre-wrap font-mono">
                  {generatedContent}
                </pre>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" className="text-white border-white/20">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share with Team
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <p className="text-blue-200">Click "Use Tool" to generate content</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upgrade prompt for free users */}
      {!isHeroPlan && (
        <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg border-yellow-400/30">
          <CardContent className="p-6">
            <HeroPlanUpgrade />
          </CardContent>
        </Card>
      )}
    </div>
  );
}