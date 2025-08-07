import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Check, Crown, User, Zap, Star, ArrowRight, Shield, ArrowLeft } from 'lucide-react';
import { useRoleAwareDashboard } from '@/utils/navigation';
import { Link } from 'wouter';

interface PricingPlan {
  name: string;
  price: { monthly: number; annual: number };
  description: string;
  icon: React.ReactElement;
  color: string;
  buttonText: string;
  features: string[];
  popular?: boolean;
  oneTime?: boolean;
}

export default function Pricing() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { getDashboardRoute } = useRoleAwareDashboard();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // Parent-specific pricing plans
  const parentPlans: PricingPlan[] = [
    {
      name: 'Free Plan',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for getting started with basic IEP management',
      icon: <User className="h-6 w-6" />,
      color: 'border-slate-600',
      buttonText: 'Current Plan',
      features: [
        'Access to IEP education hub',
        'Downloadable template letters',
        'Advocacy articles & tips'
      ]
    },
    {
      name: 'Basic Plan',
      price: { monthly: 19, annual: 190 },
      description: 'Everything in Free, plus enhanced document management',
      icon: <User className="h-6 w-6" />,
      color: 'border-blue-500',
      buttonText: 'Upgrade to Basic',
      features: [
        'Everything in Free, plus:',
        'Document intake vault',
        'Personalized IEP checklist',
        'Pre-built letter builder (for common requests)',
        'Parent-to-parent community'
      ]
    },
    {
      name: 'Plus Plan',
      price: { monthly: 29, annual: 290 },
      description: 'Advanced tracking and self-serve IEP tools',
      icon: <Zap className="h-6 w-6" />,
      color: 'border-green-500',
      buttonText: 'Upgrade to Plus',
      features: [
        'Everything in Basic, plus:',
        'Progress tracking dashboard',
        'Calendar & reminders for IEP goals',
        'Self-serve IEP builder with smart forms',
        'Upload & annotate school documents'
      ]
    },
    {
      name: 'Premium Plan',
      price: { monthly: 49, annual: 490 },
      description: 'Live advocate support and AI-powered reviews',
      icon: <Crown className="h-6 w-6 text-yellow-400" />,
      color: 'border-purple-500',
      popular: true,
      buttonText: user?.planStatus === 'heroOffer' ? 'Current Plan' : 'Upgrade to Premium',
      features: [
        'Everything in Plus, plus:',
        'Live advocate chat access',
        'AI-powered IEP review (1 per month)',
        'Discounts on 1:1 strategy calls',
        'Priority support'
      ]
    },
    {
      name: 'Hero Pack',
      price: { monthly: 495, annual: 495 },
      oneTime: true,
      description: 'Comprehensive advocacy support package',
      icon: <Shield className="h-6 w-6 text-gold-400" />,
      color: 'border-gold-500',
      buttonText: 'Get Hero Pack',
      features: [
        '1:1 IEP strategy session (Zoom)',
        'Full document review + prep',
        'Advocate present for 1 IEP meeting',
        '30-day Premium access included',
        'Customized follow-up action plan'
      ]
    }
  ];

  // Advocate-specific pricing plans
  const advocatePlans: PricingPlan[] = [
    {
      name: 'Starter Plan',
      price: { monthly: 49, annual: 490 },
      description: 'Essential tools for solo advocates',
      icon: <User className="h-6 w-6" />,
      color: 'border-blue-500',
      buttonText: 'Start with Starter',
      features: [
        'Advocate CRM (clients, case notes)',
        'Automated IEP letter builder',
        'Template library + smart forms',
        '1 seat'
      ]
    },
    {
      name: 'Pro Plan',
      price: { monthly: 75, annual: 750 },
      description: 'Advanced practice management tools',
      icon: <Zap className="h-6 w-6" />,
      color: 'border-green-500',
      popular: true,
      buttonText: 'Upgrade to Pro',
      features: [
        'Everything in Starter, plus:',
        'Scheduling calendar with parent bookings',
        'Intake forms + onboarding flows',
        'Document request tracking',
        '1 seat'
      ]
    },
    {
      name: 'Agency Plan',
      price: { monthly: 149, annual: 1490 },
      description: 'Team collaboration and client management',
      icon: <Crown className="h-6 w-6 text-yellow-400" />,
      color: 'border-purple-500',
      buttonText: 'Scale with Agency',
      features: [
        'Everything in Pro, plus:',
        '2 seats included (advocate + admin)',
        'Shared client access for teams',
        'Invoicing + billing dashboard',
        'Advocate permissions management'
      ]
    },
    {
      name: 'Agency+ Plan',
      price: { monthly: 249, annual: 2490 },
      description: 'Enterprise features and AI credits',
      icon: <Shield className="h-6 w-6 text-gold-400" />,
      color: 'border-gold-500',
      buttonText: 'Go Enterprise',
      features: [
        'Everything in Agency, plus:',
        '5 seats included',
        'AI credits included (10/mo)',
        'Onboarding training portal',
        'Priority support line',
        'Access to future compliance tools'
      ]
    }
  ];

  const plans = user?.role === 'advocate' ? advocatePlans : parentPlans;

  const handleUpgrade = (planName: string) => {
    if (planName === 'Hero Plan') {
      if (user?.planStatus === 'heroOffer') {
        return; // Already on Hero Plan
      }
      setLocation('/subscribe');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Prominent Navigation Bar */}
      <div className="bg-slate-800 border-b border-slate-700 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href={getDashboardRoute()}>
            <Button 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Return to Dashboard
            </Button>
          </Link>
          <div className="text-white font-semibold">
            My IEP Hero - Pricing Plans
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your IEP Hero Plan
          </h1>
          <p className="text-xl text-slate-400 mb-4">
            {user?.role === 'advocate' 
              ? 'Professional tools for advocacy practice management' 
              : "Empower your child's educational journey with the right tools"}
          </p>
          <p className="text-sm text-slate-500 mb-8">
            Showing {user?.role === 'advocate' ? 'Advocate & Agency' : 'Parent'} subscription tiers
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white font-semibold' : 'text-slate-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className={`relative w-14 h-8 rounded-full transition-colors ${billingCycle === 'annual' ? 'bg-purple-600' : 'bg-slate-600'}`}
            >
              <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm ${billingCycle === 'annual' ? 'text-white font-semibold' : 'text-slate-400'}`}>
              Annual
            </span>
            {billingCycle === 'annual' && (
              <Badge className="bg-green-600 text-white ml-2">
                Save 20%
              </Badge>
            )}
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative bg-slate-800 ${plan.color} ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-2">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                <div className="text-4xl font-bold text-white mb-2">
                  ${plan.price[billingCycle]}
                  <span className="text-lg text-slate-400 font-normal">
                    {plan.price[billingCycle] > 0 ? (
                      plan.oneTime ? ' one-time' : (billingCycle === 'monthly' ? '/month' : '/year')
                    ) : ''}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    What's Included
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>



                {/* Action Button */}
                <Button
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={
                    (user?.planStatus === 'heroOffer' && (plan.name === 'Hero Plan' || plan.name === 'Premium Plan')) ||
                    (user?.planStatus === 'free' && plan.name === 'Free Plan')
                  }
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                      : (user?.planStatus === 'heroOffer' && (plan.name === 'Hero Plan' || plan.name === 'Premium Plan')) ||
                        (user?.planStatus === 'free' && plan.name === 'Free Plan')
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  {(user?.planStatus === 'heroOffer' && (plan.name === 'Hero Plan' || plan.name === 'Premium Plan')) ? (
                    <>
                      <Crown className="h-4 w-4 mr-2" />
                      Current Plan
                    </>
                  ) : user?.planStatus === 'free' && plan.name === 'Free Plan' ? (
                    'Current Plan'
                  ) : plan.name === 'Hero Plan' || plan.name === 'Premium Plan' ? (
                    <>
                      {plan.buttonText}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    plan.buttonText
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Why Choose Hero Plan?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">AI-Powered Tools</h3>
                <p className="text-slate-400 text-sm">
                  Advanced AI analysis, smart letter generation, and personalized accommodation suggestions
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">Expert Support</h3>
                <p className="text-slate-400 text-sm">
                  Professional advocate matching and priority support for complex IEP situations
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <Star className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">Complete Solution</h3>
                <p className="text-slate-400 text-sm">
                  Everything you need to successfully navigate your child's IEP journey in one platform
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-2">Can I cancel anytime?</h3>
                <p className="text-slate-400 text-sm">
                  Yes, you can cancel your subscription at any time. You'll continue to have access to Hero Plan features until the end of your billing period.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-2">What payment methods do you accept?</h3>
                <p className="text-slate-400 text-sm">
                  We accept all major credit cards and debit cards through our secure Stripe payment processing.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-2">Is my data secure?</h3>
                <p className="text-slate-400 text-sm">
                  Absolutely. We use enterprise-grade security and encryption to protect your family's sensitive information.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}