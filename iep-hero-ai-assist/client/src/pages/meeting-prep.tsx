import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { CheckCircle, Calendar, FileText, Users, Clock, AlertTriangle } from "lucide-react";

export default function MeetingPrep() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              IEP Meeting Preparation
            </h1>
            <p className="text-xl text-muted-foreground">
              Get ready for your child's IEP meeting with our comprehensive preparation guide
            </p>
          </div>

          <div className="space-y-6">
            {/* Pre-Meeting Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Pre-Meeting Checklist
                </CardTitle>
                <CardDescription>Essential steps to take before your IEP meeting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "Review current IEP and progress reports",
                    "Gather recent work samples and assessments",
                    "Prepare questions about goals and services",
                    "List concerns and observations",
                    "Research potential accommodations",
                    "Bring support person if desired"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Meeting Agenda Template */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Typical Meeting Agenda
                </CardTitle>
                <CardDescription>What to expect during your IEP meeting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">1. Introductions & Review (10 min)</h4>
                    <p className="text-sm text-muted-foreground">Team introductions and review of previous IEP</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">2. Present Levels of Performance (15 min)</h4>
                    <p className="text-sm text-muted-foreground">Discussion of current academic and functional performance</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">3. Goals Development (20 min)</h4>
                    <p className="text-sm text-muted-foreground">Creating or revising annual IEP goals</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">4. Services & Placement (15 min)</h4>
                    <p className="text-sm text-muted-foreground">Determining special education services and placement</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions to Ask */}
            <Card>
              <CardHeader>
                <CardTitle>Important Questions to Ask</CardTitle>
                <CardDescription>Key questions that will help you advocate effectively</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">About Progress</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• How is my child progressing toward current goals?</li>
                      <li>• What data supports this progress?</li>
                      <li>• Are current goals appropriate?</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">About Services</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• What services are being recommended?</li>
                      <li>• How often will services be provided?</li>
                      <li>• Where will services take place?</li>
                    </ul>
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