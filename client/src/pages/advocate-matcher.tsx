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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Users, Calendar, Phone, Video, Mail, CheckCircle, GraduationCap, Building } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AdvocateMatchConfirmation } from "@/components/AdvocateMatchConfirmation";

const HELP_AREAS = [
  "IEP Evaluation Request",
  "Requesting New Services", 
  "Preparing for IEP Meeting",
  "Understanding Rights & Laws",
  "Behavior Support Plans",
  "Transition Planning",
  "Dispute Resolution",
  "Data Collection & Progress"
];

const GRADE_LEVELS = [
  "Pre-K", "Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade",
  "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade"
];

const CONTACT_METHODS = [
  { value: "phone", label: "Phone Call", icon: Phone },
  { value: "zoom", label: "Video Call (Zoom)", icon: Video },
  { value: "email", label: "Email Exchange", icon: Mail }
];

// Match your exact Supabase function format
const advocateMatchSchema = z.object({
  meetingDate: z.string().optional(),
  contactMethod: z.string().min(1, "Please select a preferred contact method"),
  availability: z.string().min(10, "Please describe your availability"),
  concerns: z.string().min(20, "Please describe your biggest concern (at least 20 characters)"),
  helpAreas: z.array(z.string()).min(1, "Please select at least one help area"),
  gradeLevel: z.string().min(1, "Child's grade level is required"),
  schoolDistrict: z.string().min(2, "School district is required"),
  selectedAdvocate: z.string().optional(),
  uploadedFiles: z.array(z.string()).optional(),
});

type AdvocateMatchForm = z.infer<typeof advocateMatchSchema>;

export default function AdvocateMatcher() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [matchData, setMatchData] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Check if user has Hero plan access
  const hasHeroAccess = user?.planStatus === 'heroOffer' || 
                        user?.email === 'parent@demo.com';

  const form = useForm<AdvocateMatchForm>({
    resolver: zodResolver(advocateMatchSchema),
    defaultValues: {
      meetingDate: "",
      contactMethod: "",
      availability: "",
      concerns: "",
      helpAreas: [],
      gradeLevel: "",
      schoolDistrict: "",
      selectedAdvocate: "",
      uploadedFiles: [],
    },
  });

  // Create advocate match mutation
  const createMatchMutation = useMutation({
    mutationFn: async (data: AdvocateMatchForm) => {
      const response = await apiRequest('POST', '/api/advocate-matches', data);
      return response.json();
    },
    onSuccess: (result) => {
      const savedTo = result.savedTo === 'local' ? 'development database' : 'Supabase';
      console.log(`✅ Data saved to: ${savedTo}`);
      
      // Store match data and show animated confirmation
      setMatchData(result.match);
      setShowConfirmation(true);
    },
    onError: (error: any) => {
      console.error('Error creating match:', error);
      toast({
        title: "Submission Failed",
        description: "Unable to submit your match request. Please try again.",
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
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Advocate Matcher</h2>
              <p className="text-gray-600 mb-6">
                Get matched with an expert IEP advocate - available with the Hero Plan ($495/year)
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

  // Show animated confirmation sequence
  if (showConfirmation && matchData) {
    return (
      <>
        <AdvocateMatchConfirmation 
          matchData={matchData}
          onComplete={() => {
            setShowConfirmation(false);
            setIsSubmitted(true);
          }}
        />
      </>
    );
  }

  if (isSubmitted) {
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

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">Welcome Back!</CardTitle>
              <CardDescription>
                Your advocate match has been successfully processed.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Ready for Another Match?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  You can submit additional requests or return to your dashboard to access all Hero Plan tools.
                </p>
              </div>
              
              <div className="flex gap-3 justify-center">
                <Link href="/dashboard-parent">
                  <Button variant="outline">
                    Back to Dashboard
                  </Button>
                </Link>
                <Button onClick={() => window.location.reload()}>
                  Submit Another Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const onSubmit = (data: AdvocateMatchForm) => {
    createMatchMutation.mutate(data);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

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

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Matched with an IEP Advocate</h1>
          <p className="text-gray-600">
            Tell us about your situation and we'll connect you with an expert advocate who can help
          </p>
          
          {/* Progress indicator */}
          <div className="flex items-center mt-6 mb-8">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              {step === 1 && "Basic Information"}
              {step === 2 && "Your IEP Needs"}
              {step === 3 && "Contact & Scheduling"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about your child and school district"}
              {step === 2 && "What areas do you need help with?"}
              {step === 3 && "How would you like to connect with your advocate?"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Step 1: Basic Information */}
                {step === 1 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="gradeLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Child's Current Grade Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select grade level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {GRADE_LEVELS.map((grade) => (
                                <SelectItem key={grade} value={grade}>
                                  <div className="flex items-center">
                                    <GraduationCap className="w-4 h-4 mr-2" />
                                    {grade}
                                  </div>
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
                      name="schoolDistrict"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School District or City</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input {...field} placeholder="e.g., Austin ISD or San Francisco, CA" className="pl-10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: IEP Needs */}
                {step === 2 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="helpAreas"
                      render={() => (
                        <FormItem>
                          <FormLabel>What areas do you need help with? (Select all that apply)</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {HELP_AREAS.map((area) => (
                              <FormField
                                key={area}
                                control={form.control}
                                name="helpAreas"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(area)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, area])
                                            : field.onChange(field.value?.filter((value) => value !== area))
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {area}
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="concerns"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What's your biggest concern or challenge right now?</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Describe your situation, what's not working, what you're worried about, or what you're trying to achieve..."
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
                      name="meetingDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Next IEP Meeting Date (if scheduled)</FormLabel>
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
                )}

                {/* Step 3: Contact & Scheduling */}
                {step === 3 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="contactMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How would you prefer to meet with your advocate?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="grid grid-cols-1 md:grid-cols-3 gap-4"
                            >
                              {CONTACT_METHODS.map((method) => (
                                <div key={method.value} className="flex items-center space-x-2 border rounded-lg p-4">
                                  <RadioGroupItem value={method.value} id={method.value} />
                                  <Label htmlFor={method.value} className="flex items-center cursor-pointer">
                                    <method.icon className="w-4 h-4 mr-2" />
                                    {method.label}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="availability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>When are you typically available?</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="e.g., Weekday evenings after 6pm, Saturday mornings, flexible during school hours..."
                              rows={3}
                              className="resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="selectedAdvocate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Advocate (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Auto-assign best match or choose specific advocate" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">Auto-assign best match</SelectItem>

                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500">
                            Leave blank for automatic matching based on your needs
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="flex justify-between pt-6">
                  {step > 1 ? (
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Previous
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  
                  {step < 3 ? (
                    <Button type="button" onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
                      Next
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={createMatchMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {createMatchMutation.isPending ? "Submitting..." : "Submit Match Request"}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}