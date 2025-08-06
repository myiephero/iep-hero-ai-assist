import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import StatsCards from "@/components/dashboard/stats-cards";
import GoalsSection from "@/components/dashboard/goals-section";
import UpcomingEvents from "@/components/dashboard/upcoming-events";
import RecentMessages from "@/components/dashboard/recent-messages";
import QuickActions from "@/components/dashboard/quick-actions";
import FileUploadModal from "@/components/modals/file-upload-modal";
import SubscriptionModal from "@/components/modals/subscription-modal";
import MemoryQA from "@/components/MemoryQA";
import { MobileMemoryQA } from "@/components/MobileMemoryQA";
import { MobileLayout } from "@/components/MobileLayout";
import { PlanStatusBadge, PlanStatusCard } from "@/components/PlanStatusBadge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMobile } from "@/hooks/use-mobile";

export default function Dashboard() {
  const { user } = useAuth();
  const { isMobile } = useMobile();
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);

  // Fetch dashboard data
  const { data: goals = [], isLoading: goalsLoading } = useQuery<any[]>({
    queryKey: ["/api/goals"],
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/events"],
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/messages"],
  });

  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/documents"],
  });

  // Calculate stats
  const stats = {
    activeGoals: goals.filter((goal: any) => goal.status === "In Progress" || goal.status === "Not Started").length,
    progressRate: goals.length > 0 
      ? Math.round(goals.reduce((acc: number, goal: any) => acc + (goal.progress || 0), 0) / goals.length)
      : 0,
    upcomingMeetings: Array.isArray(events) ? events.filter((event: any) => 
      new Date(event.date) > new Date() && event.type === "meeting"
    ).length : 0,
    documents: Array.isArray(documents) ? documents.length : 0,
  };

  const handleUploadDocument = () => {
    setShowFileUpload(true);
  };

  const handleScheduleMeeting = () => {
    // TODO: Implement meeting scheduling
    console.log("Schedule meeting clicked");
  };

  const handleGenerateReport = () => {
    // TODO: Implement report generation
    console.log("Generate report clicked");
  };

  if (goalsLoading || eventsLoading || messagesLoading || documentsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">

        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <MobileLayout className="min-h-screen bg-gray-50">

      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Welcome back, {user?.username}!
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                      Here's an overview of your child's IEP progress and upcoming activities.
                    </p>
                  </div>
                  <Button onClick={() => setShowSubscription(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Goal
                  </Button>
                </div>
                
                {/* Plan Status Display */}
                <div className="pt-4 border-t border-gray-200">
                  <PlanStatusBadge 
                    planStatus={user?.planStatus || "free"} 
                    role={user?.role}
                    onUpgrade={() => setShowSubscription(true)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="px-4 sm:px-0">
          <StatsCards stats={stats} />
        </div>

        {/* Main Content Grid */}
        <div className="px-4 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Goals Section */}
            <div className="lg:col-span-2">
              <GoalsSection goals={goals} />
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              {isMobile ? (
                <MobileMemoryQA />
              ) : (
                <MemoryQA userId={user?.id || ""} />
              )}
              <UpcomingEvents events={Array.isArray(events) ? events : []} />
              <RecentMessages messages={Array.isArray(messages) ? messages : []} />
              <QuickActions
                onUploadDocument={handleUploadDocument}
                onScheduleMeeting={handleScheduleMeeting}
                onGenerateReport={handleGenerateReport}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <FileUploadModal 
        open={showFileUpload} 
        onOpenChange={setShowFileUpload}
      />
      <SubscriptionModal 
        open={showSubscription} 
        onOpenChange={setShowSubscription}
      />
    </MobileLayout>
  );
}
