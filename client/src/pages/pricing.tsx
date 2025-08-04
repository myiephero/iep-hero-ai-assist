import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, Star, Users, FileText, Calendar, MessageSquare, Shield, Zap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Pricing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [heroModalOpen, setHeroModalOpen] = useState(false);

  const handleHeroPlanSubscribe = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe to the Hero Plan.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // For Hero Plan - $495/year subscription
      const response = await apiRequest("POST", "/api/create-subscription", {
        priceId: "price_hero_plan_495_yearly" // This will need to be set up in Stripe
      });
      const data = await response.json();
      
      if (data.clientSecret) {
        // Redirect to Stripe checkout
        window.location.href = `/subscribe?client_secret=${data.clientSecret}`;
      } else {
        throw new Error("Failed to create subscription");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setHeroModalOpen(false);
    }
  };

  const freePlanFeatures = [
    "Basic IEP goal tracking",
    "Document storage (up to 5 files)",
    "Calendar for IEP meetings",
    "Basic progress monitoring",
    "Email notifications",
  ];

  const heroPlanFeatures = [
    "Everything in Free Plan",
    "Unlimited document storage",
    "AI-powered Memory Q&A with advocate sharing",
    "Advanced progress analytics",
    "Priority email support",
    "Team collaboration tools",
    "Custom goal templates",
    "Automated progress reports",
    "Mobile app access",
    "Data export capabilities",
  ];

  const heroOnlyFeatures = [
    "AI-powered Memory Q&A system",
    "Advocate sharing and notifications",
    "Advanced progress analytics dashboard",
    "Priority support (24-hour response)",
    "Team collaboration workspace",
    "Custom goal and accommodation templates",
    "Automated progress report generation",
    "Full mobile app with offline access",
    "Complete data export and backup",
    "Advanced security and compliance features",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Pricing Plans
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Choose Your IEP Journey
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Start with our free plan or unlock the full potential of IEP management with our Hero Plan.
            Every child deserves an advocate, and every parent deserves the right tools.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="relative border-2 border-gray-200 dark:border-gray-700">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Free Plan
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Perfect for getting started with IEP management
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">$0</span>
                <span className="text-gray-600 dark:text-gray-300">/month</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-3">
                {freePlanFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="outline"
                disabled={user !== null}
              >
                {user ? "Current Plan" : "Get Started Free"}
              </Button>
            </CardFooter>
          </Card>

          {/* Hero Plan */}
          <Card className="relative border-2 border-blue-500 dark:border-blue-400 shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1">
                <Star className="h-4 w-4 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                Hero Plan
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Complete IEP advocacy and management solution
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">$495</span>
                <span className="text-gray-600 dark:text-gray-300">/year</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Billed annually • $41.25/month
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-3">
                {heroPlanFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Dialog open={heroModalOpen} onOpenChange={setHeroModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    Choose Hero Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      Hero Plan - Complete IEP Solution
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-300">
                      Everything you need to be your child's strongest advocate
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Pricing Summary */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">Hero Plan</span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">$495/year</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">$41.25/month</div>
                        </div>
                      </div>
                    </div>

                    {/* Hero-Only Features */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-500" />
                        Hero Plan Exclusive Features
                      </h3>
                      <div className="grid gap-3">
                        {heroOnlyFeatures.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <Check className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Benefits */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Why Choose Hero Plan?
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <Users className="h-6 w-6 text-blue-500 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Expert Support</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Direct access to IEP advocates</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Shield className="h-6 w-6 text-blue-500 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Data Security</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">FERPA compliant storage</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <FileText className="h-6 w-6 text-blue-500 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Unlimited Storage</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">All your IEP documents in one place</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MessageSquare className="h-6 w-6 text-blue-500 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">AI Assistant</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Smart IEP analysis and insights</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-3 pt-6 border-t">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setHeroModalOpen(false)}
                      >
                        Not Now
                      </Button>
                      <Button
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={handleHeroPlanSubscribe}
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Subscribe to Hero Plan"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Can I upgrade from Free to Hero anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! You can upgrade to the Hero Plan at any time. Your data will be preserved and you'll immediately access all Hero features.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Is my child's data secure?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Absolutely. We're FERPA compliant and use enterprise-grade security. Your child's information is encrypted and never shared without your permission.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                What if I need to cancel?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                You can cancel anytime. Hero Plan subscribers can download all their data before cancellation. No long-term contracts or hidden fees.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Do you offer support?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Free users get community support. Hero Plan includes priority email support with IEP advocates who understand the process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}