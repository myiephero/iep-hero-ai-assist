import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Upload,
  Target,
  CheckCircle,
  Brain,
  Star,
  BookOpen,
  Settings,
  Search,
  Filter,
  Plus,
  Clock,
  User,
  Edit,
  Trash2,
  Download,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import FileUploadModal from "@/components/modals/file-upload-modal";
import type { Goal, Document, Event } from "@shared/schema";
import { format } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [selectedView, setSelectedView] = useState("iep-tracker");
  const [searchTerm, setSearchTerm] = useState("");

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

  const isParent = user?.role === "parent";
  const isAdvocate = user?.role === "advocate";

  const parentTools = [
    { id: "iep-tracker", name: "IEP Tracker", icon: Target },
    { id: "document-vault", name: "Document Vault", icon: FileText },
    { id: "letter-generator", name: "Letter Generator", icon: Edit },
    { id: "meeting-prep", name: "Meeting Prep Wizard", icon: Calendar },
    { id: "progress-tracker", name: "Progress Tracker", icon: CheckCircle }
  ];

  const advocateTools = [
    { id: "case-crm", name: "Case CRM", icon: Users },
    { id: "scheduling", name: "Scheduling", icon: Calendar },
    { id: "intake-forms", name: "Intake Forms", icon: FileText },
    { id: "templates", name: "Templates & Letters", icon: BookOpen }
  ];

  const renderLeftPanel = () => {
    switch (selectedView) {
      case "iep-tracker":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">IEP Goals & Timeline</h3>
              <Button size="sm" onClick={() => setShowFileUpload(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </div>
            <div className="space-y-3">
              {(goals as Goal[]).map((goal: Goal) => (
                <Card key={goal.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{goal.description}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {goal.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Due: {goal.targetDate ? format(new Date(goal.targetDate), "MMM d") : "No date"}
                        </span>
                      </div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case "document-vault":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Document Vault</h3>
              <Button size="sm" onClick={() => setShowFileUpload(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              {(documents as Document[]).map((doc: Document) => (
                <Card key={doc.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium text-sm">{doc.originalName}</h4>
                        <p className="text-xs text-gray-500">
                          {doc.uploadedAt ? format(new Date(doc.uploadedAt), "MMM d, yyyy") : "Recently"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Brain className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case "case-crm":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Client Cases</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Case
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search clients..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-purple-500" />
                    <div>
                      <h4 className="font-medium text-sm">Sarah Johnson</h4>
                      <p className="text-xs text-gray-500">IEP Review - Next meeting: Dec 15</p>
                    </div>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-green-500" />
                    <div>
                      <h4 className="font-medium text-sm">Michael Chen</h4>
                      <p className="text-xs text-gray-500">504 Plan - Assessment pending</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Review</Badge>
                </div>
              </Card>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Select a tool to get started</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-blue-600">My IEP Hero</h1>
          <Badge variant="outline" className="text-xs">
            {user?.planStatus === 'heroOffer' ? 'Hero Plan' : 'Free Plan'}
          </Badge>
        </div>
        <nav className="hidden md:flex space-x-4">
          <Button variant="ghost" className="text-sm">Dashboard</Button>
          <Button variant="ghost" className="text-sm">Templates</Button>
          <Button variant="ghost" className="text-sm">Chat</Button>
          <Button variant="ghost" className="text-sm">Settings</Button>
        </nav>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium">{user?.username}</div>
            <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
          </div>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r p-4 space-y-6">
          {(isParent || !isAdvocate) && (
            <div>
              <div className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Parent Tools
              </div>
              <div className="space-y-2">
                {parentTools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant={selectedView === tool.id ? "default" : "ghost"}
                    className="w-full justify-start text-sm h-auto py-2"
                    onClick={() => setSelectedView(tool.id)}
                  >
                    <tool.icon className="w-4 h-4 mr-2" />
                    {tool.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {isAdvocate && (
            <div>
              <div className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Advocate Tools
              </div>
              <div className="space-y-2">
                {advocateTools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant={selectedView === tool.id ? "default" : "ghost"}
                    className="w-full justify-start text-sm h-auto py-2"
                    onClick={() => setSelectedView(tool.id)}
                  >
                    <tool.icon className="w-4 h-4 mr-2" />
                    {tool.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Resources
            </div>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-sm h-auto py-2">
                <BookOpen className="w-4 h-4 mr-2" />
                Knowledge Base
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm h-auto py-2">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex">
          {/* Left Panel - List/CRM */}
          <div className="w-1/2 p-6 overflow-y-auto border-r bg-white">
            {renderLeftPanel()}
          </div>

          {/* Right Panel - Preview/Details */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="preview">Live Preview</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="mt-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Document Preview</h3>
                      <p className="text-gray-500 mb-4">
                        Select a document or goal to view its details and preview
                      </p>
                      <Button onClick={() => setShowFileUpload(true)}>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chat" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">AI Assistant</span>
                        </div>
                        <p className="text-sm text-blue-700">
                          Hello! I'm here to help you with IEP questions, document analysis, and advocacy guidance. 
                          What would you like to know?
                        </p>
                      </div>
                      <Textarea 
                        placeholder="Ask about IEP processes, document analysis, or get advocacy advice..." 
                        className="min-h-[100px]" 
                      />
                      <Button className="w-full">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="mt-4">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Meeting Notes & To-Dos</h3>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Note
                      </Button>
                    </div>
                    <Textarea 
                      placeholder="Add meeting notes, to-dos, or important reminders..."
                      className="min-h-[200px]"
                    />
                    <div className="space-y-2">
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium">Upcoming IEP Meeting</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          December 15, 2024 - Prepare transition goals discussion
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* File Upload Modal */}
      <FileUploadModal 
        open={showFileUpload} 
        onOpenChange={setShowFileUpload}
      />
    </div>
  );
}