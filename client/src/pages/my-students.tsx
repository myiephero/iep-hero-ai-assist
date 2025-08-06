import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { UserPlus, Search, BookOpen, Target, FileText, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface Student {
  id: string;
  name: string;
  grade: string;
  school: string;
  iepStatus: 'active' | 'pending' | 'review';
  nextMeeting?: string;
  goalsCount: number;
  documentsCount: number;
  advocateId?: string;
}

export default function MyStudents() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredStudents = students?.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.school.toLowerCase().includes(searchTerm.toLowerCase())
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
        {/* Header */}
        <div className="mb-8">
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
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={() => {
                // TODO: Open add student modal or navigate to add student page
                alert('Add Student feature coming soon!');
              }}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
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
                onClick={() => {
                  alert('Add Student feature coming soon!');
                }}
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
                      <CardTitle className="text-white text-lg mb-1">{student.name}</CardTitle>
                      <p className="text-slate-400 text-sm">Grade {student.grade} • {student.school}</p>
                    </div>
                    <Badge className={`${getStatusColor(student.iepStatus)} text-white text-xs`}>
                      {getStatusText(student.iepStatus)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Quick Stats */}
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1 text-slate-300">
                        <Target className="h-4 w-4" />
                        <span>{student.goalsCount} Goals</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-300">
                        <FileText className="h-4 w-4" />
                        <span>{student.documentsCount} Docs</span>
                      </div>
                    </div>

                    {/* Next Meeting */}
                    {student.nextMeeting && (
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Calendar className="h-4 w-4" />
                        <span>Next meeting: {format(new Date(student.nextMeeting), 'MMM d, yyyy')}</span>
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
                          alert('View Goals feature coming soon!');
                        }}
                      >
                        View Goals
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 border-slate-600 text-white hover:bg-slate-700"
                        onClick={() => {
                          // TODO: Navigate to student documents
                          alert('View Documents feature coming soon!');
                        }}
                      >
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