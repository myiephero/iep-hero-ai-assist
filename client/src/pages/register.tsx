import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/lib/auth";
import { GraduationCap, Users, UserCheck, ArrowLeft, Check, Star, Zap, Shield } from "lucide-react";

type UserRole = "parent" | "advocate" | "professional";
type PlanType = "free" | "heroOffer";

interface RoleInfo {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  benefits: string[];
  color: string;
}

const ROLES: Record<UserRole, RoleInfo> = {
  parent: {
    title: "Parent/Guardian",
    subtitle: "Advocate for your child's success",
    icon: <Users className="h-6 w-6" />,
    benefits: [
      "Track IEP goals and progress",
      "Store and organize documents", 
      "Memory Q&A with AI assistance",
      "Communication with school team"
    ],
    color: "border-blue-200 bg-blue-50"
  },
  advocate: {
    title: "IEP Advocate", 
    subtitle: "Professional advocacy services",
    icon: <UserCheck className="h-6 w-6" />,
    benefits: [
      "Client management tools",
      "Professional document templates",
      "Advanced goal tracking",
      "Advocacy resource library"
    ],
    color: "border-green-200 bg-green-50"
  },
  professional: {
    title: "Education Professional",
    subtitle: "Support student outcomes",
    icon: <GraduationCap className="h-6 w-6" />,
    benefits: [
      "Student progress monitoring",
      "Collaborative planning tools", 
      "Professional reporting",
      "Team communication hub"
    ],
    color: "border-purple-200 bg-purple-50"
  }
};

const PLANS = {
  free: {
    name: "Free Plan",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Basic IEP goal tracking",
      "Document storage (up to 10 files)",
      "Simple progress monitoring",
      "Community support"
    ],
    highlight: false,
    color: "border-gray-200"
  },
  heroOffer: {
    name: "Hero Family Offer", 
    price: "$495",
    period: "per year",
    description: "Complete IEP management solution",
    features: [
      "Unlimited IEP goals & tracking",
      "Unlimited document storage",
      "AI-powered Memory Q&A",
      "Advocate sharing & collaboration",
      "Priority email support",
      "Advanced progress reports",
      "Meeting preparation tools",
      "Legal resource library"
    ],
    highlight: true,
    color: "border-blue-500 bg-blue-50"
  }
};

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("free");
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handlePlanSelect = (plan: PlanType) => {
    setSelectedPlan(plan);
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    setIsLoading(true);
    try {
      await authApi.register({
        ...formData,
        role: selectedRole,
        planStatus: selectedPlan
      });

      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });

      setLocation("/login");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Role Selection
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <GraduationCap className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to IEP Hero</h1>
            <p className="text-lg text-gray-600">Choose your role to get started with personalized features</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(ROLES).map(([key, role]) => (
              <Card 
                key={key}
                className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${role.color}`}
                onClick={() => handleRoleSelect(key as UserRole)}
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-3">
                    {role.icon}
                  </div>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                  <CardDescription>{role.subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {role.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-4">
                    Select {role.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Plan Selection  
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setStep(1)}
              className="absolute left-4 top-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h1>
            <p className="text-lg text-gray-600">
              Perfect for <span className="font-semibold">{ROLES[selectedRole!].title}</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {Object.entries(PLANS).map(([key, plan]) => (
              <Card 
                key={key}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedPlan === key ? 'ring-2 ring-blue-500' : ''
                } ${plan.color} ${plan.highlight ? 'scale-105' : ''}`}
                onClick={() => setSelectedPlan(key as PlanType)}
              >
                <CardHeader className="text-center">
                  {plan.highlight && (
                    <div className="flex justify-center mb-2">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-blue-600">
                    {plan.price}
                    <span className="text-sm font-normal text-gray-600">/{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={selectedPlan === key ? "default" : "outline"}
                  >
                    {selectedPlan === key ? "Selected" : `Choose ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button 
              onClick={() => handlePlanSelect(selectedPlan)}
              size="lg"
              className="px-8"
            >
              Continue to Registration
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Registration Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => setStep(2)}
            className="absolute left-4 top-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex justify-center mb-4">
            <GraduationCap className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Complete Your Registration</CardTitle>
          <CardDescription>
            {selectedPlan === "free" ? (
              "You're creating a FREE account"
            ) : (
              <span className="text-blue-600 font-semibold">
                You're unlocking the $495 Hero Family Offer
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Selected:</div>
            <div className="font-medium">{ROLES[selectedRole!].title}</div>
            <div className="font-medium text-blue-600">{PLANS[selectedPlan as keyof typeof PLANS].name}</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}