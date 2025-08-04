import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FileUploadModal from "@/components/modals/file-upload-modal";
import { FileText, Upload, Download, Trash2, Brain, Star, CheckCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import type { Document } from "@shared/schema";
import Footer from "@/components/layout/footer";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Documents() {
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [analyzingDocument, setAnalyzingDocument] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["/api/documents"],
  });

  const analyzeDocument = async (documentId: string) => {
    setAnalyzingDocument(documentId);
    try {
      const response = await apiRequest("POST", `/api/documents/${documentId}/analyze`);
      
      if (!response.ok) {
        throw new Error("Analysis failed");
      }
      
      const result = await response.json();
      setAnalysisResults(result);
      
      toast({
        title: "Analysis Complete!",
        description: `Your document has been analyzed by AI. Overall score: ${result.analysis.overallScore}/5 stars`,
      });
      
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
        return "bg-blue-100 text-blue-800";
      case "assessment":
        return "bg-green-100 text-green-800";
      case "progress_report":
        return "bg-yellow-100 text-yellow-800";
      case "meeting_notes":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        return "Other";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">

        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage your IEP documents and files
                </p>
              </div>
              <Button onClick={() => setShowFileUpload(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>

          {/* Documents Grid */}
          {!Array.isArray(documents) || documents.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No documents found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Upload your first IEP document to get started
                  </p>
                  <Button onClick={() => setShowFileUpload(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(documents as Document[]).map((document: Document) => (
                <Card key={document.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {document.originalName}
                          </h3>
                        </div>
                      </div>
                      <Badge className={getDocumentTypeColor(document.type)}>
                        {getDocumentTypeLabel(document.type)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {document.description && (
                      <p className="text-sm text-gray-600 mb-4">
                        {document.description}
                      </p>
                    )}
                    <div className="text-xs text-gray-500 mb-4">
                      Uploaded {document.uploadedAt ? format(new Date(document.uploadedAt), "MMM d, yyyy") : "Recently"}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => analyzeDocument(document.id)}
                        disabled={analyzingDocument === document.id}
                      >
                        <Brain className="h-4 w-4 mr-1" />
                        {analyzingDocument === document.id ? "Analyzing..." : "AI Analyze"}
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <FileUploadModal 
        open={showFileUpload} 
        onOpenChange={setShowFileUpload}
      />

      {/* Analysis Results Modal */}
      {analysisResults && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  AI Document Analysis Results
                </CardTitle>
                <Button variant="ghost" onClick={() => setAnalysisResults(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Score */}
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-6 h-6 ${
                        i < analysisResults.analysis.overallScore 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {analysisResults.analysis.overallScore}/5 Overall Score
                </h3>
                <p className="text-gray-600">{analysisResults.analysis.summary}</p>
              </div>

              {/* Strengths */}
              <div>
                <h4 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Key Strengths
                </h4>
                <ul className="space-y-2">
                  {analysisResults.analysis.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div>
                <h4 className="text-lg font-semibold text-orange-700 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Areas for Improvement
                </h4>
                <ul className="space-y-2">
                  {analysisResults.analysis.improvements.map((improvement: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Compliance Check */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">IDEA Compliance</h5>
                  <div className="text-2xl font-bold text-blue-700">
                    {analysisResults.analysis.complianceCheck.ideaCompliance}%
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-semibold text-green-900 mb-2">State Compliance</h5>
                  <div className="text-2xl font-bold text-green-700">
                    {analysisResults.analysis.complianceCheck.stateCompliance}%
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div>
                <h4 className="text-lg font-semibold text-purple-700 mb-3">Recommended Next Steps</h4>
                <ol className="space-y-2">
                  {analysisResults.analysis.nextSteps.map((step: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Priority Badge */}
              <div className="text-center">
                <Badge className={`${
                  analysisResults.analysis.priority === 'High' 
                    ? 'bg-red-100 text-red-800' 
                    : analysisResults.analysis.priority === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                } text-lg px-4 py-2`}>
                  Priority: {analysisResults.analysis.priority}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Footer />
    </div>
  );
}
