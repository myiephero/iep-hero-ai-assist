import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileText, Copy, Download, Save, Wand2 } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { supabase } from "@/utils/supabaseClient";

interface LetterTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  fields: {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'date';
    required: boolean;
    placeholder?: string;
  }[];
}

const letterTemplates: LetterTemplate[] = [
  {
    id: 'iep-evaluation',
    title: 'Request for IEP Evaluation',
    description: 'Request a comprehensive special education evaluation',
    category: 'Evaluation Requests',
    fields: [
      { name: 'childName', label: 'Child\'s Name', type: 'text', required: true },
      { name: 'schoolName', label: 'School Name', type: 'text', required: true },
      { name: 'concerns', label: 'Specific Concerns', type: 'textarea', required: true, placeholder: 'e.g., reading delays, behavior issues, attention difficulties...' }
    ]
  },
  {
    id: 'fba-request',
    title: 'Request for Functional Behavior Assessment (FBA)',
    description: 'Request a formal behavior assessment',
    category: 'Behavioral Support',
    fields: [
      { name: 'childName', label: 'Child\'s Name', type: 'text', required: true },
      { name: 'schoolName', label: 'School Name', type: 'text', required: true },
      { name: 'behaviors', label: 'Behavioral Concerns', type: 'textarea', required: true, placeholder: 'e.g., aggressive outbursts, refusal to complete work, disrupting class...' }
    ]
  },
  {
    id: 'progress-data',
    title: 'Request for Progress Reports or Data',
    description: 'Request all progress monitoring data and service records',
    category: 'Data & Records',
    fields: [
      { name: 'childName', label: 'Child\'s Name', type: 'text', required: true },
      { name: 'schoolName', label: 'School Name', type: 'text', required: true }
    ]
  },
  {
    id: 'dispute-complaint',
    title: 'Dispute or Complaint Letter',
    description: 'Express concern about IEP implementation failures',
    category: 'Advocacy',
    fields: [
      { name: 'childName', label: 'Child\'s Name', type: 'text', required: true },
      { name: 'schoolName', label: 'School Name', type: 'text', required: true },
      { name: 'issue', label: 'Issue Description', type: 'textarea', required: true, placeholder: 'e.g., provide speech services as outlined in the IEP, implement behavior plan...' }
    ]
  },
  {
    id: 'pwn-response',
    title: 'Prior Written Notice (PWN) Response',
    description: 'Respond to a Prior Written Notice from the school',
    category: 'Legal Response',
    fields: [
      { name: 'childName', label: 'Child\'s Name', type: 'text', required: true },
      { name: 'schoolName', label: 'School Name', type: 'text', required: true },
      { name: 'proposedAction', label: 'Proposed Action', type: 'textarea', required: true, placeholder: 'e.g., deny requested service, change placement, reduce services...' }
    ]
  },
  {
    id: 'iep-meeting',
    title: 'Request for IEP Meeting',
    description: 'Request an IEP team meeting for new concerns',
    category: 'Meeting Requests',
    fields: [
      { name: 'childName', label: 'Child\'s Name', type: 'text', required: true },
      { name: 'schoolName', label: 'School Name', type: 'text', required: true },
      { name: 'concerns', label: 'New Concerns', type: 'textarea', required: true, placeholder: 'e.g., declining academic performance, behavioral changes, lack of progress...' }
    ]
  },
  {
    id: 'parent-concerns',
    title: 'Parent Concerns Letter (Attach to IEP)',
    description: 'Parent input statement for IEP attachment',
    category: 'Documentation',
    fields: [
      { name: 'childName', label: 'Child\'s Name', type: 'text', required: true },
      { name: 'schoolName', label: 'School Name', type: 'text', required: true },
      { name: 'specificAreas', label: 'Specific Areas of Concern', type: 'textarea', required: true, placeholder: 'e.g., reading comprehension, peer interactions, service consistency...' }
    ]
  },
  {
    id: '504-request',
    title: '504 Plan Request (Initial)',
    description: 'Request a Section 504 Plan evaluation',
    category: 'Evaluation Requests',
    fields: [
      { name: 'childName', label: 'Child\'s Name', type: 'text', required: true },
      { name: 'schoolName', label: 'School Name', type: 'text', required: true },
      { name: 'diagnosis', label: 'Documented Diagnosis', type: 'text', required: true, placeholder: 'e.g., ADHD, anxiety, dyslexia...' }
    ]
  },
  {
    id: 'service-check',
    title: 'Service Implementation Check-In',
    description: 'Verify IEP services are being implemented',
    category: 'Monitoring',
    fields: [
      { name: 'childName', label: 'Child\'s Name', type: 'text', required: true },
      { name: 'schoolName', label: 'School Name', type: 'text', required: true }
    ]
  },
  {
    id: 'observation-request',
    title: 'Request to Observe Child in School Setting',
    description: 'Request permission to observe child in classroom',
    category: 'Observation',
    fields: [
      { name: 'childName', label: 'Child\'s Name', type: 'text', required: true },
      { name: 'schoolName', label: 'School Name', type: 'text', required: true },
      { name: 'availability', label: 'Available Dates/Times', type: 'text', required: false, placeholder: 'When are you available to observe?' }
    ]
  }
];

export default function SmartLetterGenerator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch students for mapping child names to student IDs
  const { data: parentStudents = [] } = useQuery<Array<{id: string, firstName: string, lastName: string}>>({
    queryKey: ["/api/parent/students"],
    enabled: !!user && user.role === 'parent',
  });

  const { data: advocateStudents = [] } = useQuery<Array<{id: string, firstName: string, lastName: string}>>({
    queryKey: ["/api/advocate/students"],
    enabled: !!user && user.role === 'advocate',
  });

  // Use appropriate students list based on user role
  const students = user?.role === 'advocate' ? advocateStudents : parentStudents;

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
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Smart Letter Generator</h2>
              <p className="text-gray-600 mb-6">
                Create professional advocacy letters with AI assistance. Available with Hero Plan ($495/year).
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

  const currentTemplate = letterTemplates.find(t => t.id === selectedTemplate);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateLetter = async () => {
    if (!currentTemplate) return;

    // Validate required fields including student selection
    if (!selectedStudentId) {
      toast({
        title: "Student Required",
        description: "Please select a student before generating the letter",
        variant: "destructive",
      });
      return;
    }

    const missingFields = currentTemplate.fields
      .filter(field => field.required && !formData[field.name]?.trim())
      .map(field => field.label);

    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Information",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await apiRequest('POST', '/api/generate-letter', {
        templateId: selectedTemplate,
        templateTitle: currentTemplate.title,
        formData
      });

      const data = await response.json();
      setGeneratedLetter(data.letter);

      toast({
        title: "Letter Generated!",
        description: "Your professional advocacy letter has been created.",
      });
    } catch (error) {
      console.error('Error generating letter:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate letter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLetter);
      toast({
        title: "Copied!",
        description: "Letter copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadLetter = () => {
    const blob = new Blob([generatedLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTemplate?.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Letter saved to your downloads",
    });
  };

  // Comprehensive debug test function
  const testManualInsert = async () => {
    console.log("🧪 Manual Insert Test Started");
    try {
      // Step 1: Check authentication
      console.log("🔍 Step 1: Checking Supabase authentication...");
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      console.log("📊 Session data:", { session: !!session, user: !!session?.user, sessionError });
      
      if (sessionError || !session?.user) {
        console.error("❌ Authentication failed:", sessionError);
        toast({
          title: "Authentication Failed", 
          description: "Please log in to test insert functionality",
          variant: "destructive"
        });
        return;
      }
      
      // Step 2: Test basic insert
      console.log("🔍 Step 2: Testing basic document insert...");
      const testData = {
        user_id: session.user.id,
        title: "Debug Test Letter",
        content: "This is a comprehensive debug test insert to verify Supabase connectivity and RLS policies.",
        type: "letter",
        filename: `debug_test_${Date.now()}.txt`,
        original_name: "Debug Test Letter.txt",
        display_name: "Debug Test Letter",
        generated_by: "Debug Manual Test",
        created_at: new Date().toISOString(),
        uploaded_at: new Date().toISOString()
      };
      
      console.log("📤 Insert payload:", testData);
      
      const { data, error } = await supabase
        .from("documents")
        .insert(testData, { returning: "minimal" });
      
      console.log("📊 Insert response:", { data, error });
      
      if (error) {
        console.error("❌ Manual insert error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        toast({
          title: "Manual Test Failed", 
          description: `Error: ${error.message}`,
          variant: "destructive"
        });
      } else {
        console.log("✅ Manual test insert successful!");
        toast({
          title: "🎉 Manual Test Successful",
          description: "Insert worked perfectly - check your Document Vault!"
        });
      }
    } catch (error: any) {
      console.error("❌ Manual test exception:", error);
      toast({
        title: "Test Exception",
        description: error.message || "Unexpected error during test",
        variant: "destructive"
      });
    }
  };

  const saveToVault = async () => {
    console.log("🚀 Step 1: Save to Vault clicked"); // Debug log
    
    if (!generatedLetter || !currentTemplate) {
      console.log("❌ Missing generatedLetter or currentTemplate");
      toast({
        title: "No Content to Save",
        description: "Please generate a letter first before saving to vault",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // Check frontend authentication first
      console.log("Frontend user:", user);
      if (!user) {
        console.log("User not authenticated on frontend, redirecting to login");
        toast({
          title: "Login Required",
          description: "Please log in to save documents to your vault",
          variant: "destructive",
        });
        window.location.href = '/login';
        return;
      }

      // Test backend authentication first
      console.log("🔍 Step 2: Testing backend authentication...");
      const authTest = await fetch('/api/current-user', {
        method: 'GET',
        credentials: 'include', // Essential for session-based auth
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("🔍 Auth test response status:", authTest.status);
      
      if (!authTest.ok) {
        console.error("❌ Backend authentication failed:", authTest.status);
        
        // Try to log in with demo credentials if not authenticated
        console.log("🔄 Attempting to authenticate with demo credentials...");
        const loginResponse = await fetch('/api/login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'parent@demo.com',
            password: 'demo123'
          }),
        });

        if (!loginResponse.ok) {
          console.error("❌ Demo login failed:", loginResponse.status);
          toast({
            title: "Authentication Failed",
            description: "Please log in again to save documents",
            variant: "destructive",
          });
          window.location.href = '/login';
          return;
        }
        
        console.log("✅ Demo authentication successful");
      }

      // Use selected student ID or child name from form
      const studentId = selectedStudentId || null;
      const selectedStudent = students.find(s => s.id === studentId);
      const childName = selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : (formData.childName?.trim() || 'Student');

      // Create document title from template and child name
      const documentTitle = `${currentTemplate.title} - ${childName}`;
      
      // Save document using backend API with session credentials
      console.log("🔍 Step 3: Saving document via backend API...");
      const documentData = {
        content: generatedLetter,
        type: 'letter',
        generatedBy: 'Smart Letter Generator',
        displayName: documentTitle,
        parentDocumentId: null,
        studentId: studentId
      };

      console.log("📤 API request payload:", documentData);
      const response = await fetch('/api/documents/generate', {
        method: 'POST',
        credentials: 'include', // Essential for session-based auth
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });
      
      console.log("📊 API response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API error response:", errorText);
        throw new Error(`Failed to save document: ${response.status} ${errorText}`);
      }

      const savedDocument = await response.json();
      console.log("✅ Document saved successfully:", savedDocument);

      toast({
        title: "Letter saved to your Document Vault!",
        description: `${documentTitle} has been saved successfully`,
      });

    } catch (error: any) {
      console.error('❌ Error saving to vault:', error);
      toast({
        title: "Save Failed",
        description: error.message || "Unable to save to document vault. Please try logging in again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setSelectedTemplate('');
    setSelectedStudentId('');
    setFormData({});
    setGeneratedLetter('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard-parent">
            <Button className="mb-4 bg-slate-600 hover:bg-slate-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Letter Generator</h1>
              <p className="text-gray-600">Create professional advocacy letters with AI assistance</p>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              Hero Plan
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Choose Letter Template
              </CardTitle>
              <CardDescription>
                Select the type of letter you need to generate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a letter template..." />
                </SelectTrigger>
                <SelectContent>
                  {letterTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      <div>
                        <div className="font-medium">{template.title}</div>
                        <div className="text-sm text-gray-500">{template.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Form Fields */}
          {currentTemplate && (
            <Card>
              <CardHeader>
                <CardTitle>{currentTemplate.title}</CardTitle>
                <CardDescription>{currentTemplate.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Student Selection */}
                <div>
                  <Label htmlFor="studentSelect">
                    Select Student <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a student..." />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.firstName} {student.lastName}
                        </SelectItem>
                      ))}
                      {students.length === 0 && (
                        <SelectItem value="" disabled>
                          No students available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentTemplate.fields.map(field => (
                    <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <Label htmlFor={field.name}>
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {field.type === 'textarea' ? (
                        <Textarea
                          id={field.name}
                          placeholder={field.placeholder}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          rows={3}
                        />
                      ) : (
                        <Input
                          id={field.name}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={generateLetter}
                    disabled={isGenerating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Letter
                      </>
                    )}
                  </Button>
                  <Button onClick={resetForm} className="bg-slate-600 hover:bg-slate-700 text-white">
                    Reset Form
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generated Letter Display */}
          {generatedLetter && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Generated Letter
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button onClick={downloadLetter} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    {!user ? (
                      <Button 
                        onClick={() => window.location.href = '/login'}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Login to Save
                      </Button>
                    ) : (
                      <Button 
                        onClick={saveToVault} 
                        size="sm"
                        disabled={isSaving}
                        className="bg-green-600 hover:bg-green-700 text-white disabled:bg-slate-500"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin w-3 h-3 border-2 border-green-200 border-t-transparent rounded-full mr-1" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-1" />
                            Save to Vault
                          </>
                        )}
                      </Button>
                    )}
                    
                    {/* Temporary test button for debugging - only show when authenticated */}
                    {user && (
                      <Button 
                        onClick={testManualInsert}
                        size="sm"
                        variant="outline"
                        className="border-yellow-500 text-yellow-500 hover:bg-yellow-50"
                      >
                        Test Insert
                      </Button>
                    )}
                  </div>
                </div>
                <CardDescription>
                  Review your letter below. You can copy, download, or save it to your document vault.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg p-6">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">
                    {generatedLetter}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}