import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleAwareDashboard } from "@/utils/navigation";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { ArrowLeft, Brain, Copy, Save, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const autismAccommodationSchema = z.object({
  childName: z.string().min(1, "Child's name is required"),
  gradeLevel: z.string().min(1, "Grade level is required"),
  diagnosisAreas: z.array(z.string()).min(1, "Please select at least one diagnosis area"),
  sensoryPreferences: z.string().min(1, "Please describe sensory preferences"),
  behavioralChallenges: z.string().min(1, "Please describe behavioral challenges"),
  communicationStyle: z.string().min(1, "Communication style is required"),
  additionalNotes: z.string().optional(),
});

type AutismAccommodationForm = z.infer<typeof autismAccommodationSchema>;

const GRADE_LEVELS = [
  "Pre-K", "Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", 
  "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", 
  "11th Grade", "12th Grade"
];

const DIAGNOSIS_AREAS = [
  "Autism Spectrum Disorder",
  "ADHD",
  "Sensory Processing Disorder",
  "Anxiety Disorder",
  "Communication Delays",
  "Executive Functioning Challenges",
  "Other"
];

const COMMUNICATION_STYLES = [
  "Verbal",
  "Non-verbal with AAC device",
  "Limited verbal with gestures",
  "Picture exchange (PECS)",
  "Sign language",
  "Mixed communication methods"
];

interface Accommodation {
  title: string;
  description: string;
  category: string;
  implementation: string;
}

export default function AutismAccommodations() {
  const { user } = useAuth();
  const { getDashboardRoute } = useRoleAwareDashboard();
  const { toast } = useToast();
  const [generatedAccommodations, setGeneratedAccommodations] = useState<Accommodation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedSessions, setSavedSessions] = useState<any[]>([]);

  const form = useForm<AutismAccommodationForm>({
    resolver: zodResolver(autismAccommodationSchema),
    defaultValues: {
      childName: "",
      gradeLevel: "",
      diagnosisAreas: ["Autism Spectrum Disorder"],
      sensoryPreferences: "",
      behavioralChallenges: "",
      communicationStyle: "",
      additionalNotes: "",
    },
  });

  // Fetch saved sessions for logged-in users
  const { data: sessions } = useQuery({
    queryKey: ['/api/autism-accommodations/sessions'],
    enabled: !!user,
  });

  // Generate accommodations mutation
  const generateAccommodationsMutation = useMutation({
    mutationFn: async (data: AutismAccommodationForm) => {
      console.log('🧠 Generating autism accommodations:', data);
      const response = await apiRequest('POST', '/api/autism-accommodations/generate', data);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP ${response.status}: Failed to generate accommodations`);
      }
      
      return await response.json();
    },
    onSuccess: (result) => {
      console.log('✅ Accommodations generated:', result);
      setGeneratedAccommodations(result.accommodations || []);
      toast({
        title: "Accommodations Generated!",
        description: `Generated ${result.accommodations?.length || 0} autism-specific accommodations.`,
      });
    },
    onError: (error: any) => {
      console.error('❌ Error generating accommodations:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Unable to generate accommodations. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Save session mutation
  const saveSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const response = await apiRequest('POST', '/api/autism-accommodations/save', sessionData);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP ${response.status}: Failed to save session`);
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Session Saved!",
        description: "Your autism accommodation session has been saved to your vault.",
      });
    },
    onError: (error: any) => {
      console.error('❌ Error saving session:', error);
      toast({
        title: "Save Failed",
        description: error.message || "Unable to save session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AutismAccommodationForm) => {
    setIsGenerating(true);
    generateAccommodationsMutation.mutate(data);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Accommodation copied to clipboard.",
      });
    });
  };

  const copyAllAccommodations = () => {
    const allText = generatedAccommodations.map(acc => 
      `${acc.title}\nCategory: ${acc.category}\n${acc.description}\nImplementation: ${acc.implementation}\n\n`
    ).join('');
    
    navigator.clipboard.writeText(allText).then(() => {
      toast({
        title: "All Accommodations Copied!",
        description: "All accommodations copied to clipboard.",
      });
    });
  };

  const saveSession = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save accommodation sessions.",
        variant: "destructive"
      });
      return;
    }

    const sessionData = {
      formData: form.getValues(),
      accommodations: generatedAccommodations,
      createdBy: user.role,
    };

    saveSessionMutation.mutate(sessionData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href={getDashboardRoute()}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Brain className="w-8 h-8 mr-3 text-blue-600" />
            Autism Accommodation Builder
          </h1>
          <p className="text-gray-600">
            Generate IDEA-compliant IEP accommodations specifically designed for students with autism spectrum disorders
          </p>
          
          {user?.role === 'advocate' && (
            <div className="mt-4 bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                👋 Working as an advocate - accommodations will be tagged with your professional review
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
              <CardDescription>
                Provide details about the student to generate personalized accommodations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="childName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Child's Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter child's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gradeLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {GRADE_LEVELS.map((grade) => (
                              <SelectItem key={grade} value={grade}>
                                {grade}
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
                    name="diagnosisAreas"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Diagnosis Areas</FormLabel>
                        </div>
                        {DIAGNOSIS_AREAS.map((area) => (
                          <FormField
                            key={area}
                            control={form.control}
                            name="diagnosisAreas"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={area}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(area)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, area])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== area
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {area}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sensoryPreferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sensory Preferences</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe sensory preferences (sound sensitivity, texture aversions, preferred lighting, etc.)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="behavioralChallenges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Behavioral Challenges</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe behavioral challenges (transition difficulties, repetitive behaviors, social challenges, etc.)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="communicationStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Communication Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select communication style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {COMMUNICATION_STYLES.map((style) => (
                              <SelectItem key={style} value={style}>
                                {style}
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
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any additional information that might help generate better accommodations"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={generateAccommodationsMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {generateAccommodationsMutation.isPending ? "Generating..." : "Generate Accommodations"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {generatedAccommodations.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        Generated Accommodations
                      </CardTitle>
                      <CardDescription>
                        {generatedAccommodations.length} autism-specific accommodations for {form.getValues('childName')}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={copyAllAccommodations}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy All
                      </Button>
                      {user && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={saveSession}
                          disabled={saveSessionMutation.isPending}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Session
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generatedAccommodations.map((accommodation, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{accommodation.title}</h3>
                              <Badge variant="secondary">{accommodation.category}</Badge>
                            </div>
                            <p className="text-gray-700 mb-3">{accommodation.description}</p>
                            <div className="bg-blue-50 p-3 rounded-md">
                              <p className="text-sm text-blue-800">
                                <strong>Implementation:</strong> {accommodation.implementation}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(`${accommodation.title}\n${accommodation.description}\nImplementation: ${accommodation.implementation}`)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upsell for Free Plan Users */}
            {user && user.planStatus !== 'heroOffer' && generatedAccommodations.length > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold text-yellow-800">
                      👋 Want Expert Review of These Accommodations?
                    </h3>
                    <p className="text-yellow-700">
                      Upgrade to the Hero Plan for custom recommendations and professional review from licensed IEP advocates.
                    </p>
                    <Link href="/subscribe">
                      <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                        Upgrade to Hero Plan
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {generatedAccommodations.length === 0 && !generateAccommodationsMutation.isPending && (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Fill out the form to generate autism-specific accommodations</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}