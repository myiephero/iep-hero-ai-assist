import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { UserPlus, Search, BookOpen, Target, FileText, Calendar, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Link } from 'wouter';
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  parentId: string;
  advocateId?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gradeLevel?: string;
  schoolName?: string;
  schoolDistrict?: string;
  disabilities?: string[];
  currentServices?: string[];
  iepStatus: 'active' | 'pending' | 'expired';
  lastIepDate?: string;
  nextIepDate?: string;
  caseNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const studentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().optional(),
  gradeLevel: z.string().optional(),
  schoolName: z.string().optional(),
  schoolDistrict: z.string().optional(),
  disabilities: z.string().optional(),
  currentServices: z.string().optional(),
  iepStatus: z.enum(['active', 'pending', 'expired']).default('active'),
});

type StudentForm = z.infer<typeof studentSchema>;

export default function MyStudents() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const form = useForm<StudentForm>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gradeLevel: '',
      schoolName: '',
      schoolDistrict: '',
      disabilities: '',
      currentServices: '',
      iepStatus: 'active'
    }
  });

  const { data: students, isLoading, error } = useQuery<Student[]>({
    queryKey: ['/api/parent/students'],
    enabled: !!user && user.role === 'parent',
  });

  if (!user || user.role !== 'parent') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1A1B2E] to-[#2C2F48] px-6 py-10 text-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-300">Access denied. This page is for parents only.</p>
        </div>
      </div>
    );
  }

  // Add student mutation
  const addStudentMutation = useMutation({
    mutationFn: async (data: StudentForm) => {
      const studentData = {
        ...data,
        disabilities: data.disabilities ? data.disabilities.split(',').map(d => d.trim()) : [],
        currentServices: data.currentServices ? data.currentServices.split(',').map(s => s.trim()) : [],
      };
      return apiRequest('POST', '/api/students', studentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/parent/students'] });
      toast({
        title: "Student Added",
        description: "Student has been added successfully.",
      });
      setShowAddModal(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add student",
        variant: "destructive",
      });
    }
  });

  const filteredStudents = students?.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.schoolName || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'review': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active IEP';
      case 'pending': return 'Pending';
      case 'review': return 'Under Review';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1B2E] to-[#2C2F48] px-6 py-10 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header with Navigation */}
        <div className="mb-8">
          <Link href="/dashboard-parent">
            <Button variant="ghost" className="mb-4 text-slate-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2 text-white">My Students</h1>
          <p className="text-slate-300 mb-6">
            Manage and track your children's IEP progress
          </p>

          {/* Search and Add Student */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search students by name or school..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#3E4161]/50 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-slate-800 border-slate-600">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Student</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => addStudentMutation.mutate(data))} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-200">First Name</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-slate-700 border-slate-600 text-white" placeholder="Isabella" />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-200">Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-slate-700 border-slate-600 text-white" placeholder="Smith" />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="gradeLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-200">Grade Level</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-slate-700 border-slate-600 text-white" placeholder="5th Grade" />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-200">Date of Birth</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" className="bg-slate-700 border-slate-600 text-white" />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="schoolName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">School Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-slate-700 border-slate-600 text-white" placeholder="Lincoln Elementary" />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="schoolDistrict"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">School District</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-slate-700 border-slate-600 text-white" placeholder="City School District" />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="disabilities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Disabilities (comma-separated)</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-slate-700 border-slate-600 text-white" placeholder="ADHD, Learning Disability" />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowAddModal(false)}
                        className="text-slate-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={addStudentMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {addStudentMutation.isPending ? "Adding..." : "Add Student"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-[#3E4161]/70 border-slate-600">
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2 bg-slate-600" />
                  <Skeleton className="h-4 w-24 bg-slate-600" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2 bg-slate-600" />
                  <Skeleton className="h-4 w-3/4 bg-slate-600" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="bg-red-900/30 border-red-600">
            <CardContent className="p-6">
              <p className="text-red-300">Failed to load students. Please try again.</p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredStudents.length === 0 && (
          <Card className="bg-[#3E4161]/70 border-slate-600">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Students Found</h3>
              <p className="text-slate-400 mb-6">
                {searchTerm ? 'No students match your search criteria.' : 'Get started by adding your first student.'}
              </p>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={() => setShowAddModal(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Your First Student
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Students Grid */}
        {!isLoading && filteredStudents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="bg-[#3E4161]/70 border-slate-600 hover:bg-[#3E4161]/90 transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white text-lg mb-1">{student.firstName} {student.lastName}</CardTitle>
                      <p className="text-slate-400 text-sm">{student.gradeLevel ? `Grade ${student.gradeLevel}` : 'No grade'} • {student.schoolName || 'No school'}</p>
                    </div>
                    <Badge className={`${getStatusColor(student.iepStatus)} text-white text-xs`}>
                      {getStatusText(student.iepStatus)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Student Information */}
                    <div className="space-y-2 text-sm text-slate-300">
                      {student.disabilities && student.disabilities.length > 0 && (
                        <div>
                          <span className="font-medium">Disabilities: </span>
                          <span>{student.disabilities.join(', ')}</span>
                        </div>
                      )}
                      {student.schoolDistrict && (
                        <div>
                          <span className="font-medium">District: </span>
                          <span>{student.schoolDistrict}</span>
                        </div>
                      )}
                      {student.nextIepDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Next IEP: {format(new Date(student.nextIepDate), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 border-slate-600 text-white hover:bg-slate-700"
                        onClick={() => {
                          // Navigate to student goals (placeholder for now)
                          alert(`View goals for ${student.firstName} ${student.lastName} - feature coming soon!`);
                        }}
                      >
                        <Target className="h-4 w-4 mr-1" />
                        Goals
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 border-slate-600 text-white hover:bg-slate-700"
                        onClick={() => {
                          // Navigate to student documents
                          window.location.href = `/documents?student=${student.id}`;
                        }}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Documents
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}