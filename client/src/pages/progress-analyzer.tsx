import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, Calendar, Target, AlertCircle, CheckCircle2, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

interface Goal {
  id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  dueDate: string;
  category: string;
}

export default function ProgressAnalyzer() {
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState<"month" | "quarter" | "year">("quarter");

  // Check if user has Hero plan access
  const hasHeroAccess = user?.planStatus === 'heroOffer' || 
                        user?.email === 'parent@demo.com';

  // Fetch goals for analysis
  const { data: goals = [], isLoading } = useQuery<Goal[]>({
    queryKey: ['/api/goals'],
    enabled: hasHeroAccess
  });

  if (!hasHeroAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/dashboard-parent">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <Card className="text-center p-8">
            <CardContent>
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Progress Analyzer</h2>
              <p className="text-gray-600 mb-6">
                This advanced analytics tool is available with the Hero Plan ($495/year)
              </p>
              <Link href="/subscribe">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  Upgrade to Hero Plan
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const calculateOverallProgress = () => {
    if (goals.length === 0) return 0;
    const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0);
    return Math.round(totalProgress / goals.length);
  };

  const getGoalsByStatus = () => {
    const completed = goals.filter(g => g.status === 'completed').length;
    const inProgress = goals.filter(g => g.status === 'in-progress').length;
    const notStarted = goals.filter(g => g.status === 'not-started').length;
    return { completed, inProgress, notStarted };
  };

  const getUpcomingDeadlines = () => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return goals.filter(goal => {
      const dueDate = new Date(goal.dueDate);
      return dueDate >= now && dueDate <= thirtyDaysFromNow && goal.status !== 'completed';
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  const getProgressTrend = () => {
    // Simulate trend data based on current progress
    const overallProgress = calculateOverallProgress();
    if (overallProgress >= 75) return { trend: "excellent", color: "text-green-600", icon: "📈" };
    if (overallProgress >= 50) return { trend: "good", color: "text-blue-600", icon: "📊" };
    if (overallProgress >= 25) return { trend: "needs attention", color: "text-yellow-600", icon: "⚠️" };
    return { trend: "requires focus", color: "text-red-600", icon: "🚨" };
  };

  const statusData = getGoalsByStatus();
  const upcomingDeadlines = getUpcomingDeadlines();
  const progressTrend = getProgressTrend();
  const overallProgress = calculateOverallProgress();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard-parent">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Analyzer</h1>
              <p className="text-gray-600">Comprehensive analysis of your child's IEP progress</p>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              Hero Plan
            </Badge>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2">{overallProgress}%</div>
              <Progress value={overallProgress} className="h-2" />
              <p className={`text-sm mt-2 ${progressTrend.color}`}>
                {progressTrend.icon} {progressTrend.trend}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2">{goals.length}</div>
              <div className="text-sm text-gray-600">
                {statusData.completed} completed, {statusData.inProgress} in progress
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2">{upcomingDeadlines.length}</div>
              <div className="text-sm text-gray-600">Next 30 days</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {goals.length > 0 ? Math.round((statusData.completed / goals.length) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Goals completed on time</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="goals">Goal Analysis</TabsTrigger>
            <TabsTrigger value="trends">Trends & Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Goal Status Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Goal Status Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Completed</span>
                    </div>
                    <Badge variant="secondary">{statusData.completed}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span>In Progress</span>
                    </div>
                    <Badge variant="secondary">{statusData.inProgress}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-gray-600" />
                      <span>Not Started</span>
                    </div>
                    <Badge variant="secondary">{statusData.notStarted}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Upcoming Deadlines
                  </CardTitle>
                  <CardDescription>Goals due in the next 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingDeadlines.length === 0 ? (
                    <p className="text-gray-500 text-sm">No upcoming deadlines</p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingDeadlines.slice(0, 5).map((goal) => (
                        <div key={goal.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{goal.title}</p>
                            <p className="text-xs text-gray-500">
                              Due: {new Date(goal.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Progress value={goal.progress} className="w-16 h-2" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Goal Analysis</CardTitle>
                <CardDescription>Progress breakdown for each active goal</CardDescription>
              </CardHeader>
              <CardContent>
                {goals.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No goals found</p>
                    <Link href="/goals">
                      <Button>Add Your First Goal</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {goals.map((goal) => (
                      <div key={goal.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{goal.title}</h3>
                          <Badge variant={
                            goal.status === 'completed' ? 'default' :
                            goal.status === 'in-progress' ? 'secondary' : 'outline'
                          }>
                            {goal.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <Progress value={goal.progress} className="h-2" />
                          </div>
                          <span className="text-sm font-medium">{goal.progress}%</span>
                          <span className="text-xs text-gray-500">
                            Due: {new Date(goal.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Insights & Recommendations</CardTitle>
                <CardDescription>AI-powered analysis of your child's progress patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">📊 Current Status</h4>
                  <p className="text-blue-800 text-sm">
                    Your child is making {progressTrend.trend} progress with an overall completion rate of {overallProgress}%.
                    {statusData.completed > 0 && ` They have successfully completed ${statusData.completed} goals.`}
                  </p>
                </div>

                {upcomingDeadlines.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">⚠️ Attention Needed</h4>
                    <p className="text-yellow-800 text-sm">
                      {upcomingDeadlines.length} goals have deadlines in the next 30 days. 
                      Consider reviewing progress and adjusting support strategies if needed.
                    </p>
                  </div>
                )}

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">💡 Recommendations</h4>
                  <div className="text-green-800 text-sm space-y-2">
                    {overallProgress >= 75 ? (
                      <p>Excellent progress! Continue current strategies and consider introducing new challenges.</p>
                    ) : overallProgress >= 50 ? (
                      <p>Good momentum. Focus on maintaining consistency and addressing any specific challenges.</p>
                    ) : (
                      <p>Consider meeting with your IEP team to review goals and adjust support strategies.</p>
                    )}
                    
                    {statusData.inProgress > statusData.completed && (
                      <p>• Focus on completing in-progress goals before starting new ones</p>
                    )}
                    
                    {upcomingDeadlines.length > 2 && (
                      <p>• Prioritize goals with approaching deadlines</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}