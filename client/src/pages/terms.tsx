import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Agreement to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  By accessing and using IEP Advocacy services, you accept and agree to be bound by 
                  the terms and provision of this agreement. If you do not agree to abide by the above, 
                  please do not use this service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Service Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  IEP Advocacy provides consultation, support, and advocacy services related to 
                  Individual Education Programs (IEPs) for children with disabilities. Our services include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IEP document review and analysis</li>
                  <li>Meeting preparation and support</li>
                  <li>Educational advocacy guidance</li>
                  <li>Resource and template access</li>
                </ul>
                <p className="mt-4 font-semibold">
                  IMPORTANT: We do not provide legal advice. Our services are educational and 
                  supportive in nature. For legal matters, please consult with a qualified attorney.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Subscription Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Billing</h4>
                    <p>
                      Subscriptions are billed monthly in advance. All fees are non-refundable 
                      except as required by law.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Payment</h4>
                    <p>
                      You agree to pay all fees associated with your subscription plan. Payment 
                      is due monthly in advance.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Cancellation</h4>
                    <p>
                      You may cancel your subscription at any time. Cancellation will take effect 
                      at the end of your current billing period.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. User Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">You agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Use our services in accordance with applicable laws</li>
                  <li>Not share your account access with unauthorized parties</li>
                  <li>Respect the intellectual property rights of our materials</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Confidentiality and Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We are committed to protecting your privacy and the confidentiality of your 
                  child's educational information. All information shared with us will be treated 
                  as confidential and used solely for the purpose of providing our services. 
                  Please refer to our Privacy Policy for detailed information about how we 
                  collect, use, and protect your data.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  IEP Advocacy provides information and support services but cannot guarantee 
                  specific outcomes in your child's educational program. We are not responsible 
                  for decisions made by school districts or the results of IEP meetings. Our 
                  liability is limited to the amount you paid for our services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Termination</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We reserve the right to terminate or suspend your account if you violate these 
                  terms of service. Upon termination, your right to use our services will cease 
                  immediately.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We reserve the right to modify these terms at any time. We will notify you of 
                  any material changes via email or through our website. Your continued use of 
                  our services after such notification constitutes acceptance of the new terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-4">
                  <p>Email: legal@iepadvocacy.com</p>
                  <p>Phone: (555) 123-4567</p>
                  <p>Address: 123 Education Way, Suite 100, City, State 12345</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}