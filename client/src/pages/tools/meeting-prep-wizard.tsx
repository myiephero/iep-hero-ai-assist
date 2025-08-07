import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Calendar, Users, Download, Save, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function MeetingPrepWizard() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch available students
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: user?.role === 'advocate' ? ["/api/advocate/students"] : ["/api/parent/students"],
    enabled: !!user,
  });
  
  const [formData, setFormData] = useState({
    meetingType: "",
    studentId: "",
    meetingDate: "",
    attendees: "",
    concerns: "",
    goals: "",
    questions: "",
    documents: [] as string[],
    priorities: ""
  });
  const [generatedPrep, setGeneratedPrep] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [savingToVault, setSavingToVault] = useState(false);

  const meetingTypes = {
    "initial": "Initial IEP Meeting",
    "annual": "Annual IEP Review",
    "amendment": "IEP Amendment Meeting", 
    "evaluation": "Evaluation Planning Meeting",
    "transition": "Transition Planning Meeting",
    "discipline": "Disciplinary Review Meeting",
    "placement": "Placement Review Meeting"
  };

  const documentChecklist = [
    "Current IEP",
    "Recent evaluations",
    "Progress reports",
    "Work samples",
    "Teacher observations",
    "Medical reports",
    "Independent evaluations",
    "Previous meeting notes"
  ];

  const handleDocumentChange = (document: string, checked: boolean) => {
    if (checked) {
      setFormData({...formData, documents: [...formData.documents, document]});
    } else {
      setFormData({...formData, documents: formData.documents.filter((doc: string) => doc !== document)});
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const prep = generateMeetingPrep(formData);
      setGeneratedPrep(prep);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMeetingPrep = (data: any) => {
    const date = new Date().toLocaleDateString();
    
    return `📅 IEP MEETING PREPARATION GUIDE
Generated: ${date}

MEETING DETAILS:
Type: ${meetingTypes[data.meetingType as keyof typeof meetingTypes] || '[Meeting Type]'}
Student: ${data.studentId ? (students as any[]).find(s => s.id === data.studentId)?.firstName + ' ' + (students as any[]).find(s => s.id === data.studentId)?.lastName : '[Student Name]'}
Date: ${data.meetingDate || '[Meeting Date]'}
Expected Attendees: ${data.attendees || '[Attendees List]'}

═══════════════════════════════════════

📋 PRE-MEETING CHECKLIST:

DOCUMENTS TO BRING:
${data.documents.length > 0 ? 
  data.documents.map(doc => `☑️ ${doc}`).join('\n') :
  '☐ Current IEP\n☐ Recent evaluations\n☐ Progress reports\n☐ Work samples'}

PREPARATION TASKS:
☐ Review current IEP goals and progress
☐ Prepare questions (see below)
☐ Gather recent work samples
☐ Note any concerns or changes since last meeting
☐ Review legal rights and procedural safeguards
☐ Plan childcare if needed

═══════════════════════════════════════

🎯 MEETING PRIORITIES:
${data.priorities || `• Discuss current progress on existing goals
• Address any new concerns or needs
• Ensure appropriate supports and services
• Plan for upcoming transitions or changes
• Review and update accommodation needs`}

🤔 KEY QUESTIONS TO ASK:

PROGRESS & GOALS:
• How is my child progressing toward current IEP goals?
• What data supports these progress reports?
• Which goals need to be modified or updated?
• Are current goals still appropriate and challenging?

SERVICES & SUPPORTS:
• Are current services meeting my child's needs?
• What additional supports might be beneficial?
• How are accommodations working in the classroom?
• Are there new assistive technologies to consider?

EDUCATIONAL ENVIRONMENT:
• Is the current placement the least restrictive environment?
• How is my child doing socially with peers?
• What classroom modifications are in place?
• Are there inclusion opportunities we should explore?

CONCERNS TO DISCUSS:
${data.concerns || `• Any new challenges or regression
• Changes in behavior or motivation
• Academic concerns in specific subjects
• Social or emotional needs
• Physical or health considerations`}

═══════════════════════════════════════

⚖️ LEGAL RIGHTS REMINDER:

YOUR RIGHTS UNDER IDEA:
• Right to meaningful participation in all decisions
• Right to prior written notice of any changes
• Right to request an independent evaluation
• Right to dispute resolution procedures
• Right to have child educated in least restrictive environment

IF YOU DISAGREE:
• Ask for prior written notice of the team's decision
• Request additional meeting time to discuss
• Consider independent evaluation
• Know your mediation and due process rights

═══════════════════════════════════════

📝 MEETING AGENDA ITEMS:

1. INTRODUCTIONS & REVIEW (10 minutes)
   - Team member introductions
   - Review meeting purpose and timeline

2. PRESENT LEVELS DISCUSSION (15 minutes)
   - Current academic performance
   - Functional performance updates
   - Strengths and needs assessment

3. GOAL REVIEW & DEVELOPMENT (20 minutes)
   - Progress on existing goals
   - Goal modifications or new goals
   - Measurable annual goals discussion

4. SERVICES & SUPPORTS (15 minutes)
   - Special education services
   - Related services needs
   - Supplementary aids and services

5. PLACEMENT DISCUSSION (10 minutes)
   - Educational environment review
   - Least restrictive environment consideration

6. ASSESSMENT & TRANSITION (10 minutes)
   - Assessment participation
   - Transition planning (if age appropriate)

7. NEXT STEPS & TIMELINE (5 minutes)
   - Implementation timeline
   - Next meeting date
   - Follow-up actions

═══════════════════════════════════════

💡 ADVOCACY TIPS:

BEFORE THE MEETING:
• Arrive early and bring organized documents
• Bring a support person if desired
• Review your child's strengths and needs
• Prepare specific examples and data

DURING THE MEETING:
• Take notes or ask to record (with permission)
• Ask for clarification on any confusing terms
• Ensure all decisions are data-based
• Don't feel pressured to sign immediately

AFTER THE MEETING:
• Review the draft IEP carefully
• Ask questions before final approval
• Keep copies of all meeting documents
• Follow up on any agreed-upon actions

═══════════════════════════════════════

Remember: You are an equal member of the IEP team. Your input and concerns are valuable and should be respected throughout the process.

This preparation guide was generated using AI assistance and should be customized to your specific situation and needs.`;
  };

  // Save to vault mutation
  const saveToVaultMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/documents/generate", {
        content,
        type: "meeting_prep",
        generatedBy: "Meeting Prep Wizard",
        displayName: `Meeting Prep Guide - ${formData.studentId ? (students as any[]).find(s => s.id === formData.studentId)?.firstName + ' ' + (students as any[]).find(s => s.id === formData.studentId)?.lastName : 'Student'} - ${formData.meetingDate || new Date().toLocaleDateString()}`,
        parentDocumentId: null,
        studentId: formData.studentId || null
      });
      
      if (!response.ok) {
        throw new Error("Failed to save to vault");
      }
      
      return response.json();
    },
    onSuccess: () => {
      const selectedStudent = students.find(s => s.id === formData.studentId);
      const studentName = selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : 'Student';
      
      toast({
        title: "Meeting Prep Guide Saved!",
        description: `Saved to Document Vault for ${studentName}`
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
            <h1 className="text-3xl font-bold text-white">Meeting Prep Wizard</h1>
            <p className="text-blue-200">Comprehensive IEP meeting preparation assistant</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preparation Form */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Meeting Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Meeting Type</Label>
                <Select value={formData.meetingType} onValueChange={(value) => setFormData({...formData, meetingType: value})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select meeting type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(meetingTypes).map(([key, title]) => (
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
                  <Label className="text-white">Meeting Date</Label>
                  <Input
                    type="date"
                    value={formData.meetingDate}
                    onChange={(e) => setFormData({...formData, meetingDate: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Expected Attendees</Label>
                <Textarea
                  value={formData.attendees}
                  onChange={(e) => setFormData({...formData, attendees: e.target.value})}
                  placeholder="List team members who will attend (teachers, specialists, administrators...)"
                  rows={2}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              <div>
                <Label className="text-white">Primary Concerns</Label>
                <Textarea
                  value={formData.concerns}
                  onChange={(e) => setFormData({...formData, concerns: e.target.value})}
                  placeholder="What concerns or issues do you want to address in this meeting?"
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              <div>
                <Label className="text-white">Meeting Priorities</Label>
                <Textarea
                  value={formData.priorities}
                  onChange={(e) => setFormData({...formData, priorities: e.target.value})}
                  placeholder="What are your top priorities for this meeting?"
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              <div>
                <Label className="text-white">Questions to Ask</Label>
                <Textarea
                  value={formData.questions}
                  onChange={(e) => setFormData({...formData, questions: e.target.value})}
                  placeholder="Specific questions you want to ask the team..."
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              <div>
                <Label className="text-white">Documents to Bring</Label>
                <div className="space-y-2 mt-2">
                  {documentChecklist.map((document) => (
                    <div key={document} className="flex items-center space-x-2">
                      <Checkbox
                        id={document}
                        checked={formData.documents.includes(document)}
                        onCheckedChange={(checked) => handleDocumentChange(document, checked as boolean)}
                        className="border-white/20"
                      />
                      <label htmlFor={document} className="text-white text-sm">
                        {document}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? "Preparing Guide..." : "Generate Prep Guide"}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Prep Guide */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Meeting Preparation Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedPrep ? (
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 max-h-96 overflow-y-auto">
                    <pre className="text-white text-sm whitespace-pre-wrap font-mono">
                      {generatedPrep}
                    </pre>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        const blob = new Blob([generatedPrep], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `Meeting_Prep_${formData.studentName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Student'}.txt`;
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
                        saveToVaultMutation.mutate(generatedPrep);
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
                  <Users className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">Fill out the meeting details to generate your comprehensive prep guide</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}