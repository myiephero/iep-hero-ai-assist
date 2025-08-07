import { Home, FileText, Target, User, MessageCircle, Star } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAwareDashboard } from '@/utils/navigation';

const navigationItems = [
  {
    name: 'Dashboard',
    href: 'DYNAMIC_DASHBOARD',
    icon: Home,
    description: 'Overview and goals'
  },
  {
    name: 'Memory Q&A',
    href: 'DYNAMIC_DASHBOARD#memory-qa',
    icon: MessageCircle,
    description: 'Ask questions'
  },
  {
    name: 'Documents',
    href: '/documents',
    icon: FileText,
    description: 'IEP files'
  },
  {
    name: 'Goals',
    href: '/goals',
    icon: Target,
    description: 'Track progress'
  },
  {
    name: 'Plans',
    href: '/pricing',
    icon: Star,
    description: 'Upgrade plan'
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
    description: 'Account settings'
  }
];

export function MobileNavigation() {
  const [location] = useLocation();
  const { isMobile } = useMobile();
  const { getDashboardRoute } = useRoleAwareDashboard();

  if (!isMobile) return null;

  // Create dynamic navigation items with role-aware dashboard routes
  const dynamicNavItems = navigationItems.map(item => ({
    ...item,
    href: item.href === 'DYNAMIC_DASHBOARD' ? getDashboardRoute() : 
          item.href === 'DYNAMIC_DASHBOARD#memory-qa' ? `${getDashboardRoute()}#memory-qa` : 
          item.href
  }));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border">
      <div className="flex justify-around items-center px-2 py-1">
        {dynamicNavItems.map((item) => {
          const isActive = location === item.href || 
            (item.href.includes('#') && location === item.href.split('#')[0]);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-0 flex-1",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate max-w-full">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}