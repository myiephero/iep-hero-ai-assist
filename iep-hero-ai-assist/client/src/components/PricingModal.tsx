import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const parentPlans = [
    {
      name: "Basic Parent",
      price: "$29/month",
      description: "Essential IEP support for families",
      features: [
        "IEP Document Analysis",
        "Basic Meeting Prep",
        "Email Support",
        "Resource Library Access"
      ]
    },
    {
      name: "Premium Parent",
      price: "$59/month",
      description: "Comprehensive advocacy support",
      features: [
        "Everything in Basic",
        "1-on-1 Advocate Consultation",
        "Letter Generation",
        "Priority Support",
        "Custom Action Plans"
      ],
      popular: true
    }
  ];

  const advocatePlans = [
    {
      name: "Professional Advocate",
      price: "$99/month",
      description: "Complete advocacy platform",
      features: [
        "Unlimited Client Cases",
        "Advanced Analytics",
        "Document Templates",
        "Client Management System",
        "Professional Resources"
      ]
    },
    {
      name: "Agency Advocate",
      price: "$199/month",
      description: "Multi-advocate organization support",
      features: [
        "Everything in Professional",
        "Team Collaboration Tools",
        "White-label Options",
        "API Access",
        "Custom Integrations"
      ]
    }
  ];

  const handleSelectPlan = (planName: string) => {
    // Navigate to signup with plan parameter
    window.location.href = `/api/auth/signup?plan=${encodeURIComponent(planName)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6">
            Choose Your Plan
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* Parent Plans */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">For Parents</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {parentPlans.map((plan) => (
                <Card key={plan.name} className="relative">
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{plan.name}</span>
                      <span className="text-2xl font-bold text-primary">{plan.price}</span>
                    </CardTitle>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <div className="w-2 h-2 bg-success rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => handleSelectPlan(plan.name)}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Advocate Plans */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-secondary">For Advocates</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {advocatePlans.map((plan) => (
                <Card key={plan.name}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{plan.name}</span>
                      <span className="text-2xl font-bold text-secondary">{plan.price}</span>
                    </CardTitle>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <div className="w-2 h-2 bg-success rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => handleSelectPlan(plan.name)}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}