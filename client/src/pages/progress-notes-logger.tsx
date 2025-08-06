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
import { ArrowLeft, FileText, Plus, Filter, Upload, Calendar, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const SERVICE_TYPES = [
  "Speech Therapy",
  "Occupational Therapy", 
  "Physical Therapy",
  "Reading Support",
  "Behavior Intervention",
  "Social Skills Training",
  "Assistive Technology",
  "Counseling Services",
  "Other"
];

const progressNoteSchema = z.object({
  serviceType: z.string().min(1, "Service type is required"),
  date: z.string().min(1, "Date is required"),
  status: z.enum(["yes", "no", "not_sure"], {
    required_error: "Please indicate if service was provided"
  }),
  notes: z.string().min(10, "Please provide at least 10 characters of notes"),
  attachmentUrl: z.string().optional(),
});

type ProgressNoteForm = z.infer<typeof progressNoteSchema>;

export default function ProgressNotesLogger() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");

  // Check if user has Hero plan access
  const hasHeroAccess = user?.planStatus === 'heroOffer' || 
                        user?.email === 'parent@demo.com';

  const form = useForm<ProgressNoteForm>({
    resolver: zodResolver(progressNoteSchema),
    defaultValues: {
      serviceType: "",
      date: new Date().toISOString().split('T')[0], // Today's date
      status: undefined,
      notes: "",
      attachmentUrl: "",
    },
  });

  // Fetch progress notes
  const { data: progressNotes = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/progress-notes'],
    enabled: hasHeroAccess,
  });

  // Create progress note mutation
  const createNoteMutation = useMutation({
    mutationFn: async (data: ProgressNoteForm) => {
      const response = await apiRequest('POST', '/api/progress-notes', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Progress Note Saved",
        description: "Your service note has been logged successfully.",
      });
      form.reset({
        serviceType: "",
        date: new Date().toISOString().split('T')[0],
        status: undefined,
        notes: "",
        attachmentUrl: "",
      });
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['/api/progress-notes'] });
    },
    onError: (error: any) => {
      console.error('Error creating note:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save progress note. Please try again.",
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
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Progress Notes Logger</h2>
              <p className="text-gray-600 mb-6">
                This service tracking tool is available with the Hero Plan ($495/year)
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

  const onSubmit = (data: ProgressNoteForm) => {
    createNoteMutation.mutate(data);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'yes':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Provided</Badge>;
      case 'no':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="w-3 h-3 mr-1" />Not Provided</Badge>;
      case 'not_sure':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><HelpCircle className="w-3 h-3 mr-1" />Unclear</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Filter notes based on selected filters
  const filteredNotes = progressNotes.filter((note: any) => {
    const matchesStatus = statusFilter === 'all' || note.status === statusFilter;
    const matchesService = serviceFilter === 'all' || note.serviceType === serviceFilter;
    return matchesStatus && matchesService;
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
            <h1 className="text-3xl font-bold text-gray-900">Progress Notes Logger</h1>
            <p className="text-gray-600 mt-1">
              Track service delivery and compare what was promised vs. received
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(true)} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={showForm}
          >
            <Plus className="w-4 h-4 mr-2" />
            Log New Note
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Add Progress Note
              </CardTitle>
              <CardDescription>
                Log details about a service your child received (or didn't receive)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select service type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SERVICE_TYPES.map((service) => (
                                <SelectItem key={service} value={service}>
                                  {service}
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
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Date</FormLabel>
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
                  </div>

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Was the service provided?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="yes" />
                              <Label htmlFor="yes" className="text-green-700">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="no" />
                              <Label htmlFor="no" className="text-red-700">No</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="not_sure" id="not_sure" />
                              <Label htmlFor="not_sure" className="text-yellow-700">Not Sure</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="What happened? Did your child mention anything? Did you get a report from the school?"
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
                    name="attachmentUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attachment URL (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Upload className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              {...field} 
                              placeholder="Link to document, email, or evidence"
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
                      disabled={createNoteMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700">
                      {createNoteMutation.isPending ? "Saving..." : "Save Note"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Progress Notes Display */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Progress Notes</CardTitle>
                <CardDescription>
                  {filteredNotes.length} notes logged
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
                      <SelectItem value="yes">Provided</SelectItem>
                      <SelectItem value="no">Not Provided</SelectItem>
                      <SelectItem value="not_sure">Unclear</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    {SERVICE_TYPES.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
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
                <p className="text-gray-600">Loading progress notes...</p>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No progress notes found</p>
                <p className="text-sm text-gray-500">
                  {(progressNotes as any[]).length === 0 
                    ? "Start logging your child's service delivery to track progress"
                    : "Try adjusting your filters to see more notes"
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotes.map((note: any) => (
                  <div key={note.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">{formatDate(note.date)}</span>
                        <Badge variant="outline">{note.serviceType}</Badge>
                        {getStatusBadge(note.status)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{note.notes}</p>
                    {note.attachmentUrl && (
                      <a 
                        href={note.attachmentUrl} 
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