import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, ChevronLeft, Wand2, Copy, Download, Save, ClipboardList } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface WizardStep {
  id: number;
  title: string;
  description: string;
  field: string;
  type: 'text' | 'textarea' | 'radio' | 'radio-text';
  options?: string[];
  required: boolean;
}

const wizardSteps: WizardStep[] = [
  {
    id: 1,
    title: "Meeting Concerns",
    description: "What concerns do you want to address in this meeting?",
    field: "concerns",
    type: "textarea",
    required: true
  },
  {
    id: 2,
    title: "Services & Supports",
    description: "What services or supports are you unsure about?",
    field: "services",
    type: "textarea",
    required: false
  },
  {
    id: 3,
    title: "Child's Progress",
    description: "What progress has your child made lately — or not made?",
    field: "progress",
    type: "textarea",
    required: true
  },
  {
    id: 4,
    title: "Recent Changes",
    description: "Are there any recent behavioral, emotional, or medical changes?",
    field: "changes",
    type: "radio-text",
    options: ["Yes", "No"],
    required: true
  },
  {
    id: 5,
    title: "Goal/Placement Requests",
    description: "Are you requesting any changes to goals or placement?",
    field: "requests",
    type: "radio-text",
    options: ["Yes", "No"],
    required: true
  },
  {
    id: 6,
    title: "Support Attendees",
    description: "Do you want anyone else to attend this meeting with you?",
    field: "attendees",
    type: "radio-text",
    options: ["Yes", "No"],
    required: false
  },
  {
    id: 7,
    title: "Questions for Team",
    description: "Any specific questions you want to ask the school team?",
    field: "questions",
    type: "textarea",
    required: false
  }
];

export default function MeetingPrepWizard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedPrep, setGeneratedPrep] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Check if user has Hero plan access
  const hasHeroAccess = user?.planStatus === 'heroOffer' || 
                        user?.email === 'parent@demo.com';

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
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Meeting Prep Wizard</h2>
              <p className="text-gray-600 mb-6">
                This AI-powered meeting preparation tool is available with the Hero Plan ($495/year)
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

  const currentStepData = wizardSteps.find(step => step.id === currentStep);
  const progress = (currentStep / wizardSteps.length) * 100;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRadioTextChange = (field: string, radioValue: string, textValue?: string) => {
    if (radioValue === "Yes" && textValue !== undefined) {
      setFormData(prev => ({ ...prev, [field]: `${radioValue}: ${textValue}` }));
    } else {
      setFormData(prev => ({ ...prev, [field]: radioValue }));
    }
  };

  const nextStep = () => {
    if (currentStepData?.required && !formData[currentStepData.field]?.trim()) {
      toast({
        title: "Required Field",
        description: "Please complete this step before continuing.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < wizardSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      generatePrepSheet();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generatePrepSheet = async () => {
    setIsGenerating(true);

    try {
      const response = await apiRequest('POST', '/api/generate-meeting-prep', {
        formData
      });

      const data = await response.json();
      setGeneratedPrep(data.prepSheet);
      setIsComplete(true);

      toast({
        title: "Prep Sheet Generated!",
        description: "Your personalized IEP meeting preparation guide is ready.",
      });
    } catch (error) {
      console.error('Error generating prep sheet:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate prep sheet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrep);
      toast({
        title: "Copied!",
        description: "Prep sheet copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadPDF = () => {
    const blob = new Blob([generatedPrep], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'iep-meeting-prep-sheet.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Prep sheet saved to your downloads",
    });
  };

  const startOver = () => {
    setCurrentStep(1);
    setFormData({});
    setGeneratedPrep('');
    setIsComplete(false);
  };

  if (isComplete && generatedPrep) {
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

          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Your IEP Meeting Prep Sheet</CardTitle>
              <CardDescription>
                Personalized preparation guide for your upcoming IEP meeting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 mb-6">
                <Button onClick={copyToClipboard} variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button onClick={downloadPDF} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button onClick={startOver} variant="outline">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Start New Prep
                </Button>
              </div>

              <div className="bg-white rounded-lg p-6 border">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">{generatedPrep}</pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wand2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Generating Your Prep Sheet</h3>
            <p className="text-gray-600 mb-4">
              Creating your personalized IEP meeting preparation guide...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard-parent">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-xl">Meeting Prep Wizard</CardTitle>
                <CardDescription>Step {currentStep} of {wizardSteps.length}</CardDescription>
              </div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <ClipboardList className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <Progress value={progress} className="w-full" />
          </CardHeader>

          <CardContent className="space-y-6">
            {currentStepData && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{currentStepData.title}</h3>
                  <p className="text-gray-600 mb-4">{currentStepData.description}</p>

                  {currentStepData.type === 'text' && (
                    <Input
                      value={formData[currentStepData.field] || ''}
                      onChange={(e) => handleInputChange(currentStepData.field, e.target.value)}
                      placeholder="Enter your response..."
                      className="w-full"
                    />
                  )}

                  {currentStepData.type === 'textarea' && (
                    <Textarea
                      value={formData[currentStepData.field] || ''}
                      onChange={(e) => handleInputChange(currentStepData.field, e.target.value)}
                      placeholder="Enter your response..."
                      rows={4}
                      className="w-full"
                    />
                  )}

                  {currentStepData.type === 'radio-text' && (
                    <div className="space-y-4">
                      <RadioGroup
                        value={formData[`${currentStepData.field}_radio`] || ''}
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, [`${currentStepData.field}_radio`]: value }));
                          if (value === "No") {
                            handleRadioTextChange(currentStepData.field, value);
                          }
                        }}
                      >
                        {currentStepData.options?.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={option} />
                            <Label htmlFor={option}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>

                      {formData[`${currentStepData.field}_radio`] === "Yes" && (
                        <Textarea
                          value={formData[`${currentStepData.field}_text`] || ''}
                          onChange={(e) => {
                            const textValue = e.target.value;
                            setFormData(prev => ({ ...prev, [`${currentStepData.field}_text`]: textValue }));
                            handleRadioTextChange(currentStepData.field, "Yes", textValue);
                          }}
                          placeholder="Please provide details..."
                          rows={3}
                          className="w-full"
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <Button onClick={nextStep}>
                    {currentStep === wizardSteps.length ? (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Prep Sheet
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}