import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import FileUploadModal from "@/components/modals/file-upload-modal";
import type { Goal, Document, Event } from "@shared/schema";
import { format } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();
  const [showFileUpload, setShowFileUpload] = useState(false);
  
  console.log('🎨 PREMIUM DASHBOARD LOADED - Hero Plan user:', user?.planStatus === 'heroOffer');

  // Data fetching
  const { data: goals = [] } = useQuery({
    queryKey: ["/api/goals"],
  });

  const { data: documents = [] } = useQuery({
    queryKey: ["/api/documents"],
  });

  const { data: events = [] } = useQuery({
    queryKey: ["/api/events"],
  });

  const isHeroPlan = user?.planStatus === 'heroOffer';

  const heroTools = [
    { name: "AI IEP Review", desc: "Comprehensive AI analysis of existing IEP documents", icon: "🧠" },
    { name: "IEP Goal Generator", desc: "AI-powered IEP goal creation with measurable objectives", icon: "🎯" },
    { name: "Template Builder", desc: "Create custom IEP document templates", icon: "📄" },
    { name: "Progress Analyzer", desc: "AI analysis of student progress", icon: "📊" },
    { name: "Meeting Prep Assistant", desc: "AI-generated talking points for IEP meetings", icon: "🗣️" },
    { name: "Compliance Checker", desc: "Ensure IEP compliance with state/federal laws", icon: "✅" },
    { name: "Accommodation Builder", desc: "Generate accommodations/modifications", icon: "⚙️" },
    { name: "Transition Planner", desc: "Planning for post-secondary goals", icon: "📆" },
  ];

  const launchTool = (tool: string) => {
    if (tool === "AI IEP Review") {
      setShowFileUpload(true);
    } else {
      alert(`${tool} is coming soon!`);
    }
  };

  const getStatsData = () => {
    const goalsArray = goals as Goal[];
    const documentsArray = documents as Document[];
    const eventsArray = events as Event[];
    
    return {
      activeGoals: goalsArray.length,
      progressRate: goalsArray.length > 0 ? Math.round((goalsArray.filter(g => g.status === 'completed').length / goalsArray.length) * 100) : 0,
      meetings: eventsArray.length,
      documents: documentsArray.length
    };
  };

  const stats = getStatsData();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#1A1B2E] to-[#2C2F48] text-white">
      <header className="sticky top-0 z-50 bg-[#2C2F48]/95 backdrop-blur shadow-lg px-6 py-4 flex items-center justify-between border-b border-slate-600">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">My IEP Hero</h1>
          {isHeroPlan && (
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
              Hero Plan
            </Badge>
          )}
        </div>
        <nav className="space-x-4 flex items-center">
          <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
            Dashboard
          </Button>
          <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
            Goals
          </Button>
          <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
            Documents
          </Button>
          <div className="flex items-center gap-2 ml-4">
            <div className="text-right">
              <div className="text-sm font-medium text-white">{user?.username}</div>
              <div className="text-xs text-slate-400 capitalize">{user?.role}</div>
            </div>
          </div>
        </nav>
      </header>

      <div className="flex-1 px-6 py-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.username}!
          </h2>
          <p className="text-slate-400">
            Manage your child's IEP progress and goals with AI-powered tools
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="text-slate-400 text-sm">Active Goals</div>
              <div className="text-2xl font-bold text-white">{stats.activeGoals}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="text-slate-400 text-sm">Progress Rate</div>
              <div className="text-2xl font-bold text-white">{stats.progressRate}%</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="text-slate-400 text-sm">Meetings</div>
              <div className="text-2xl font-bold text-white">{stats.meetings}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="text-slate-400 text-sm">Documents</div>
              <div className="text-2xl font-bold text-white">{stats.documents}</div>
            </CardContent>
          </Card>
        </div>

        {/* AI Tools Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              AI-Powered IEP Professional Tools
            </h3>
            {!isHeroPlan && (
              <Badge variant="outline" className="border-amber-500 text-amber-400">
                Upgrade to Hero Plan for full access
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {heroTools.map((tool) => (
              <Card 
                key={tool.name} 
                className="bg-slate-800/70 border-slate-600 hover:bg-slate-700/70 transition-all duration-200 cursor-pointer group"
                onClick={() => launchTool(tool.name)}
              >
                <CardContent className="p-4">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </div>
                  <div className="font-semibold text-white mb-2">
                    {tool.name}
                  </div>
                  <div className="text-sm text-slate-400 mb-4 line-clamp-2">
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

        {/* Tabs Section */}
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger 
              value="preview" 
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
            >
              Live Preview
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
            >
              AI Chat
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
            >
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="bg-slate-900/50 rounded-lg p-8 text-center border border-slate-700">
                  <div className="text-4xl mb-4">📄</div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Document Preview
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Upload an IEP document to see AI analysis and recommendations
                  </p>
                  <Button 
                    onClick={() => setShowFileUpload(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Upload Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-800/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl">🧠</div>
                      <span className="text-sm font-medium text-blue-300">AI Assistant</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      Hello! I'm here to help you with IEP questions, document analysis, and advocacy guidance. 
                      What would you like to know about your child's educational plan?
                    </p>
                  </div>
                  <Textarea 
                    placeholder="Ask about IEP processes, goals, accommodations, or get advocacy advice..." 
                    className="min-h-[120px] bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500" 
                  />
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Meeting Notes & To-Dos</h3>
                  <Button size="sm" className="bg-slate-700 hover:bg-slate-600 text-white">
                    Add Note
                  </Button>
                </div>
                <Textarea 
                  placeholder="Add meeting notes, to-dos, or important reminders..."
                  className="min-h-[200px] bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                />
                <div className="space-y-3">
                  <div className="p-4 bg-amber-900/20 border border-amber-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-amber-400">⏰</div>
                      <span className="text-sm font-medium text-amber-300">Upcoming IEP Meeting</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      {(events as Event[]).length > 0 
                        ? `${format(new Date((events as Event[])[0].date), "MMMM d, yyyy")} - Prepare transition goals discussion`
                        : "No upcoming meetings scheduled"
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* File Upload Modal */}
      <FileUploadModal 
        open={showFileUpload} 
        onOpenChange={setShowFileUpload}
      />
    </div>
  );
}/* Force cache refresh */
