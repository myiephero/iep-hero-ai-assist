import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Download, Copy, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import Navbar from '@/components/layout/navbar';

interface ReportData {
  studentName: string;
  gradeLevel: string;
  disability: string;
  currentServices: string;
  concerns: string;
  requestedAction: string;
  reportType: string;
  timeline: string;
  additionalInfo: string;
}

export default function AdvocacyReportGenerator() {
  const [formData, setFormData] = useState<ReportData>({
    studentName: '',
    gradeLevel: '',
    disability: '',
    currentServices: '',
    concerns: '',
    requestedAction: '',
    reportType: 'comprehensive',
    timeline: 'urgent',
    additionalInfo: ''
  });
  
  const [generatedReport, setGeneratedReport] = useState<string>('');
  const [showReport, setShowReport] = useState(false);
  const { toast } = useToast();

  const generateReportMutation = useMutation({
    mutationFn: async (data: ReportData) => {
      const response = await apiRequest('POST', '/api/generate-advocacy-report', data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedReport(data.report);
      setShowReport(true);
      toast({
        title: "Report Generated Successfully",
        description: "Your advocacy report is ready for review and download."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate advocacy report. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleInputChange = (field: keyof ReportData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    if (!formData.studentName || !formData.concerns || !formData.requestedAction) {
      toast({
        title: "Missing Information",
        description: "Please fill in student name, concerns, and requested action.",
        variant: "destructive"
      });
      return;
    }
    generateReportMutation.mutate(formData);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedReport);
      toast({
        title: "Copied to Clipboard",
        description: "The advocacy report has been copied to your clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard. Please select and copy manually.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `advocacy-report-${formData.studentName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Your advocacy report is being downloaded."
    });
  };

  const handleReset = () => {
    setFormData({
      studentName: '',
      gradeLevel: '',
      disability: '',
      currentServices: '',
      concerns: '',
      requestedAction: '',
      reportType: 'comprehensive',
      timeline: 'urgent',
      additionalInfo: ''
    });
    setGeneratedReport('');
    setShowReport(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                One-Click Advocacy Report Generator
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Generate comprehensive advocacy reports for IEP meetings, legal documentation, 
              and school district communications in minutes, not hours.
            </p>
            <Badge className="mt-3 bg-blue-100 text-blue-800 border-blue-200">
              AI-Powered • Professional Quality • Legally Compliant
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Student Information & Concerns
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="studentName" className="text-sm font-medium text-gray-700">
                      Student Name *
                    </Label>
                    <Input
                      id="studentName"
                      value={formData.studentName}
                      onChange={(e) => handleInputChange('studentName', e.target.value)}
                      placeholder="Enter student's full name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gradeLevel" className="text-sm font-medium text-gray-700">
                      Grade Level
                    </Label>
                    <Select value={formData.gradeLevel} onValueChange={(value) => handleInputChange('gradeLevel', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pre-k">Pre-K</SelectItem>
                        <SelectItem value="k">Kindergarten</SelectItem>
                        <SelectItem value="1">1st Grade</SelectItem>
                        <SelectItem value="2">2nd Grade</SelectItem>
                        <SelectItem value="3">3rd Grade</SelectItem>
                        <SelectItem value="4">4th Grade</SelectItem>
                        <SelectItem value="5">5th Grade</SelectItem>
                        <SelectItem value="6">6th Grade</SelectItem>
                        <SelectItem value="7">7th Grade</SelectItem>
                        <SelectItem value="8">8th Grade</SelectItem>
                        <SelectItem value="9">9th Grade</SelectItem>
                        <SelectItem value="10">10th Grade</SelectItem>
                        <SelectItem value="11">11th Grade</SelectItem>
                        <SelectItem value="12">12th Grade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="disability" className="text-sm font-medium text-gray-700">
                    Primary Disability/Diagnosis
                  </Label>
                  <Input
                    id="disability"
                    value={formData.disability}
                    onChange={(e) => handleInputChange('disability', e.target.value)}
                    placeholder="e.g., Autism, ADHD, Learning Disability"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="currentServices" className="text-sm font-medium text-gray-700">
                    Current IEP Services
                  </Label>
                  <Textarea
                    id="currentServices"
                    value={formData.currentServices}
                    onChange={(e) => handleInputChange('currentServices', e.target.value)}
                    placeholder="List current accommodations, modifications, and services..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="concerns" className="text-sm font-medium text-gray-700">
                    Primary Concerns *
                  </Label>
                  <Textarea
                    id="concerns"
                    value={formData.concerns}
                    onChange={(e) => handleInputChange('concerns', e.target.value)}
                    placeholder="Describe specific concerns about the current IEP, services, or educational progress..."
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="requestedAction" className="text-sm font-medium text-gray-700">
                    Requested Action *
                  </Label>
                  <Textarea
                    id="requestedAction"
                    value={formData.requestedAction}
                    onChange={(e) => handleInputChange('requestedAction', e.target.value)}
                    placeholder="What specific actions or changes are you requesting from the school district?"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reportType" className="text-sm font-medium text-gray-700">
                      Report Type
                    </Label>
                    <Select value={formData.reportType} onValueChange={(value) => handleInputChange('reportType', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                        <SelectItem value="meeting-prep">Meeting Preparation</SelectItem>
                        <SelectItem value="legal-documentation">Legal Documentation</SelectItem>
                        <SelectItem value="complaint-filing">Complaint Filing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timeline" className="text-sm font-medium text-gray-700">
                      Timeline Priority
                    </Label>
                    <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent (Immediate)</SelectItem>
                        <SelectItem value="normal">Normal (30 days)</SelectItem>
                        <SelectItem value="routine">Routine (60+ days)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="additionalInfo" className="text-sm font-medium text-gray-700">
                    Additional Information
                  </Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    placeholder="Any additional context, documentation references, or special circumstances..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={handleGenerate}
                    disabled={generateReportMutation.isPending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {generateReportMutation.isPending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    className="px-6"
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Generated Report */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Generated Advocacy Report
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!showReport ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 bg-gray-100 rounded-full mb-4">
                      <FileText className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Ready to Generate
                    </h3>
                    <p className="text-gray-600 max-w-sm">
                      Fill out the form and click "Generate Report" to create your 
                      professional advocacy document.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-2 mb-4">
                      <Button
                        onClick={handleCopy}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                        {generatedReport}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}