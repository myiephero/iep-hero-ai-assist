import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Brain, Save, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { IEPDraft } from "@shared/schema";

export default function GoalGenerator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [diagnosis, setDiagnosis] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Check if user has Hero plan access
  const hasHeroAccess = user?.planStatus === 'heroOffer' || 
                        user?.email === 'parent@demo.com';

  // Fetch existing drafts
  const { data: drafts = [], isLoading } = useQuery<IEPDraft[]>({
    queryKey: ['/api/iep-drafts'],
    enabled: !!user?.id && hasHeroAccess
  });

  // Save draft mutation
  const saveDraftMutation = useMutation({
    mutationFn: (data: { diagnosis: string; suggestions: string }) =>
      apiRequest(`/api/iep-drafts`, 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/iep-drafts'] });
      toast({
        title: "Draft Saved",
        description: "Your IEP goals have been saved successfully.",
      });
      // Clear form after saving
      setDiagnosis('');
      setSuggestions('');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save draft",
        variant: "destructive",
      });
    }
  });

  const handleGenerate = async () => {
    if (!diagnosis.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a diagnosis to generate IEP goals.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiRequest('/api/generate-iep-goals', 'POST', { diagnosis });

      if (response && response.goals) {
        setSuggestions(response.goals);
        toast({
          title: "Goals Generated",
          description: "IEP goals have been generated successfully.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate IEP goals",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!suggestions.trim()) {
      toast({
        title: "No Content",
        description: "Please generate goals before saving.",
        variant: "destructive",
      });
      return;
    }

    saveDraftMutation.mutate({
      diagnosis: diagnosis.trim(),
      suggestions: suggestions.trim()
    });
  };

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
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">IEP Goal Generator</h2>
              <p className="text-gray-600 mb-6">
                Generate comprehensive IEP goals based on your child's diagnosis. Available with Hero Plan ($495/year).
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">IEP Goal Generator</h1>
          <p className="text-slate-600">Generate personalized IEP goals based on your child's diagnosis and needs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Generator Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Generate New Goals
              </CardTitle>
              <CardDescription>
                Enter your child's diagnosis to generate targeted IEP goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  placeholder="Enter diagnosis (e.g., Autism Spectrum Disorder, ADHD, Dyslexia...)"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !diagnosis.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Goals...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Generate IEP Goals
                  </>
                )}
              </Button>

              {suggestions && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="suggestions">Generated Goals</Label>
                    <Textarea
                      id="suggestions"
                      value={suggestions}
                      onChange={(e) => setSuggestions(e.target.value)}
                      rows={12}
                      className="min-h-[300px]"
                      placeholder="Generated IEP goals will appear here..."
                    />
                  </div>

                  <Button 
                    onClick={handleSave}
                    disabled={saveDraftMutation.isPending || !suggestions.trim()}
                    className="w-full"
                    variant="outline"
                  >
                    {saveDraftMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save to Vault
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Previous Drafts */}
          <Card>
            <CardHeader>
              <CardTitle>Previous Drafts</CardTitle>
              <CardDescription>
                Your saved IEP goal drafts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : drafts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No drafts saved yet</p>
                  <p className="text-sm">Generate and save your first IEP goals to see them here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {drafts.map((draft) => (
                    <Card key={draft.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="secondary">{draft.diagnosis}</Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(draft.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {draft.suggestions}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 p-0 h-auto"
                          onClick={() => {
                            setDiagnosis(draft.diagnosis);
                            setSuggestions(draft.suggestions);
                          }}
                        >
                          Load Draft
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}