import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { TrendingUp, Target, Calendar, Award } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Progress Tracking
            </h1>
            <p className="text-xl text-muted-foreground">
              Monitor your child's progress toward IEP goals and objectives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">+12% from last quarter</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Goals Met</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7/9</div>
                <p className="text-xs text-muted-foreground">Goals on track</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Quarter</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Q2</div>
                <p className="text-xs text-muted-foreground">Oct - Dec 2024</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Milestones reached</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* IEP Goals Progress */}
            <Card>
              <CardHeader>
                <CardTitle>IEP Goals Progress</CardTitle>
                <CardDescription>Current progress on annual goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Reading Comprehension</span>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <Progress value={85} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1">Target: 80% by May 2025</p>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Math Problem Solving</span>
                    <span className="text-sm text-muted-foreground">72%</span>
                  </div>
                  <Progress value={72} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1">Target: 75% by May 2025</p>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Social Communication</span>
                    <span className="text-sm text-muted-foreground">91%</span>
                  </div>
                  <Progress value={91} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1">Target: 85% by May 2025</p>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Fine Motor Skills</span>
                    <span className="text-sm text-muted-foreground">68%</span>
                  </div>
                  <Progress value={68} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1">Target: 70% by May 2025</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Progress Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Progress Reports</CardTitle>
                <CardDescription>Latest updates from your child's team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      subject: "Speech Therapy",
                      date: "Dec 1, 2024",
                      progress: "Excellent progress on articulation goals",
                      status: "On Track"
                    },
                    {
                      subject: "Math Support",
                      date: "Nov 28, 2024", 
                      progress: "Steady improvement in problem-solving strategies",
                      status: "On Track"
                    },
                    {
                      subject: "Reading Support",
                      date: "Nov 25, 2024",
                      progress: "Exceeding expectations in comprehension",
                      status: "Ahead"
                    },
                    {
                      subject: "Occupational Therapy",
                      date: "Nov 20, 2024",
                      progress: "Working on fine motor coordination",
                      status: "Needs Support"
                    }
                  ].map((report, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{report.subject}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          report.status === 'Ahead' ? 'bg-green-100 text-green-800' :
                          report.status === 'On Track' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{report.progress}</p>
                      <p className="text-xs text-muted-foreground">{report.date}</p>
                    </div>
                  ))}
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