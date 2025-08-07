import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Lock, Timer, Eye, User, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SharedDocumentProps {
  token: string;
}

interface SharedDocument {
  document: {
    id: string;
    displayName: string;
    type: string;
    description?: string;
    content?: string;
    createdAt: string;
  };
  accessLevel: string;
  canDownload: boolean;
  sharedBy: string;
}

export function SharedDocumentView({ token }: SharedDocumentProps) {
  const { toast } = useToast();
  const [document, setDocument] = useState<SharedDocument | null>(null);
  const [password, setPassword] = useState("");
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocument = async (attemptPassword?: string) => {
    try {
      const url = new URL(`/shared/${token}`, window.location.origin);
      if (attemptPassword) {
        url.searchParams.set('password', attemptPassword);
      }

      const response = await fetch(url.toString());
      const data = await response.json();

      if (response.status === 401 && data.requiresPassword) {
        setRequiresPassword(true);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load shared document');
      }

      setDocument(data);
      setRequiresPassword(false);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [token]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast({
        title: "Password Required",
        description: "Please enter the password to access this document",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    fetchDocument(password);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`/shared/${token}/download`);
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document?.document.displayName || 'document';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Started",
        description: "Your document is being downloaded",
      });
    } catch (err: any) {
      toast({
        title: "Download Failed",
        description: err.message || "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeIcon = (type: string) => {
    return <FileText className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-600">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading shared document...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/50 border-red-500/30">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
            <p className="text-slate-300 mb-4">{error}</p>
            <Button onClick={() => window.location.href = '/'} className="bg-blue-600 hover:bg-blue-700">
              Go to IEP Hero
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requiresPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-600">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
            <CardTitle className="text-white">Password Protected</CardTitle>
            <p className="text-slate-300">This document requires a password to access</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-slate-200">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Access Document
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!document) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between bg-slate-800/50 border border-slate-600 rounded-lg p-4">
            <div className="flex items-center gap-3">
              {getTypeIcon(document.document.type)}
              <div>
                <h1 className="text-xl font-semibold text-white">{document.document.displayName}</h1>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Shared by {document.sharedBy}
                  </span>
                  <span className="flex items-center gap-1">
                    <Timer className="w-4 h-4" />
                    {formatDate(document.document.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600/20 text-blue-300 border border-blue-500">
                <Eye className="w-3 h-3 mr-1" />
                {document.accessLevel}
              </Badge>
              {document.canDownload && (
                <Button onClick={handleDownload} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Document Content */}
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Document Content</CardTitle>
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                {document.document.type}
              </Badge>
            </div>
            {document.document.description && (
              <p className="text-slate-300">{document.document.description}</p>
            )}
          </CardHeader>
          <CardContent>
            {document.document.content ? (
              <div className="prose prose-invert max-w-none">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                  <pre className="whitespace-pre-wrap text-slate-200 font-sans leading-relaxed">
                    {document.document.content}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>This document doesn't have previewable content.</p>
                {document.canDownload && (
                  <p className="mt-2">Click the download button above to access the file.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Securely shared via IEP Hero - Your trusted partner in special education advocacy</p>
        </div>
      </div>
    </div>
  );
}