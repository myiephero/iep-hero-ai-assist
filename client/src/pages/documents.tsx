import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import FileUploadModal from "@/components/modals/file-upload-modal";
import DocumentTagsDisplay from "@/components/DocumentTagsDisplay";
import { FileText, Upload, Download, Brain, Edit2, Check, X, Eye, Save, ArrowLeft, Search, User, Trash2, Archive, MoreHorizontal, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import type { Document } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Documents() {
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [analyzingDocument, setAnalyzingDocument] = useState<string | null>(null);
  const [editingDocument, setEditingDocument] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [viewingAnalysis, setViewingAnalysis] = useState<any>(null);
  const [currentAnalysisDocument, setCurrentAnalysisDocument] = useState<any>(null);
  const [savingToVault, setSavingToVault] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [assigningStudent, setAssigningStudent] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [bulkActionMode, setBulkActionMode] = useState(false);
  const [retaggingDocument, setRetaggingDocument] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get student ID from URL params if filtering by student
  const params = new URLSearchParams(window.location.search);
  const studentId = params.get('student');

  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: studentId ? ["/api/documents", { studentId }] : ["/api/documents"],
  });

  // Query for student name if filtering by specific student
  const { data: student } = useQuery({
    queryKey: ["/api/students", studentId],
    enabled: !!studentId,
  });

  // Query all students for assignment functionality - use advocate/students for advocates
  const { data: allStudents = [] } = useQuery({
    queryKey: user?.role === 'advocate' ? ["/api/advocate/students"] : ["/api/students"],
    enabled: !!user,
  });

  // Filter documents by student if specified and add search functionality
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchTerm || 
      (doc.displayName || doc.originalName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStudent = !studentId || doc.studentId === studentId;
    
    return matchesSearch && matchesStudent;
  });

  const displayDocuments = filteredDocuments;
  const isHeroPlan = user?.planStatus === 'heroOffer';

  // Mutation for updating document name
  const updateDocumentNameMutation = useMutation({
    mutationFn: async ({ documentId, displayName }: { documentId: string; displayName: string }) => {
      const response = await apiRequest("PATCH", `/api/documents/${documentId}/name`, { displayName });
      if (!response.ok) {
        throw new Error("Failed to update document name");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      setEditingDocument(null);
      setEditingName("");
      toast({ 
        title: "Success",
        description: "Document name updated successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update document name",
        variant: "destructive"
      });
    }
  });

  // Save analysis to vault mutation
  const saveAnalysisToVaultMutation = useMutation({
    mutationFn: async ({ analysisResult, documentName, parentDocumentId }: { 
      analysisResult: any; 
      documentName: string;
      parentDocumentId: string;
    }) => {
      const analysisContent = `IEP DOCUMENT ANALYSIS REPORT

Generated: ${new Date().toLocaleString()}
Original Document: ${documentName}

OVERALL SCORE: ${analysisResult.overallScore}/5
IDEA COMPLIANCE: ${analysisResult.complianceCheck?.ideaCompliance || 'N/A'}%

SUMMARY:
${analysisResult.summary}

STRENGTHS:
${analysisResult.strengths?.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n') || 'None identified'}

AREAS FOR IMPROVEMENT:
${analysisResult.improvements?.map((i: string, idx: number) => `${idx + 1}. ${i}`).join('\n') || 'None identified'}

NEXT STEPS:
${analysisResult.nextSteps?.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n') || 'None identified'}

PRIORITY LEVEL: ${analysisResult.priority || 'Low'}
`;

      const response = await apiRequest("POST", "/api/documents/generate", {
        content: analysisContent,
        type: "analysis_report",
        generatedBy: "AI Document Analysis",
        displayName: `${documentName} - AI Analysis Report`,
        parentDocumentId
      });
      
      if (!response.ok) {
        throw new Error("Failed to save analysis to vault");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Saved to Vault!",
        description: "Analysis report has been saved to your Document Vault"
      });
      setSavingToVault(false);
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save analysis to vault",
        variant: "destructive"
      });
      setSavingToVault(false);
    }
  });

  // Mutation for assigning document to student
  const assignToStudentMutation = useMutation({
    mutationFn: async ({ documentId, studentId }: { documentId: string; studentId: string }) => {
      const response = await apiRequest("PATCH", `/api/documents/${documentId}/assign`, { studentId });
      if (!response.ok) {
        throw new Error("Failed to assign document to student");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      setAssigningStudent(null);
      setSelectedStudentId("");
      toast({
        title: "Success",
        description: "Document assigned to student successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error", 
        description: error.message || "Failed to assign document to student",
        variant: "destructive"
      });
    }
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (documentIds: string[]) => {
      const response = await apiRequest("DELETE", "/api/documents/bulk", { documentIds });
      if (!response.ok) {
        throw new Error("Failed to delete documents");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      setSelectedDocuments(new Set());
      setBulkActionMode(false);
      toast({
        title: "Success",
        description: "Documents deleted successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete documents",
        variant: "destructive"
      });
    }
  });

  // Functions
  const toggleDocumentSelection = (documentId: string) => {
    const newSelected = new Set(selectedDocuments);
    if (newSelected.has(documentId)) {
      newSelected.delete(documentId);
    } else {
      newSelected.add(documentId);
    }
    setSelectedDocuments(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedDocuments.size === displayDocuments.length && displayDocuments.length > 0) {
      setSelectedDocuments(new Set());
    } else {
      setSelectedDocuments(new Set(displayDocuments.map(doc => doc.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedDocuments.size > 0) {
      bulkDeleteMutation.mutate(Array.from(selectedDocuments));
    }
  };
  const startEditingName = (doc: any) => {
    setEditingDocument(doc.id);
    setEditingName(doc.displayName || doc.originalName);
  };

  const saveDocumentName = () => {
    if (editingDocument && editingName.trim()) {
      updateDocumentNameMutation.mutate({
        documentId: editingDocument,
        displayName: editingName.trim()
      });
    }
  };

  const cancelEditing = () => {
    setEditingDocument(null);
    setEditingName("");
  };

  // Mutation for retagging documents
  const retagDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await apiRequest("POST", `/api/documents/${documentId}/retag`);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Document retagged!",
        description: "AI tags and categories updated successfully.",
      });
      setRetaggingDocument(null);
    },
    onError: (error: any) => {
      toast({
        title: "Retagging failed",
        description: error.message || "Failed to update document tags",
        variant: "destructive",
      });
      setRetaggingDocument(null);
    },
  });

  const handleRetag = (documentId: string) => {
    setRetaggingDocument(documentId);
    retagDocumentMutation.mutate(documentId);
  };

  const downloadDocument = async (documentId: string, filename: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/download`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error("Download failed");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: "Document downloaded successfully"
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to download document",
        variant: "destructive"
      });
    }
  };

  const analyzeDocument = async (documentId: string) => {
    setAnalyzingDocument(documentId);
    try {
      // Check if document has a file to analyze
      const doc = documents.find(d => d.id === documentId);
      if (!doc) {
        throw new Error("Document not found");
      }
      
      // If it's a generated document (no fileUrl), we can't analyze it
      if (!doc.fileUrl || doc.generatedBy) {
        toast({
          title: "Cannot Analyze",
          description: "This document was generated by AI and cannot be re-analyzed.",
          variant: "destructive",
        });
        return;
      }
      
      const response = await apiRequest("POST", `/api/documents/${documentId}/analyze`);
      
      if (!response.ok) {
        throw new Error("Analysis failed");
      }
      
      const result = await response.json();
      
      toast({
        title: "Analysis Complete!",
        description: `Your document has been analyzed by AI. Overall score: ${result.analysis.overallScore}/5 stars`,
      });

      // Refresh documents to get updated analysis results
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzingDocument(null);
    }
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case "iep":
        return "bg-blue-600 text-white";
      case "assessment":
        return "bg-green-600 text-white";
      case "progress_report":
        return "bg-yellow-600 text-white";
      case "meeting_notes":
        return "bg-purple-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "iep":
        return "IEP Document";
      case "assessment":
        return "Assessment Report";
      case "progress_report":
        return "Progress Report";
      case "meeting_notes":
        return "Meeting Notes";
      default:
        return "Document";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1B2E] to-[#2C2F48] text-white">


      <div className="p-6">
        {/* Header with Navigation */}
        <div className="mb-6">
          {studentId ? (
            <Link href="/my-students">
              <Button variant="ghost" className="mb-4 text-slate-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to My Students
              </Button>
            </Link>
          ) : (
            <Link href={user?.role === 'parent' ? '/dashboard-parent' : user?.role === 'advocate' ? '/dashboard-advocate' : '/dashboard'}>
              <Button variant="ghost" className="mb-4 text-slate-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          )}
          
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {studentId && student ? `${student.firstName} ${student.lastName} - Documents` : 'Document Vault'}
              </h2>
              <p className="text-slate-300">
                {studentId ? `View and manage documents for ${student?.firstName || 'this student'}` : 'Securely store and analyze your IEP documents'}
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowFileUpload(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
              <Button
                onClick={() => setBulkActionMode(!bulkActionMode)}
                className="bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
              >
                {bulkActionMode ? "Cancel Selection" : "Select Documents"}
              </Button>
            </div>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {bulkActionMode && (
          <div className="mb-4 p-4 bg-slate-700 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={selectedDocuments.size === displayDocuments.length && displayDocuments.length > 0}
                  onCheckedChange={toggleSelectAll}
                  className="border-slate-400"
                />
                <span className="text-white">
                  {selectedDocuments.size === 0 
                    ? "Select documents" 
                    : `${selectedDocuments.size} document${selectedDocuments.size === 1 ? '' : 's'} selected`
                  }
                </span>
              </div>
              {selectedDocuments.size > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleBulkDelete}
                    disabled={bulkDeleteMutation.isPending}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    {bulkDeleteMutation.isPending ? "Deleting..." : "Delete Selected"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#3E4161]/50 border-slate-600 text-white placeholder-slate-400"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid gap-4">
            {displayDocuments.map((doc) => (
              <Card key={doc.id} className="bg-[#3E4161] border-slate-600 hover:bg-[#4A4E76] transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {bulkActionMode && (
                        <Checkbox
                          checked={selectedDocuments.has(doc.id)}
                          onCheckedChange={() => toggleDocumentSelection(doc.id)}
                          className="border-slate-400"
                        />
                      )}
                      <div className="p-3 bg-slate-700 rounded-lg">
                        <FileText className="w-8 h-8 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {editingDocument === doc.id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="bg-slate-700 border-slate-600 text-white"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveDocumentName();
                                  if (e.key === 'Escape') cancelEditing();
                                }}
                              />
                              <Button
                                size="sm"
                                onClick={saveDocumentName}
                                disabled={updateDocumentNameMutation.isPending}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEditing}
                                className="border-slate-500"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-white">
                                {doc.displayName || doc.originalName}
                              </h3>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEditingName(doc)}
                                className="p-1 h-auto text-slate-400 hover:text-white"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getDocumentTypeColor(doc.type)}>
                            {getDocumentTypeLabel(doc.type)}
                          </Badge>
                          {doc.fileSize && (
                            <span className="text-sm text-slate-400">{doc.fileSize} bytes</span>
                          )}
                          {doc.analysisResult && (
                            <Badge className="bg-emerald-600 text-white">
                              AI Analyzed
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <span>Uploaded {doc.uploadedAt ? format(new Date(doc.uploadedAt), "MMM d, yyyy") : "Unknown"}</span>
                          {doc.studentId && (
                            <Badge className="bg-purple-600 text-white">
                              <User className="w-3 h-3 mr-1" />
                              Student Assigned
                            </Badge>
                          )}
                        </div>
                        {/* Smart Tags Display */}
                        <div className="mt-3">
                          <DocumentTagsDisplay 
                            document={doc} 
                            onRetag={handleRetag}
                            isRetagging={retaggingDocument === doc.id}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Student Assignment */}
                      {assigningStudent === doc.id ? (
                        <div className="flex items-center gap-2">
                          <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                            <SelectTrigger className="w-48 bg-[#3E4161] border-slate-600 text-white [&>span]:text-white hover:bg-slate-600">
                              <SelectValue placeholder="Select student" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#3E4161] border-slate-600 text-white">
                              {allStudents.length === 0 ? (
                                <div className="p-2 text-slate-400 text-sm">No students found</div>
                              ) : (
                                allStudents.map((student: any) => (
                                  <SelectItem 
                                    key={student.id} 
                                    value={student.id}
                                    className="text-white hover:bg-slate-600 focus:bg-slate-600 data-[highlighted]:bg-slate-600"
                                  >
                                    {student.firstName} {student.lastName}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            onClick={() => {
                              if (selectedStudentId) {
                                assignToStudentMutation.mutate({ 
                                  documentId: doc.id, 
                                  studentId: selectedStudentId 
                                });
                              }
                            }}
                            disabled={!selectedStudentId || assignToStudentMutation.isPending}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setAssigningStudent(null);
                              setSelectedStudentId("");
                            }}
                            className="border-slate-500"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAssigningStudent(doc.id)}
                          className="bg-purple-700 border-purple-500 text-white hover:bg-purple-600 hover:border-purple-400"
                        >
                          <User className="w-4 h-4 mr-1" />
                          {doc.studentId ? "Reassign" : "Assign to Student"}
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadDocument(doc.id, doc.originalName)}
                        className="bg-slate-700 border-slate-500 text-white hover:bg-slate-600 hover:border-slate-400"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      {doc.analysisResult && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setViewingAnalysis(doc.analysisResult);
                            setCurrentAnalysisDocument(doc);
                          }}
                          className="bg-emerald-700 border-emerald-500 text-white hover:bg-emerald-600 hover:border-emerald-400"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Analysis
                        </Button>
                      )}
                      {doc.content && !doc.analysisResult && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // For text content documents, display content as formatted text
                            const contentToShow = {
                              summary: doc.content,
                              isTextContent: true,
                              documentType: doc.generatedBy || 'Generated Content'
                            };
                            setViewingAnalysis(contentToShow);
                            setCurrentAnalysisDocument(doc);
                          }}
                          className="bg-emerald-700 border-emerald-500 text-white hover:bg-emerald-600 hover:border-emerald-400"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Analysis
                        </Button>
                      )}
                      {/* Show AI Analyze/Re-analyze for all documents with Hero Plan */}
                      {isHeroPlan && (
                        <Button
                          onClick={() => analyzeDocument(doc.id)}
                          disabled={analyzingDocument === doc.id}
                          className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-600"
                          size="sm"
                        >
                          <Brain className="w-4 h-4 mr-1" />
                          {analyzingDocument === doc.id ? "Analyzing..." : (doc.analysisResult || doc.content) ? "Re-analyze" : "AI Analyze"}
                        </Button>
                      )}
                      {!isHeroPlan && (
                        <div className="text-xs text-slate-400 ml-2">
                          Hero Plan required
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Empty State */}
            {displayDocuments.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {searchTerm ? 'No documents found' : 'No documents yet'}
                  </h3>
                  <p className="text-slate-400 mb-6">
                    {searchTerm 
                      ? `No documents match "${searchTerm}". Try a different search term.`
                      : 'Upload your first IEP document to get started with AI analysis and secure storage'
                    }
                  </p>
                  {!searchTerm && (
                    <Button 
                      onClick={() => setShowFileUpload(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}


      </div>

      <FileUploadModal 
        open={showFileUpload} 
        onOpenChange={setShowFileUpload}
      />

      {/* Analysis Results Dialog */}
      <Dialog open={!!viewingAnalysis} onOpenChange={() => {
        setViewingAnalysis(null);
        setCurrentAnalysisDocument(null);
      }}>
        <DialogContent className="bg-[#3E4161] border-slate-600 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold text-white">AI Document Analysis</DialogTitle>
            {currentAnalysisDocument && (
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setSavingToVault(true);
                    saveAnalysisToVaultMutation.mutate({
                      analysisResult: viewingAnalysis,
                      documentName: currentAnalysisDocument.displayName || currentAnalysisDocument.originalName,
                      parentDocumentId: currentAnalysisDocument.id
                    });
                  }}
                  disabled={savingToVault}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {savingToVault ? "Saving..." : "Save to Vault"}
                </Button>
                <Button
                  onClick={() => {
                    const analysisText = `IEP DOCUMENT ANALYSIS REPORT

Generated: ${new Date().toLocaleString()}
Original Document: ${currentAnalysisDocument.displayName || currentAnalysisDocument.originalName}

OVERALL SCORE: ${viewingAnalysis.overallScore}/5
IDEA COMPLIANCE: ${viewingAnalysis.complianceCheck?.ideaCompliance || 'N/A'}%

SUMMARY:
${viewingAnalysis.summary}

STRENGTHS:
${viewingAnalysis.strengths?.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n') || 'None identified'}

AREAS FOR IMPROVEMENT:
${viewingAnalysis.improvements?.map((i: string, idx: number) => `${idx + 1}. ${i}`).join('\n') || 'None identified'}

NEXT STEPS:
${viewingAnalysis.nextSteps?.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n') || 'None identified'}

PRIORITY LEVEL: ${viewingAnalysis.priority || 'Low'}
`;
                    
                    const blob = new Blob([analysisText], { type: 'text/plain' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${currentAnalysisDocument.displayName || currentAnalysisDocument.originalName}_Analysis.txt`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    
                    toast({
                      title: "Downloaded",
                      description: "Analysis report downloaded successfully"
                    });
                  }}
                  variant="outline"
                  className="border-slate-500 text-white hover:bg-slate-700"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                {/* Save Analysis to Vault button for structured analysis */}
                {!viewingAnalysis.isTextContent && (
                  <Button
                    onClick={() => {
                      setSavingToVault(true);
                      saveAnalysisToVaultMutation.mutate({
                        analysisResult: viewingAnalysis,
                        documentName: currentAnalysisDocument.displayName || currentAnalysisDocument.originalName,
                        parentDocumentId: currentAnalysisDocument.id
                      });
                    }}
                    disabled={savingToVault}
                    variant="outline" 
                    className="border-blue-500 text-blue-400 hover:bg-blue-700"
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    {savingToVault ? "Saving..." : "Save to Vault"}
                  </Button>
                )}
              </div>
            )}
          </DialogHeader>
          {viewingAnalysis && (
            <div className="space-y-6">
              {viewingAnalysis.isTextContent ? (
                // Display text content for generated documents
                <div>
                  <div className="mb-4 p-3 bg-blue-700 rounded-lg">
                    <h3 className="text-white font-semibold">Document Type: {viewingAnalysis.documentType}</h3>
                  </div>
                  <div className="text-slate-300 bg-slate-700 p-6 rounded-lg leading-relaxed whitespace-pre-line">
                    {viewingAnalysis.summary}
                  </div>
                </div>
              ) : (
                // Display structured analysis for analyzed documents
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-700 rounded-lg">
                      <div className="text-3xl font-bold text-blue-400">{viewingAnalysis.overallScore}/5</div>
                      <div className="text-sm text-slate-300">Overall Score</div>
                    </div>
                    <div className="text-center p-4 bg-slate-700 rounded-lg">
                      <div className="text-3xl font-bold text-emerald-400">{viewingAnalysis.complianceCheck?.ideaCompliance || 'N/A'}%</div>
                      <div className="text-sm text-slate-300">IDEA Compliance</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Summary</h3>
                    <p className="text-slate-300 bg-slate-700 p-4 rounded-lg">{viewingAnalysis.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Strengths</h3>
                    <ul className="space-y-2">
                      {viewingAnalysis.strengths?.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-slate-300">
                          <span className="text-emerald-400 mt-1">✓</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Areas for Improvement</h3>
                    <ul className="space-y-2">
                      {viewingAnalysis.improvements?.map((improvement: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-slate-300">
                          <span className="text-yellow-400 mt-1">!</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Next Steps</h3>
                    <ul className="space-y-2">
                      {viewingAnalysis.nextSteps?.map((step: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-slate-300">
                          <span className="text-blue-400 mt-1">→</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">Priority Level:</span>
                    <Badge className={
                      viewingAnalysis.priority === 'High' ? 'bg-red-600' :
                      viewingAnalysis.priority === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'
                    }>
                      {viewingAnalysis.priority || 'Low'}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}