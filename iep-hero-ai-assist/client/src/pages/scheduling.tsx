import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Calendar, Clock, Users, MapPin, Video, Plus } from "lucide-react";

export default function Scheduling() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                Meeting Scheduler
              </h1>
              <p className="text-xl text-muted-foreground">
                Schedule and manage your IEP meetings and appointments
              </p>
            </div>
            <Button className="bg-gradient-to-r from-primary to-secondary">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar View */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    December 2024
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 35 }, (_, i) => {
                      const date = i - 6; // Adjust for calendar start
                      const isCurrentMonth = date > 0 && date <= 31;
                      const hasEvent = [15, 22, 28].includes(date);
                      
                      return (
                        <div
                          key={i}
                          className={`p-2 h-12 border rounded text-center text-sm ${
                            isCurrentMonth ? 'hover:bg-muted cursor-pointer' : 'text-muted-foreground'
                          } ${hasEvent ? 'bg-primary/20 border-primary' : ''}`}
                        >
                          {isCurrentMonth ? date : ''}
                          {hasEvent && <div className="w-2 h-2 bg-primary rounded-full mx-auto mt-1"></div>}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Meetings */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Meetings</CardTitle>
                  <CardDescription>Your scheduled appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Annual IEP Review</h4>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                          Required
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Dec 15, 2024
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          2:00 PM - 3:30 PM
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          Conference Room A
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          6 attendees
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Speech Therapy Check-in</h4>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Virtual
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Dec 22, 2024
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          10:00 AM - 10:30 AM
                        </div>
                        <div className="flex items-center">
                          <Video className="h-3 w-3 mr-1" />
                          Zoom Meeting
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Progress Review</h4>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Optional
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Dec 28, 2024
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          1:00 PM - 2:00 PM
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          Library
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Meeting Types */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Meeting Types</CardTitle>
              <CardDescription>Different types of meetings you can schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold mb-2">IEP Team Meeting</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Annual review, goal setting, or program changes
                  </p>
                  <Button variant="outline" size="sm" className="w-full">Schedule</Button>
                </div>
                
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold mb-2">Progress Conference</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Review progress toward current goals
                  </p>
                  <Button variant="outline" size="sm" className="w-full">Schedule</Button>
                </div>
                
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold mb-2">Service Planning</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Plan therapy services and supports
                  </p>
                  <Button variant="outline" size="sm" className="w-full">Schedule</Button>
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