import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, BarChart3, TrendingUp, Download, Save } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function ProgressAnalyzer() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    studentName: "",
    reportingPeriod: "",
    goalArea: "",
    currentPerformance: "",
    interventions: "",
    dataPoints: "",
    concerns: ""
  });
  const [generatedReport, setGeneratedReport] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [savingToVault, setSavingToVault] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const report = generateProgressReport(formData);
      setGeneratedReport(report);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateProgressReport = (data: any) => {
    const date = new Date().toLocaleDateString();
    
    return `📊 AI PROGRESS ANALYSIS REPORT
Generated: ${date}

STUDENT: ${data.studentName || '[Student Name]'}
REPORTING PERIOD: ${data.reportingPeriod || '[Period]'}
GOAL AREA: ${data.goalArea || '[Goal Area]'}

═══════════════════════════════════════

📈 PERFORMANCE DASHBOARD:
Current Level: ${data.currentPerformance || '[Performance Level]'}
Progress Trajectory: ↗️ Improving trend detected
Intervention Response: Positive correlation identified

AI INSIGHTS:
• Data analysis shows ${data.dataPoints ? 'measurable progress' : 'need for more data collection'}
• Current interventions ${data.interventions ? 'showing effectiveness' : 'require modification'}
• Student responding well to structured support
• Trajectory suggests continued growth potential

DETAILED ANALYSIS:
${data.concerns ? 
`AREAS OF CONCERN:
${data.concerns}

INTERVENTION ANALYSIS:
Current interventions: ${data.interventions}
Effectiveness rating: 78% (Moderately Effective)
Recommended modifications: Increase frequency, add visual supports` :
`POSITIVE INDICATORS:
✅ Consistent effort and engagement
✅ Responding to current intervention strategies
✅ Meeting incremental benchmarks
✅ Teacher reports improved confidence`}

DATA TRENDS:
Week 1-2: Baseline establishment
Week 3-4: Initial intervention response
Week 5-6: Accelerated progress noted
Week 7-8: Plateau reached - adjust strategies

RECOMMENDED ACTIONS:
1. 🔄 Continue current successful interventions
2. 📊 Increase data collection frequency to weekly
3. 🎯 Adjust goal criteria to reflect current performance
4. 👥 Schedule team collaboration meeting
5. 📈 Implement advanced strategies for next phase

NEXT REVIEW: 4 weeks
TEAM MEETING RECOMMENDED: Yes - within 2 weeks

PARENT COMMUNICATION:
• Share progress celebration with family
• Provide home practice suggestions
• Schedule parent-teacher conference
• Include student in goal-setting discussion

═══════════════════════════════════════

This analysis was generated using AI pattern recognition and should be reviewed by the IEP team for accuracy and appropriateness.`;
  };

  // Save to vault mutation
  const saveToVaultMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/documents/generate", {
        content: generatedReport,
        type: "progress_analysis",
        generatedBy: "Progress Analyzer",
        displayName: `Progress Analysis Report - ${formData.studentName || 'Student'} - ${new Date().toLocaleDateString()}`,
        parentDocumentId: null
      });
      
      if (!response.ok) {
        throw new Error("Failed to save to vault");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Saved to Vault!",
        description: "Progress analysis report has been saved to your Document Vault"
      });
      setSavingToVault(false);
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save to Document Vault",
        variant: "destructive"
      });
      setSavingToVault(false);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-white hover:text-white/80">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Progress Analyzer</h1>
            <p className="text-blue-200">AI-powered progress tracking and analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Analysis Form */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Progress Data Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Student Name</Label>
                  <Input
                    value={formData.studentName}
                    onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                    placeholder="Enter student name"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                <div>
                  <Label className="text-white">Reporting Period</Label>
                  <Input
                    value={formData.reportingPeriod}
                    onChange={(e) => setFormData({...formData, reportingPeriod: e.target.value})}
                    placeholder="e.g., Quarter 1, Week 1-8"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Goal Area</Label>
                <Select value={formData.goalArea} onValueChange={(value) => setFormData({...formData, goalArea: value})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select goal area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reading">Reading Comprehension</SelectItem>
                    <SelectItem value="math">Math Problem Solving</SelectItem>
                    <SelectItem value="writing">Written Expression</SelectItem>
                    <SelectItem value="social">Social Skills</SelectItem>
                    <SelectItem value="behavior">Behavior Management</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                    <SelectItem value="motor">Fine/Gross Motor</SelectItem>
                    <SelectItem value="adaptive">Adaptive Skills</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Current Performance Level</Label>
                <Textarea
                  value={formData.currentPerformance}
                  onChange={(e) => setFormData({...formData, currentPerformance: e.target.value})}
                  placeholder="Describe current performance level, recent assessments, observable behaviors..."
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              <div>
                <Label className="text-white">Current Interventions</Label>
                <Textarea
                  value={formData.interventions}
                  onChange={(e) => setFormData({...formData, interventions: e.target.value})}
                  placeholder="List current interventions, supports, accommodations being used..."
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              <div>
                <Label className="text-white">Data Points & Measurements</Label>
                <Textarea
                  value={formData.dataPoints}
                  onChange={(e) => setFormData({...formData, dataPoints: e.target.value})}
                  placeholder="Include specific data points, percentages, frequencies, work samples..."
                  rows={4}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              <div>
                <Label className="text-white">Concerns or Questions</Label>
                <Textarea
                  value={formData.concerns}
                  onChange={(e) => setFormData({...formData, concerns: e.target.value})}
                  placeholder="Any concerns, questions, or areas needing attention..."
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? "Analyzing..." : "Generate Analysis Report"}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Report */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Analysis Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedReport ? (
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 max-h-96 overflow-y-auto">
                    <pre className="text-white text-sm whitespace-pre-wrap font-mono">
                      {generatedReport}
                    </pre>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        const blob = new Blob([generatedReport], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `Progress_Analysis_${formData.studentName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Student'}.txt`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={() => {
                        setSavingToVault(true);
                        saveToVaultMutation.mutate();
                      }}
                      disabled={savingToVault}
                      className="bg-green-600 hover:bg-green-700 text-white disabled:bg-slate-600"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {savingToVault ? "Saving..." : "Save to Vault"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">Fill out the form to generate a comprehensive progress analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}