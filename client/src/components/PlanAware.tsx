import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Lock, Star } from 'lucide-react';
import { useLocation } from 'wouter';

interface PlanAwareProps {
  children: React.ReactNode;
  requiredPlan?: 'free' | 'heroOffer';
  fallback?: React.ReactNode;
}

export function PlanAware({ children, requiredPlan = 'free', fallback }: PlanAwareProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const userPlan = user?.planStatus || user?.subscriptionTier || 'free';
  const hasAccess = requiredPlan === 'free' || userPlan === 'heroOffer' || userPlan === 'hero';

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card className="bg-slate-800 border-slate-600">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
          <Crown className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-white flex items-center justify-center gap-2">
          <Lock className="h-5 w-5 text-amber-400" />
          Hero Plan Required
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-slate-300">
          This feature requires a Hero Plan subscription to unlock advanced AI-powered tools and professional advocacy support.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button 
            onClick={() => setLocation('/pricing')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Star className="h-4 w-4 mr-2" />
            View Pricing
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setLocation('/subscribe')}
            className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
          >
            Upgrade Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface PlanBadgeProps {
  plan?: string;
  className?: string;
}

export function PlanBadge({ plan, className = "" }: PlanBadgeProps) {
  const planName = plan === 'heroOffer' || plan === 'hero' ? 'Hero Plan' : 'Free Plan';
  const planColor = plan === 'heroOffer' || plan === 'hero' 
    ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
    : 'bg-slate-500';

  return (
    <Badge className={`${planColor} text-white ${className}`}>
      {plan === 'heroOffer' || plan === 'hero' ? (
        <Crown className="h-3 w-3 mr-1" />
      ) : (
        <Star className="h-3 w-3 mr-1" />
      )}
      {planName}
    </Badge>
  );
}

export function usePlanAccess() {
  const { user } = useAuth();
  
  const userPlan = user?.planStatus || user?.subscriptionTier || 'free';
  const isHeroPlan = userPlan === 'heroOffer' || userPlan === 'hero';
  
  const hasAccess = (requiredPlan: 'free' | 'heroOffer') => {
    return requiredPlan === 'free' || isHeroPlan;
  };

  return {
    userPlan,
    isHeroPlan,
    isFree: userPlan === 'free',
    hasAccess
  };
}