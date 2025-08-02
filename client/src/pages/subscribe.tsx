import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { CheckCircle } from "lucide-react";
import { useToast } from "../hooks/use-toast";

// Replace with your Stripe publishable key - this is safe to expose publicly
const stripePromise = loadStripe("pk_test_51234567890abcdef..."); // Replace with your actual publishable key

interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const parentPlans: Plan[] = [
  {
    id: "parent-basic",
    name: "Parent Basic",
    price: "$49/month",
    description: "Essential IEP support for parents",
    features: [
      "IEP document review",
      "Monthly consultation call",
      "Email support",
      "Resource library access"
    ]
  },
  {
    id: "parent-premium",
    name: "Parent Premium",
    price: "$99/month",
    description: "Comprehensive IEP advocacy",
    features: [
      "Everything in Basic",
      "Meeting preparation support",
      "Unlimited consultation calls",
      "Priority email support",
      "Goal writing assistance"
    ],
    isPopular: true
  }
];

const advocatePlans: Plan[] = [
  {
    id: "advocate-basic",
    name: "Advocate Basic",
    price: "$149/month",
    description: "Professional tools for IEP advocates",
    features: [
      "Client management system",
      "Document templates",
      "Basic analytics",
      "Email support"
    ]
  },
  {
    id: "advocate-pro",
    name: "Advocate Pro",
    price: "$299/month",
    description: "Complete advocacy practice management",
    features: [
      "Everything in Basic",
      "Advanced analytics",
      "Custom branding",
      "Priority support",
      "Training resources"
    ],
    isPopular: true
  }
];

function SubscribeForm({ selectedPlan }: { selectedPlan: Plan }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Subscription</CardTitle>
        <CardDescription>
          You selected: {selectedPlan.name} - {selectedPlan.price}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <PaymentElement />
          <Button 
            type="submit" 
            disabled={!stripe || isLoading} 
            className="w-full mt-4"
          >
            {isLoading ? "Processing..." : "Subscribe Now"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function PlanSelection({ onSelectPlan }: { onSelectPlan: (plan: Plan) => void }) {
  const [planType, setPlanType] = useState<"parents" | "advocates">("parents");

  const plans = planType === "parents" ? parentPlans : advocatePlans;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Select the plan that best fits your needs
        </p>
        
        <div className="flex justify-center mb-8">
          <div className="bg-muted p-1 rounded-lg">
            <Button
              variant={planType === "parents" ? "default" : "ghost"}
              onClick={() => setPlanType("parents")}
              className="px-6"
            >
              For Parents
            </Button>
            <Button
              variant={planType === "advocates" ? "default" : "ghost"}
              onClick={() => setPlanType("advocates")}
              className="px-6"
            >
              For Advocates
            </Button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.isPopular ? 'border-primary' : ''}`}>
            {plan.isPopular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold text-primary">{plan.price}</div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => onSelectPlan(plan)} 
                className="w-full"
                variant={plan.isPopular ? "default" : "outline"}
              >
                Choose {plan.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function Subscribe() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [clientSecret, setClientSecret] = useState<string>("");

  const handleSelectPlan = async (plan: Plan) => {
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId: plan.id }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        console.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const appearance = {
    theme: 'stripe' as const,
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-20 px-4">
        {!selectedPlan ? (
          <PlanSelection onSelectPlan={handleSelectPlan} />
        ) : (
          <Elements options={options} stripe={stripePromise}>
            <SubscribeForm selectedPlan={selectedPlan} />
          </Elements>
        )}
      </div>

      <Footer />
    </div>
  );
}