import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Shield } from "lucide-react";
import { useLocation } from "wouter";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SubscriptionModal({ open, onOpenChange }: SubscriptionModalProps) {
  const [, setLocation] = useLocation();

  const plans = [
    {
      name: "Basic",
      price: 19,
      description: "Perfect for individual families",
      features: [
        "Up to 3 IEP documents",
        "Basic progress tracking",
        "Email support",
      ],
      priceId: "price_basic", // Replace with actual Stripe price ID
    },
    {
      name: "Professional",
      price: 49,
      description: "Ideal for advocates and professionals",
      popular: true,
      features: [
        "Unlimited IEP documents",
        "Advanced analytics",
        "Team collaboration",
        "Priority support",
      ],
      priceId: "price_professional", // Replace with actual Stripe price ID
    },
    {
      name: "Enterprise",
      price: 99,
      description: "For schools and large organizations",
      features: [
        "Everything in Professional",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 phone support",
      ],
      priceId: "price_enterprise", // Replace with actual Stripe price ID
    },
  ];

  const handleChoosePlan = (priceId: string) => {
    onOpenChange(false);
    setLocation(`/subscribe?price=${priceId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Choose Your Plan</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular ? "border-2 border-primary shadow-lg" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-primary text-white">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <h4 className="text-lg font-semibold">{plan.name}</h4>
                <div className="mt-4">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleChoosePlan(plan.priceId)}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : `Choose ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <CreditCard className="h-6 w-6 text-blue-600" />
            <Shield className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600">Secure payments powered by Stripe</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
