import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Target, TrendingUp, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface DashboardMetricsProps {
  className?: string;
}

interface MetricsData {
  activeGoals: number;
  progressRate: number;
  upcomingMeeting: {
    title: string;
    date: string;
    type: string;
  } | null;
  documents: number;
}

export function DashboardMetrics({ className = "" }: DashboardMetricsProps) {
  const { data: metrics, isLoading, error } = useQuery<MetricsData>({
    queryKey: ['/api/dashboard/metrics'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-[#3E4161]/70 border-slate-600">
            <CardContent className="p-4">
              <Skeleton className="h-6 w-20 mb-2 bg-slate-600" />
              <Skeleton className="h-8 w-16 mb-2 bg-slate-600" />
              <Skeleton className="h-4 w-24 bg-slate-600" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <Card className="bg-red-900/30 border-red-600">
          <CardContent className="p-4">
            <p className="text-red-300">Failed to load dashboard metrics</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatUpcomingMeeting = (meeting: any) => {
    if (!meeting) return "No upcoming meetings";
    
    try {
      const meetingDate = new Date(meeting.date);
      return format(meetingDate, 'MMM d, yyyy');
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {/* Active Goals */}
      <Card className="bg-[#3E4161]/70 border-slate-600 hover:bg-[#3E4161]/90 transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Target className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Active Goals</p>
              <p className="text-2xl font-bold text-white">{metrics?.activeGoals || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Rate */}
      <Card className="bg-[#3E4161]/70 border-slate-600 hover:bg-[#3E4161]/90 transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Progress Rate</p>
              <p className="text-2xl font-bold text-white">{metrics?.progressRate || 0}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Meeting */}
      <Card className="bg-[#3E4161]/70 border-slate-600 hover:bg-[#3E4161]/90 transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-400">Next Meeting</p>
              <p className="text-sm font-semibold text-white truncate">
                {metrics?.upcomingMeeting?.title || "No upcoming meetings"}
              </p>
              <p className="text-xs text-slate-500">
                {formatUpcomingMeeting(metrics?.upcomingMeeting)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Count */}
      <Card className="bg-[#3E4161]/70 border-slate-600 hover:bg-[#3E4161]/90 transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <FileText className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Documents</p>
              <p className="text-2xl font-bold text-white">{metrics?.documents || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}