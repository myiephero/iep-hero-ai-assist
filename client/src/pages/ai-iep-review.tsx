// ai-iep-review.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'wouter';

interface ReviewResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  complianceScore: number;
}

export default function AIIEPReviewPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null); // Clear previous results
    }
  };

  const submitForReview = async () => {
    if (!file) {
      toast({
        title: "Please select a file",
        description: "Choose an IEP document to analyze (PDF, DOC, or DOCX)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/review-iep', {
        method: 'POST',
        body: formData,
        credentials: 'include' // Include session cookies for authentication
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || 'Failed to analyze IEP document');
      }

      const data = await response.json();
      setResult(data);
      
      toast({
        title: "Analysis Complete!",
        description: `IEP document "${file.name}" has been analyzed successfully`,
      });
    } catch (error) {
      console.error('Error analyzing IEP:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the IEP document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f2f7fd] to-[#eaf0f8] py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Link href="/dashboard-parent">
            <Button variant="ghost" className="mb-4 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold mb-3 text-slate-900">AI IEP Review</h1>
          <p className="text-lg text-slate-600">
            Upload your child's IEP document for a comprehensive AI-powered analysis of strengths, weaknesses, and compliance.
          </p>
        </div>

        {/* Upload Section */}
        <Card className="bg-white shadow-sm border border-slate-200 mb-8">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="iep-file" className="block text-sm font-medium text-slate-700 mb-2">
                  Upload IEP Document
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    id="iep-file"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="flex-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {file && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FileText className="w-4 h-4" />
                      {file.name}
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Supported formats: PDF, DOC, DOCX (max 10MB)
                </p>
              </div>

              <Button 
                disabled={loading || !file} 
                onClick={submitForReview}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                size="lg"
              >
                {loading ? (
                  <>
                    <Upload className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing IEP Document...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Analyze IEP Document
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900">IEP Analysis Results</h2>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(result.complianceScore)}`}>
                {getScoreIcon(result.complianceScore)}
                Compliance Score: {result.complianceScore}%
              </div>
            </div>

            {/* Executive Summary */}
            <Card className="bg-blue-50 border border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Executive Summary
                </h3>
                <p className="text-blue-800 leading-relaxed">{result.summary}</p>
              </CardContent>
            </Card>

            {/* Strengths and Weaknesses */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card className="bg-green-50 border border-green-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Strengths ({result.strengths.length})
                  </h3>
                  <ul className="space-y-2">
                    {result.strengths.map((strength, index) => (
                      <li key={index} className="text-green-800 text-sm flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Areas for Improvement */}
              <Card className="bg-orange-50 border border-orange-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-orange-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Areas for Improvement ({result.weaknesses.length})
                  </h3>
                  <ul className="space-y-2">
                    {result.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-orange-800 text-sm flex items-start gap-2">
                        <span className="text-orange-600 mt-1">•</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="bg-purple-50 border border-purple-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-purple-900 mb-4">
                  Recommendations for Next Steps
                </h3>
                <ul className="space-y-3">
                  {result.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-purple-800 text-sm flex items-start gap-3">
                      <span className="bg-purple-200 text-purple-700 font-bold text-xs px-2 py-1 rounded-full shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">What to Do Next</h3>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• Save or print this analysis for your records</li>
                <li>• Share relevant points with your child's IEP team</li>
                <li>• Request an IEP meeting if significant issues were identified</li>
                <li>• Use the recommendations to advocate for your child's needs</li>
                <li>• Consider requesting a formal IEP review if compliance score is low</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}