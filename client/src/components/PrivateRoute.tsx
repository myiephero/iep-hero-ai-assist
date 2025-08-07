import { ReactNode } from 'react';
import { Redirect } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
  roles?: string[];
  redirectTo?: string;
}

export function PrivateRoute({ 
  children, 
  roles = [], 
  redirectTo = '/login' 
}: PrivateRouteProps) {
  const { user, loading, getUserRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to={redirectTo} />;
  }

  const userRole = getUserRole();
  
  if (roles.length > 0 && !roles.includes(userRole)) {
    // Redirect based on user role
    if (userRole === 'parent') {
      return <Redirect to="/dashboard-parent" />;
    } else if (userRole === 'advocate' || userRole === 'professional') {
      return <Redirect to="/dashboard-premium" />;
    }
    return <Redirect to="/dashboard" />;
  }

  return <>{children}</>;
}

// Convenience wrapper for role-specific routes
export function ParentRoute({ children }: { children: ReactNode }) {
  return <PrivateRoute roles={['parent']}>{children}</PrivateRoute>;
}

export function AdvocateRoute({ children }: { children: ReactNode }) {
  return <PrivateRoute roles={['advocate', 'professional']}>{children}</PrivateRoute>;
}

export function AnyUserRoute({ children }: { children: ReactNode }) {
  return <PrivateRoute>{children}</PrivateRoute>;
}