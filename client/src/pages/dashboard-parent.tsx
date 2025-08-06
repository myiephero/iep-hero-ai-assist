// dashboard-parent.tsx
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import IEPGoalGenerator from '@/components/IEPGoalGenerator';
import { IEPStatusViewer } from '@/components/IEPStatusViewer';
import { DashboardMetrics } from '@/components/DashboardMetrics';


const parentTools = [
  {
    name: 'IEP Goal Generator',
    description: 'Create SMART goals tailored to your child\'s needs',
    icon: '🎯'
  },
  {
    name: 'Progress Analyzer',
    description: 'See how your child is progressing toward goals',
    icon: '📈'
  },
  {
    name: 'Meeting Prep Wizard',
    description: 'Answer guided questions to generate prep notes',
    icon: '📋'
  },
  {
    name: 'Request Letters',
    description: 'Generate legally sound letters (e.g., Request for IEP, FBA, etc.)',
    icon: '✉️'
  },
  {
    name: 'Progress Notes',
    description: 'Track updates on services vs. promised supports',
    icon: '📝'
  },
  {
    name: 'Communication Plan',
    description: 'Track emails, deadlines, and key requests',
    icon: '📧'
  },
  {
    name: 'Know Your Rights',
    description: 'Get plain-language explanations of IDEA & Section 504',
    icon: '⚖️'
  },
  {
    name: 'Document Vault',
    description: 'Upload FERPA/HIPAA-compliant IEPs, emails, notes',
    icon: '🗂️'
  },
  {
    name: 'AI IEP Review',
    description: 'Get comprehensive AI analysis of your child\'s IEP',
    icon: '🧠'
  },
  {
    name: 'Ask AI About My Docs',
    description: 'Ask questions about your uploaded IEP documents',
    icon: '💬'
  },
  {
    name: 'Get Expert Help',
    description: 'Connect with an IEP advocate for personalized support',
    icon: '🤝'
  }
];

export default function ParentDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [upload, setUpload] = useState<File | null>(null);

  const displayUser = user || { username: "demo_parent", planStatus: "heroOffer" };
  const isHeroPlan = (displayUser as any).planStatus === 'heroOffer';

  const openToolModal = (tool: string) => {
    if (tool === "IEP Goal Generator") {
      setLocation("/tools/iep-goal-generator");
      return;
    }
    if (tool === "AI IEP Review") {
      setLocation("/tools/ai-iep-review");
      return;
    }
    if (tool === "Ask AI About My Docs") {
      setLocation("/tools/ask-ai-docs");
      return;
    }
    if (tool === "Progress Analyzer") {
      setLocation("/tools/progress-analyzer");
      return;
    }
    if (tool === "Meeting Prep Wizard") {
      setLocation("/tools/meeting-prep-wizard");
      return;
    }
    if (tool === "Request Letters") {
      setLocation("/tools/smart-letter-generator");
      return;
    }
    if (tool === "Progress Notes") {
      setLocation("/tools/progress-notes-logger");
      return;
    }
    if (tool === "Communication Plan") {
      setLocation("/tools/communication-tracker");
      return;
    }
    if (tool === "Know Your Rights") {
      setLocation("/tools/rights-explainer");
      return;
    }
    if (tool === "Document Vault") {
      setLocation("/documents");
      return;
    }
    if (tool === "Get Expert Help") {
      setLocation("/tools/advocate-matcher");
      return;
    }
    setSelectedTool(tool);
    setModalOpen(true);
  };

  const handleSubmit = () => {
    // This should not be called since all tools now route directly to their pages
    alert(`${selectedTool} activated! Feature coming soon.`);
    setModalOpen(false);
    setUpload(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#1A1B2E] to-[#2C2F48] px-6 py-10 text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-white">
          Welcome back, {(displayUser as any).username}!
        </h1>
        {isHeroPlan && (
          <div className="flex items-center gap-2 mb-4">
            <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-sm font-medium">
              🏆 Hero Plan Active
            </div>
          </div>
        )}
        <p className="text-slate-300 mb-8">
          Your complete toolkit for IEP advocacy and support
        </p>

        {/* Dashboard Metrics - Real Data */}
        <DashboardMetrics className="mb-8" />

        {/* Essential Tools - Clean Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card 
            className="bg-[#3E4161]/70 border-slate-600 cursor-pointer hover:bg-[#3E4161]/90 transition-all duration-200"
            onClick={() => setLocation("/documents")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">📁</div>
              <div className="font-semibold text-white">Document Vault</div>
              <div className="text-xs text-slate-400">Manage Files</div>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-[#3E4161]/70 border-slate-600 cursor-pointer hover:bg-[#3E4161]/90 transition-all duration-200"
            onClick={() => setLocation("/tools/iep-goal-generator")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-semibold text-white">Goal Generator</div>
              <div className="text-xs text-slate-400">Create Goals</div>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-[#3E4161]/70 border-slate-600 cursor-pointer hover:bg-[#3E4161]/90 transition-all duration-200"
            onClick={() => setLocation("/tools/ai-iep-review")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🧠</div>
              <div className="font-semibold text-white">AI Review</div>
              <div className="text-xs text-slate-400">Analyze IEPs</div>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-[#3E4161]/70 border-slate-600 cursor-pointer hover:bg-[#3E4161]/90 transition-all duration-200"
            onClick={() => setLocation("/tools/progress-analyzer")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold text-white">Reports</div>
              <div className="text-xs text-slate-400">Track Progress</div>
            </CardContent>
          </Card>
        </div>

        {/* Your Child's IEP Overview - Consolidated */}
        <details className="mb-8">
          <summary className="text-xl font-semibold mb-4 text-white cursor-pointer hover:text-blue-400 transition-colors">
            Your Child's IEP Overview
          </summary>
          <div className="mt-4 space-y-4">
            {/* Remove hardcoded demo data - will be replaced with real data */}
            <Card className="bg-[#3E4161]/70 border-slate-600">
              <CardContent className="p-4">
                <div className="text-center text-slate-400">
                  <div className="text-sm">IEP data will appear here when you have active goals and documents</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </details>

        {/* Messages Section */}
        <div className="mb-8">
          <Card 
            className="bg-[#3E4161]/70 border-slate-600 cursor-pointer hover:bg-[#3E4161]/90 transition-all duration-200"
            onClick={() => setLocation("/messages")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">💬</div>
              <div className="font-semibold text-white">Messages</div>
              <div className="text-xs text-slate-400">Chat with your advocate</div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Tools - Matching Top Row Style */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Additional Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Meeting Prep', desc: 'Prepare for IEP meetings', icon: '🗣️', route: '/tools/meeting-prep-wizard' },
              { name: 'Letter Generator', desc: 'Request letters & communication', icon: '📄', route: '/tools/smart-letter-generator' },
              { name: 'Progress Logger', desc: 'Track service delivery', icon: '📝', route: '/tools/progress-notes-logger' },
              { name: 'Get Expert Help', desc: 'Connect with advocates', icon: '🤝', route: '/matcher' }
            ].map((tool, index) => (
              <Card
                key={index}
                className="bg-[#3E4161]/70 border-slate-600 cursor-pointer hover:bg-[#3E4161]/90 transition-all duration-200"
                onClick={() => setLocation(tool.route)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <div className="font-semibold text-white">{tool.name}</div>
                  <div className="text-xs text-slate-400">{tool.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tool Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="bg-[#2C2F48] border border-slate-600 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-white">{selectedTool}</DialogTitle>
            </DialogHeader>
            
            {selectedTool === "IEP Goal Generator" ? (
              <IEPGoalGenerator />
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-300">
                  {selectedTool === "Ask AI About My Docs" 
                    ? "Upload a document to ask questions about it" 
                    : "This tool will help you with your child's IEP management."}
                </p>
                {selectedTool === "Ask AI About My Docs" && (
                  <div>
                    <Input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setUpload(e.target.files?.[0] || null)}
                      className="bg-[#3E4161] border-slate-500 text-white"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Upload PDF, DOC, or DOCX files (max 10MB)
                    </p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {selectedTool === "Ask AI About My Docs" ? "Upload & Ask" : "Start Tool"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setModalOpen(false)}
                    className="border-slate-500 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
    </>
  );
}