import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { UserPlus, Search, Users, Target, FileText, Calendar, MessageCircle, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface ParentClient {
  id: string;
  parentName: string;
  email: string;
  phone?: string;
  studentsCount: number;
  activeGoals: number;
  documentsCount: number;
  lastContact: string;
  caseStatus: 'active' | 'pending' | 'completed';
  nextMeeting?: string;
  students: Array<{
    name: string;
    grade: string;
    school: string;
  }>;
}

export default function MyParents() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: clients, isLoading, error } = useQuery<ParentClient[]>({
    queryKey: ['/api/advocate/clients'],
    enabled: !!user && user.role === 'advocate',
  });

  if (!user || user.role !== 'advocate') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1A1B2E] to-[#2C2F48] px-6 py-10 text-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-300">Access denied. This page is for advocates only.</p>
        </div>
      </div>
    );
  }

  const filteredClients = clients?.filter(client =>
    client.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.students.some(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.school.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active Case';
      case 'pending': return 'Pending Intake';
      case 'completed': return 'Case Closed';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1B2E] to-[#2C2F48] px-6 py-10 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">My Parent Clients</h1>
          <p className="text-slate-300 mb-6">
            Manage your advocacy cases and client relationships
          </p>

          {/* Search and Add Client */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search clients by name, email, or student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#3E4161]/50 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={() => {
                // TODO: Open add client modal or navigate to intake form
                alert('New Client Intake feature coming soon!');
              }}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              New Client
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
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
              <p className="text-red-300">Failed to load client information. Please try again.</p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredClients.length === 0 && (
          <Card className="bg-[#3E4161]/70 border-slate-600">
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Clients Found</h3>
              <p className="text-slate-400 mb-6">
                {searchTerm ? 'No clients match your search criteria.' : 'Start building your advocacy practice by adding your first client.'}
              </p>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={() => {
                  alert('New Client Intake feature coming soon!');
                }}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Your First Client
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Clients Grid */}
        {!isLoading && filteredClients.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredClients.map((client) => (
              <Card key={client.id} className="bg-[#3E4161]/70 border-slate-600 hover:bg-[#3E4161]/90 transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-1">{client.parentName}</CardTitle>
                      <p className="text-slate-400 text-sm">{client.email}</p>
                      {client.phone && (
                        <p className="text-slate-400 text-sm">{client.phone}</p>
                      )}
                    </div>
                    <Badge className={`${getStatusColor(client.caseStatus)} text-white text-xs`}>
                      {getStatusText(client.caseStatus)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Students */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Students ({client.studentsCount})</h4>
                      <div className="space-y-1">
                        {client.students.slice(0, 2).map((student, index) => (
                          <div key={index} className="text-sm text-slate-400">
                            {student.name} - Grade {student.grade} at {student.school}
                          </div>
                        ))}
                        {client.students.length > 2 && (
                          <div className="text-sm text-slate-500">
                            +{client.students.length - 2} more students
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1 text-slate-300">
                        <Target className="h-4 w-4" />
                        <span>{client.activeGoals} Active Goals</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-300">
                        <FileText className="h-4 w-4" />
                        <span>{client.documentsCount} Documents</span>
                      </div>
                    </div>

                    {/* Last Contact & Next Meeting */}
                    <div className="space-y-1 text-sm text-slate-300">
                      <div>Last contact: {format(new Date(client.lastContact), 'MMM d, yyyy')}</div>
                      {client.nextMeeting && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Next meeting: {format(new Date(client.nextMeeting), 'MMM d, yyyy')}</span>
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
                          // TODO: Open messaging or call functionality
                          alert('Contact Client feature coming soon!');
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 border-slate-600 text-white hover:bg-slate-700"
                        onClick={() => {
                          // TODO: Navigate to client case details
                          alert('View Case Details feature coming soon!');
                        }}
                      >
                        View Case
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