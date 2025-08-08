import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Shield, BookOpen, Users, Clock, FileText, Phone } from "lucide-react";

export default function Rights() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Your Rights Under IDEA
            </h1>
            <p className="text-xl text-muted-foreground">
              Understanding your family's rights in special education
            </p>
          </div>

          <div className="space-y-6">
            {/* Core Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Fundamental Rights
                </CardTitle>
                <CardDescription>Your basic rights under the Individuals with Disabilities Education Act</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Badge className="mt-1">FAPE</Badge>
                      <div>
                        <h4 className="font-semibold">Free Appropriate Public Education</h4>
                        <p className="text-sm text-muted-foreground">
                          Your child has the right to special education and related services at no cost
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Badge className="mt-1">LRE</Badge>
                      <div>
                        <h4 className="font-semibold">Least Restrictive Environment</h4>
                        <p className="text-sm text-muted-foreground">
                          Education alongside non-disabled peers to the maximum extent appropriate
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Badge className="mt-1">IEP</Badge>
                      <div>
                        <h4 className="font-semibold">Individualized Education Program</h4>
                        <p className="text-sm text-muted-foreground">
                          A written plan designed specifically for your child's unique needs
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Badge className="mt-1">ESY</Badge>
                      <div>
                        <h4 className="font-semibold">Extended School Year</h4>
                        <p className="text-sm text-muted-foreground">
                          Services beyond the regular school year if needed to prevent regression
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Procedural Safeguards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Procedural Safeguards
                </CardTitle>
                <CardDescription>Legal protections and processes available to you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">Prior Written Notice</h4>
                    <p className="text-sm text-muted-foreground">
                      The school must provide written notice before proposing or refusing to change your child's program
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">Parental Consent</h4>
                    <p className="text-sm text-muted-foreground">
                      Your written consent is required for initial evaluation, initial services, and reevaluations
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">Access to Records</h4>
                    <p className="text-sm text-muted-foreground">
                      You have the right to inspect and review all educational records related to your child
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">Independent Educational Evaluation</h4>
                    <p className="text-sm text-muted-foreground">
                      You may request an independent evaluation at public expense if you disagree with the school's evaluation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Participation Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Participation Rights
                </CardTitle>
                <CardDescription>Your role in your child's education decisions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">IEP Team Participation</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Participate in all IEP meetings</li>
                      <li>• Provide input on goals and services</li>
                      <li>• Bring advocates or support persons</li>
                      <li>• Request additional team members</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Decision Making</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Equal voice in placement decisions</li>
                      <li>• Right to disagree with proposals</li>
                      <li>• Request mediation or due process</li>
                      <li>• File complaints with state education agency</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Important Timelines
                </CardTitle>
                <CardDescription>Key deadlines and timeframes you should know</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span className="font-medium">Initial Evaluation</span>
                    <Badge variant="outline">60 school days</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span className="font-medium">IEP Meeting After Evaluation</span>
                    <Badge variant="outline">30 calendar days</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span className="font-medium">Annual IEP Review</span>
                    <Badge variant="outline">12 months</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span className="font-medium">Reevaluation</span>
                    <Badge variant="outline">3 years (or sooner)</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Need Help?
                </CardTitle>
                <CardDescription>Resources when you need support with your rights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Parent Training & Information Centers</h4>
                    <p className="text-sm text-muted-foreground">Free training and support for parents</p>
                    <p className="text-sm font-medium">1-888-248-0822</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Disability Rights Organizations</h4>
                    <p className="text-sm text-muted-foreground">Legal advocacy and support</p>
                    <p className="text-sm font-medium">Contact your state's protection & advocacy agency</p>
                  </div>
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