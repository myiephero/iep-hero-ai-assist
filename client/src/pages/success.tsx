import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, BookOpen, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Success() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate some loading time to allow for data refresh
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Processing your subscription...</p>
        </div>
      </div>
    );
  }

  const planBenefits = {
    'parent-basic': [
      'Monthly IEP review sessions',
      'Email support within 24 hours',
      'Access to resource library',
      'Basic goal writing templates'
    ],
    'parent-premium': [
      'Unlimited IEP consultations',
      'Priority email support',
      'Meeting preparation assistance',
      'Custom goal writing help',
      'Progress monitoring tools'
    ],
    'advocate-basic': [
      'Client management dashboard',
      'Document template library',
      'Basic analytics and reporting',
      'Email support'
    ],
    'advocate-pro': [
      'Advanced client management',
      'Custom branded materials',
      'Comprehensive analytics',
      'Priority support',
      'Training resource access'
    ]
  };

  const currentPlanBenefits = (user as any)?.subscriptionPlan 
    ? planBenefits[(user as any).subscriptionPlan as keyof typeof planBenefits] || []
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Welcome to IEP Advocacy!</h1>
            <p className="text-xl text-muted-foreground mb-2">
              Your subscription is now active
            </p>
            {(user as any)?.subscriptionPlan && (
              <p className="text-lg">
                Plan: <span className="font-semibold">{(user as any).subscriptionPlan}</span>
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  What's Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Schedule Your First Call</h4>
                    <p className="text-sm text-muted-foreground">
                      Book a consultation to discuss your IEP needs
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Explore Resources</h4>
                    <p className="text-sm text-muted-foreground">
                      Access our library of IEP guides and templates
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Get Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Reach out whenever you need help
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Plan Benefits</CardTitle>
                <CardDescription>
                  Here's what's included in your subscription
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentPlanBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-x-4">
            <Button size="lg">
              Go to Dashboard
            </Button>
            <Button variant="outline" size="lg">
              Schedule First Call
            </Button>
          </div>

          <Card className="mt-12">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Our team is here to support you every step of the way. If you have any questions
                or need assistance getting started, don't hesitate to reach out.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <h4 className="font-semibold">Email Support</h4>
                  <p className="text-muted-foreground">support@iepadvocacy.com</p>
                </div>
                <div>
                  <h4 className="font-semibold">Phone Support</h4>
                  <p className="text-muted-foreground">(555) 123-4567</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}