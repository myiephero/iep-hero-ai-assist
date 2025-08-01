import { Card, CardContent } from "@/components/ui/card";
import { Target, TrendingUp, Calendar, FileText } from "lucide-react";

interface StatsData {
  activeGoals: number;
  progressRate: number;
  upcomingMeetings: number;
  documents: number;
}

interface StatsCardsProps {
  stats: StatsData;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Active Goals",
      value: stats.activeGoals,
      icon: Target,
      color: "text-primary",
    },
    {
      title: "Progress Rate",
      value: `${stats.progressRate}%`,
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Upcoming Meetings",
      value: stats.upcomingMeetings,
      icon: Calendar,
      color: "text-orange-600",
    },
    {
      title: "Documents",
      value: stats.documents,
      icon: FileText,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className="stats-card">
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {card.title}
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {card.value}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
