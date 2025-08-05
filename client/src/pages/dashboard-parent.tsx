// dashboard-parent.tsx
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import IEPGoalGenerator from '@/components/IEPGoalGenerator';

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
  const isHeroPlan = displayUser.planStatus === 'heroOffer';

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
    <div className="min-h-screen bg-gradient-to-b from-[#f2f7fd] to-[#eaf0f8] px-6 py-10 text-slate-800">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">
          Welcome back, {displayUser.username}! (Updated: {new Date().toLocaleTimeString()})
        </h1>
        <p className="text-slate-600 mb-8">
          You're doing amazing. Let's check on your child's progress and get prepared for what's next.
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white shadow-sm border border-slate-200">
            <CardContent className="p-4">
              <div className="text-slate-600 text-sm">Active Goals</div>
              <div className="text-2xl font-bold text-slate-900">2</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border border-slate-200">
            <CardContent className="p-4">
              <div className="text-slate-600 text-sm">Progress Rate</div>
              <div className="text-2xl font-bold text-slate-900">67%</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border border-slate-200">
            <CardContent className="p-4">
              <div className="text-slate-600 text-sm">Upcoming Meeting</div>
              <div className="text-2xl font-bold text-slate-900">Aug 15</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border border-slate-200">
            <CardContent className="p-4">
              <div className="text-slate-600 text-sm">Documents</div>
              <div className="text-2xl font-bold text-slate-900">5</div>
            </CardContent>
          </Card>
        </div>

        {/* Parent Tools Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6 text-slate-900">Helpful Tools Just for You ({parentTools.length} tools)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 min-h-fit">
            {parentTools.map((tool, index) => (
              <Card 
                key={`${tool.name}-${index}`} 
                className="bg-white hover:shadow-xl transition-all duration-200 cursor-pointer group border border-slate-200 w-full"
                onClick={() => openToolModal(tool.name)}
              >
                <CardContent className="p-6">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-slate-900">{tool.name}</h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{tool.description}</p>
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                    disabled={!isHeroPlan && tool.name !== "Ask AI About My Docs"}
                  >
                    {isHeroPlan || tool.name === "Ask AI About My Docs" ? "Use Tool" : "Upgrade Required"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tool Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="bg-white border border-slate-200 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-slate-900">{selectedTool}</DialogTitle>
            </DialogHeader>
            
            {selectedTool === "IEP Goal Generator" ? (
              <IEPGoalGenerator />
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  {selectedTool === "Ask AI About My Docs" 
                    ? "Upload a document to ask questions about it" 
                    : "This tool will help you with your child's IEP management."}
                </p>
                {selectedTool === "Ask AI About My Docs" && (
                  <Input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setUpload(e.target.files?.[0] || null)}
                    className="border-slate-300"
                  />
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
                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
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
  );
}