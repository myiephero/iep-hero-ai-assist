import { Route, Router } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/use-auth.tsx";
import MainLayout from "@/components/layout/main-layout";
import { MobileNavigation } from "@/components/MobileNavigation";

// Import pages
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import DashboardParent from "@/pages/dashboard-parent";
import Goals from "@/pages/goals";
import Documents from "@/pages/documents";
import Messages from "@/pages/messages";
import MeetingPrep from "@/pages/meeting-prep";
import ProgressNotes from "@/pages/progress-notes";
import MyStudents from "@/pages/my-students";
import MyParents from "@/pages/my-parents";
import Subscribe from "@/pages/subscribe";
import Pricing from "@/pages/pricing";
import NotFound from "@/pages/not-found";

// Import available tool pages (simplified for now)
import IEPGoalGenerator from "@/pages/iep-goal-generator";
import AIIEPReview from "@/pages/ai-iep-review";
import AskAIAboutDocs from "@/pages/ask-ai-about-docs";
import AdvocateMatchers from "@/pages/advocate-matcher";
import SmartLetterGenerator from "@/pages/smart-letter-generator";

// Create a single query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50" />
      </div>
    );
  }

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <Router>
          <Route path="/register" component={Register} />
          <Route component={Login} />
        </Router>
        <Toaster />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <Router>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/dashboard-parent" component={DashboardParent} />
          <Route path="/goals" component={Goals} />
          <Route path="/documents" component={Documents} />
          <Route path="/messages" component={Messages} />
          <Route path="/meeting-prep" component={MeetingPrep} />
          <Route path="/progress-notes" component={ProgressNotes} />
          <Route path="/my-students" component={MyStudents} />
          <Route path="/my-parents" component={MyParents} />
          <Route path="/subscribe" component={Subscribe} />
          <Route path="/pricing" component={Pricing} />
          
          {/* Tool Routes */}
          <Route path="/tools/iep-goal-generator" component={IEPGoalGenerator} />
          <Route path="/tools/ai-iep-review" component={AIIEPReview} />
          <Route path="/tools/ask-ai-about-docs" component={AskAIAboutDocs} />
          <Route path="/tools/advocate-matcher" component={AdvocateMatchers} />
          <Route path="/tools/smart-letter-generator" component={SmartLetterGenerator} />
          
          <Route component={NotFound} />
        </Router>
        <MobileNavigation />
      </MainLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;