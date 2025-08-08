import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { MessageSquare, Send, Search, Filter, Plus } from "lucide-react";

export default function Messages() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                Messages
              </h1>
              <p className="text-xl text-muted-foreground">
                Communicate with your child's education team
              </p>
            </div>
            <Button className="bg-gradient-to-r from-primary to-secondary">
              <Plus className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Message List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Input placeholder="Search messages..." className="flex-1" />
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        sender: "Ms. Johnson (Special Ed Teacher)",
                        subject: "Progress Update - Reading Goals",
                        time: "2 hours ago",
                        unread: true,
                        preview: "I wanted to share some exciting progress..."
                      },
                      {
                        sender: "Dr. Smith (Speech Therapist)",
                        subject: "Re: Speech Therapy Schedule",
                        time: "1 day ago",
                        unread: false,
                        preview: "Thank you for your flexibility with the..."
                      },
                      {
                        sender: "Principal Martinez",
                        subject: "Upcoming IEP Meeting",
                        time: "2 days ago",
                        unread: true,
                        preview: "We'd like to schedule your annual IEP..."
                      },
                      {
                        sender: "Mrs. Chen (OT)",
                        subject: "Fine Motor Skills Assessment",
                        time: "3 days ago",
                        unread: false,
                        preview: "The assessment results show significant..."
                      }
                    ].map((message, index) => (
                      <div
                        key={index}
                        className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                          message.unread ? 'border-primary bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h4 className={`text-sm font-medium ${message.unread ? 'font-semibold' : ''}`}>
                            {message.sender}
                          </h4>
                          {message.unread && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                        <p className={`text-sm ${message.unread ? 'font-medium' : 'text-muted-foreground'} mb-1`}>
                          {message.subject}
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">{message.preview}</p>
                        <p className="text-xs text-muted-foreground">{message.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Message Thread */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Progress Update - Reading Goals</CardTitle>
                      <CardDescription>Conversation with Ms. Johnson (Special Ed Teacher)</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="secondary">Active</Badge>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
                    <div className="flex justify-start">
                      <div className="max-w-[80%] bg-muted p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Ms. Johnson</span>
                          <span className="text-xs text-muted-foreground">Dec 8, 2:30 PM</span>
                        </div>
                        <p className="text-sm">
                          I wanted to share some exciting progress Sarah has made with her reading comprehension goals. 
                          She's consistently scoring above 80% on our weekly assessments and is showing great improvement 
                          in identifying main ideas and supporting details.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="max-w-[80%] bg-primary text-primary-foreground p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">You</span>
                          <span className="text-xs opacity-90">Dec 8, 3:15 PM</span>
                        </div>
                        <p className="text-sm">
                          That's wonderful news! We've been working on reading together at home too. 
                          Would it be possible to get copies of the assessments to review?
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="max-w-[80%] bg-muted p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Ms. Johnson</span>
                          <span className="text-xs text-muted-foreground">Dec 8, 4:20 PM</span>
                        </div>
                        <p className="text-sm">
                          Absolutely! I'll send home copies with Sarah tomorrow. I'd also like to discuss potentially 
                          adjusting her reading goals upward at our next IEP meeting. She's exceeding our current expectations.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="border-t pt-4">
                    <div className="flex space-x-2">
                      <Textarea 
                        placeholder="Type your message..."
                        className="flex-1 min-h-[80px]"
                      />
                      <Button className="bg-gradient-to-r from-primary to-secondary">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common message templates and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                  <h4 className="font-semibold mb-1">Request Meeting</h4>
                  <p className="text-sm text-muted-foreground text-left">
                    Template for requesting an IEP team meeting
                  </p>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                  <h4 className="font-semibold mb-1">Progress Inquiry</h4>
                  <p className="text-sm text-muted-foreground text-left">
                    Ask about your child's current progress
                  </p>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                  <h4 className="font-semibold mb-1">Concern Report</h4>
                  <p className="text-sm text-muted-foreground text-left">
                    Template for reporting concerns or issues
                  </p>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}