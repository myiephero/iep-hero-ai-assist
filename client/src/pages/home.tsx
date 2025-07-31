import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, FileText, Phone, Users, CheckCircle, Clock, AlertCircle } from "lucide-react";
import type { User } from "@shared/schema";

export default function Home() {
  const { user, isLoading } = useAuth() as { user: User | undefined; isLoading: boolean };
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, isLoading, toast]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const hasActiveSubscription = user.subscriptionStatus === 'active';
  const planName = user.subscriptionPlan === 'parent-basic' ? 'Parent Basic' : 
                   user.subscriptionPlan === 'advocate-pro' ? 'Advocate Pro' : 'No Plan';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName || user.email}!
          </h1>
          <p className="text-lg text-gray-600">
            Your IEP advocacy dashboard is ready to help you support your child's educational journey.
          </p>
        </div>

        {/* Subscription Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              {hasActiveSubscription ? (
                <CheckCircle className="text-green-600 mr-2" />
              ) : (
                <AlertCircle className="text-yellow-600 mr-2" />
              )}
              Subscription Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-semibold text-gray-900">{planName}</p>
                <p className="text-gray-600">
                  Status: <span className={`font-medium ${hasActiveSubscription ? 'text-green-600' : 'text-yellow-600'}`}>
                    {user.subscriptionStatus || 'No active subscription'}
                  </span>
                </p>
              </div>
              {!hasActiveSubscription && (
                <Link href="/subscribe">
                  <Button>Subscribe Now</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Calendar className="text-primary mr-3 h-8 w-8" />
                <h3 className="text-lg font-semibold">Schedule Consultation</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Book your next advocacy consultation call with our experts.
              </p>
              <Button variant="outline" className="w-full" disabled={!hasActiveSubscription}>
                Schedule Call
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <FileText className="text-primary mr-3 h-8 w-8" />
                <h3 className="text-lg font-semibold">Document Library</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Access templates, checklists, and your IEP documents.
              </p>
              <Button variant="outline" className="w-full" disabled={!hasActiveSubscription}>
                View Documents
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Phone className="text-primary mr-3 h-8 w-8" />
                <h3 className="text-lg font-semibold">Emergency Support</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Need urgent help? Contact our emergency consultation line.
              </p>
              <Button 
                variant="outline" 
                className="w-full" 
                disabled={!hasActiveSubscription || user.subscriptionPlan !== 'advocate-pro'}
              >
                Call Support
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="text-primary mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasActiveSubscription ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">Account Created</p>
                    <p className="text-sm text-gray-600">Welcome to IEP Advocacy!</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(user.createdAt!).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">Subscription Activated</p>
                    <p className="text-sm text-gray-600">{planName} plan is now active</p>
                  </div>
                  <span className="text-sm text-gray-500">Recent</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Subscribe to a plan to start tracking your advocacy activities.
                </p>
                <Link href="/subscribe">
                  <Button>Choose Your Plan</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plan Features */}
        {hasActiveSubscription && (
          <Card>
            <CardHeader>
              <CardTitle>Your Plan Includes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {user.subscriptionPlan === 'parent-basic' ? (
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
                      <span>Emergency consultation hotline</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-green-600 mr-2 h-5 w-5" />
                      <span>Document review and drafting</span>
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
        )}
      </div>

      <Footer />
    </div>
  );
}
