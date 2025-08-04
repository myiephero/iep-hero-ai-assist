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
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(true);
  const [showPricingPlans, setShowPricingPlans] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const roleOptions = [
    {
      id: "parent",
      title: "Parent/Guardian",
      description: "Managing your child's IEP journey",
      icon: "👨‍👩‍👧‍👦",
      valueProps: [
        "Track your child's IEP goals and progress",
        "Organize important documents and reports",
        "Prepare effectively for IEP meetings",
        "Connect with advocates for support",
        "Access AI-powered memory assistance"
      ],
      primaryBenefit: "Advocate for your child with confidence and organization"
    },
    {
      id: "advocate",
      title: "IEP Advocate",
      description: "Supporting families through the IEP process",
      icon: "🤝",
      valueProps: [
        "Collaborate with multiple families",
        "Share expertise and resources",
        "Access comprehensive case management",
        "Streamline communication with families",
        "Build evidence-based advocacy cases"
      ],
      primaryBenefit: "Empower families with professional advocacy tools"
    },
    {
      id: "professional",
      title: "Education Professional",
      description: "Teachers, specialists, and school staff",
      icon: "🎓",
      valueProps: [
        "Monitor student progress efficiently",
        "Collaborate with families and teams",
        "Access best-practice resources",
        "Streamline IEP documentation",
        "Track intervention effectiveness"
      ],
      primaryBenefit: "Enhance student outcomes through better collaboration"
    }
  ];

  const getPricingPlansForRole = (role: string) => {
    const basePlans = [
      {
        id: "free",
        name: "Free Plan",
        price: "$0",
        period: "forever",
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
        popular: true,
        features: [
          "Everything in Free Plan",
          "AI-powered Memory Q&A",
          "Unlimited document storage",
          "Priority email support",
          "Advanced progress analytics",
          "Goal recommendation engine",
          "Meeting preparation tools",
          "Legal resource library"
        ]
      }
    ];

    // Customize plans based on role
    if (role === "parent") {
      basePlans[0].description = "Perfect for families getting started with IEP management";
      basePlans[1].description = "Complete family advocacy with expert support";
      basePlans[1].features.push("Monthly parent consultations", "Advocate collaboration tools");
    } else if (role === "advocate") {
      basePlans[0].description = "Basic tools for new advocates";
      basePlans[1].description = "Professional advocacy platform with advanced features";
      basePlans[1].features.push("Multi-family case management", "Professional resource library");
    } else if (role === "professional") {
      basePlans[0].description = "Essential tools for classroom teachers";
      basePlans[1].description = "Comprehensive platform for education professionals";
      basePlans[1].features.push("Team collaboration tools", "Student outcome analytics");
    }

    return basePlans;
  };

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setShowRoleSelection(false);
    setShowPricingPlans(true);
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setShowPricingPlans(false);
    setShowRegistrationForm(true);
  };

  const handleBackToRoles = () => {
    setShowPricingPlans(false);
    setShowRoleSelection(true);
  };

  const handleBackToPlans = () => {
    setShowRegistrationForm(false);
    setShowPricingPlans(true);
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
        role: selectedRole
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
            title: "Hero Plan Selected - Payment Required",
            description: "After verifying your email, you'll complete your $495/year Hero Plan payment to unlock all features.",
          });
          // Store the selected plan in localStorage for after email verification
          localStorage.setItem('selectedPlan', 'hero');
        } else {
          const roleData = roleOptions.find(r => r.id === selectedRole);
          toast({
            title: `FREE ${roleData?.title} Account Created!`,
            description: "Your free My IEP Hero account is ready. Check your email to verify and start using your free features.",
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

  // Role Selection Screen
  if (showRoleSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to My IEP Hero
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Let's get you started with the right tools for your role in the IEP process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {roleOptions.map((role) => (
              <Card key={role.id} className="relative transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer group">
                <CardHeader className="text-center pb-6">
                  <div className="text-6xl mb-4">{role.icon}</div>
                  <CardTitle className="text-2xl font-bold">{role.title}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {role.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="font-semibold text-blue-900 mb-3">{role.primaryBenefit}</p>
                  </div>

                  <ul className="space-y-3">
                    {role.valueProps.map((prop, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{prop}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleRoleSelect(role.id)}
                    className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 group-hover:bg-blue-700"
                  >
                    I'm a {role.title}
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

  // Pricing Plans Screen
  if (showPricingPlans) {
    const selectedRoleData = roleOptions.find(r => r.id === selectedRole);
    const pricingPlans = getPricingPlansForRole(selectedRole);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Button variant="outline" onClick={handleBackToRoles} className="text-sm">
                ← Back to Roles
              </Button>
              <div className="text-3xl">{selectedRoleData?.icon}</div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Perfect! You're a {selectedRoleData?.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {selectedRoleData?.primaryBenefit}. Choose the plan that fits your needs.
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
                    {plan.id === 'free' ? 'Create FREE Account' : 'Select Hero Plan - $495/year'}
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
          <CardTitle className="text-2xl font-bold">
            {selectedPlan === 'free' 
              ? "You're creating a FREE My IEP Hero account" 
              : "You're unlocking the $495 Hero Family Offer"
            }
          </CardTitle>
          <CardDescription className="mt-4">
            {selectedPlan === 'free' ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-semibold">✅ FREE Forever Access Includes:</p>
                <ul className="text-sm text-green-700 mt-2 space-y-1">
                  <li>• Basic IEP goal tracking</li>
                  <li>• Document storage (up to 10 files)</li>
                  <li>• Calendar for IEP meetings</li>
                  <li>• Progress monitoring</li>
                </ul>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-semibold">🌟 Hero Family Offer ($495/year) Includes:</p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• Everything in Free Plan</li>
                  <li>• AI-powered Memory Q&A</li>
                  <li>• Advocate sharing & collaboration</li>
                  <li>• Unlimited document storage</li>
                  <li>• Monthly expert consultations</li>
                </ul>
                <p className="text-xs text-blue-600 mt-3 font-medium">
                  Payment will be processed after account creation
                </p>
              </div>
            )}
          </CardDescription>
          <div className="flex gap-2 justify-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToPlans}
            >
              ← Change Plan
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowRegistrationForm(false);
                setShowPricingPlans(false);
                setShowRoleSelection(true);
              }}
            >
              Change Role
            </Button>
          </div>
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
              {isLoading ? "Creating Account..." : 
                selectedPlan === 'free' 
                  ? "Create FREE Account & Send Welcome Email"
                  : "Create Account & Proceed to Payment ($495/year)"
              }
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