import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { GraduationCap, Users, UserCheck, ArrowLeft, Check, Star, ArrowRight } from "lucide-react";

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
  const { register } = useAuth();
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
      const result = await register(
        formData.email,
        formData.username,
        formData.password,
        selectedRole,
        selectedPlan
      );

      toast({
        title: "Account Created!",
        description: "Welcome to My IEP Hero! Redirecting to dashboard...",
      });

      // Small delay for UX
      setTimeout(() => {
        setLocation("/dashboard");
      }, 1000);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Role Selection
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-6xl">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl shadow-2xl">
                  <GraduationCap className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">Welcome to My IEP Hero</h1>
              <p className="text-xl text-blue-200 max-w-2xl mx-auto">Choose your role to unlock personalized features and transform your IEP journey</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {Object.entries(ROLES).map(([key, role]) => (
                <Card 
                  key={key}
                  className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 backdrop-blur-xl bg-white/10 border-white/20 group"
                  onClick={() => handleRoleSelect(key as UserRole)}
                >
                  <CardHeader className="text-center pb-6">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-2xl group-hover:from-blue-400/30 group-hover:to-indigo-600/30 transition-all">
                        {role.icon}
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-white mb-2">{role.title}</CardTitle>
                    <CardDescription className="text-blue-200 text-base">{role.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {role.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-blue-100">
                          <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all group-hover:scale-105">
                      Choose {role.title}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-blue-200">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-400 hover:text-white underline font-semibold transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Plan Selection  
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-5xl">
            <div className="text-center mb-12">
              <Button 
                variant="ghost" 
                onClick={() => setStep(1)}
                className="absolute left-4 top-4 text-blue-200 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Roles
              </Button>
              
              <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
              <p className="text-xl text-blue-200">
                Perfect for <span className="font-semibold text-blue-400">{ROLES[selectedRole!].title}</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {Object.entries(PLANS).map(([key, plan]) => (
                <Card 
                  key={key}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 backdrop-blur-xl bg-white/10 border-white/20 ${
                    selectedPlan === key ? 'ring-2 ring-blue-400 bg-white/20' : ''
                  } ${plan.highlight ? 'border-blue-400/50' : ''} group`}
                  onClick={() => setSelectedPlan(key as PlanType)}
                >
                  <CardHeader className="text-center pb-6">
                    {plan.highlight && (
                      <div className="flex justify-center mb-4">
                        <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-lg">
                          <Star className="h-4 w-4 mr-2 animate-pulse" />
                          Most Popular Choice
                        </span>
                      </div>
                    )}
                    <CardTitle className="text-3xl text-white mb-4">{plan.name}</CardTitle>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-blue-400">{plan.price}</span>
                      <span className="text-blue-200 ml-2">/{plan.period}</span>
                    </div>
                    <CardDescription className="text-blue-200 text-base">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-blue-100">
                          <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full h-12 font-semibold rounded-lg shadow-lg transition-all group-hover:scale-105 ${
                        selectedPlan === key 
                          ? 'bg-blue-500 hover:bg-blue-600 text-white ring-2 ring-blue-400' 
                          : plan.highlight
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                            : 'bg-white/20 hover:bg-white/30 text-white border-white/30'
                      }`}
                    >
                      {selectedPlan === key ? '✓ Selected' : `Choose ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button 
                onClick={() => handlePlanSelect(selectedPlan)}
                size="lg"
                className="px-12 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  Continue to Registration
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Registration Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <Button 
              variant="ghost" 
              onClick={() => setStep(2)}
              className="absolute left-4 top-4 text-blue-200 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plans
            </Button>
            
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl shadow-2xl">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl text-white mb-4">Complete Your Registration</CardTitle>
            <CardDescription className="text-lg">
              {selectedPlan === "free" ? (
                <span className="text-green-400 font-semibold">✅ You're creating a FREE account</span>
              ) : (
                <span className="text-blue-400 font-semibold">🌟 You're unlocking the $495 Hero Family Offer</span>
              )}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Selection Summary */}
            <div className="p-4 bg-white/10 rounded-lg border border-white/20">
              <div className="text-sm text-blue-200 mb-2">Your Selection:</div>
              <div className="font-semibold text-white">{ROLES[selectedRole!].title}</div>
              <div className="font-semibold text-blue-400">{PLANS[selectedPlan as keyof typeof PLANS].name}</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder-blue-200 h-12 focus:bg-white/20 focus:border-blue-400 transition-all"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white font-medium">Username</Label>
                <Input
                  id="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder-blue-200 h-12 focus:bg-white/20 focus:border-blue-400 transition-all"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder-blue-200 h-12 focus:bg-white/20 focus:border-blue-400 transition-all"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-14 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Your Account...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    {selectedPlan === "free" ? "Create Free Account" : "Create Hero Account"}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-blue-200">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}