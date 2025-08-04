import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FileUploadModal from "@/components/modals/file-upload-modal";
import { FileText, Upload, Download, Brain } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import type { Document } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function Documents() {
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [analyzingDocument, setAnalyzingDocument] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  // Mock documents for demo
  const mockDocuments: (Document & { size: string })[] = [
    {
      id: "1",
      title: "IEP_Report_March.pdf",
      type: "iep",
      userId: "demo",
      filename: "IEP_Report_March.pdf",
      filePath: "/uploads/demo1.pdf",
      uploadedAt: new Date("2024-03-15"),
      size: "2.4 MB",
    },
    {
      id: "2", 
      title: "ReadingEval_Results.pdf",
      type: "assessment",
      userId: "demo",
      filename: "ReadingEval_Results.pdf", 
      filePath: "/uploads/demo2.pdf",
      uploadedAt: new Date("2024-02-20"),
      size: "1.8 MB",
    },
    {
      id: "3",
      title: "Notes_AprilMeeting.pdf", 
      type: "meeting_notes",
      userId: "demo",
      filename: "Notes_AprilMeeting.pdf",
      filePath: "/uploads/demo3.pdf",
      uploadedAt: new Date("2024-04-10"),
      size: "1.2 MB",
    },
  ];

  const displayDocuments = documents.length > 0 ? documents : mockDocuments;
  const isHeroPlan = user?.planStatus === 'heroOffer';

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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#2C2F48]/95 backdrop-blur shadow-lg px-6 py-4 flex items-center justify-between border-b border-slate-600">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">My IEP Hero</h1>
          {isHeroPlan && (
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
              Hero Plan
            </Badge>
          )}
        </div>
        <nav className="space-x-4 flex items-center">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
              Dashboard
            </Button>
          </Link>
          <Link href="/goals">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
              Goals
            </Button>
          </Link>
          <Button variant="ghost" className="text-white bg-slate-700">
            Documents
          </Button>
          <div className="flex items-center gap-2 ml-4">
            <div className="text-right">
              <div className="text-sm font-medium text-white">{user?.username}</div>
              <div className="text-xs text-slate-400 capitalize">
                {user?.planStatus === 'heroOffer' ? 'Hero Plan' : 'Free Plan'}
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Document Vault</h2>
            <p className="text-slate-300">Securely store and analyze your IEP documents</p>
          </div>
          <Button 
            onClick={() => setShowFileUpload(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
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
                      <div className="p-3 bg-slate-700 rounded-lg">
                        <FileText className="w-8 h-8 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">{doc.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getDocumentTypeColor(doc.type)}>
                            {getDocumentTypeLabel(doc.type)}
                          </Badge>
                          {doc.size && (
                            <span className="text-sm text-slate-400">{doc.size}</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400">
                          Uploaded {format(new Date(doc.uploadedAt), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-500 text-slate-300 hover:bg-slate-700"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button
                        onClick={() => analyzeDocument(doc.id)}
                        disabled={analyzingDocument === doc.id || !isHeroPlan}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        <Brain className="w-4 h-4 mr-1" />
                        {analyzingDocument === doc.id ? "Analyzing..." : "AI Analyze"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {displayDocuments.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No documents yet</h3>
            <p className="text-slate-400 mb-6">Upload your first IEP document to get started</p>
            <Button 
              onClick={() => setShowFileUpload(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>
        )}
      </div>

      <FileUploadModal 
        open={showFileUpload} 
        onOpenChange={setShowFileUpload}
      />
    </div>
  );
}