import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Goal } from "@shared/schema";

interface GoalsSectionProps {
  goals: Goal[];
}

export default function GoalsSection({ goals }: GoalsSectionProps) {
  const getStatusColor = (progress: number) => {
    if (progress >= 80) return "status-exceeding";
    if (progress >= 60) return "status-on-track";
    return "status-needs-focus";
  };

  const getStatusText = (progress: number) => {
    if (progress >= 80) return "Exceeding";
    if (progress >= 60) return "On Track";
    return "Needs Focus";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Current IEP Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No goals found</p>
              <Button>Add Your First Goal</Button>
            </div>
          ) : (
            goals.map((goal) => (
              <div key={goal.id} className="goal-card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {goal.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {goal.description}
                    </p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <Badge className={`status-badge ${getStatusColor(goal.progress || 0)}`}>
                      {getStatusText(goal.progress || 0)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {goals.length > 0 && (
          <div className="mt-6">
            <Button className="w-full">View All Goals</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
