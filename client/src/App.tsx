import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import DashboardAdvocate from "@/pages/dashboard-premium";
import DashboardParent from "@/pages/dashboard-parent";
import Documents from "@/pages/documents";
import Goals from "@/pages/goals";
import IEPGoalGeneratorPage from "@/pages/iep-goal-generator";
import AIIEPReviewPage from "@/pages/ai-iep-review";
import AskAiAboutDocs from "@/pages/ask-ai-about-docs";
import GoalGenerator from "@/pages/goal-generator";
import SimpleAdvocateMatcherForm from "@/pages/simple-advocate-matcher";
import Messages from "@/pages/messages";
import ProgressAnalyzer from "@/pages/progress-analyzer";
import MeetingPrep from "@/pages/meeting-prep";
import SmartLetterGenerator from "@/pages/smart-letter-generator";
import ProgressNotes from "@/pages/progress-notes";
import CommunicationPlan from "@/pages/communication-plan";
import RightsExplainer from "@/pages/rights-explainer";
import MeetingPrepWizard from "@/pages/meeting-prep-wizard";
import SmartLetterGeneratorTool from "@/pages/tools/smart-letter-generator";
import ProgressAnalyzerTool from "@/pages/tools/progress-analyzer";
import MeetingPrepWizardTool from "@/pages/tools/meeting-prep-wizard";
import ProgressNotesLogger from "@/pages/progress-notes-logger";
import CommunicationTracker from "@/pages/communication-tracker";
import AdvocateMatcher from "@/pages/advocate-matcher";
import AdvocacyReportGenerator from "@/pages/advocacy-report-generator";
import Subscribe from "@/pages/subscribe";
import Pricing from "@/pages/pricing";
import Chat from "@/pages/chat";
import MyStudents from "@/pages/my-students";
import MyParents from "@/pages/my-parents";
import AdvocateStudents from "@/pages/advocate-students";
import SharedDocumentPage from "@/pages/shared-document";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { MobileNavigation } from "@/components/MobileNavigation";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import Navbar from "@/components/layout/navbar";

// Simplified AuthGuard - kept for backward compatibility
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}

function DashboardRouter() {
  const { getUserRole } = useAuth();
  const userRole = getUserRole();
  
  console.log('🔄 Dashboard Router - User role:', userRole);
  
  if (userRole === 'parent') {
    console.log('👨‍👩‍👧‍👦 Routing parent to parent dashboard');
    return <Redirect to="/dashboard-parent" />;
  } else if (userRole === 'advocate' || userRole === 'professional') {
    console.log('👩‍💼 Routing advocate/professional to premium dashboard');
    return <Redirect to="/dashboard-premium" />;
  } else {
    console.log('❓ Unknown role, defaulting to premium dashboard');
    return <Redirect to="/dashboard-premium" />;
  }
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/subscribe">
        <AuthGuard>
          <Navbar />
          <Subscribe />
        </AuthGuard>
      </Route>
      <Route path="/pricing" component={Pricing} />
      <Route path="/dashboard">
        <AuthGuard>
          <DashboardRouter />
        </AuthGuard>
      </Route>
      <Route path="/dashboard-parent">
        <AuthGuard>
          <Navbar />
          <DashboardParent />
        </AuthGuard>
      </Route>
      <Route path="/dashboard-advocate">
        <AuthGuard>
          <Navbar />
          <Redirect to="/dashboard-premium" />
        </AuthGuard>
      </Route>
      <Route path="/dashboard-premium">
        <AuthGuard>
          <Navbar />
          <DashboardAdvocate />
        </AuthGuard>
      </Route>
      <Route path="/documents">
        <AuthGuard>
          <Navbar />
          <Documents />
        </AuthGuard>
      </Route>
      <Route path="/goals">
        <AuthGuard>
          <Navbar />
          <Goals />
        </AuthGuard>
      </Route>
      <Route path="/tools/iep-goal-generator">
        <AuthGuard>
          <IEPGoalGeneratorPage />
        </AuthGuard>
      </Route>
      <Route path="/goal-generator">
        <AuthGuard>
          <GoalGenerator />
        </AuthGuard>
      </Route>
      <Route path="/tools/goals">
        <AuthGuard>
          <GoalGenerator />
        </AuthGuard>
      </Route>
      <Route path="/simple-advocate-matcher">
        <AuthGuard>
          <SimpleAdvocateMatcherForm />
        </AuthGuard>
      </Route>
      <Route path="/matcher">
        <AuthGuard>
          <SimpleAdvocateMatcherForm />
        </AuthGuard>
      </Route>
      <Route path="/messages">
        <AuthGuard>
          <Messages />
        </AuthGuard>
      </Route>
      <Route path="/tools/ai-iep-review">
        <AuthGuard>
          <AIIEPReviewPage />
        </AuthGuard>
      </Route>
      <Route path="/tools/ask-ai-docs">
        <AuthGuard>
          <AskAiAboutDocs />
        </AuthGuard>
      </Route>
      <Route path="/tools/progress-analyzer">
        <AuthGuard>
          <ProgressAnalyzerTool />
        </AuthGuard>
      </Route>
      <Route path="/tools/meeting-prep">
        <AuthGuard>
          <MeetingPrep />
        </AuthGuard>
      </Route>
      <Route path="/smart-letter-generator">
        <AuthGuard>
          <Navbar />
          <SmartLetterGenerator />
        </AuthGuard>
      </Route>
      <Route path="/tools/smart-letter-generator">
        <AuthGuard>
          <SmartLetterGeneratorTool />
        </AuthGuard>
      </Route>
      <Route path="/tools/meeting-prep-wizard">
        <AuthGuard>
          <MeetingPrepWizardTool />
        </AuthGuard>
      </Route>
      <Route path="/tools/progress-notes">
        <AuthGuard>
          <ProgressNotes />
        </AuthGuard>
      </Route>
      <Route path="/tools/communication-plan">
        <AuthGuard>
          <CommunicationPlan />
        </AuthGuard>
      </Route>
      <Route path="/tools/rights-explainer">
        <AuthGuard>
          <RightsExplainer />
        </AuthGuard>
      </Route>

      <Route path="/tools/progress-notes-logger">
        <AuthGuard>
          <ProgressNotesLogger />
        </AuthGuard>
      </Route>
      <Route path="/tools/communication-tracker">
        <AuthGuard>
          <CommunicationTracker />
        </AuthGuard>
      </Route>
      <Route path="/tools/advocate-matcher">
        <AuthGuard>
          <AdvocateMatcher />
        </AuthGuard>
      </Route>
      <Route path="/tools/goal-generator">
        <AuthGuard>
          <GoalGenerator />
        </AuthGuard>
      </Route>
      <Route path="/tools/ai-document-review">
        <AuthGuard>
          <AIIEPReviewPage />
        </AuthGuard>
      </Route>
      <Route path="/tools/advocacy-report-generator">
        <AuthGuard>
          <AdvocacyReportGenerator />
        </AuthGuard>
      </Route>
      
      <Route path="/advocacy-report-generator">
        <AuthGuard>
          <AdvocacyReportGenerator />
        </AuthGuard>
      </Route>
      <Route path="/chat">
        <AuthGuard>
          <Chat />
        </AuthGuard>
      </Route>
      <Route path="/my-students">
        <AuthGuard>
          <Navbar />
          <MyStudents />
        </AuthGuard>
      </Route>
      <Route path="/my-parents">
        <AuthGuard>
          <Navbar />
          <MyParents />
        </AuthGuard>
      </Route>
      <Route path="/advocate-students">
        <AuthGuard>
          <Navbar />
          <AdvocateStudents />
        </AuthGuard>
      </Route>
      {/* Public route for shared documents */}
      <Route path="/shared/:token">
        <SharedDocumentPage />
      </Route>
      
      <Route path="/">
        <Redirect to="/dashboard" />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <OfflineIndicator />
          <PWAInstallPrompt />
          <Router />
          <MobileNavigation />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
