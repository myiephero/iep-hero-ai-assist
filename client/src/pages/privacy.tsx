import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">Last updated: December 2024</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Our Commitment to Privacy</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              IEP Advocacy is committed to protecting your privacy and the confidentiality of your personal 
              and educational information. This Privacy Policy explains how we collect, use, protect, and 
              share information when you use our services.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h4>Personal Information</h4>
            <p>We collect information you provide directly to us, including:</p>
            <ul>
              <li>Name, email address, and contact information</li>
              <li>Payment and billing information (processed securely by Stripe)</li>
              <li>Account credentials and preferences</li>
            </ul>

            <h4>Educational Information</h4>
            <p>To provide advocacy services, we may collect:</p>
            <ul>
              <li>Student information (name, age, grade, disabilities)</li>
              <li>IEP documents and educational records</li>
              <li>School and district information</li>
              <li>Meeting notes and correspondence</li>
            </ul>

            <h4>Technical Information</h4>
            <p>We automatically collect certain information:</p>
            <ul>
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Usage patterns and preferences</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide educational advocacy services and support</li>
              <li>Communicate with you about your account and services</li>
              <li>Process payments and manage subscriptions</li>
              <li>Improve and personalize our services</li>
              <li>Comply with legal obligations</li>
              <li>Protect against fraud and abuse</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Information Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>We do not sell, trade, or rent your personal information. We may share information only in these limited circumstances:</p>
            
            <h4>With Your Consent</h4>
            <p>We may share information when you explicitly authorize us to do so.</p>

            <h4>Service Providers</h4>
            <p>We work with trusted third-party service providers who help us operate our services:</p>
            <ul>
              <li>Payment processing (Stripe)</li>
              <li>Cloud hosting and data storage</li>
              <li>Email and communication services</li>
              <li>Analytics and performance monitoring</li>
            </ul>

            <h4>Legal Requirements</h4>
            <p>We may disclose information if required by law or to:</p>
            <ul>
              <li>Comply with legal process or government requests</li>
              <li>Protect the rights and safety of our users</li>
              <li>Investigate fraud or security issues</li>
              <li>Enforce our Terms of Service</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>FERPA and Educational Records</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              We understand the importance of protecting educational records under the Family Educational 
              Rights and Privacy Act (FERPA). When you share educational documents with us:
            </p>
            <ul>
              <li>We maintain confidentiality as required by FERPA</li>
              <li>Access is limited to authorized advocates working on your case</li>
              <li>We do not share educational records without your written consent</li>
              <li>You maintain all rights to your child's educational records</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>We implement appropriate security measures to protect your information:</p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Secure cloud infrastructure with regular backups</li>
              <li>Access controls and authentication requirements</li>
              <li>Regular security audits and updates</li>
              <li>Staff training on privacy and security practices</li>
            </ul>
            <p>
              However, no method of transmission over the internet is 100% secure. While we strive to 
              protect your information, we cannot guarantee its absolute security.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>You have the following rights regarding your information:</p>
            
            <h4>Access and Updates</h4>
            <ul>
              <li>Review and update your account information</li>
              <li>Request copies of information we have about you</li>
              <li>Correct inaccurate or incomplete information</li>
            </ul>

            <h4>Data Deletion</h4>
            <ul>
              <li>Request deletion of your personal information</li>
              <li>Close your account and remove your data</li>
              <li>Note: We may retain some information as required by law</li>
            </ul>

            <h4>Communication Preferences</h4>
            <ul>
              <li>Opt out of marketing communications</li>
              <li>Manage notification settings</li>
              <li>Choose communication methods</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              Our services are intended for parents and advocates, not for direct use by children under 13. 
              We do not knowingly collect personal information from children under 13. If we become aware 
              that we have collected such information, we will take steps to delete it promptly.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material 
              changes by posting the new policy on this page and updating the "Last updated" date. 
              Your continued use of our services after such changes constitutes your acceptance of the 
              updated policy.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <ul>
              <li>Email: privacy@iepadvocacy.com</li>
              <li>Phone: 1-800-IEP-HELP</li>
              <li>Mail: Privacy Officer, IEP Advocacy Services, 123 Education Way, Suite 100, Learning City, LC 12345</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
