import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileText, Copy, Download, Save, Wand2 } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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
    id: 'iep-evaluation-request',
    title: 'Request for IEP Evaluation',
    description: 'Formal request for initial IEP evaluation or re-evaluation',
    category: 'Evaluation Requests',
    fields: [
      { name: 'childName', label: 'Child\'s Name', type: 'text', required: true },
      { name: 'schoolName', label: 'School Name', type: 'text', required: true },
      { name: 'grade', label: 'Grade Level', type: 'text', required: true },
      { name: 'concerns', label: 'Specific Concerns', type: 'textarea', required: true, placeholder: 'Describe the areas of concern that prompt this evaluation request...' },
      { name: 'requestedDate', label: 'Requested Meeting Date', type: 'date', required: false }
    ]
  },
  {
    id: 'fba-request',
    title: 'Request for Functional Behavioral Assessment (FBA)',
    description: 'Request for behavioral assessment and intervention plan',
    category: 'Behavioral Support',
    fields: [
      { name: 'childName', label: 'Child\'s Name', type: 'text', required: true },
      { name: 'schoolName', label: 'School Name', type: 'text', required: true },
      { name: 'grade', label: 'Grade Level', type: 'text', required: true },
      { name: 'behaviors', label: 'Behavioral Concerns', type: 'textarea', required: true, placeholder: 'Describe specific behaviors that are interfering with learning...' },
      { name: 'interventions', label: 'Previous Interventions Tried', type: 'textarea', required: false, placeholder: 'List any strategies or interventions already attempted...' }
    ]
  },
  {
    id: 'progress-data-request',
    title: 'Request for Progress Data',
    description: 'Request access to your child\'s progress data and records',
    category: 'Data & Records',
    fields: [
      { name: 'childName', label: 'Child\'s Name', type: 'text', required: true },
      { name: 'schoolName', label: 'School Name', type: 'text', required: true },
      { name: 'dataType', label: 'Type of Data Requested', type: 'textarea', required: true, placeholder: 'Specify what data you need (progress reports, assessment scores, work samples, etc.)...' },
      { name: 'timeframe', label: 'Time Period', type: 'text', required: false, placeholder: 'e.g., Current school year, last 6 months' },
      { name: 'purpose', label: 'Purpose for Request', type: 'textarea', required: false, placeholder: 'Explain why you need this data...' }
    ]
  },
  {
    id: 'dispute-complaint',
    title: 'Dispute/Complaint Letter',
    description: 'Formal complaint about IEP services or violations',
    category: 'Advocacy',
    fields: [
      { name: 'childName', label: 'Child\'s Name', type: 'text', required: true },
      { name: 'schoolName', label: 'School Name', type: 'text', required: true },
      { name: 'issueDescription', label: 'Description of Issue', type: 'textarea', required: true, placeholder: 'Describe the specific problem or violation...' },
      { name: 'previousCommunication', label: 'Previous Communications', type: 'textarea', required: false, placeholder: 'Summarize any previous attempts to resolve this issue...' },
      { name: 'desiredResolution', label: 'Desired Resolution', type: 'textarea', required: true, placeholder: 'What outcome are you seeking?' }
    ]
  },
  {
    id: 'pwn-response',
    title: 'Prior Written Notice (PWN) Response',
    description: 'Response to a Prior Written Notice from the school',
    category: 'Legal Response',
    fields: [
      { name: 'childName', label: 'Child\'s Name', type: 'text', required: true },
      { name: 'schoolName', label: 'School Name', type: 'text', required: true },
      { name: 'pwnDate', label: 'PWN Date', type: 'date', required: true },
      { name: 'pwnSubject', label: 'PWN Subject/Action', type: 'text', required: true, placeholder: 'What was the school\'s proposed action?' },
      { name: 'responseType', label: 'Your Response', type: 'textarea', required: true, placeholder: 'Do you agree or disagree? Explain your position...' },
      { name: 'additionalInfo', label: 'Additional Information', type: 'textarea', required: false, placeholder: 'Any supporting information or requests...' }
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

  // Check if user has Hero plan access - force enable for demo accounts
  const hasHeroAccess = user?.planStatus === 'heroOffer' || 
                        user?.email === 'parent@demo.com' ||
                        (process.env.NODE_ENV === 'development' && user?.role === 'parent');

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
      // Create a document in the vault
      const documentData = {
        filename: `${currentTemplate.title.replace(/\s+/g, '_')}_${Date.now()}.txt`,
        originalName: `${currentTemplate.title} - ${new Date().toLocaleDateString()}.txt`,
        type: 'letter',
        content: generatedLetter
      };

      await apiRequest('POST', '/api/documents', documentData);

      toast({
        title: "Saved to Vault!",
        description: "Letter has been saved to your document vault",
      });
    } catch (error) {
      console.error('Error saving to vault:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save to document vault",
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
            <Button variant="ghost" className="mb-4">
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
                  <Button onClick={resetForm} variant="outline">
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
                      variant="outline" 
                      size="sm"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full mr-1" />
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