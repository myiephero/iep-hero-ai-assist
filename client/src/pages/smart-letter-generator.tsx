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

    // Validate required fields
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

  const saveToVault = async () => {
    if (!generatedLetter || !currentTemplate) return;

    setIsSaving(true);
    try {
      // Check if user is authenticated
      if (!user) {
        throw new Error('Please log in to save documents');
      }

      // Find matching student ID based on child name from form
      let studentId = null;
      const childName = formData.childName?.trim();
      
      if (childName && students.length > 0) {
        // Try to match by full name first
        const matchingStudent = students.find(student => {
          const fullName = `${student.firstName} ${student.lastName}`.trim().toLowerCase();
          return fullName === childName.toLowerCase();
        });
        
        // If no full name match, try first name only
        if (!matchingStudent) {
          const firstNameMatch = students.find(student => 
            student.firstName.toLowerCase() === childName.toLowerCase()
          );
          studentId = firstNameMatch?.id || null;
        } else {
          studentId = matchingStudent.id;
        }
      }

      // Create document title from template and child name
      const documentTitle = `${currentTemplate.title} - ${childName || 'Student'}`;
      
      // Try Supabase first, fallback to API endpoint if not available
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://')) {
        // Use direct Supabase insertion
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session?.user) {
          throw new Error('Supabase authentication required');
        }

        // Generate safe filename
        const timestamp = new Date().getTime();
        const filename = `${documentTitle.replace(/[^a-zA-Z0-9\-_\s]/g, '').replace(/\s+/g, '_')}_${timestamp}.txt`;

        // Insert document directly into Supabase with minimal return to avoid RLS SELECT issues
        const { error: insertError } = await supabase
          .from('documents')
          .insert({
            user_id: session.user.id,
            student_id: studentId,
            title: documentTitle,
            content: generatedLetter,
            type: 'letter',
            filename: filename,
            original_name: `${documentTitle}.txt`,
            display_name: documentTitle,
            generated_by: 'Smart Letter Generator',
            created_at: new Date().toISOString(),
            uploaded_at: new Date().toISOString()
          });

        if (insertError) {
          throw insertError;
        }
      } else {
        // Fallback to API endpoint for local development
        const documentData = {
          content: generatedLetter,
          type: 'letter',
          generatedBy: 'Smart Letter Generator',
          displayName: documentTitle,
          parentDocumentId: null,
          studentId: studentId
        };

        const response = await apiRequest('POST', '/api/documents/generate', documentData);
        
        if (!response.ok) {
          throw new Error('Failed to save document');
        }
      }

      toast({
        title: "Letter saved to your Document Vault!",
        description: `${documentTitle} has been saved successfully`,
      });

    } catch (error: any) {
      console.error('Error saving to vault:', error);
      toast({
        title: "Save Failed",
        description: error.message || "Unable to save to document vault",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setSelectedTemplate('');
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