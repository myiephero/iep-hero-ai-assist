import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, FileText, Download, Save } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

const letterTemplates = {
  "request-meeting": "Request for IEP Team Meeting",
  "prior-notice": "Prior Written Notice Response",
  "evaluation-request": "Request for Educational Evaluation",
  "placement-concern": "Placement Concern Letter",
  "due-process": "Due Process Complaint",
  "504-request": "Section 504 Accommodation Request"
};

export default function SmartLetterGenerator() {
  const { user } = useAuth();
  
  // Fetch available students
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: user?.role === 'advocate' ? ["/api/advocate/students"] : ["/api/parent/students"],
    enabled: !!user,
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [formData, setFormData] = useState({
    studentId: "",
    schoolName: "",
    teacherName: "",
    concerns: "",
    requestedActions: "",
    timeline: ""
  });
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const templateContent = generateLetterContent(selectedTemplate, formData);
      setGeneratedLetter(templateContent);
      
      // Auto-save to document vault
      await saveToDocumentVault(templateContent);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateLetterContent = (template: string, data: any) => {
    const date = new Date().toLocaleDateString();
    const selectedStudent = data.studentId ? (students as any[]).find(s => s.id === data.studentId) : null;
    const studentName = selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : '[Student Name]';
    
    const templates = {
      "request-meeting": `${date}

[School Administrator Name]
[School Name]
[School Address]

Dear [Administrator Name],

I am writing to formally request an IEP team meeting for my child, ${studentName}, who is currently enrolled in ${data.teacherName}'s class at ${data.schoolName}.

REASON FOR MEETING REQUEST:
${data.concerns}

REQUESTED ACTIONS:
${data.requestedActions}

REQUESTED TIMELINE:
I would appreciate if this meeting could be scheduled within ${data.timeline || "10 school days"} of this request, as outlined in IDEA regulations.

Please provide me with:
- Available meeting dates and times
- List of team members who will attend
- Meeting location and format (in-person/virtual)

I look forward to collaborating with the team to ensure ${studentName}'s educational needs are met.

Sincerely,
[Your Name]
[Your Contact Information]

---
LEGAL REFERENCE: 34 CFR §300.501(b)(1) - Parent participation in meetings`,

      "prior-notice": `${date}

[School Administrator Name]
[School Name]
[School Address]

RE: Response to Prior Written Notice for ${studentName}

Dear [Administrator Name],

I am responding to the Prior Written Notice dated [DATE] regarding proposed changes to ${studentName}'s IEP.

MY CONCERNS:
${data.concerns}

REQUESTED ACTIONS:
${data.requestedActions}

I do not consent to the proposed changes and request an IEP team meeting to discuss alternatives that would better meet ${studentName}'s educational needs.

Please schedule this meeting within 10 school days and provide:
- Detailed explanation of the proposed changes
- Data supporting these decisions
- Alternative options considered

Thank you for your attention to this matter.

Sincerely,
[Your Name]
[Date]

---
LEGAL REFERENCE: 34 CFR §300.503 - Prior notice by the public agency`,

      "evaluation-request": `${date}

[School Administrator Name]  
[School Name]
[School Address]

RE: Request for Educational Evaluation - ${studentName}

Dear [Administrator Name],

I am formally requesting a comprehensive educational evaluation for my child, ${studentName}, who is currently in ${data.teacherName}'s class.

AREAS OF CONCERN:
${data.concerns}

REQUESTED EVALUATIONS:
${data.requestedActions}

Please initiate this evaluation process within the 15-day timeline required by IDEA and provide me with:
- Evaluation timeline and schedule
- List of assessments to be conducted
- Names and qualifications of evaluators
- My procedural safeguards

I consent to this evaluation and look forward to working with the team.

Sincerely,
[Your Name]
[Contact Information]

---
LEGAL REFERENCE: 34 CFR §300.301 - Initial evaluations`
    };

    return templates[template as keyof typeof templates] || "Template not found";
  };

  const saveToDocumentVault = async (content: string) => {
    try {
      await apiRequest("POST", "/api/documents/generate", {
        content,
        type: "template",
        generatedBy: "smart-letter-generator",
        displayName: `${letterTemplates[selectedTemplate as keyof typeof letterTemplates]} - ${new Date().toLocaleDateString()}`
      });
      console.log("Letter saved to document vault");
    } catch (error) {
      console.error("Failed to save letter:", error);
    }
  };

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
            <h1 className="text-3xl font-bold text-white">Smart Letter Generator</h1>
            <p className="text-blue-200">AI-powered advocacy letter templates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Letter Builder */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Letter Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Letter Type</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select letter type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(letterTemplates).map(([key, title]) => (
                      <SelectItem key={key} value={key}>{title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Student Name</Label>
                  <Select value={formData.studentId} onValueChange={(value) => setFormData({...formData, studentId: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder={studentsLoading ? "Loading students..." : "Select a student"} />
                    </SelectTrigger>
                    <SelectContent>
                      {(students as any[]).map((student: any) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.firstName} {student.lastName}
                          {student.gradeLevel && ` (${student.gradeLevel})`}
                        </SelectItem>
                      ))}
                      {(students as any[]).length === 0 && !studentsLoading && (
                        <SelectItem value="" disabled>
                          No students available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">School Name</Label>
                  <Input
                    value={formData.schoolName}
                    onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                    placeholder="Enter school name"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Teacher/Contact Name</Label>
                <Input
                  value={formData.teacherName}
                  onChange={(e) => setFormData({...formData, teacherName: e.target.value})}
                  placeholder="Enter teacher or contact name"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              <div>
                <Label className="text-white">Concerns or Issues</Label>
                <Textarea
                  value={formData.concerns}
                  onChange={(e) => setFormData({...formData, concerns: e.target.value})}
                  placeholder="Describe your concerns or the issues you want to address..."
                  rows={4}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              <div>
                <Label className="text-white">Requested Actions</Label>
                <Textarea
                  value={formData.requestedActions}
                  onChange={(e) => setFormData({...formData, requestedActions: e.target.value})}
                  placeholder="What specific actions are you requesting..."
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              <div>
                <Label className="text-white">Timeline</Label>
                <Input
                  value={formData.timeline}
                  onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                  placeholder="e.g., 10 school days, by [date]"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!selectedTemplate || isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? "Generating..." : "Generate Letter"}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Letter */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Generated Letter</CardTitle>
            </CardHeader>
            <CardContent>
              {generatedLetter ? (
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 max-h-96 overflow-y-auto">
                    <pre className="text-white text-sm whitespace-pre-wrap font-mono">
                      {generatedLetter}
                    </pre>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        const blob = new Blob([generatedLetter], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${letterTemplates[selectedTemplate as keyof typeof letterTemplates].replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
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
                      onClick={() => saveToDocumentVault(generatedLetter)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save to Vault
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">Select a template and fill out the form to generate your letter</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}