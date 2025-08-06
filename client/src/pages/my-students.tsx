import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, User, Calendar, School, FileText, Settings, Eye } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";


interface Student {
  id: string;
  parentId: string;
  advocateId?: string;
  firstName: string;
  lastName?: string;
  dateOfBirth?: string;
  gradeLevel?: string;
  schoolName?: string;
  schoolDistrict?: string;
  disabilities: string[];
  currentServices: string[];
  iepStatus: string;
  lastIepDate?: string;
  nextIepDate?: string;
  caseNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyStudents() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gradeLevel: "",
    schoolName: "",
    schoolDistrict: "",
    disabilities: [] as string[],
    currentServices: [] as string[],
    iepStatus: "active",
    lastIepDate: "",
    nextIepDate: "",
    caseNotes: ""
  });

  const { data: students = [], isLoading } = useQuery<Student[]>({
    queryKey: ['/api/students'],
    enabled: !!user
  });

  const addStudentMutation = useMutation({
    mutationFn: (studentData: any) => apiRequest("POST", "/api/students", studentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/students'] });
      setShowAddStudent(false);
      resetForm();
    }
  });

  const updateStudentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest("PUT", `/api/students/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/students'] });
      setSelectedStudent(null);
      resetForm();
    }
  });

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gradeLevel: "",
      schoolName: "",
      schoolDistrict: "",
      disabilities: [],
      currentServices: [],
      iepStatus: "active",
      lastIepDate: "",
      nextIepDate: "",
      caseNotes: ""
    });
  };

  const handleAddDisability = (disability: string) => {
    if (disability && !formData.disabilities.includes(disability)) {
      setFormData({
        ...formData,
        disabilities: [...formData.disabilities, disability]
      });
    }
  };

  const handleRemoveDisability = (disability: string) => {
    setFormData({
      ...formData,
      disabilities: formData.disabilities.filter(d => d !== disability)
    });
  };

  const handleAddService = (service: string) => {
    if (service && !formData.currentServices.includes(service)) {
      setFormData({
        ...formData,
        currentServices: [...formData.currentServices, service]
      });
    }
  };

  const handleRemoveService = (service: string) => {
    setFormData({
      ...formData,
      currentServices: formData.currentServices.filter(s => s !== service)
    });
  };

  const handleSubmit = () => {
    if (selectedStudent) {
      updateStudentMutation.mutate({ id: selectedStudent.id, data: formData });
    } else {
      addStudentMutation.mutate(formData);
    }
  };

  const openEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName || "",
      dateOfBirth: student.dateOfBirth || "",
      gradeLevel: student.gradeLevel || "",
      schoolName: student.schoolName || "",
      schoolDistrict: student.schoolDistrict || "",
      disabilities: student.disabilities || [],
      currentServices: student.currentServices || [],
      iepStatus: student.iepStatus,
      lastIepDate: student.lastIepDate || "",
      nextIepDate: student.nextIepDate || "",
      caseNotes: student.caseNotes || ""
    });
    setShowAddStudent(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'expired': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">

        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Students</h1>
            <p className="text-blue-200 mt-2">Manage your children's IEP information and documents</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setSelectedStudent(null);
              setShowAddStudent(true);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>

        {/* Students Grid */}
        {(students as Student[]).length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="text-center py-12">
              <User className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No students added yet</h3>
              <p className="text-white/60 mb-6">Add your first student to start managing their IEP information</p>
              <Button 
                onClick={() => setShowAddStudent(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(students as Student[]).map((student: Student) => (
              <Card key={student.id} className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">
                      {student.firstName} {student.lastName}
                    </CardTitle>
                    <Badge className={`${getStatusColor(student.iepStatus)} text-white text-xs`}>
                      {student.iepStatus.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    {student.gradeLevel && (
                      <div className="flex items-center gap-2 text-white/80">
                        <School className="w-4 h-4" />
                        Grade {student.gradeLevel}
                      </div>
                    )}
                    {student.schoolName && (
                      <div className="flex items-center gap-2 text-white/80">
                        <School className="w-4 h-4" />
                        {student.schoolName}
                      </div>
                    )}
                    {student.nextIepDate && (
                      <div className="flex items-center gap-2 text-white/80">
                        <Calendar className="w-4 h-4" />
                        Next IEP: {new Date(student.nextIepDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {student.disabilities.length > 0 && (
                    <div>
                      <Label className="text-white text-xs">Disabilities:</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {student.disabilities.slice(0, 2).map((disability) => (
                          <Badge key={disability} variant="outline" className="text-xs text-white border-white/20">
                            {disability}
                          </Badge>
                        ))}
                        {student.disabilities.length > 2 && (
                          <Badge variant="outline" className="text-xs text-white border-white/20">
                            +{student.disabilities.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditStudent(student)}
                      className="flex-1 text-white border-white/20 hover:bg-white/10"
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-white border-white/20 hover:bg-white/10"
                      onClick={() => window.location.href = `/student/${student.id}/documents`}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Student Dialog */}
        <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
          <DialogContent className="bg-[#3E4161] border-slate-600 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                {selectedStudent ? 'Edit Student' : 'Add New Student'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">First Name *</Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-white">Last Name</Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
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
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Grade Level</Label>
                  <Select value={formData.gradeLevel} onValueChange={(value) => setFormData({...formData, gradeLevel: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pre-K">Pre-K</SelectItem>
                      <SelectItem value="K">Kindergarten</SelectItem>
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(grade => (
                        <SelectItem key={grade} value={grade.toString()}>{grade}</SelectItem>
                      ))}
                      <SelectItem value="Post-Secondary">Post-Secondary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">School Name</Label>
                  <Input
                    value={formData.schoolName}
                    onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">School District</Label>
                  <Input
                    value={formData.schoolDistrict}
                    onChange={(e) => setFormData({...formData, schoolDistrict: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">IEP Status</Label>
                <Select value={formData.iepStatus} onValueChange={(value) => setFormData({...formData, iepStatus: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Last IEP Date</Label>
                  <Input
                    type="date"
                    value={formData.lastIepDate}
                    onChange={(e) => setFormData({...formData, lastIepDate: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Next IEP Date</Label>
                  <Input
                    type="date"
                    value={formData.nextIepDate}
                    onChange={(e) => setFormData({...formData, nextIepDate: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Case Notes</Label>
                <Textarea
                  value={formData.caseNotes}
                  onChange={(e) => setFormData({...formData, caseNotes: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => setShowAddStudent(false)}
                  variant="outline"
                  className="flex-1 text-white border-slate-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.firstName || addStudentMutation.isPending || updateStudentMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {addStudentMutation.isPending || updateStudentMutation.isPending ? 
                    "Saving..." : 
                    selectedStudent ? "Update Student" : "Add Student"
                  }
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}