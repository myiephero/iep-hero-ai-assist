import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [isLoading, setIsLoading] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const pricingPlans = [
    {
      id: "free",
      name: "Free Plan",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with IEP management",
      popular: false,
      features: [
        "Basic IEP goal tracking",
        "Document storage (up to 10 files)",
        "Calendar for IEP meetings",
        "Progress monitoring",
        "Email support"
      ]
    },
    {
      id: "hero",
      name: "Hero Plan",
      price: "$495",
      period: "per year",
      description: "Complete IEP advocacy with expert support",
      popular: true,
      features: [
        "Everything in Free Plan",
        "AI-powered Memory Q&A",
        "Advocate sharing & collaboration",
        "Unlimited document storage",
        "Priority email support",
        "Advanced progress analytics",
        "Goal recommendation engine",
        "Meeting preparation tools",
        "Legal resource library",
        "Monthly expert consultations"
      ]
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setShowRegistrationForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiRequest("POST", "/api/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "parent"
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Registration Successful!",
          description: data.message || "Please check your email to verify your account.",
        });
        
        // If Hero plan selected, redirect to payment after email verification
        if (selectedPlan === "hero") {
          toast({
            title: "Next Step",
            description: "After verifying your email, you'll be prompted to complete your Hero Plan subscription.",
          });
        }
        
        setLocation("/login");
      } else {
        const errorData = await response.json();
        toast({
          title: "Registration Failed",
          description: errorData.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!showRegistrationForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Join My IEP Hero
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that's right for your family's IEP journey. Start managing your child's education with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card key={plan.id} className={`relative transition-all duration-200 hover:shadow-lg ${
                plan.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1 flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-blue-600">{plan.price}</span>
                    <span className="text-gray-500 ml-2">/{plan.period}</span>
                  </div>
                  <CardDescription className="mt-4 text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`w-full py-6 text-lg font-semibold ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    {plan.id === 'free' ? 'Start Free' : 'Choose Hero Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
          <CardDescription>
            Selected: <span className="font-semibold text-blue-600">
              {pricingPlans.find(p => p.id === selectedPlan)?.name}
            </span>
          </CardDescription>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRegistrationForm(false)}
            className="mt-2"
          >
            Change Plan
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Full Name</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your full name"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account & Send Welcome Email"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}