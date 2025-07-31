import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
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
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-lg text-gray-600">Select the advocacy plan that best fits your needs.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Parent Basic Plan */}
        <Card className="shadow-lg border border-gray-200 relative">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Parent Basic</h3>
              <p className="text-gray-600 mb-4">Essential support for involved parents</p>
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold text-gray-900">$19</span>
                <span className="text-xl text-gray-600 ml-1">/month</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Billed monthly • Cancel anytime</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                <span className="text-gray-700">Monthly 1-hour consultation call</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                <span className="text-gray-700">Email support within 48 hours</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                <span className="text-gray-700">Access to resource library</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                <span className="text-gray-700">IEP template and checklist tools</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                <span className="text-gray-700">Basic rights and law guidance</span>
              </li>
            </ul>

            <Button 
              className="w-full py-4 text-lg"
              onClick={() => onSelectPlan('parent-basic')}
            >
              Select Parent Basic
            </Button>
          </CardContent>
        </Card>

        {/* Advocate Pro Plan */}
        <Card className="shadow-xl border-2 border-primary relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold">
              Most Popular
            </span>
          </div>

          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Advocate Pro</h3>
              <p className="text-gray-600 mb-4">Comprehensive advocacy services</p>
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold text-gray-900">$75</span>
                <span className="text-xl text-gray-600 ml-1">/month</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Billed monthly • Cancel anytime</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                <span className="text-gray-700"><strong>Everything in Parent Basic, plus:</strong></span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                <span className="text-gray-700">Weekly 1-hour consultation calls</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                <span className="text-gray-700">Priority email support (24-hour response)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                <span className="text-gray-700">IEP meeting preparation and attendance</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                <span className="text-gray-700">Document review and drafting support</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                <span className="text-gray-700">Emergency consultation hotline</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                <span className="text-gray-700">Legal referral network access</span>
              </li>
            </ul>

            <Button 
              className="w-full py-4 text-lg"
              onClick={() => onSelectPlan('advocate-pro')}
            >
              Select Advocate Pro
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function Subscribe() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handlePlanSelection = async (plan: string) => {
    setSelectedPlan(plan);
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/create-subscription", { plan });
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error: any) {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

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
