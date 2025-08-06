import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { UserPlus, Search, Users, Target, FileText, Calendar, Edit, Trash2, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { apiRequest } from '@/lib/queryClient';
import type { Student } from '@shared/schema';

export default function AdvocateStudents() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form state for creating/editing students
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gradeLevel: '',
    schoolName: '',
    schoolDistrict: '',
    disabilities: [] as string[],
    currentServices: [] as string[],
    parentId: '', // For advocate to assign student to a parent client
    caseNotes: ''
  });

  const { data: students = [], isLoading, error } = useQuery<Student[]>({
    queryKey: ['/api/advocate/students'],
    enabled: !!user && user.role === 'advocate',
  });

  const { data: parentClients = [] } = useQuery({
    queryKey: ['/api/advocate/clients'],
    enabled: !!user && user.role === 'advocate',
  });

  const createStudentMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/advocate/students", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/advocate/students"] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Student created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create student",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gradeLevel: '',
      schoolName: '',
      schoolDistrict: '',
      disabilities: [],
      currentServices: [],
      parentId: '',
      caseNotes: ''
    });
    setEditingStudent(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.parentId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createStudentMutation.mutate(formData);
  };

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.schoolDistrict.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || user.role !== 'advocate') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1A1B2E] to-[#2C2F48] px-6 py-10 text-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-300">Access denied. This page is for advocates only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1B2E] to-[#2C2F48] px-6 py-10 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Student Management</h1>
          <p className="text-slate-300 mb-6">
            Manage students for your advocacy cases
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
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#2C2F48] border-slate-600 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl">Add New Student</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">First Name *</Label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="bg-[#3E4161]/50 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-white">Last Name *</Label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="bg-[#3E4161]/50 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Date of Birth</Label>
                      <Input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                        className="bg-[#3E4161]/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Grade Level</Label>
                      <Select value={formData.gradeLevel} onValueChange={(value) => setFormData({...formData, gradeLevel: value})}>
                        <SelectTrigger className="bg-[#3E4161]/50 border-slate-600 text-white">
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#3E4161] border-slate-500">
                          <SelectItem value="Pre-K">Pre-K</SelectItem>
                          <SelectItem value="K">Kindergarten</SelectItem>
                          <SelectItem value="1">1st Grade</SelectItem>
                          <SelectItem value="2">2nd Grade</SelectItem>
                          <SelectItem value="3">3rd Grade</SelectItem>
                          <SelectItem value="4">4th Grade</SelectItem>
                          <SelectItem value="5">5th Grade</SelectItem>
                          <SelectItem value="6">6th Grade</SelectItem>
                          <SelectItem value="7">7th Grade</SelectItem>
                          <SelectItem value="8">8th Grade</SelectItem>
                          <SelectItem value="9">9th Grade</SelectItem>
                          <SelectItem value="10">10th Grade</SelectItem>
                          <SelectItem value="11">11th Grade</SelectItem>
                          <SelectItem value="12">12th Grade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">Assign to Parent Client *</Label>
                    <Select value={formData.parentId} onValueChange={(value) => setFormData({...formData, parentId: value})}>
                      <SelectTrigger className="bg-[#3E4161]/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select parent client" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#3E4161] border-slate-500">
                        {parentClients.map((client: any) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.parentName} - {client.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">School Name</Label>
                      <Input
                        value={formData.schoolName}
                        onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                        className="bg-[#3E4161]/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white">School District</Label>
                      <Input
                        value={formData.schoolDistrict}
                        onChange={(e) => setFormData({...formData, schoolDistrict: e.target.value})}
                        className="bg-[#3E4161]/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">Case Notes</Label>
                    <Input
                      value={formData.caseNotes}
                      onChange={(e) => setFormData({...formData, caseNotes: e.target.value})}
                      placeholder="Initial assessment notes, concerns, etc."
                      className="bg-[#3E4161]/50 border-slate-600 text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="border-slate-600 text-white hover:bg-slate-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createStudentMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {createStudentMutation.isPending ? 'Creating...' : 'Create Student'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-[#3E4161]/70 border-slate-600">
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2 bg-slate-600" />
                  <Skeleton className="h-4 w-48 bg-slate-600" />
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
              <p className="text-red-300">Failed to load student information. Please try again.</p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredStudents.length === 0 && (
          <Card className="bg-[#3E4161]/70 border-slate-600">
            <CardContent className="p-12 text-center">
              <GraduationCap className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Students Found</h3>
              <p className="text-slate-400 mb-6">
                {searchTerm ? 'No students match your search criteria.' : 'Start by adding students for your advocacy cases.'}
              </p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Your First Student
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Students Grid */}
        {!isLoading && filteredStudents.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="bg-[#3E4161]/70 border-slate-600 hover:bg-[#3E4161]/90 transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-1">
                        {student.firstName} {student.lastName}
                      </CardTitle>
                      <p className="text-slate-400 text-sm">Grade {student.gradeLevel}</p>
                      <p className="text-slate-400 text-sm">{student.schoolName}</p>
                    </div>
                    <Badge className="bg-green-500 text-white text-xs">
                      {student.iepStatus === 'active' ? 'Active IEP' : 'Pending IEP'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Disabilities */}
                    {student.disabilities && student.disabilities.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-300 mb-1">Disabilities</h4>
                        <div className="flex flex-wrap gap-1">
                          {student.disabilities.slice(0, 3).map((disability, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                              {disability}
                            </Badge>
                          ))}
                          {student.disabilities.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                              +{student.disabilities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Current Services */}
                    {student.currentServices && student.currentServices.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-300 mb-1">Services</h4>
                        <div className="text-sm text-slate-400">
                          {student.currentServices.slice(0, 2).join(', ')}
                          {student.currentServices.length > 2 && ` (+${student.currentServices.length - 2} more)`}
                        </div>
                      </div>
                    )}

                    {/* Case Notes */}
                    {student.caseNotes && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-300 mb-1">Notes</h4>
                        <p className="text-sm text-slate-400 line-clamp-2">
                          {student.caseNotes}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 border-slate-600 text-white hover:bg-slate-700"
                        onClick={() => {
                          // TODO: Navigate to student goals
                          window.location.href = `/goals?student=${student.id}`;
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
                          // TODO: Navigate to student documents
                          alert('Student documents feature coming soon!');
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