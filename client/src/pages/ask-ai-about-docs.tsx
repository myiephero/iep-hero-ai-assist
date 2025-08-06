import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageCircle, FileText, Brain, ArrowLeft, Save, Download } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

interface Document {
  id: string;
  filename: string;
  uploadedAt: string;
}

export default function AskAiAboutDocs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [question, setQuestion] = useState("");
  const [mode, setMode] = useState<"single" | "all">("all");
  const [selectedDocId, setSelectedDocId] = useState<string>("");
  const [answer, setAnswer] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savingToVault, setSavingToVault] = useState(false);

  // Check if user has Hero plan access
  const hasHeroAccess = user?.planStatus === 'heroOffer' || 
                        user?.email === 'parent@demo.com';

  // Fetch documents for single mode selection
  const { data: documents = [] } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
    enabled: hasHeroAccess
  });

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    if (mode === "single" && !selectedDocId) return;

    setIsAnalyzing(true);
    setAnswer("");

    try {
      const response = await apiRequest("POST", "/api/ask-docs", {
        mode,
        docId: selectedDocId,
        question: question.trim()
      });

      const result = await response.json();
      setAnswer(result.answer);
    } catch (error) {
      console.error("Error asking AI:", error);
      setAnswer("Sorry, I encountered an error while analyzing your documents. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Save to vault mutation
  const saveToVaultMutation = useMutation({
    mutationFn: async () => {
      const qaContent = `AI DOCUMENT Q&A RESPONSE

Question: ${question}
Analysis Mode: ${mode === "all" ? "All Documents" : `Single Document (${documents.find(d => d.id === selectedDocId)?.filename || "Unknown"})`}
Generated: ${new Date().toLocaleString()}

QUESTION:
${question}

AI RESPONSE:
${answer}

---
This Q&A was generated using AI-powered document analysis to provide insights from your IEP documents.`;

      const response = await apiRequest("POST", "/api/documents/generate", {
        content: qaContent,
        type: "qa_response",
        generatedBy: "Ask AI About Docs",
        displayName: `AI Q&A - ${question.slice(0, 50)}... - ${new Date().toLocaleDateString()}`,
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
        description: "Q&A response has been saved to your Document Vault"
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

  if (!hasHeroAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <Card className="text-center p-8">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Ask AI About Docs</CardTitle>
              <CardDescription>
                Query your IEP documents with AI-powered analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-purple-900 mb-2">Hero Plan Required</h3>
                <p className="text-purple-700 mb-4">
                  Get intelligent answers from your IEP documents with AI-powered document analysis.
                </p>
                <Link href="/pricing">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Upgrade to Hero Plan
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Ask AI About Docs</h1>
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              HERO
            </Badge>
          </div>
          <p className="text-gray-600">
            Get intelligent answers from your IEP documents using AI analysis
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Question Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Ask Your Question
              </CardTitle>
              <CardDescription>
                Ask specific questions about your IEP documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mode">Analysis Mode</Label>
                <Select value={mode} onValueChange={(value) => setMode(value as "single" | "all")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select analysis mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Documents</SelectItem>
                    <SelectItem value="single">Single Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {mode === "single" && (
                <div>
                  <Label htmlFor="document">Select Document</Label>
                  <Select value={selectedDocId} onValueChange={setSelectedDocId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a document" />
                    </SelectTrigger>
                    <SelectContent>
                      {documents.map((doc: Document) => (
                        <SelectItem key={doc.id} value={doc.id}>
                          {doc.filename}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="question">Your Question</Label>
                <Textarea
                  id="question"
                  placeholder="e.g., What accommodations are mentioned for reading? What are the current IEP goals for math?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleAskQuestion}
                disabled={!question.trim() || (mode === "single" && !selectedDocId) || isAnalyzing}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Documents...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Ask AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* AI Response */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                AI Analysis
              </CardTitle>
              <CardDescription>
                Intelligent insights from your IEP documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-purple-600" />
                    <p className="text-gray-600">Analyzing your documents...</p>
                    <p className="text-sm text-gray-500 mt-2">
                      This may take a few moments
                    </p>
                  </div>
                </div>
              ) : answer ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="text-purple-900 font-semibold mb-2">AI Response:</h4>
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {answer}
                    </div>
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
                      <Save className="w-4 h-4 mr-1" />
                      {savingToVault ? "Saving..." : "Save to Vault"}
                    </Button>
                    <Button
                      onClick={() => {
                        const qaText = `AI DOCUMENT Q&A RESPONSE

Question: ${question}
Analysis Mode: ${mode === "all" ? "All Documents" : `Single Document (${documents.find(d => d.id === selectedDocId)?.filename || "Unknown"})`}
Generated: ${new Date().toLocaleString()}

QUESTION:
${question}

AI RESPONSE:
${answer}

---
This Q&A was generated using AI-powered document analysis to provide insights from your IEP documents.`;
                        
                        const blob = new Blob([qaText], { type: 'text/plain' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `AI_QA_${question.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                        
                        toast({
                          title: "Downloaded",
                          description: "Q&A response downloaded successfully"
                        });
                      }}
                      variant="outline"
                      className="border-slate-300 hover:bg-slate-50"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Ask a question to get AI-powered insights</p>
                  <p className="text-sm mt-2">
                    Your documents will be analyzed to provide relevant answers
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Example Questions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Example Questions</CardTitle>
            <CardDescription>
              Try these sample questions to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2">
              {[
                "What accommodations are mentioned for reading?",
                "What are the current IEP goals for math?",
                "Which services are being provided?",
                "What testing accommodations are listed?",
                "How often are progress reports due?",
                "What transition goals are included?"
              ].map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left h-auto p-3"
                  onClick={() => setQuestion(example)}
                >
                  <span className="text-sm">{example}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}