import { Route, Router } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import pages
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import DashboardParent from "@/pages/dashboard-parent";
import Goals from "@/pages/goals";
import Messages from "@/pages/messages";
import Documents from "@/pages/documents";
import MeetingPrep from "@/pages/meeting-prep";
import ProgressNotes from "@/pages/progress-notes";
import NotFound from "@/pages/not-found";

// Create query client
const queryClient = new QueryClient();

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <Login />
        <Toaster />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/dashboard-parent" component={DashboardParent} />
        <Route path="/goals" component={Goals} />
        <Route path="/messages" component={Messages} />
        <Route path="/documents" component={Documents} />
        <Route path="/meeting-prep" component={MeetingPrep} />
        <Route path="/progress-notes" component={ProgressNotes} />
        <Route component={NotFound} />
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;