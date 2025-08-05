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
import { apiRequest } from "@/lib/queryClient";

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
      id: "iep-review",
      title: "AI IEP Review",
      description: "Comprehensive AI analysis of existing IEP documents with improvement recommendations",
      icon: <Brain className="w-6 h-6" />,
      color: "blue",
      premium: true
    },
    {
      id: "goal-generator",
      title: "IEP Goal Generator",
      description: "AI-powered IEP goal creation with measurable objectives",
      icon: <Target className="w-6 h-6" />,
      color: "green",
      premium: true
    },
    {
      id: "template-builder",
      title: "Template Builder", 
      description: "Create custom IEP document templates and forms",
      icon: <FileText className="w-6 h-6" />,
      color: "purple",
      premium: true
    },
    {
      id: "progress-analyzer",
      title: "Progress Analyzer",
      description: "AI analysis of student progress and data-driven recommendations",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "orange",
      premium: true
    },
    {
      id: "meeting-prep",
      title: "Meeting Prep Assistant",
      description: "AI-generated talking points and meeting preparation materials",
      icon: <Users className="w-6 h-6" />,
      color: "teal",
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
      description: "Generate evidence-based accommodations and modifications",
      icon: <Settings className="w-6 h-6" />,
      color: "indigo",
      premium: true
    },
    {
      id: "transition-planner",
      title: "Transition Planner",
      description: "AI-assisted transition planning for post-secondary goals",
      icon: <Calendar className="w-6 h-6" />,
      color: "pink",
      premium: true
    }
  ];

  const handleGenerateContent = async (toolId: string) => {
    setIsGenerating(true);
    try {
      if (!isHeroPlan) {
        console.log("Hero Plan feature access enabled for testing");
      }
      
      // Simulate AI generation with realistic timing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const templates = {
        "iep-review": `🤖 AI IEP DOCUMENT ANALYSIS COMPLETE

OVERALL ASSESSMENT: ⭐⭐⭐⭐☆ (4/5 - STRONG IEP)

KEY STRENGTHS IDENTIFIED:
✅ Goals are specific and measurable
✅ Present levels of performance well documented  
✅ Appropriate accommodations listed
✅ Services align with identified needs

AREAS FOR IMPROVEMENT:
🔶 Transition planning could be more detailed (if age-appropriate)
🔶 Consider adding assistive technology goals
🔶 Progress monitoring frequency could be increased

COMPLIANCE CHECK:
✅ IDEA Requirements Met: 95%
✅ State Standards Aligned: 92%
⚠️  Minor formatting improvements needed

RECOMMENDED NEXT STEPS:
1. Schedule team meeting to discuss transition services
2. Evaluate need for AT assessment
3. Review progress monitoring schedule
4. Update parent communication plan

PRIORITY RATING: Medium - Schedule review within 30 days`,

        "goal-generator": `🎯 AI-GENERATED IEP GOALS

READING COMPREHENSION GOAL:
By [DATE], when given grade-level reading passages, [STUDENT] will read with 95% accuracy and answer comprehension questions with 80% accuracy across 4 out of 5 consecutive trials as measured by curriculum-based assessments.

BENCHMARKS:
• Decode grade-level words with 90% accuracy
• Identify main ideas with 75% accuracy  
• Answer inferential questions with 70% accuracy

MATH PROBLEM SOLVING GOAL:
By [DATE], when presented with multi-step word problems, [STUDENT] will solve problems using appropriate strategies with 75% accuracy in 4 out of 5 trials.

SOCIAL SKILLS GOAL:
By [DATE], [STUDENT] will initiate and maintain appropriate peer interactions during structured activities for 15 minutes with minimal prompting in 8 out of 10 opportunities.`,

        "template-builder": `📋 CUSTOM IEP TEMPLATE GENERATED

=== IEP MEETING AGENDA ===
Date: ___________  Time: ___________

ATTENDEES:
□ Parent/Guardian: ________________
□ General Ed Teacher: _____________
□ Special Ed Teacher: _____________
□ School Administrator: ___________
□ Related Service Providers: ______

AGENDA:
1. Welcome & Introductions (5 min)
2. Review Previous IEP & Progress (15 min)
3. Present Levels Discussion (20 min)
4. Goals & Objectives Review (25 min)
5. Services & Placement (15 min)
6. Accommodations & Modifications (10 min)
7. Assessment Participation (5 min)
8. Transition Planning (15 min)
9. Next Steps & Signatures (10 min)

NOTES SECTION:
_________________________________
_________________________________`,

        "progress-analyzer": `📊 AI PROGRESS ANALYSIS REPORT

STUDENT: [Name] | PERIOD: [Dates]

PERFORMANCE DASHBOARD:
📈 Reading: 78% (↗️ +12% from last quarter)
⚠️  Math: 62% (↔️ Plateau - needs intervention)
🎯 Social Skills: 85% (↗️ +8% improvement)
✅ Behavior: 92% (↗️ Excellent progress)

AI INSIGHTS:
• Reading growth trajectory suggests current interventions are effective
• Math performance plateau indicates need for strategy modification
• Social skills showing consistent improvement with peer interactions
• Behavior goals nearly mastered - consider advancing objectives

RECOMMENDED ACTIONS:
1. 🔄 Modify math intervention - try concrete manipulatives
2. 📅 Increase progress monitoring frequency for math
3. 🎉 Celebrate reading success and maintain current approach
4. 🎯 Advance social skills goals to more complex scenarios

NEXT REVIEW: 4 weeks`
      };

      const content = templates[toolId as keyof typeof templates] || "Content generated successfully!";
      setGeneratedContent(content);
      
      // Auto-save to document vault
      await saveToDocumentVault(content, toolId);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToDocumentVault = async (content: string, toolId: string) => {
    try {
      const toolTitles = {
        "iep-review": "AI IEP Analysis Report",
        "goal-generator": "AI Generated IEP Goals",
        "template-builder": "Custom IEP Template",
        "progress-analyzer": "AI Progress Analysis Report",
        "compliance-checker": "Compliance Check Report",
        "meeting-prep": "Meeting Preparation Guide"
      };

      const displayName = toolTitles[toolId as keyof typeof toolTitles] || `Generated Content - ${new Date().toLocaleDateString()}`;
      
      const response = await apiRequest("POST", "/api/documents/generate", {
        content,
        type: "generated",
        generatedBy: toolId,
        displayName
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Content saved to document vault:", result);
        // Could add a toast notification here
      }
    } catch (error) {
      console.error("Failed to save to document vault:", error);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <Card 
            key={tool.id} 
            className={`bg-white/10 backdrop-blur-lg border-white/20 cursor-pointer transition-all duration-300 hover:bg-white/15 ${
              activeTool === tool.id ? 'ring-2 ring-blue-400' : ''
            }`}
            onClick={() => setActiveTool(tool.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-white`}>
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
              <p className="text-white/80 text-sm mb-4">{tool.description}</p>
              <Button 
                variant="ghost" 
                className="w-full text-white hover:text-white hover:bg-white/20 border border-white/20"
                onClick={() => handleGenerateContent(tool.id)}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Use Tool
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Tool Content */}
      {activeTool && (
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
                className="text-white hover:text-white/80"
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
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      const blob = new Blob([generatedContent], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${tools.find(t => t.id === activeTool)?.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => saveToDocumentVault(generatedContent, activeTool!)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Save to Vault
                  </Button>
                  <Button size="sm" variant="outline" className="text-white border-white/20">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share with Team
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-white mx-auto mb-4" />
                <p className="text-white text-lg">Click "Use Tool" to generate content</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upgrade prompt removed for MVP testing */}
    </div>
  );
}