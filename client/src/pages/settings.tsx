import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Download,
  Mail,
  Phone,
  MapPin,
  Save
} from "lucide-react";

export default function Settings() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account preferences and settings.</p>
          </div>

          <div className="space-y-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your personal information and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter your first name" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter your last name" defaultValue="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Address
                  </Label>
                  <Input id="email" type="email" placeholder="Enter your email" defaultValue="john.doe@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone Number
                  </Label>
                  <Input id="phone" type="tel" placeholder="Enter your phone number" defaultValue="+1 (555) 123-4567" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Address
                  </Label>
                  <Input id="address" placeholder="Enter your address" defaultValue="123 Main St, City, State 12345" />
                </div>

                <Separator />
                
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to be notified about IEP updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Meeting Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get notified before IEP meetings</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Progress Updates</Label>
                    <p className="text-sm text-muted-foreground">Weekly progress report summaries</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Document Changes</Label>
                    <p className="text-sm text-muted-foreground">Notifications when IEP documents are updated</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security & Privacy
                </CardTitle>
                <CardDescription>Manage your account security and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Change Password</Label>
                  <div className="flex space-x-2">
                    <Input type="password" placeholder="Current password" className="flex-1" />
                    <Input type="password" placeholder="New password" className="flex-1" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Data Sharing</Label>
                    <p className="text-sm text-muted-foreground">Allow anonymous usage analytics</p>
                  </div>
                  <Switch />
                </div>

                <Separator />
                
                <Button>Update Security Settings</Button>
              </CardContent>
            </Card>

            {/* Subscription Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Subscription & Billing
                </CardTitle>
                <CardDescription>Manage your subscription and payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Current Plan: Premium</p>
                    <p className="text-sm text-muted-foreground">$99/month • Next billing: Jan 15, 2025</p>
                  </div>
                  <Button variant="outline">Manage Subscription</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-renewal</Label>
                    <p className="text-sm text-muted-foreground">Automatically renew your subscription</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                  <Button variant="outline">Update Payment Method</Button>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Export or delete your account data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="destructive">Delete Account</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Account deletion is permanent and cannot be undone. All your IEP data will be permanently removed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}