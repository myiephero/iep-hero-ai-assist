import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthContext, useAuth, useAuthState } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import PremiumDashboard from "@/pages/dashboard-premium";
import Documents from "@/pages/documents";
import Goals from "@/pages/goals";
import Subscribe from "@/pages/subscribe";
import Pricing from "@/pages/pricing";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { MobileNavigation } from "@/components/MobileNavigation";
import { OfflineIndicator } from "@/components/OfflineIndicator";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  console.log('🔍 AuthGuard check:', { user: user?.email, isLoading });

  if (isLoading) {
    console.log('⏳ AuthGuard: Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    console.log('❌ AuthGuard: No user, redirecting to login');
    return <Redirect to="/login" />;
  }

  console.log('✅ AuthGuard: User authenticated, showing content');
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/subscribe">
        <AuthGuard>
          <Subscribe />
        </AuthGuard>
      </Route>
      <Route path="/pricing" component={Pricing} />
      <Route path="/dashboard">
        <AuthGuard>
          <PremiumDashboard />
        </AuthGuard>
      </Route>
      <Route path="/documents">
        <AuthGuard>
          <Documents />
        </AuthGuard>
      </Route>
      <Route path="/goals">
        <AuthGuard>
          <Goals />
        </AuthGuard>
      </Route>
      <Route path="/">
        <Redirect to="/dashboard" />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const authState = useAuthState();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authState}>
        <TooltipProvider>
          <OfflineIndicator />
          <PWAInstallPrompt />
          <Router />
          <MobileNavigation />
          <Toaster />
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
