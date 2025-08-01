import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Subscribe from "@/pages/subscribe";
import Success from "@/pages/success";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
// Authentication temporarily disabled to fix infinite loop

function Router() {
  return (
    <Switch>
      {/* Public routes available to everyone */}
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
