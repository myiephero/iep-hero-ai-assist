import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, Plus, GraduationCap, Calendar, FileText, User, School, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

const addStudentSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  grade: z.string().min(1, "Grade is required"),
  school: z.string().optional(),
  district: z.string().optional(),
  disabilities: z.array(z.string()).default([]),
  currentServices: z.array(z.string()).default([]),
  iepStatus: z.enum(["active", "inactive", "developing"]).default("active"),
  parentId: z.string().min(1, "Parent selection is required"),
});

type AddStudentFormData = z.infer<typeof addStudentSchema>;

const gradeOptions = [
  "PreK", "K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "Post-Secondary"
];

const commonDisabilities = [
  "Autism Spectrum Disorder",
  "ADHD",
  "Learning Disability",
  "Intellectual Disability", 
  "Speech/Language Impairment",
  "Emotional Behavioral Disorder",
  "Other Health Impairment",
  "Multiple Disabilities",
  "Hearing Impairment",
  "Visual Impairment",
  "Orthopedic Impairment",
  "Traumatic Brain Injury"
];

const commonServices = [
  "Special Education",
  "Speech Therapy", 
  "Occupational Therapy",
  "Physical Therapy",
  "Behavioral Support",
  "Counseling",
  "Assistive Technology",
  "Transportation",
  "Extended School Year",
  "Paraprofessional Support"
];

export default function MyStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedDisabilities, setSelectedDisabilities] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const form = useForm<AddStudentFormData>({
    resolver: zodResolver(addStudentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      grade: "",
      school: "",
      district: "",
      disabilities: [],
      currentServices: [],
      iepStatus: "active",
      parentId: "",
    },
  });

  // Query for advocate's students
  const { data: students = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/advocate/students"],
    enabled: !!user,
  });

  // Query for advocate's clients (parents)
  const { data: clients = [] } = useQuery({
    queryKey: ["/api/advocate-clients"],
    enabled: !!user,
  });

  // Mutation to add new student
  const addStudentMutation = useMutation({
    mutationFn: async (data: AddStudentFormData) => {
      const response = await apiRequest("POST", "/api/advocate/students", {
        ...data,
        advocateId: user?.id,
        disabilities: selectedDisabilities,
        currentServices: selectedServices,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add student");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Student added successfully",
      });
      setShowAddStudent(false);
      form.reset();
      setSelectedDisabilities([]);
      setSelectedServices([]);
      queryClient.invalidateQueries({ queryKey: ["/api/advocate/students"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add student",
        variant: "destructive",
      });
    },
  });

  const filteredStudents = students.filter((student: any) =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.school?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: AddStudentFormData) => {
    addStudentMutation.mutate({
      ...data,
      disabilities: selectedDisabilities,
      currentServices: selectedServices,
    });
  };

  const toggleDisability = (disability: string) => {
    setSelectedDisabilities(prev => 
      prev.includes(disability) 
        ? prev.filter(d => d !== disability)
        : [...prev, disability]
    );
  };

  const toggleService = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Students</h1>
              <p className="text-slate-300">
                Manage students you're advocating for
              </p>
            </div>
            <Button
              onClick={() => setShowAddStudent(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Student
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search students by name, school, or grade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#3E4161]/50 border-slate-600 text-white placeholder-slate-400"
            />
          </div>
        </div>

        {/* Student Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full" />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <GraduationCap className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">
                {searchTerm ? 'No students found' : 'No students yet'}
              </h3>
              <p className="text-slate-400 mb-6">
                {searchTerm 
                  ? `No students match "${searchTerm}". Try a different search term.`
                  : 'Add students to start building their advocacy cases'
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => setShowAddStudent(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Student
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((student: any) => (
              <Card key={student.id} className="bg-[#3E4161] border-slate-600 hover:bg-[#4A4E76] transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-600 rounded-lg">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {student.firstName} {student.lastName}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className={
                            student.iepStatus === 'active' 
                              ? "text-green-400 border-green-400" 
                              : student.iepStatus === 'developing'
                              ? "text-yellow-400 border-yellow-400"
                              : "text-red-400 border-red-400"
                          }
                        >
                          {student.iepStatus === 'active' ? 'Active IEP' : 
                           student.iepStatus === 'developing' ? 'IEP Developing' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <GraduationCap className="w-4 h-4" />
                      Grade {student.grade}
                    </div>
                    {student.school && (
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <School className="w-4 h-4" />
                        {student.school}
                      </div>
                    )}
                    {student.district && (
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <MapPin className="w-4 h-4" />
                        {student.district}
                      </div>
                    )}
                  </div>

                  {student.disabilities && student.disabilities.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm text-slate-400">
                        <strong>Primary Disabilities</strong>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {student.disabilities.slice(0, 2).map((disability: string) => (
                          <Badge key={disability} variant="secondary" className="text-xs">
                            {disability}
                          </Badge>
                        ))}
                        {student.disabilities.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{student.disabilities.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                    <div className="text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Born: {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'Unknown'}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <FileText className="w-3 h-3" />
                      View Files
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-slate-500 text-white hover:bg-slate-700"
                      onClick={() => setLocation(`/documents?studentId=${student.id}`)}
                    >
                      Documents
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => setLocation(`/tools/iep-goal-generator?studentId=${student.id}`)}
                    >
                      IEP Goals
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Student Dialog */}
      <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
        <DialogContent className="bg-[#3E4161] border-slate-600 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Add New Student</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">First Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Student's first name"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Last Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Student's last name"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Date of Birth</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Grade</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {gradeOptions.map((grade) => (
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
              </div>

              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Parent/Guardian</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select parent/guardian" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {clients.map((client: any) => (
                          <SelectItem key={client.parentId} value={client.parentId}>
                            {client.clientName || client.parent?.username} ({client.parent?.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">School (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Current school"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">District (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="School district"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="iepStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">IEP Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select IEP status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="developing">Developing</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <div className="text-white font-medium">Disabilities (Select all that apply)</div>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-700 rounded">
                  {commonDisabilities.map((disability) => (
                    <label key={disability} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedDisabilities.includes(disability)}
                        onChange={() => toggleDisability(disability)}
                        className="rounded"
                      />
                      <span className="text-white">{disability}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-white font-medium">Current Services (Select all that apply)</div>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-700 rounded">
                  {commonServices.map((service) => (
                    <label key={service} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service)}
                        onChange={() => toggleService(service)}
                        className="rounded"
                      />
                      <span className="text-white">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddStudent(false)}
                  className="flex-1 border-slate-500"
                  disabled={addStudentMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={addStudentMutation.isPending}
                >
                  {addStudentMutation.isPending ? "Adding..." : "Add Student"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}