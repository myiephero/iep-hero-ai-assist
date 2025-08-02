import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import NotFound from "./pages/not-found";
import Landing from "./pages/landing";
import Dashboard from "./pages/dashboard";
import Settings from "./pages/settings";
import LetterGenerator from "./pages/letter-generator";
import MeetingPrep from "./pages/meeting-prep";
import Documents from "./pages/documents";
import ProgressPage from "./pages/progress";
import Rights from "./pages/rights";
import Scheduling from "./pages/scheduling";
import Messages from "./pages/messages";
import Home from "./pages/home";
import Subscribe from "./pages/subscribe";
import Success from "./pages/success";
import Terms from "./pages/terms";
import Privacy from "./pages/privacy";
// Authentication temporarily disabled to fix infinite loop

function Router() {
  return (
    <Switch>
      {/* Public routes available to everyone */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/settings" component={Settings} />
      <Route path="/letter-generator" component={LetterGenerator} />
      <Route path="/meeting-prep" component={MeetingPrep} />
      <Route path="/documents" component={Documents} />
      <Route path="/progress" component={ProgressPage} />
      <Route path="/rights" component={Rights} />
      <Route path="/scheduling" component={Scheduling} />
      <Route path="/messages" component={Messages} />
      <Route path="/subscribe" component={Subscribe} />
      <Route path="/success" component={Success} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      
      {/* Default route - show landing page for now */}
      <Route path="/" component={Landing} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
