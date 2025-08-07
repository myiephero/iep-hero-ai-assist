// dashboard-parent.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useRoleAwareDashboard } from '@/utils/navigation';
import { useQuery } from '@tanstack/react-query';
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
    name: 'Get Expert Help',
    description: 'Connect with qualified IEP advocates',
    icon: '🤝'
  }
];

export default function ParentDashboard() {
  const { user, getUserRole } = useAuth();
  const [, setLocation] = useLocation();
  const { getDashboardRoute } = useRoleAwareDashboard();
  const [modalOpen, setModalOpen] = useState(false);

  // Debug logging for role validation
  console.log('🔍 Parent Dashboard - User:', user?.email, 'Username:', user?.username, 'Role:', getUserRole());

  // Role validation - redirect if not parent
  const userRole = getUserRole();
  if (userRole && userRole !== 'parent') {
    console.log('❌ Non-parent user accessing parent dashboard, redirecting to premium');
    setLocation(getDashboardRoute());
    return null;
  }

  // Additional debug for display issues
  useEffect(() => {
    console.log('🔍 Parent Dashboard rendered with user:', {
      email: user?.email,
      username: user?.username,
      role: user?.role,
      getUserRole: getUserRole()
    });
  }, [user, getUserRole]);

  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [upload, setUpload] = useState<File | null>(null);

  // Fetch dashboard metrics for IEP Overview Panel
  const { data: metrics } = useQuery({
    queryKey: ['/api/dashboard/metrics'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const displayUser = user || { username: 'Parent Demo', email: 'parent@demo.com' };
  const isHeroPlan = user?.subscriptionTier === 'heroOffer';

  const handleTool = (tool: string) => {
    if (tool === "IEP Goal Generator") {
      setLocation("/tools/goal-generator");
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
    <div className="min-h-screen bg-gradient-to-b from-[#1A1B2E] to-[#2C2F48] px-6 py-10 text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-white">
          Welcome back, {user?.username || 'Parent'}!
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

        {/* Quick Access to Students */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">My Students</h2>
          <Card 
            className="bg-[#3E4161]/70 border-slate-600 cursor-pointer hover:bg-[#3E4161]/90 transition-all duration-200"
            onClick={() => setLocation("/my-students")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">👥</div>
              <div className="font-semibold text-white">Manage Students</div>
              <div className="text-xs text-slate-400">View and manage your children's IEP information</div>
            </CardContent>
          </Card>
        </div>

        {/* Essential Tools - Clean Top Row */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Core Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card 
              className="bg-[#3E4161]/70 border-slate-600 cursor-pointer hover:bg-[#3E4161]/90 transition-all duration-200"
              onClick={() => setLocation("/documents")}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🗂️</div>
                <div className="font-semibold text-white">Document Vault</div>
                <div className="text-xs text-slate-400">Upload & organize IEP documents</div>
              </CardContent>
            </Card>
            
            <Card
              className="bg-[#3E4161]/70 border-slate-600 cursor-pointer hover:bg-[#3E4161]/90 transition-all duration-200"
              onClick={() => setLocation("/tools/goal-generator")}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-semibold text-white">Goal Generator</div>
                <div className="text-xs text-slate-400">Create SMART IEP goals</div>
              </CardContent>
            </Card>
            
            <Card
              className="bg-[#3E4161]/70 border-slate-600 cursor-pointer hover:bg-[#3E4161]/90 transition-all duration-200"
              onClick={() => setLocation("/tools/ai-document-review")}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🔍</div>
                <div className="font-semibold text-white">AI Review</div>
                <div className="text-xs text-slate-400">Analyze IEP documents</div>
              </CardContent>
            </Card>
            
            <Card
              className="bg-[#3E4161]/70 border-slate-600 cursor-pointer hover:bg-[#3E4161]/90 transition-all duration-200"
              onClick={() => setLocation("/messages")}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">💬</div>
                <div className="font-semibold text-white">Messages</div>
                <div className="text-xs text-slate-400">Chat with advocates</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Tools Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Additional Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              className="bg-[#3E4161]/70 border-slate-600 cursor-pointer hover:bg-[#3E4161]/90 transition-all duration-200"
              onClick={() => setLocation("/tools/meeting-prep-wizard")}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">📋</div>
                <div className="font-semibold text-white">Meeting Prep</div>
                <div className="text-xs text-slate-400">Prepare for IEP meetings</div>
              </CardContent>
            </Card>
            
            <Card
              className="bg-[#3E4161]/70 border-slate-600 cursor-pointer hover:bg-[#3E4161]/90 transition-all duration-200"
              onClick={() => setLocation("/tools/smart-letter-generator")}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">✉️</div>
                <div className="font-semibold text-white">Letter Generator</div>
                <div className="text-xs text-slate-400">Generate legal letters</div>
              </CardContent>
            </Card>
            
            <Card
              className="bg-[#3E4161]/70 border-slate-600 cursor-pointer hover:bg-[#3E4161]/90 transition-all duration-200"
              onClick={() => setLocation("/tools/progress-notes-logger")}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">📝</div>
                <div className="font-semibold text-white">Progress Logger</div>
                <div className="text-xs text-slate-400">Track service delivery</div>
              </CardContent>
            </Card>
            
            <Card
              className="bg-[#3E4161]/70 border-slate-600 cursor-pointer hover:bg-[#3E4161]/90 transition-all duration-200"
              onClick={() => setLocation("/tools/communication-tracker")}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">📧</div>
                <div className="font-semibold text-white">Communication Plan</div>
                <div className="text-xs text-slate-400">Track emails & requests</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Get Expert Help Section - Advocate Matcher */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Get Expert Support</h2>
          <Card
            className="bg-[#3E4161]/70 border-slate-600 cursor-pointer hover:bg-[#3E4161]/90 transition-all duration-200 border-2 border-blue-500/30"
            onClick={() => setLocation("/advocate-matcher")}
          >
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🤝</div>
              <div className="font-bold text-white text-lg mb-2">Get Matched with an IEP Advocate</div>
              <div className="text-sm text-slate-300 mb-3">
                Connect with qualified professionals who can guide you through the IEP process
              </div>
              <div className="text-xs text-blue-300 bg-blue-900/20 px-3 py-1 rounded-full inline-block">
                Free consultation available
              </div>
            </CardContent>
          </Card>
        </div>

        {/* IEP Overview Panel */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Your Child's IEP Overview</h2>
          <Card className="bg-[#3E4161]/70 border-slate-600">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{(metrics as any)?.activeGoals || 0}</div>
                  <div className="text-sm text-slate-400">Active Goals</div>
                  {(!(metrics as any)?.activeGoals || metrics.activeGoals === 0) && (
                    <div className="text-xs text-blue-300 mt-1">Create your first goal</div>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">{(metrics as any)?.progressRate || 0}%</div>
                  <div className="text-sm text-slate-400">Overall Progress</div>
                  {(!(metrics as any)?.progressRate || metrics.progressRate === 0) && (
                    <div className="text-xs text-green-300 mt-1">Start making progress</div>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-400 mb-1">
                    {(metrics as any)?.upcomingMeeting ? 'Scheduled' : 'No Meeting'}
                  </div>
                  <div className="text-sm text-slate-400">Next IEP Review</div>
                  {!(metrics as any)?.upcomingMeeting && (
                    <div className="text-xs text-purple-300 mt-1">Schedule your next meeting</div>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400 mb-1">{(metrics as any)?.documents || 0}</div>
                  <div className="text-sm text-slate-400">Documents</div>
                  {(!(metrics as any)?.documents || metrics.documents === 0) && (
                    <div className="text-xs text-orange-300 mt-1">Upload your first document</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent IEP Activity Feed */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Recent Activity</h2>
          <Card className="bg-[#3E4161]/70 border-slate-600">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-slate-700/50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-slate-300">Demo account created</span>
                  <span className="text-xs text-slate-500 ml-auto">Today</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-slate-700/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-slate-300">Hero Plan activated</span>
                  <span className="text-xs text-slate-500 ml-auto">Today</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-slate-700/50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-sm text-slate-300">{(metrics as any)?.documents || 4} documents uploaded</span>
                  <span className="text-xs text-slate-500 ml-auto">Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modal for legacy tools */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="bg-slate-800 border-slate-600">
            <DialogHeader>
              <DialogTitle className="text-white">{selectedTool}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-white">
              <p>{parentTools.find(t => t.name === selectedTool)?.description}</p>
              {selectedTool === "Goal Generator" && <IEPGoalGenerator />}
              {selectedTool === "IEP Status" && <IEPStatusViewer />}
              {upload && (
                <div className="p-3 bg-slate-700 rounded">
                  <p className="text-sm">Uploaded: {upload.name}</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                  Submit
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setModalOpen(false)}
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}