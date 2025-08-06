import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageSquare, Plus, Filter, Upload, Calendar, CheckCircle, Clock, AlertTriangle, Mail, Phone, MessageCircle, FileText } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const COMMUNICATION_TYPES = [
  { value: "email", label: "Email", icon: Mail },
  { value: "in-person", label: "In-Person", icon: MessageCircle },
  { value: "phone", label: "Phone Call", icon: Phone },
  { value: "written", label: "Written Note", icon: FileText }
];

const SUBJECT_TYPES = [
  "IEP Request",
  "Service Concern",
  "Data Request", 
  "Meeting Request",
  "Behavior Support",
  "Assessment Request",
  "Placement Discussion",
  "Progress Update",
  "Other"
];

const communicationLogSchema = z.object({
  dateSent: z.string().min(1, "Date is required"),
  communicationType: z.string().min(1, "Communication type is required"),
  subject: z.string().min(1, "Subject is required"),
  summary: z.string().min(10, "Please provide at least 10 characters of summary"),
  responseReceived: z.boolean(),
  dateResponse: z.string().optional(),
  attachmentUrl: z.string().optional(),
});

type CommunicationLogForm = z.infer<typeof communicationLogSchema>;

export default function CommunicationTracker() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Check if user has Hero plan access
  const hasHeroAccess = user?.planStatus === 'heroOffer' || 
                        user?.email === 'parent@demo.com';

  const form = useForm<CommunicationLogForm>({
    resolver: zodResolver(communicationLogSchema),
    defaultValues: {
      dateSent: new Date().toISOString().split('T')[0],
      communicationType: "",
      subject: "",
      summary: "",
      responseReceived: false,
      dateResponse: "",
      attachmentUrl: "",
    },
  });

  // Watch for response received changes
  const responseReceived = form.watch("responseReceived");

  // Fetch communication logs
  const { data: communicationLogs = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/communication-logs'],
    enabled: hasHeroAccess,
  });

  // Create communication log mutation
  const createLogMutation = useMutation({
    mutationFn: async (data: CommunicationLogForm) => {
      const response = await apiRequest('POST', '/api/communication-logs', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Communication Logged",
        description: "Your communication has been logged successfully.",
      });
      form.reset({
        dateSent: new Date().toISOString().split('T')[0],
        communicationType: "",
        subject: "",
        summary: "",
        responseReceived: false,
        dateResponse: "",
        attachmentUrl: "",
      });
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['/api/communication-logs'] });
    },
    onError: (error: any) => {
      console.error('Error creating log:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save communication log. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!hasHeroAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/dashboard-parent">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <Card className="text-center p-8">
            <CardContent>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Communication Tracker</h2>
              <p className="text-gray-600 mb-6">
                This communication tracking tool is available with the Hero Plan ($495/year)
              </p>
              <Link href="/subscribe">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  Upgrade to Hero Plan
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const onSubmit = (data: CommunicationLogForm) => {
    createLogMutation.mutate(data);
  };

  const getStatusBadge = (log: any) => {
    if (log.responseReceived) {
      return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Responded</Badge>;
    }
    
    const daysSince = Math.floor((new Date().getTime() - new Date(log.dateSent).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince >= 10) {
      return <Badge className="bg-red-100 text-red-800 border-red-200"><AlertTriangle className="w-3 h-3 mr-1" />Overdue ({daysSince}d)</Badge>;
    }
    
    return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Waiting ({daysSince}d)</Badge>;
  };

  const getCommunicationIcon = (type: string) => {
    const typeObj = COMMUNICATION_TYPES.find(t => t.value === type);
    if (!typeObj) return <MessageSquare className="w-4 h-4" />;
    const Icon = typeObj.icon;
    return <Icon className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Filter logs based on selected filters
  const filteredLogs = communicationLogs.filter((log: any) => {
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'responded' && log.responseReceived) ||
      (statusFilter === 'waiting' && !log.responseReceived) ||
      (statusFilter === 'overdue' && !log.responseReceived && 
        Math.floor((new Date().getTime() - new Date(log.dateSent).getTime()) / (1000 * 60 * 60 * 24)) >= 10);
    const matchesType = typeFilter === 'all' || log.communicationType === typeFilter;
    return matchesStatus && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard-parent">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Communication Tracker</h1>
            <p className="text-gray-600 mt-1">
              Track your school communications and stay organized with follow-ups
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(true)} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={showForm}
          >
            <Plus className="w-4 h-4 mr-2" />
            Log Communication
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Log New Communication
              </CardTitle>
              <CardDescription>
                Record your communication with the school team and track responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="dateSent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date Sent</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input {...field} type="date" className="pl-10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="communicationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Communication Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select communication type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {COMMUNICATION_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex items-center">
                                    <type.icon className="w-4 h-4 mr-2" />
                                    {type.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject/Request Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SUBJECT_TYPES.map((subject) => (
                              <SelectItem key={subject} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brief Summary</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe what you communicated about, what you requested, and any key details..."
                            rows={4}
                            className="resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="responseReceived"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Was a response received?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => field.onChange(value === 'true')}
                            value={field.value ? 'true' : 'false'}
                            className="flex space-x-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="true" id="response-yes" />
                              <Label htmlFor="response-yes" className="text-green-700">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="false" id="response-no" />
                              <Label htmlFor="response-no" className="text-red-700">No</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {responseReceived && (
                    <FormField
                      control={form.control}
                      name="dateResponse"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Response</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input {...field} type="date" className="pl-10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="attachmentUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attachment URL (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Upload className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              {...field} 
                              placeholder="Link to email screenshot or document"
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createLogMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700">
                      {createLogMutation.isPending ? "Saving..." : "Save Communication"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Communication Timeline */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Communication Timeline</CardTitle>
                <CardDescription>
                  {filteredLogs.length} communications logged
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="responded">Responded</SelectItem>
                      <SelectItem value="waiting">Waiting</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {COMMUNICATION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-600">Loading communications...</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No communications found</p>
                <p className="text-sm text-gray-500">
                  {(communicationLogs as any[]).length === 0 
                    ? "Start logging your school communications to stay organized"
                    : "Try adjusting your filters to see more communications"
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLogs.map((log: any) => (
                  <div key={log.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getCommunicationIcon(log.communicationType)}
                          <span className="font-medium text-gray-900">{formatDate(log.dateSent)}</span>
                        </div>
                        <Badge variant="outline">{log.subject}</Badge>
                        {getStatusBadge(log)}
                      </div>
                      {log.dateResponse && (
                        <span className="text-sm text-gray-500">
                          Responded: {formatDate(log.dateResponse)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{log.summary}</p>
                    {log.attachmentUrl && (
                      <a 
                        href={log.attachmentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        View Attachment
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}