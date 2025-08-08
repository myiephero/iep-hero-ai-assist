import { useState } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { 
  FileText, 
  Download, 
  Copy, 
  Send,
  RefreshCw,
  Mail,
  User,
  Calendar,
  Briefcase
} from "lucide-react";
import { useToast } from "../hooks/use-toast";

export default function LetterGenerator() {
  const [formData, setFormData] = useState({
    letterType: "",
    studentName: "",
    studentGrade: "",
    schoolName: "",
    recipientName: "",
    recipientTitle: "",
    parentName: "",
    concerns: "",
    requestedServices: [] as string[],
    urgency: "",
    additionalInfo: ""
  });

  const [generatedLetter, setGeneratedLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const letterTypes = [
    { value: "initial-referral", label: "Initial IEP Referral" },
    { value: "evaluation-request", label: "Request for Evaluation" },
    { value: "meeting-request", label: "IEP Meeting Request" },
    { value: "concern-letter", label: "Concern/Complaint Letter" },
    { value: "service-request", label: "Additional Services Request" },
    { value: "progress-inquiry", label: "Progress Report Inquiry" },
    { value: "placement-concern", label: "Placement Concern" },
    { value: "due-process", label: "Due Process Notice" }
  ];

  const serviceOptions = [
    "Speech Therapy",
    "Occupational Therapy", 
    "Physical Therapy",
    "Behavioral Support",
    "Extended School Year (ESY)",
    "Assistive Technology",
    "Specialized Transportation",
    "1:1 Aide Support",
    "Counseling Services",
    "Adaptive PE"
  ];

  const handleServiceChange = (service: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      requestedServices: checked 
        ? [...prev.requestedServices, service]
        : prev.requestedServices.filter(s => s !== service)
    }));
  };

  const generateLetter = () => {
    setIsGenerating(true);
    
    // Simulate letter generation
    setTimeout(() => {
      const date = new Date().toLocaleDateString();
      const letter = `${date}

${formData.recipientName}
${formData.recipientTitle}
${formData.schoolName}

Dear ${formData.recipientName},

I am writing to formally request ${formData.letterType.replace('-', ' ')} for my child, ${formData.studentName}, who is currently in ${formData.studentGrade} grade at ${formData.schoolName}.

CONCERNS:
${formData.concerns}

REQUESTED SERVICES:
${formData.requestedServices.map(service => `• ${service}`).join('\n')}

${formData.additionalInfo ? `ADDITIONAL INFORMATION:\n${formData.additionalInfo}\n\n` : ''}I believe these services are necessary to ensure ${formData.studentName} receives a Free Appropriate Public Education (FAPE) as guaranteed under the Individuals with Disabilities Education Act (IDEA).

I request that we schedule a meeting within 30 days to discuss this matter further. Please provide me with written confirmation of this request and the proposed meeting date.

Thank you for your attention to this matter. I look forward to working collaboratively to support ${formData.studentName}'s educational needs.

Sincerely,

${formData.parentName}
Parent/Guardian of ${formData.studentName}

---
This letter was generated using IEP Advocacy Services Letter Generator. Please review and customize as needed before sending.`;

      setGeneratedLetter(letter);
      setIsGenerating(false);
      toast({
        title: "Letter Generated Successfully",
        description: "Your advocacy letter has been created. Please review before sending.",
      });
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast({
      title: "Copied to Clipboard",
      description: "The letter has been copied to your clipboard.",
    });
  };

  const downloadLetter = () => {
    const blob = new Blob([generatedLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IEP-Letter-${formData.studentName}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Letter Downloaded",
      description: "Your letter has been downloaded as a text file.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">IEP Advocacy Letter Generator</h1>
            <p className="text-xl text-muted-foreground">
              Create professional advocacy letters to communicate effectively with your child's school
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Letter Details
                </CardTitle>
                <CardDescription>
                  Fill out the information below to generate your advocacy letter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Letter Type */}
                <div className="space-y-2">
                  <Label>Letter Type</Label>
                  <Select value={formData.letterType} onValueChange={(value) => setFormData(prev => ({...prev, letterType: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select letter type" />
                    </SelectTrigger>
                    <SelectContent>
                      {letterTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Student Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Student Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentName">Student Name</Label>
                      <Input 
                        id="studentName"
                        value={formData.studentName}
                        onChange={(e) => setFormData(prev => ({...prev, studentName: e.target.value}))}
                        placeholder="Enter student's full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentGrade">Grade</Label>
                      <Input 
                        id="studentGrade"
                        value={formData.studentGrade}
                        onChange={(e) => setFormData(prev => ({...prev, studentGrade: e.target.value}))}
                        placeholder="e.g., 3rd grade, 9th grade"
                      />
                    </div>
                  </div>
                </div>

                {/* School Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    School Information
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input 
                      id="schoolName"
                      value={formData.schoolName}
                      onChange={(e) => setFormData(prev => ({...prev, schoolName: e.target.value}))}
                      placeholder="Enter school name"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipientName">Recipient Name</Label>
                      <Input 
                        id="recipientName"
                        value={formData.recipientName}
                        onChange={(e) => setFormData(prev => ({...prev, recipientName: e.target.value}))}
                        placeholder="Principal, Special Ed Director, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipientTitle">Recipient Title</Label>
                      <Input 
                        id="recipientTitle"
                        value={formData.recipientTitle}
                        onChange={(e) => setFormData(prev => ({...prev, recipientTitle: e.target.value}))}
                        placeholder="Principal, Director of Special Education"
                      />
                    </div>
                  </div>
                </div>

                {/* Parent Information */}
                <div className="space-y-2">
                  <Label htmlFor="parentName">Your Name (Parent/Guardian)</Label>
                  <Input 
                    id="parentName"
                    value={formData.parentName}
                    onChange={(e) => setFormData(prev => ({...prev, parentName: e.target.value}))}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Concerns */}
                <div className="space-y-2">
                  <Label htmlFor="concerns">Specific Concerns</Label>
                  <Textarea 
                    id="concerns"
                    value={formData.concerns}
                    onChange={(e) => setFormData(prev => ({...prev, concerns: e.target.value}))}
                    placeholder="Describe your specific concerns about your child's education..."
                    rows={4}
                  />
                </div>

                {/* Requested Services */}
                <div className="space-y-2">
                  <Label>Requested Services (select all that apply)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {serviceOptions.map(service => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox 
                          id={service}
                          checked={formData.requestedServices.includes(service)}
                          onCheckedChange={(checked) => handleServiceChange(service, checked as boolean)}
                        />
                        <Label htmlFor={service} className="text-sm">{service}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                  <Textarea 
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData(prev => ({...prev, additionalInfo: e.target.value}))}
                    placeholder="Any additional details you'd like to include..."
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={generateLetter} 
                  disabled={!formData.letterType || !formData.studentName || !formData.schoolName || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating Letter...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Letter
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Letter Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Generated Letter
                </CardTitle>
                <CardDescription>
                  Review and customize your letter before sending
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedLetter ? (
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm font-mono">{generatedLetter}</pre>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={copyToClipboard} variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button onClick={downloadLetter} variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Send className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Fill out the form and click "Generate Letter" to create your advocacy letter
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tips Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Tips for Effective Advocacy Letters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Be Specific</h4>
                  <p className="text-sm text-muted-foreground">
                    Include specific examples of concerns and clearly state what you're requesting.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Stay Professional</h4>
                  <p className="text-sm text-muted-foreground">
                    Maintain a respectful and collaborative tone throughout your communication.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Keep Records</h4>
                  <p className="text-sm text-muted-foreground">
                    Always keep copies of your letters and any responses you receive.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Know Your Rights</h4>
                  <p className="text-sm text-muted-foreground">
                    Reference IDEA and your child's right to FAPE when appropriate.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Set Timelines</h4>
                  <p className="text-sm text-muted-foreground">
                    Request specific response times and meeting dates in your letters.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Follow Up</h4>
                  <p className="text-sm text-muted-foreground">
                    If you don't receive a response, send a follow-up letter referencing your original request.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}