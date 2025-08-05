import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Calendar, FileText, Users, CheckSquare, Download, Lightbulb } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface Goal {
  id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
}

interface Document {
  id: string;
  filename: string;
  originalName: string;
  type: string;
}

export default function MeetingPrep() {
  const { user } = useAuth();
  const [meetingType, setMeetingType] = useState<"annual" | "quarterly" | "informal">("quarterly");
  const [meetingDate, setMeetingDate] = useState("");
  const [concerns, setConcerns] = useState("");
  const [questions, setQuestions] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prepPackage, setPrepPackage] = useState<any>(null);

  // Check if user has Hero plan access - force enable for demo accounts
  const hasHeroAccess = user?.planStatus === 'heroOffer' || 
                        user?.email === 'parent@demo.com' ||
                        (process.env.NODE_ENV === 'development' && user?.role === 'parent');

  // Fetch goals
  const { data: goals = [] } = useQuery<Goal[]>({
    queryKey: ['/api/goals'],
    enabled: hasHeroAccess
  });

  // Fetch documents
  const { data: documents = [] } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
    enabled: hasHeroAccess
  });

  if (!hasHeroAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/dashboard-parent">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <Card className="text-center p-8">
            <CardContent>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">IEP Meeting Prep</h2>
              <p className="text-gray-600 mb-6">
                This comprehensive meeting preparation tool is available with the Hero Plan ($495/year)
              </p>
              <Link href="/subscribe">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  Upgrade to Hero Plan
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const generateMeetingPrep = async () => {
    setIsGenerating(true);
    
    // Simulate AI-powered meeting prep generation
    setTimeout(() => {
      const selectedGoalsData = goals.filter(g => selectedGoals.includes(g.id));
      const selectedDocsData = documents.filter(d => selectedDocs.includes(d.id));
      
      const prepData = {
        meetingInfo: {
          type: meetingType,
          date: meetingDate,
          duration: meetingType === 'annual' ? '2-3 hours' : meetingType === 'quarterly' ? '1-1.5 hours' : '30-45 minutes'
        },
        agenda: generateAgenda(meetingType, selectedGoalsData),
        questionsToAsk: generateQuestions(meetingType, concerns),
        documentsToReview: selectedDocsData,
        goalStatus: selectedGoalsData,
        parentRights: getParentRights(meetingType),
        preparation: getPreparationTips(meetingType)
      };
      
      setPrepPackage(prepData);
      setIsGenerating(false);
    }, 2000);
  };

  const generateAgenda = (type: string, goals: Goal[]) => {
    const baseAgenda = [
      "Welcome and introductions",
      "Review of current IEP goals and progress",
      "Discussion of assessments and evaluations",
      "Review of accommodations and modifications"
    ];

    if (type === 'annual') {
      return [
        ...baseAgenda,
        "Transition planning (if applicable)",
        "Setting new annual goals",
        "Placement and service decisions",
        "Schedule next meeting"
      ];
    } else if (type === 'quarterly') {
      return [
        ...baseAgenda,
        "Progress monitoring review",
        "Adjustment of current supports",
        "Parent and student concerns",
        "Next steps and timeline"
      ];
    } else {
      return [
        "Check-in on current goals",
        "Address specific concerns",
        "Quick progress review",
        "Immediate action items"
      ];
    }
  };

  const generateQuestions = (type: string, userConcerns: string) => {
    const baseQuestions = [
      "How is my child progressing toward their current goals?",
      "Are the current accommodations working effectively?",
      "What support can I provide at home?",
      "Are there any concerns I should be aware of?"
    ];

    const typeSpecificQuestions = {
      annual: [
        "What new goals should we set for next year?",
        "Are there additional services my child might benefit from?",
        "How will we measure progress throughout the year?",
        "Should we consider any changes to placement?"
      ],
      quarterly: [
        "Which goals are on track and which need adjustment?",
        "Are there any behavioral concerns?",
        "How can we improve collaboration between home and school?",
        "What additional resources might help?"
      ],
      informal: [
        "What immediate changes can we make?",
        "Are there any urgent concerns?",
        "How can we better support current goals?",
        "What quick wins can we implement?"
      ]
    };

    let questions = [...baseQuestions, ...typeSpecificQuestions[type as keyof typeof typeSpecificQuestions]];
    
    if (userConcerns.trim()) {
      questions.push(`Regarding my concerns about: ${userConcerns} - what can we do to address this?`);
    }

    return questions;
  };

  const getParentRights = (type: string) => [
    "You have the right to participate equally in all decisions",
    "You can request additional team members to attend",
    "You can request an independent evaluation if needed",
    "You have the right to review all records before the meeting",
    "You can bring an advocate or support person",
    "You can request the meeting be rescheduled if needed"
  ];

  const getPreparationTips = (type: string) => [
    "Review your child's current IEP document thoroughly",
    "Gather any recent work samples or progress reports",
    "Prepare a list of your child's strengths and challenges",
    "Document any concerns or observations from home",
    "Bring a notebook to take notes during the meeting",
    "Arrive a few minutes early to settle in and review materials"
  ];

  const downloadPrepPackage = () => {
    // In a real implementation, this would generate a PDF
    alert("Meeting prep package would be downloaded as PDF (feature in development)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard-parent">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">IEP Meeting Prep</h1>
              <p className="text-gray-600">Get organized and confident for your next IEP meeting</p>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              Hero Plan
            </Badge>
          </div>
        </div>

        {!prepPackage ? (
          /* Meeting Setup Form */
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Meeting Information
                </CardTitle>
                <CardDescription>Tell us about your upcoming meeting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Meeting Type</Label>
                  <div className="flex gap-4 mt-2">
                    {[
                      { value: "annual", label: "Annual Review", desc: "Comprehensive yearly meeting" },
                      { value: "quarterly", label: "Progress Review", desc: "Regular check-in meeting" },
                      { value: "informal", label: "Informal Meeting", desc: "Quick discussion or concern" }
                    ].map((option) => (
                      <div key={option.value} className="flex-1">
                        <Button
                          variant={meetingType === option.value ? "default" : "outline"}
                          className="w-full h-auto p-4 flex flex-col items-start"
                          onClick={() => setMeetingType(option.value as any)}
                        >
                          <span className="font-medium">{option.label}</span>
                          <span className="text-xs opacity-70">{option.desc}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="meetingDate">Meeting Date (Optional)</Label>
                  <Input
                    id="meetingDate"
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="concerns">Current Concerns or Questions</Label>
                  <Textarea
                    id="concerns"
                    placeholder="What specific topics do you want to discuss? Any concerns about progress, behavior, or services?"
                    value={concerns}
                    onChange={(e) => setConcerns(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5" />
                  Goals to Discuss
                </CardTitle>
                <CardDescription>Select goals you want to focus on during the meeting</CardDescription>
              </CardHeader>
              <CardContent>
                {goals.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No goals found. <Link href="/goals" className="text-blue-600 hover:underline">Add some goals</Link> to get started.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {goals.map((goal) => (
                      <div key={goal.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                        <Checkbox
                          id={goal.id}
                          checked={selectedGoals.includes(goal.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedGoals([...selectedGoals, goal.id]);
                            } else {
                              setSelectedGoals(selectedGoals.filter(id => id !== goal.id));
                            }
                          }}
                        />
                        <label htmlFor={goal.id} className="flex-1 cursor-pointer">
                          <div className="font-medium">{goal.title}</div>
                          <div className="text-sm text-gray-500">Progress: {goal.progress}%</div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documents to Reference
                </CardTitle>
                <CardDescription>Select relevant documents to discuss</CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No documents found. <Link href="/documents" className="text-blue-600 hover:underline">Upload some documents</Link> to reference them in meetings.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                        <Checkbox
                          id={doc.id}
                          checked={selectedDocs.includes(doc.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedDocs([...selectedDocs, doc.id]);
                            } else {
                              setSelectedDocs(selectedDocs.filter(id => id !== doc.id));
                            }
                          }}
                        />
                        <label htmlFor={doc.id} className="flex-1 cursor-pointer">
                          <div className="font-medium">{doc.originalName}</div>
                          <div className="text-sm text-gray-500 capitalize">{doc.type}</div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={generateMeetingPrep}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Generating Meeting Prep Package...
                </>
              ) : (
                <>
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Generate Meeting Prep Package
                </>
              )}
            </Button>
          </div>
        ) : (
          /* Meeting Prep Package */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Meeting Prep Package</h2>
              <div className="flex gap-2">
                <Button onClick={downloadPrepPackage} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button onClick={() => setPrepPackage(null)} variant="outline">
                  Start Over
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Meeting Agenda</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {prepPackage.agenda.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 font-medium">{index + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Questions to Ask</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {prepPackage.questionsToAsk.map((question: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600">•</span>
                        <span className="text-sm">{question}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Rights as a Parent</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {prepPackage.parentRights.map((right: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-purple-600">✓</span>
                        <span className="text-sm">{right}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preparation Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {prepPackage.preparation.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-600">💡</span>
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {prepPackage.goalStatus.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Goals to Discuss</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {prepPackage.goalStatus.map((goal: Goal) => (
                      <div key={goal.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{goal.title}</h4>
                          <Badge variant="secondary">{goal.progress}% complete</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}