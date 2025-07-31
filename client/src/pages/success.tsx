import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle, Calendar, FileText, Phone } from "lucide-react";
import type { User } from "@shared/schema";

export default function Success() {
  const { user } = useAuth() as { user: User | undefined };
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give some time for the user data to refresh after successful payment
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900">Processing your subscription...</h2>
          </div>
        </div>
      </div>
    );
  }

  const planName = user?.subscriptionPlan === 'parent-basic' ? 'Parent Basic' : 
                   user?.subscriptionPlan === 'advocate-pro' ? 'Advocate Pro' : 'your plan';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to IEP Advocacy!
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Your subscription to {planName} is now active. You're all set to get the advocacy support your child deserves.
          </p>
        </div>

        {/* What's Next */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Schedule Your First Call</h3>
                <p className="text-sm text-gray-600">
                  Book your initial consultation to discuss your child's needs and goals.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Access Resources</h3>
                <p className="text-sm text-gray-600">
                  Explore our library of IEP templates, checklists, and educational materials.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Get Support</h3>
                <p className="text-sm text-gray-600">
                  Reach out anytime with questions via email or emergency hotline.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Benefits */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your {planName} Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {user?.subscriptionPlan === 'parent-basic' ? (
                <>
                  <div className="flex items-center">
                    <CheckCircle className="text-green-600 mr-2 h-5 w-5" />
                    <span>Monthly 1-hour consultation call</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-green-600 mr-2 h-5 w-5" />
                    <span>Email support within 48 hours</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-green-600 mr-2 h-5 w-5" />
                    <span>Access to resource library</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-green-600 mr-2 h-5 w-5" />
                    <span>IEP template and checklist tools</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-green-600 mr-2 h-5 w-5" />
                    <span>Basic rights and law guidance</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center">
                    <CheckCircle className="text-green-600 mr-2 h-5 w-5" />
                    <span>Weekly 1-hour consultation calls</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-green-600 mr-2 h-5 w-5" />
                    <span>Priority email support (24-hour)</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-green-600 mr-2 h-5 w-5" />
                    <span>IEP meeting preparation & attendance</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-green-600 mr-2 h-5 w-5" />
                    <span>Document review and drafting</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-green-600 mr-2 h-5 w-5" />
                    <span>Emergency consultation hotline</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-green-600 mr-2 h-5 w-5" />
                    <span>Legal referral network access</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <Link href="/">
            <Button size="lg" className="mr-4">
              Go to Dashboard
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            Schedule First Call
          </Button>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-2">
            Have questions? We're here to help!
          </p>
          <p className="text-sm text-gray-500">
            Email us at support@iepadvocacy.com or call our support line.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
