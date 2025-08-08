import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Our Commitment to Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  At IEP Advocacy, we are committed to protecting your privacy and the confidentiality 
                  of your personal information. This Privacy Policy explains how we collect, use, 
                  disclose, and safeguard your information when you use our services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Information We Collect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Personal Information</h4>
                    <p>
                      We may collect personal information that you voluntarily provide, including:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Name and contact information</li>
                      <li>Payment and billing information</li>
                      <li>Child's educational information (IEP documents, assessment reports)</li>
                      <li>Communication preferences</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold">Usage Information</h4>
                    <p>
                      We automatically collect certain information about your use of our services:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Log data and usage patterns</li>
                      <li>Device and browser information</li>
                      <li>IP address and location data</li>
                      <li>Cookies and similar technologies</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">We use your information to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide and improve our advocacy services</li>
                  <li>Process payments and manage your account</li>
                  <li>Communicate with you about our services</li>
                  <li>Analyze and enhance user experience</li>
                  <li>Comply with legal obligations</li>
                  <li>Protect against fraud and security threats</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Information Sharing and Disclosure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    We do not sell, trade, or rent your personal information to third parties. 
                    We may share your information only in the following circumstances:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>With your explicit consent</li>
                    <li>To comply with legal requirements or court orders</li>
                    <li>To protect our rights, property, or safety</li>
                    <li>With trusted service providers who assist in our operations</li>
                    <li>In connection with a business transfer or merger</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  We implement appropriate technical and organizational security measures to protect 
                  your personal information, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Limited access to personal information</li>
                  <li>Secure payment processing</li>
                  <li>Employee training on data protection</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Rights and Choices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access and review your personal information</li>
                  <li>Request corrections to inaccurate data</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request data portability</li>
                  <li>File a complaint with regulatory authorities</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  While our services relate to children's education, we do not knowingly collect 
                  personal information directly from children under 13. We collect information 
                  about children only from their parents or guardians for the purpose of providing 
                  advocacy services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We retain your personal information for as long as necessary to provide our services 
                  and comply with legal obligations. When you cancel your account, we will delete 
                  your personal information within 30 days, unless we are required to retain it 
                  for legal purposes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any 
                  material changes by posting the new policy on our website and sending you an 
                  email notification. Your continued use of our services after such notification 
                  constitutes acceptance of the updated policy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  If you have any questions about this Privacy Policy or our data practices, 
                  please contact us:
                </p>
                <div>
                  <p>Email: privacy@iepadvocacy.com</p>
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