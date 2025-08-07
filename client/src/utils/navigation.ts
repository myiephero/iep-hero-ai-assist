// Navigation utility functions
import { useAuth } from '@/contexts/AuthContext';

export const useRoleAwareDashboard = () => {
  const { user, getUserRole } = useAuth();
  
  const getDashboardRoute = () => {
    const role = getUserRole();
    return role === 'parent' ? '/dashboard-parent' : '/dashboard-premium';
  };
  
  return { getDashboardRoute };
};

export const getRoleAwareDashboardPath = (role?: string) => {
  return role === 'parent' ? '/dashboard-parent' : '/dashboard-premium';
};