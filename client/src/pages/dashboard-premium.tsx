import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Crown, 
  Target, 
  TrendingUp, 
  Calendar, 
  FileText, 
  MessageSquare,
  Plus,
  Star,
  Users,
  BookOpen,
  Brain,
  Sparkles,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  Share2,
  Download,
  Bell
} from "lucide-react";
import { PlanStatusBadge } from "@/components/PlanStatusBadge";
import Navbar from "@/components/layout/navbar";
import MemoryQA from "@/components/MemoryQA";
import { IEPTools } from "@/components/IEPTools";

export default function PremiumDashboard() {
  const { user } = useAuth();
  const { isMobile } = useMobile();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch dashboard data
  const { data: goals = [], isLoading: goalsLoading } = useQuery<any[]>({
    queryKey: ["/api/goals"],
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/events"],
  });

  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/documents"],
  });

  // Hero Plan Features Check
  const isHeroPlan = user?.planStatus === 'heroOffer' || user?.subscriptionTier === 'heroOffer';
  
  // Debug logging for plan status
  console.log('🔍 Dashboard Debug:', {
    user,
    userPlanStatus: user?.planStatus,
    userSubscriptionTier: user?.subscriptionTier,
    isHeroPlan,
    userObject: JSON.stringify(user, null, 2)
  });

  const stats = {
    activeGoals: goals.filter((goal: any) => goal.status === "In Progress" || goal.status === "Not Started").length,
    completedGoals: goals.filter((goal: any) => goal.status === "Completed").length,
    progressRate: goals.length > 0 
      ? Math.round(goals.reduce((acc: number, goal: any) => acc + (goal.progress || 0), 0) / goals.length)
      : 0,
    upcomingMeetings: Array.isArray(events) ? (events as any[]).filter((event: any) => 
      new Date(event.date) > new Date() && event.type === "meeting"
    ).length : 0,
    documents: Array.isArray(documents) ? (documents as any[]).length : 0,
  };

  if (goalsLoading || eventsLoading || documentsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Navbar />
      
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Hero Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  Welcome back, {user?.username}!
                </h1>
                {isHeroPlan && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                    <Crown className="w-4 h-4 text-white" />
                    <span className="text-white font-semibold text-sm">HERO</span>
                  </div>
                )}
              </div>
              <p className="text-blue-200 text-lg">
                {isHeroPlan 
                  ? "Your premium IEP management suite with AI-powered insights"
                  : "Manage your child's IEP progress and goals"
                }
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <PlanStatusBadge planStatus={'heroOffer'} />
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Active Goals</p>
                  <p className="text-3xl font-bold">{stats.activeGoals}</p>
                </div>
                <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm font-medium">Progress Rate</p>
                  <p className="text-3xl font-bold">{stats.progressRate}%</p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm font-medium">Meetings</p>
                  <p className="text-3xl font-bold">{stats.upcomingMeetings}</p>
                </div>
                <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-200 text-sm font-medium">Documents</p>
                  <p className="text-3xl font-bold">{stats.documents}</p>
                </div>
                <div className="h-12 w-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* IEP AI Tools Section - Always show for demo, check Hero status */}
        <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border-purple-400/30 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" />
              AI-Powered IEP Tools
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                HERO EXCLUSIVE
              </Badge>
            </CardTitle>
            <p className="text-purple-200">Professional IEP management tools powered by artificial intelligence</p>
          </CardHeader>
          <CardContent>
            <IEPTools isHeroPlan={true} userId={user?.id || ''} />
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Goals & Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current IEP Goals */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    Current IEP Goals
                  </CardTitle>
                  <Button variant="ghost" className="text-blue-400 hover:text-blue-300">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Goal
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {goals.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">No goals yet</h3>
                    <p className="text-blue-200 mb-4">Start by adding your first IEP goal</p>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      Add Your First Goal
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {goals.slice(0, 3).map((goal: any, index: number) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-white font-medium">{goal.title || `Goal ${index + 1}`}</h4>
                          <Badge variant="outline" className="text-blue-400 border-blue-400">
                            {goal.status || 'In Progress'}
                          </Badge>
                        </div>
                        <p className="text-blue-200 text-sm mb-3">{goal.description || 'No description available'}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 bg-white/10 rounded-full h-2 mr-3">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${goal.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-white text-sm font-medium">{goal.progress || 0}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions for Hero Plan */}
            {isHeroPlan && (
              <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg border-yellow-400/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    Hero Plan Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button variant="ghost" className="h-auto p-4 text-left justify-start bg-white/10 hover:bg-white/20">
                      <div className="flex items-center gap-3">
                        <Brain className="w-6 h-6 text-yellow-400" />
                        <div>
                          <p className="text-white font-medium">AI Memory Q&A</p>
                          <p className="text-yellow-200 text-xs">Ask questions about your IEP</p>
                        </div>
                      </div>
                    </Button>
                    
                    <Button variant="ghost" className="h-auto p-4 text-left justify-start bg-white/10 hover:bg-white/20">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="w-6 h-6 text-yellow-400" />
                        <div>
                          <p className="text-white font-medium">Advanced Analytics</p>
                          <p className="text-yellow-200 text-xs">Detailed progress reports</p>
                        </div>
                      </div>
                    </Button>
                    
                    <Button variant="ghost" className="h-auto p-4 text-left justify-start bg-white/10 hover:bg-white/20">
                      <div className="flex items-center gap-3">
                        <Share2 className="w-6 h-6 text-yellow-400" />
                        <div>
                          <p className="text-white font-medium">Advocate Sharing</p>
                          <p className="text-yellow-200 text-xs">Share insights with advocates</p>
                        </div>
                      </div>
                    </Button>
                    
                    <Button variant="ghost" className="h-auto p-4 text-left justify-start bg-white/10 hover:bg-white/20">
                      <div className="flex items-center gap-3">
                        <Download className="w-6 h-6 text-yellow-400" />
                        <div>
                          <p className="text-white font-medium">Generate Reports</p>
                          <p className="text-yellow-200 text-xs">Professional IEP reports</p>
                        </div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - AI Q&A and Activities */}
          <div className="space-y-6">
            {/* AI Memory Q&A */}
            {isHeroPlan ? (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    Ask About Your IEP
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                      HERO
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MemoryQA userId={user?.id || ''} />
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-gray-400" />
                    AI Memory Q&A
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Hero Plan Feature</h3>
                  <p className="text-blue-200 text-sm mb-4">
                    Ask AI questions about your IEP documents and get instant insights
                  </p>
                  <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white">
                    Upgrade to Hero
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Upcoming Events */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-400" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!Array.isArray(events) || events.length === 0 ? (
                  <div className="text-center py-6">
                    <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-blue-200 text-sm">No upcoming events</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(events as any[]).slice(0, 3).map((event: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{event.title || `Event ${index + 1}`}</p>
                          <p className="text-blue-200 text-xs">{event.date || 'Date TBD'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Documents */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-400" />
                  Recent Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!Array.isArray(documents) || documents.length === 0 ? (
                  <div className="text-center py-6">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-blue-200 text-sm">No documents yet</p>
                    <Button variant="ghost" className="text-blue-400 hover:text-blue-300 mt-2" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Upload Document
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(documents as any[]).slice(0, 3).map((doc: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors">
                        <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{doc.name || `Document ${index + 1}`}</p>
                          <p className="text-blue-200 text-xs">{doc.date || 'Recently uploaded'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}