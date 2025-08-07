import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleAwareDashboard } from "@/utils/navigation";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { getDashboardRoute } = useRoleAwareDashboard();
  const [, setLocation] = useLocation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${getDashboardRoute()}`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "You are now subscribed!",
      });
      setLocation(getDashboardRoute());
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement />
          <Button type="submit" className="w-full" disabled={!stripe || !elements}>
            Subscribe
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [location] = useLocation();
  const { toast } = useToast();
  const { getDashboardRoute } = useRoleAwareDashboard();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Extract price ID from URL params
  const urlParams = new URLSearchParams(location.split('?')[1]);
  const priceId = urlParams.get('price') || 'price_professional';

  useEffect(() => {
    // For MVP testing, show a message and redirect to dashboard
    setIsRedirecting(true);
    
    toast({
      title: "Subscription Success!",
      description: "For MVP testing, all Hero Plan features are available. Redirecting to dashboard...",
    });
    
    setTimeout(() => {
      window.location.href = getDashboardRoute();
    }, 3000);
  }, [priceId]);

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4" />
          <div className="max-w-md">
            <h2 className="text-2xl font-bold text-green-700 mb-2">Subscription Activated!</h2>
            <p className="text-gray-600 mb-4">
              For MVP testing, all Hero Plan features are now available in your account.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to your dashboard in 3 seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // This should not render during MVP testing since we redirect immediately
  return null;
}
