import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AuthRoleSelect } from "./AuthRoleSelect";
import { PricingModal } from "./PricingModal";
import { ArrowLeft } from "lucide-react";

interface SignUpProps {
  onBackToSignIn: () => void;
}

export function SignUp({ onBackToSignIn }: SignUpProps) {
  const [step, setStep] = useState<'role' | 'form' | 'pricing'>('role');
  const [selectedRole, setSelectedRole] = useState<'parent' | 'advocate' | 'administrator' | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [showPricingModal, setShowPricingModal] = useState(false);

  const handleRoleSelect = (role: 'parent' | 'advocate' | 'administrator') => {
    setSelectedRole(role);
    if (role === 'administrator') {
      // Handle invite-only flow differently
      alert('Administrator accounts are invite-only. Please contact support for access.');
      return;
    }
    setStep('form');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'parent') {
      setShowPricingModal(true);
    } else if (selectedRole === 'advocate') {
      // Handle advocate application process
      console.log('Advocate application:', formData);
      alert('Thank you for your application. We will review and contact you soon.');
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  if (step === 'role') {
    return (
      <div>
        <AuthRoleSelect onRoleSelect={handleRoleSelect} />
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div>
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit -ml-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95 transition-all duration-100"
            onClick={() => setStep('role')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Role Selection
          </Button>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Complete Registration</h2>
            <p className="text-muted-foreground">
              {selectedRole === 'parent' ? 'Create your parent account' : 'Apply for advocate access'}
            </p>
          </div>
        </div>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter first name"
                className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter last name"
                className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              value={formData.email}
              onChange={handleInputChange('email')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              value={formData.password}
              onChange={handleInputChange('password')}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95 transition-all duration-100"
          >
            {selectedRole === 'parent' ? 'Continue to Plans' : 'Submit Application'}
          </Button>
        </form>
        
        <PricingModal 
          isOpen={showPricingModal} 
          onClose={() => setShowPricingModal(false)} 
        />
      </div>
    );
  }

  return null;
}