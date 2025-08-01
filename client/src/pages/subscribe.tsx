import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { isUnauthorizedError } from "@/lib/authUtils";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = ({ selectedPlan }: { selectedPlan: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const planName = selectedPlan === 'parent-basic' ? 'Parent Basic ($19/month)' : 'Advocate Pro ($75/month)';

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Subscription</CardTitle>
        <p className="text-sm text-gray-600">Subscribe to {planName}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement />
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!stripe || isLoading}
          >
            {isLoading ? 'Processing...' : `Subscribe to ${selectedPlan === 'parent-basic' ? 'Parent Basic' : 'Advocate Pro'}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const PlanSelection = ({ onSelectPlan }: { onSelectPlan: (plan: string) => void }) => {
  const [activeTab, setActiveTab] = useState<'parent' | 'advocate'>('parent');

  const parentPlans = [
    {
      id: 'parent-basic',
      name: 'Parent Basic',
      price: 19,
      description: 'Essential support for involved parents',
      popular: false,
      features: [
        'Monthly 1-hour consultation call',
        'Email support within 48 hours',
        'Access to resource library',
        'IEP template and checklist tools',
        'Basic rights and law guidance'
      ]
    },
    {
      id: 'parent-premium',
      name: 'Parent Premium',
      price: 49,
      description: 'Enhanced support for complex cases',
      popular: true,
      features: [
        'Everything in Parent Basic, plus:',
        'Bi-weekly 1-hour consultation calls',
        'Priority email support (24-hour)',
        'IEP meeting preparation guidance',
        'Document review assistance',
        'Access to advocacy templates'
      ]
    },
    {
      id: 'parent-pro',
      name: 'Parent Pro',
      price: 29,
      description: 'Comprehensive parent advocacy package',
      popular: false,
      features: [
        'Everything in Parent Premium, plus:',
        'Weekly 1-hour consultation calls',
        'Emergency consultation hotline',
        'IEP meeting attendance (virtual)',
        'Legal referral network access',
        'Crisis intervention support'
      ]
    }
  ];

  const advocatePlans = [
    {
      id: 'advocate-standard',
      name: 'Advocate Standard',
      price: 49,
      description: 'Professional advocacy services',
      popular: false,
      features: [
        'Unlimited consultation calls',
        'Priority email support (4-hour)',
        'IEP meeting attendance',
        'Document drafting and review',
        'Legal research assistance',
        'Professional development resources'
      ]
    },
    {
      id: 'advocate-premium',
      name: 'Advocate Premium',
      price: 75,
      description: 'Full-service advocacy practice support',
      popular: true,
      features: [
        'Everything in Advocate Standard, plus:',
        '24/7 emergency consultation line',
        'Legal expert network access',
        'Advanced case management tools',
        'Continuing education credits',
        'Peer consultation network'
      ]
    },
    {
      id: 'advocate-enterprise',
      name: 'Advocate Enterprise',
      price: 99,
      description: 'Enterprise-level advocacy solutions',
      popular: false,
      features: [
        'Everything in Advocate Premium, plus:',
        'Multi-case management dashboard',
        'White-label client portal',
        'Custom training programs',
        'Dedicated account manager',
        'Advanced analytics and reporting'
      ]
    }
  ];

  const currentPlans = activeTab === 'parent' ? parentPlans : advocatePlans;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-lg text-gray-600">Select the advocacy plan that best fits your needs.</p>
      </div>

      {/* Tab Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === 'parent'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('parent')}
          >
            For Parents
          </button>
          <button
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === 'advocate'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('advocate')}
          >
            For Advocates
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {currentPlans.map((plan) => (
          <Card key={plan.id} className={`shadow-lg border relative ${plan.popular ? 'border-2 border-primary' : 'border-gray-200'}`}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}

            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-xl text-gray-600 ml-1">/month</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Billed monthly • Cancel anytime</p>
              </div>

              <ul className="space-y-4 mb-8 min-h-[240px]">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5 flex-shrink-0" />
                    <span className={`text-gray-700 ${feature.includes('Everything in') ? 'font-semibold' : ''}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button 
                className="w-full py-4 text-lg"
                onClick={() => onSelectPlan(plan.id)}
              >
                Select {plan.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default function Subscribe() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Subscribe page works independently of authentication
  const { toast } = useToast();

  const handlePlanSelection = async (plan: string) => {
    setSelectedPlan(plan);
    setIsLoading(true);

    try {
      // Use the public checkout session endpoint that doesn't require auth
      const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: 'guest-user', 
          plan 
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }
      
      const data = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = (window as any).Stripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      });
      
      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create subscription",
        variant: "destructive",
      });
      setSelectedPlan(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Subscription page is accessible without authentication

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedPlan ? (
          <PlanSelection onSelectPlan={handlePlanSelection} />
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedPlan(null);
                  setClientSecret("");
                }}
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Plans
              </Button>
            </div>

            {isLoading || !clientSecret ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                <span className="ml-3 text-gray-600">Setting up your subscription...</span>
              </div>
            ) : (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <SubscribeForm selectedPlan={selectedPlan} />
              </Elements>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
