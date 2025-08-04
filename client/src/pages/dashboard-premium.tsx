// dashboard-advocate.tsx - Professional advocate dashboard with full AI toolkit

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

const advocateTools = [
  { name: 'AI IEP Review', desc: 'Analyze existing IEPs for quality & improvement', icon: '🧠' },
  { name: 'IEP Goal Generator', desc: 'Craft measurable objectives quickly', icon: '🎯' },
  { name: 'Template Builder', desc: 'Design reusable IEP templates and forms', icon: '📄' },
  { name: 'Progress Analyzer', desc: 'Data-driven recommendations for IEP goals', icon: '📊' },
  { name: 'Meeting Prep Assistant', desc: 'Generate talking points and meeting notes', icon: '🗣️' },
  { name: 'Compliance Checker', desc: 'Ensure legal adherence to IEP policies', icon: '✅' },
  { name: 'Accommodation Builder', desc: 'Auto-generate accommodations by diagnosis', icon: '⚙️' },
  { name: 'Transition Planner', desc: 'Create plans for post-secondary success', icon: '📆' }
];

export default function DashboardAdvocate() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [upload, setUpload] = useState<File | null>(null);
  const { user } = useAuth();

  const displayUser = user || { email: "advocate@demo.com", planStatus: "heroOffer", username: "demo_advocate", role: "advocate" };
  const isHeroPlan = displayUser.planStatus === 'heroOffer';

  const openToolModal = (tool: string) => {
    setSelectedTool(tool);
    setModalOpen(true);
  };

  const handleSubmit = () => {
    alert(`Uploaded ${upload?.name || 'nothing'} to ${selectedTool}`);
    setModalOpen(false);
    setUpload(null);
  };

  return (
    <div className="bg-gradient-to-b from-[#1A1B2E] to-[#2C2F48] min-h-screen text-white">

      <div className="px-6 pb-10">
        {/* Welcome Section */}
        <div className="pt-8 pb-6">
          <h1 className="text-2xl font-bold mb-2 text-white">
            Welcome, {displayUser.username || 'Professional'}!
          </h1>
          <p className="text-slate-300 mb-6">
            Access your complete suite of AI-powered IEP management tools
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Card className="bg-[#3E4161]/70 border-slate-600">
            <CardContent className="p-4">
              <div className="text-slate-300 text-sm">Families Supported</div>
              <div className="text-2xl font-bold text-white">4</div>
            </CardContent>
          </Card>
          <Card className="bg-[#3E4161]/70 border-slate-600">
            <CardContent className="p-4">
              <div className="text-slate-300 text-sm">Documents Reviewed</div>
              <div className="text-2xl font-bold text-white">12</div>
            </CardContent>
          </Card>
          <Card className="bg-[#3E4161]/70 border-slate-600">
            <CardContent className="p-4">
              <div className="text-slate-300 text-sm">Goals Generated</div>
              <div className="text-2xl font-bold text-white">28</div>
            </CardContent>
          </Card>
          <Card className="bg-[#3E4161]/70 border-slate-600">
            <CardContent className="p-4">
              <div className="text-slate-300 text-sm">Compliance Flags</div>
              <div className="text-2xl font-bold text-white">1</div>
            </CardContent>
          </Card>
        </div>

        {/* AI Tools Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">AI-Powered IEP Professional Tools</h3>
            {isHeroPlan && (
              <Badge className="bg-blue-600/20 text-blue-300 border border-blue-500">
                Hero Plan Exclusive
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {advocateTools.map((tool) => (
              <Card 
                key={tool.name} 
                className="bg-[#3E4161] hover:bg-[#4A4E76] border-slate-500 transition-all duration-200 cursor-pointer group"
                onClick={() => openToolModal(tool.name)}
              >
                <CardContent className="p-4">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </div>
                  <div className="font-semibold text-white mb-2">
                    {tool.name}
                  </div>
                  <div className="text-sm text-slate-300 mb-4 line-clamp-2">
                    {tool.desc}
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!isHeroPlan && tool.name !== "AI IEP Review"}
                  >
                    {isHeroPlan || tool.name === "AI IEP Review" ? "Use Tool" : "Upgrade Required"}
                  </Button>
                </CardContent>
              </Card>
            ))}
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
                <Input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setUpload(e.target.files?.[0] || null)}
                  className="bg-[#3E4161] border-slate-500 text-white"
                />
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
  );
}