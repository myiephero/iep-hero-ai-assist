import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Check, Crown, User, Zap, Star, ArrowRight, Shield } from 'lucide-react';

export default function Pricing() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: 'Free Plan',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for getting started with basic IEP management',
      icon: <User className="h-6 w-6" />,
      color: 'border-slate-600',
      buttonText: 'Current Plan',
      features: [
        'Basic goal tracking',
        'Document storage (up to 5 files)',
        'Simple progress monitoring',
        'Community support',
        'Basic meeting prep tools'
      ],
      limitations: [
        'No AI-powered features',
        'Limited document analysis',
        'Basic templates only',
        'No advocate matching'
      ]
    },
    {
      name: 'Hero Plan',
      price: { monthly: 29, annual: 290 },
      description: 'Complete IEP management with AI-powered tools and advocacy support',
      icon: <Crown className="h-6 w-6 text-yellow-400" />,
      color: 'border-purple-500',
      popular: true,
      buttonText: user?.planStatus === 'heroOffer' ? 'Current Plan' : 'Upgrade to Hero',
      features: [
        'Everything in Free Plan',
        'Unlimited AI-powered document analysis',
        'Smart letter generation with templates',
        'Advanced goal generator with AI insights',
        'Autism accommodation builder',
        'Professional advocate matching',
        'Meeting prep wizard with AI suggestions',
        'Unlimited document storage',
        'Priority email support',
        'Advanced progress analytics',
        'Communication tracker',
        'Ask AI about your docs feature'
      ],
      limitations: []
    }
  ];

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
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your IEP Hero Plan
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            Empower your child's educational journey with the right tools
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                    {plan.price[billingCycle] > 0 ? (billingCycle === 'monthly' ? '/month' : '/year') : ''}
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

                {/* Limitations (if any) */}
                {plan.limitations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-400 mb-3 text-sm">
                      Limitations
                    </h4>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, i) => (
                        <li key={i} className="text-xs text-slate-500">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={user?.planStatus === 'heroOffer' && plan.name === 'Hero Plan'}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                      : user?.planStatus === 'free' && plan.name === 'Free Plan'
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  {user?.planStatus === 'heroOffer' && plan.name === 'Hero Plan' ? (
                    <>
                      <Crown className="h-4 w-4 mr-2" />
                      Current Plan
                    </>
                  ) : user?.planStatus === 'free' && plan.name === 'Free Plan' ? (
                    'Current Plan'
                  ) : plan.name === 'Hero Plan' ? (
                    <>
                      Upgrade to Hero
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