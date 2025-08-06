// dashboard-parent.tsx
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import IEPGoalGenerator from '@/components/IEPGoalGenerator';
import { IEPStatusViewer } from '@/components/IEPStatusViewer';


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
    <>

      <div className="min-h-screen bg-gradient-to-b from-[#f2f7fd] to-[#eaf0f8] px-6 py-10 text-slate-800">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">
          Welcome back, {displayUser.username}! (Updated: {new Date().toLocaleTimeString()})
        </h1>
        <p className="text-slate-600 mb-8">
          You're doing amazing. Let's check on your child's progress and get prepared for what's next.
        </p>

        {/* IEP Management Dashboard */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-slate-900">Your Child's IEP Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white shadow-sm border border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-slate-600 text-sm">Active Goals</div>
                    <div className="text-2xl font-bold text-slate-900">3</div>
                  </div>
                  <div className="text-blue-500">🎯</div>
                </div>
                <div className="text-xs text-slate-500 mt-1">2 in progress, 1 completed</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm border border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-slate-600 text-sm">Overall Progress</div>
                    <div className="text-2xl font-bold text-slate-900">75%</div>
                  </div>
                  <div className="text-green-500">📈</div>
                </div>
                <div className="text-xs text-slate-500 mt-1">Above grade level</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm border border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-slate-600 text-sm">Next IEP Review</div>
                    <div className="text-2xl font-bold text-slate-900">Mar 15</div>
                  </div>
                  <div className="text-yellow-500">🗓️</div>
                </div>
                <div className="text-xs text-slate-500 mt-1">In 45 days</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm border border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-slate-600 text-sm">Documents</div>
                    <div className="text-2xl font-bold text-slate-900">8</div>
                  </div>
                  <div className="text-purple-500">📁</div>
                </div>
                <div className="text-xs text-slate-500 mt-1">IEPs, reports, assessments</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent IEP Activity */}
          <Card className="bg-white shadow-sm border border-slate-200 mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent IEP Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">Reading Goal Completed</div>
                      <div className="text-sm text-slate-600">Emma achieved 80% accuracy in grade-level reading</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500">2 days ago</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm">📝</span>
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">Progress Report Generated</div>
                      <div className="text-sm text-slate-600">Q2 progress update for math and social skills</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500">1 week ago</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 text-sm">🤝</span>
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">Advocate Meeting Scheduled</div>
                      <div className="text-sm text-slate-600">Annual review prep with Sarah Johnson</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500">2 weeks ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* IEP Status Section */}
        <div className="mb-8">
          <IEPStatusViewer />
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
                  <div>
                    <Input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setUpload(e.target.files?.[0] || null)}
                      className="border-slate-300"
                    />
                    <p className="text-xs text-slate-500 mt-1">
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
    </>
  );
}