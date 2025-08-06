import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Download, Copy, FileText, Clock, AlertCircle, Save } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  studentId: z.string().min(1, "Please select a student"),
  gradeLevel: z.string().min(1, "Grade level is required"),
  disability: z.string().min(2, "Primary disability is required"),
  currentServices: z.string().min(10, "Current services description is required"),
  concerns: z.string().min(20, "Please provide detailed concerns"),
  requestedAction: z.string().min(10, "Requested action is required"),
  reportType: z.string().min(1, "Report type is required"),
  timeline: z.string().min(1, "Timeline is required"),
  additionalInfo: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

export default function AdvocacyReportGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string>("");
  const [reportMetadata, setReportMetadata] = useState<any>(null);
  const [savingToVault, setSavingToVault] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch available students based on user role
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: user?.role === 'advocate' ? ["/api/advocate/students"] : ["/api/parent/students"],
    enabled: !!user,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: "",
      gradeLevel: "",
      disability: "",
      currentServices: "",
      concerns: "",
      requestedAction: "",
      reportType: "",
      timeline: "",
      additionalInfo: ""
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/generate-advocacy-report", data);
      const result = await response.json();
      
      if (result.success) {
        setGeneratedReport(result.report);
        setReportMetadata(result.metadata);
        toast({
          title: "Report Generated Successfully",
          description: "Your professional advocacy report has been created."
        });
      } else {
        throw new Error(result.error || "Failed to generate report");
      }
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Unable to generate advocacy report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReport);
    toast({
      title: "Copied to Clipboard",
      description: "The advocacy report has been copied to your clipboard."
    });
  };

  const downloadReport = () => {
    const blob = new Blob([generatedReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `advocacy-report-${reportMetadata?.studentName?.replace(/\s+/g, '-') || 'student'}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Download Started",
      description: "Your advocacy report is being downloaded."
    });
  };

  // Save to vault mutation
  const saveToVaultMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/documents/generate", {
        content: generatedReport,
        type: "advocacy_report",
        generatedBy: "Advocacy Report Generator",
        displayName: `Advocacy Report - ${reportMetadata?.studentName || 'Student'} - ${new Date().toLocaleDateString()}`,
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
        description: "Advocacy report has been saved to your Document Vault"
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

  const resetForm = () => {
    form.reset();
    setGeneratedReport("");
    setReportMetadata(null);
  };

  if (generatedReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard-advocate">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Generated Advocacy Report</h1>
              <p className="text-slate-600">
                Report for {reportMetadata?.studentName} • {reportMetadata?.reportType} • Generated {new Date(reportMetadata?.generatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg">Professional Advocacy Report</CardTitle>
                <CardDescription>
                  Ready for school district communication, legal proceedings, or IEP team meetings
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    setSavingToVault(true);
                    saveToVaultMutation.mutate();
                  }}
                  disabled={savingToVault}
                  className="bg-green-600 hover:bg-green-700 text-white disabled:bg-slate-600" 
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-1" />
                  {savingToVault ? "Saving..." : "Save to Vault"}
                </Button>
                <Button onClick={copyToClipboard} variant="outline" size="sm" className="gap-2">
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button onClick={downloadReport} variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button onClick={resetForm} variant="default" size="sm">
                  Generate New Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-slate-800">
                  {generatedReport}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard-advocate">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Advocacy Report Generator</h1>
            <p className="text-slate-600">Create professional advocacy reports for IEP students</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Student & Advocacy Information
            </CardTitle>
            <CardDescription>
              Provide detailed information to generate a comprehensive advocacy report that includes legal framework, recommended actions, and next steps.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Student Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Student Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="studentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student Name</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={studentsLoading ? "Loading students..." : "Select a student"} />
                              </SelectTrigger>
                            </FormControl>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gradeLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select grade level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Pre-K">Pre-K</SelectItem>
                              <SelectItem value="Kindergarten">Kindergarten</SelectItem>
                              <SelectItem value="1st Grade">1st Grade</SelectItem>
                              <SelectItem value="2nd Grade">2nd Grade</SelectItem>
                              <SelectItem value="3rd Grade">3rd Grade</SelectItem>
                              <SelectItem value="4th Grade">4th Grade</SelectItem>
                              <SelectItem value="5th Grade">5th Grade</SelectItem>
                              <SelectItem value="6th Grade">6th Grade</SelectItem>
                              <SelectItem value="7th Grade">7th Grade</SelectItem>
                              <SelectItem value="8th Grade">8th Grade</SelectItem>
                              <SelectItem value="9th Grade">9th Grade</SelectItem>
                              <SelectItem value="10th Grade">10th Grade</SelectItem>
                              <SelectItem value="11th Grade">11th Grade</SelectItem>
                              <SelectItem value="12th Grade">12th Grade</SelectItem>
                              <SelectItem value="Transition (18-21)">Transition (18-21)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="disability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Disability Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select primary disability" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Autism Spectrum Disorder">Autism Spectrum Disorder</SelectItem>
                            <SelectItem value="Specific Learning Disability">Specific Learning Disability</SelectItem>
                            <SelectItem value="ADHD">ADHD</SelectItem>
                            <SelectItem value="Intellectual Disability">Intellectual Disability</SelectItem>
                            <SelectItem value="Emotional Behavioral Disorder">Emotional/Behavioral Disorder</SelectItem>
                            <SelectItem value="Speech Language Impairment">Speech/Language Impairment</SelectItem>
                            <SelectItem value="Other Health Impairment">Other Health Impairment</SelectItem>
                            <SelectItem value="Multiple Disabilities">Multiple Disabilities</SelectItem>
                            <SelectItem value="Hearing Impairment">Hearing Impairment</SelectItem>
                            <SelectItem value="Visual Impairment">Visual Impairment</SelectItem>
                            <SelectItem value="Orthopedic Impairment">Orthopedic Impairment</SelectItem>
                            <SelectItem value="Traumatic Brain Injury">Traumatic Brain Injury</SelectItem>
                            <SelectItem value="Developmental Delay">Developmental Delay</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currentServices"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current IEP Services</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe current special education services, related services, accommodations, and modifications..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Advocacy Request Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Advocacy Request</h3>
                  
                  <FormField
                    control={form.control}
                    name="concerns"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Concerns</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detail your specific concerns about the student's education, services, or treatment..."
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Be specific about what is not working and how it impacts the student's education
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requestedAction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requested Action</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What specific changes or actions are you requesting from the school district?"
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="reportType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Report Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select report type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="IEP Meeting Preparation">IEP Meeting Preparation</SelectItem>
                              <SelectItem value="Service Request">Service Request</SelectItem>
                              <SelectItem value="Complaint Documentation">Complaint Documentation</SelectItem>
                              <SelectItem value="Due Process Preparation">Due Process Preparation</SelectItem>
                              <SelectItem value="Placement Appeal">Placement Appeal</SelectItem>
                              <SelectItem value="Evaluation Request">Evaluation Request</SelectItem>
                              <SelectItem value="Progress Monitoring">Progress Monitoring</SelectItem>
                              <SelectItem value="Transition Planning">Transition Planning</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timeline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timeline Priority</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timeline" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Immediate (1-2 weeks)">
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4 text-red-500" />
                                  Immediate (1-2 weeks)
                                </div>
                              </SelectItem>
                              <SelectItem value="Urgent (3-4 weeks)">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-orange-500" />
                                  Urgent (3-4 weeks)
                                </div>
                              </SelectItem>
                              <SelectItem value="Standard (1-2 months)">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-blue-500" />
                                  Standard (1-2 months)
                                </div>
                              </SelectItem>
                              <SelectItem value="Long-term (3+ months)">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-green-500" />
                                  Long-term (3+ months)
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Information (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any additional context, previous communications, or relevant information..."
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    disabled={isGenerating}
                    className="min-w-[200px]"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Advocacy Report
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Generated Report Display */}
        {generatedReport && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Generated Advocacy Report
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadReport}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSavingToVault(true);
                      saveToVaultMutation.mutate();
                    }}
                    disabled={savingToVault}
                    className="gap-2"
                  >
                    {savingToVault ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save to Vault
                      </>
                    )}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 border rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-slate-800 font-mono">
                  {generatedReport}
                </pre>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                  className="gap-2"
                >
                  Generate Another Report
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}