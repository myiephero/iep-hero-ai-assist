import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">Last updated: December 2024</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              By accessing and using IEP Advocacy services, you agree to be bound by these Terms of Service 
              and all applicable laws and regulations. If you do not agree with any of these terms, you are 
              prohibited from using our services.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Service Description</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              IEP Advocacy provides educational advocacy services, consultation, and support for families 
              navigating the Individualized Education Program (IEP) process. Our services include:
            </p>
            <ul>
              <li>Educational advocacy consultation</li>
              <li>IEP meeting support and preparation</li>
              <li>Document review and guidance</li>
              <li>Educational rights information</li>
              <li>Resource library access</li>
            </ul>
            <p>
              <strong>Important:</strong> Our services do not constitute legal advice. We are educational 
              advocates, not attorneys. For legal matters, we can provide referrals to qualified attorneys.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Subscription Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h4>Billing and Payment</h4>
            <ul>
              <li>Subscriptions are billed monthly in advance</li>
              <li>Payment is processed automatically via Stripe</li>
              <li>Prices are subject to change with 30 days notice</li>
              <li>No refunds for partial months of service</li>
            </ul>
            
            <h4>Cancellation</h4>
            <ul>
              <li>You may cancel your subscription at any time</li>
              <li>Cancellation takes effect at the end of the current billing period</li>
              <li>You retain access to services until the end of the paid period</li>
              <li>Canceled accounts cannot be reactivated; you must subscribe again</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>User Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>You agree to:</p>
            <ul>
              <li>Provide accurate and current information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Use services only for lawful purposes</li>
              <li>Respect the confidentiality of other families</li>
              <li>Not share your account access with others</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Confidentiality and Privacy</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              We maintain strict confidentiality regarding all client information and educational records. 
              Our advocates are bound by professional ethical standards. We will not share your information 
              without your written consent, except as required by law.
            </p>
            <p>
              For details on how we collect and use your personal information, please review our Privacy Policy.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              IEP Advocacy services are provided on an "as is" basis. We make no warranties regarding the 
              outcome of educational advocacy efforts. Educational decisions remain with school districts 
              and educational teams.
            </p>
            <p>
              Our liability is limited to the amount paid for services in the month when any alleged 
              damage occurred. We are not liable for indirect, consequential, or punitive damages.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Termination</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              We reserve the right to terminate or suspend your account and access to services immediately, 
              without prior notice, for any violation of these Terms of Service or for any other reason 
              deemed necessary by us.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              We reserve the right to modify these Terms of Service at any time. Changes will be posted 
              on this page with an updated "Last updated" date. Continued use of our services after 
              changes constitutes acceptance of the new terms.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              If you have questions about these Terms of Service, please contact us:
            </p>
            <ul>
              <li>Email: legal@iepadvocacy.com</li>
              <li>Phone: 1-800-IEP-HELP</li>
              <li>Mail: IEP Advocacy Services, 123 Education Way, Suite 100, Learning City, LC 12345</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
