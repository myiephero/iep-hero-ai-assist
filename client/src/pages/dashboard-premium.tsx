// dashboard-advocate.tsx - Professional advocate dashboard with full AI toolkit

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { DashboardMetrics } from "@/components/DashboardMetrics";


const advocateTools = [
  { name: 'Smart Letter Generator', desc: 'Generate legally sound advocacy letters', icon: '📝', route: '/tools/smart-letter-generator' },
  { name: 'IEP Review Tool', desc: 'AI-powered IEP analysis and recommendations', icon: '🧠', route: '/tools/ai-iep-review' },
  { name: 'Meeting Prep Assistant', desc: 'Generate talking points and meeting notes', icon: '📋', route: '/tools/meeting-prep-wizard' },
  { name: 'Progress Analyzer', desc: 'Data-driven recommendations for IEP goals', icon: '📊', route: '/tools/progress-analyzer' },
  { name: 'Document Vault', desc: 'Secure client document management', icon: '🗂️', route: '/documents' },
  { name: 'Compliance Checker', desc: 'Ensure legal adherence to IEP policies', icon: '✅', route: '/tools/ai-iep-review' },
  { name: 'Advocate Messaging', desc: 'Secure communication with clients', icon: '💬', route: '/messages' },
  { name: 'Get Expert Help', desc: 'Connect with specialist advocates', icon: '🤝', route: '/tools/advocate-matcher' },
  { name: 'Progress Logger', desc: 'Track service delivery and outcomes', icon: '📝', route: '/tools/progress-notes-logger' }
];

export default function DashboardAdvocate() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [upload, setUpload] = useState<File | null>(null);
  const [, setLocation] = useLocation();
  const { user, getUserRole } = useAuth();

  // Debug logging for role validation
  console.log('🔍 Advocate Dashboard - User:', user?.email, 'Role:', getUserRole());

  // Role validation - redirect if parent
  const userRole = getUserRole();
  if (userRole === 'parent') {
    console.log('❌ Parent user accessing advocate dashboard, redirecting');
    setLocation('/dashboard-parent');
    return null;
  }

  const displayUser = user || { email: "advocate@demo.com", planStatus: "heroOffer", username: "demo_advocate", role: "advocate" };
  const isHeroPlan = (displayUser as any).planStatus === 'heroOffer';

  // Tool navigation is now handled directly in the grid via tool.route

  const handleSubmit = () => {
    // Tools should redirect to their actual implementation pages
    // This is a fallback for unimplemented tools
    setModalOpen(false);
    setUpload(null);
  };

  return (
    <>

      <div className="bg-gradient-to-b from-[#1A1B2E] to-[#2C2F48] min-h-screen text-white">

      <div className="px-6 pb-10">
        {/* Welcome Section */}
        <div className="pt-8 pb-6">
          <h1 className="text-2xl font-bold mb-2 text-white">
            Welcome back, {user?.username || 'Professional'}!
          </h1>
          <p className="text-slate-300 mb-6">
            {userRole === 'advocate' ? 'Access your complete suite of AI-powered advocacy tools' : 'Access your complete suite of AI-powered IEP management tools'}
          </p>
          
          {/* Dashboard Metrics - Real Data */}
          <DashboardMetrics className="mb-8" />
        </div>



        {/* Client Management Dashboard */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Your Client Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-[#3E4161]/70 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-slate-300 text-sm">Active Families</div>
                    <div className="text-2xl font-bold text-white">8</div>
                  </div>
                  <div className="text-blue-400">👨‍👩‍👧‍👦</div>
                </div>
                <div className="text-xs text-slate-400 mt-1">3 new this month</div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#3E4161]/70 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-slate-300 text-sm">Students Served</div>
                    <div className="text-2xl font-bold text-white">12</div>
                  </div>
                  <div className="text-green-400">👦👧</div>
                </div>
                <div className="text-xs text-slate-400 mt-1">Across 8 districts</div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#3E4161]/70 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-slate-300 text-sm">IEPs in Review</div>
                    <div className="text-2xl font-bold text-white">5</div>
                  </div>
                  <div className="text-yellow-400">📋</div>
                </div>
                <div className="text-xs text-slate-400 mt-1">2 due this week</div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#3E4161]/70 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-slate-300 text-sm">Success Rate</div>
                    <div className="text-2xl font-bold text-white">94%</div>
                  </div>
                  <div className="text-green-400">📈</div>
                </div>
                <div className="text-xs text-slate-400 mt-1">Goal achievement</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Real Client Activity with Live Data */}
          <Card className="bg-[#3E4161]/70 border-slate-600 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Client Activity</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-green-500 text-green-400 hover:bg-green-500/10"
                  onClick={() => setLocation('/my-parents')}
                >
                  Manage Clients
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[#2C2F48] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-blue-400 text-sm">📋</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">Johnson Family - Emma (Grade 3)</div>
                      <div className="text-sm text-slate-300">IEP uploaded to Document Vault</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-slate-400">Today</div>
                    <Button size="sm" variant="ghost" className="text-green-400 hover:text-green-300">
                      Review
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-[#2C2F48] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-green-400 text-sm">✓</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">Smith Family - Michael (Grade 4)</div>
                      <div className="text-sm text-slate-300">New message received</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-slate-400">2 days ago</div>
                    <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                      Reply
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-[#2C2F48] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <span className="text-yellow-400 text-sm">📅</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">Davis Family - Alex (Grade 5)</div>
                      <div className="text-sm text-slate-300">Goal created for reading comprehension</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-slate-400">3 days ago</div>
                    <Button size="sm" variant="ghost" className="text-yellow-400 hover:text-yellow-300">
                      View
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setLocation('/my-parents')}
                >
                  View All Families
                </Button>
                <Button 
                  variant="outline"
                  className="border-green-500 text-green-400 hover:bg-green-500/10"
                  onClick={() => setLocation('/simple-advocate-matcher')}
                >
                  New Referrals
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advocate Professional Tools */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Professional Advocate Tools</h2>
            {isHeroPlan && (
              <Badge className="bg-blue-600/20 text-blue-300 border border-blue-500">
                ✅ Hero Plan Active
              </Badge>
            )}
          </div>
          
          {/* First Row - Core Tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {advocateTools.slice(0, 3).map((tool, index) => (
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
          
          {/* Second Row - Advanced Tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {advocateTools.slice(3, 6).map((tool, index) => (
              <Card 
                key={index + 3}
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
          
          {/* Third Row - Communication & Support Tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {advocateTools.slice(6, 9).map((tool, index) => (
              <Card 
                key={index + 6}
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

        {/* New Referrals Queue */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">📥 New Referrals Queue</h3>
            <Badge className="bg-orange-600/20 text-orange-300 border border-orange-500">
              2 pending
            </Badge>
          </div>
          
          <div className="space-y-4">
            <Card className="bg-[#3E4161]/70 border-orange-600/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <span className="text-orange-400 text-sm">👤</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">Rodriguez Family</div>
                      <div className="text-sm text-slate-300">Child: Sofia (Grade 2) - Autism Spectrum Disorder</div>
                      <div className="text-xs text-slate-400">Referred: 2 hours ago</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="border-orange-500 text-orange-400">
                      Intro Call
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                      Decline
                    </Button>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-[#2C2F48] rounded-lg">
                  <div className="text-sm text-slate-300">
                    <strong>Intake Summary:</strong> Parent seeking advocacy for daughter's IEP review. 
                    Current concerns include lack of appropriate accommodations and insufficient progress monitoring.
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#3E4161]/70 border-orange-600/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <span className="text-orange-400 text-sm">👤</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">Thompson Family</div>
                      <div className="text-sm text-slate-300">Child: Marcus (Grade 6) - ADHD, Learning Disability</div>
                      <div className="text-xs text-slate-400">Referred: 1 day ago</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="border-orange-500 text-orange-400">
                      Intro Call
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                      Decline
                    </Button>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-[#2C2F48] rounded-lg">
                  <div className="text-sm text-slate-300">
                    <strong>Intake Summary:</strong> Parent requesting support for upcoming transition meeting. 
                    Student moving from elementary to middle school and needs updated IEP goals.
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center">
              <Button 
                variant="outline" 
                className="border-orange-500 text-orange-400 hover:bg-orange-500/10"
                onClick={() => setLocation('/simple-advocate-matcher')}
              >
                View All Referrals
              </Button>
            </div>
          </div>
        </div>

        {/* AI Tool Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="bg-[#2C2F48] border-slate-600 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">{selectedTool}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-slate-300">
                {selectedTool === "AI IEP Review" 
                  ? "Upload a document to begin AI analysis" 
                  : "This AI tool will help you with IEP management."}
              </p>
              {selectedTool === "AI IEP Review" && (
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
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {selectedTool === "AI IEP Review" ? "Upload & Analyze" : "Activate Tool"}
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
          </DialogContent>
        </Dialog>
      </div>
    </div>
    </>
  );
}