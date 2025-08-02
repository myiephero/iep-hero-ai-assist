import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Clock } from "lucide-react";
import type { Goal } from "@shared/schema";

interface GoalProgressChartProps {
  goals: Goal[];
}

export default function GoalProgressChart({ goals }: GoalProgressChartProps) {
  // Calculate overall statistics
  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => goal.status === "Completed").length;
  const inProgressGoals = goals.filter(goal => goal.status === "In Progress").length;
  const notStartedGoals = goals.filter(goal => goal.status === "Not Started").length;
  
  const overallProgress = totalGoals > 0 
    ? Math.round(goals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / totalGoals)
    : 0;

  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  // Sort goals by progress for visual hierarchy
  const sortedGoals = [...goals].sort((a, b) => (b.progress || 0) - (a.progress || 0));

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Not Started": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{overallProgress}%</div>
            <div className="relative">
              <Progress 
                value={overallProgress} 
                className="h-3 transition-all duration-1000 ease-out"
              />
              <div 
                className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000 ease-out"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Average across {totalGoals} goals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{completionRate}%</div>
            <Progress 
              value={completionRate} 
              className="h-3 transition-all duration-1000 ease-out"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {completedGoals} of {totalGoals} goals completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{inProgressGoals}</div>
            <div className="flex gap-2 text-xs">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {inProgressGoals} In Progress
              </span>
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                {notStartedGoals} Not Started
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Goal Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Goal Progress Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedGoals.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No goals to display</p>
              </div>
            ) : (
              sortedGoals.map((goal, index) => (
                <div 
                  key={goal.id} 
                  className="p-4 border rounded-lg hover:shadow-md transition-all duration-300"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards"
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {goal.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {goal.description}
                      </p>
                      {goal.studentId && (
                        <p className="text-xs text-gray-500 mt-1">
                          Student: {goal.studentId}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge className={getStatusColor(goal.status)}>
                        {goal.status}
                      </Badge>
                      <span className="text-sm font-medium">
                        {goal.progress || 0}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={goal.progress || 0} 
                        className="h-2 transition-all duration-1000 ease-out"
                      />
                      <div 
                        className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-1000 ease-out ${getProgressColor(goal.progress || 0)}`}
                        style={{ 
                          width: `${goal.progress || 0}%`,
                          animationDelay: `${index * 200}ms`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}