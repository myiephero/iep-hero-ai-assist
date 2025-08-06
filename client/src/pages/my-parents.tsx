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
import { Users, User, Calendar, MessageCircle, FolderOpen, Phone, Mail, Star, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";


interface AdvocateClient {
  id: string;
  advocateId: string;
  parentId: string;
  status: string;
  assignedDate: string;
  caseType?: string;
  priority: string;
  lastContact?: string;
  nextMeeting?: string;
  notes?: string;
  parent: {
    id: string;
    email: string;
    username: string;
  };
  students: Array<{
    id: string;
    firstName: string;
    lastName?: string;
    gradeLevel?: string;
    schoolName?: string;
    iepStatus: string;
    nextIepDate?: string;
  }>;
}

export default function MyParents() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedClient, setSelectedClient] = useState<AdvocateClient | null>(null);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [showUpdateNotes, setShowUpdateNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [nextMeeting, setNextMeeting] = useState("");

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['/api/advocate/clients'],
    enabled: !!user && user.role === 'advocate'
  });

  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest("PUT", `/api/advocate/clients/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/advocate/clients'] });
      setShowUpdateNotes(false);
      setSelectedClient(null);
    }
  });

  const handleUpdateClient = () => {
    if (!selectedClient) return;
    
    updateClientMutation.mutate({
      id: selectedClient.id,
      data: {
        notes,
        nextMeeting,
        lastContact: new Date().toISOString()
      }
    });
  };

  const openClientDetails = (client: AdvocateClient) => {
    setSelectedClient(client);
    setShowClientDetails(true);
  };

  const openUpdateNotes = (client: AdvocateClient) => {
    setSelectedClient(client);
    setNotes(client.notes || "");
    setNextMeeting(client.nextMeeting || "");
    setShowUpdateNotes(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
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
            <h1 className="text-3xl font-bold text-white">My Parent Clients</h1>
            <p className="text-blue-200 mt-2">Manage your parent caseload and student files</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-blue-600 text-white">
              {clients.length} Active Clients
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{clients.filter((c: AdvocateClient) => c.status === 'active').length}</p>
                  <p className="text-xs text-white/60">Active Cases</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{clients.filter((c: AdvocateClient) => c.priority === 'urgent' || c.priority === 'high').length}</p>
                  <p className="text-xs text-white/60">High Priority</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{clients.filter((c: AdvocateClient) => c.nextMeeting).length}</p>
                  <p className="text-xs text-white/60">Scheduled Meetings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{clients.reduce((total: number, c: AdvocateClient) => total + c.students.length, 0)}</p>
                  <p className="text-xs text-white/60">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clients Grid */}
        {clients.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No clients assigned yet</h3>
              <p className="text-white/60">Parent clients will appear here when they are assigned to you</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {clients.map((client: AdvocateClient) => (
              <Card key={client.id} className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white text-lg">{client.parent.username}</CardTitle>
                      <p className="text-white/60 text-sm">{client.parent.email}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge className={`${getStatusColor(client.status)} text-white text-xs`}>
                        {client.status.toUpperCase()}
                      </Badge>
                      <Badge className={`${getPriorityColor(client.priority)} text-white text-xs`}>
                        {client.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Case Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-white/80">
                      <Calendar className="w-4 h-4" />
                      Assigned: {formatDate(client.assignedDate)}
                    </div>
                    {client.caseType && (
                      <div className="flex items-center gap-2 text-white/80">
                        <FolderOpen className="w-4 h-4" />
                        {client.caseType.replace('_', ' ').toUpperCase()}
                      </div>
                    )}
                    {client.lastContact && (
                      <div className="flex items-center gap-2 text-white/80">
                        <Clock className="w-4 h-4" />
                        Last contact: {formatDate(client.lastContact)}
                      </div>
                    )}
                    {client.nextMeeting && (
                      <div className="flex items-center gap-2 text-white/80">
                        <Calendar className="w-4 h-4" />
                        Next meeting: {formatDate(client.nextMeeting)}
                      </div>
                    )}
                  </div>

                  {/* Students */}
                  {client.students.length > 0 && (
                    <div>
                      <Label className="text-white text-xs">Students ({client.students.length}):</Label>
                      <div className="space-y-1 mt-1">
                        {client.students.slice(0, 2).map((student) => (
                          <div key={student.id} className="flex items-center justify-between bg-white/5 rounded p-2">
                            <div>
                              <p className="text-white text-sm font-medium">
                                {student.firstName} {student.lastName}
                              </p>
                              <p className="text-white/60 text-xs">
                                {student.gradeLevel && `Grade ${student.gradeLevel}`}
                                {student.schoolName && ` • ${student.schoolName}`}
                              </p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${student.iepStatus === 'active' ? 'text-green-400 border-green-400' : 'text-yellow-400 border-yellow-400'}`}
                            >
                              {student.iepStatus}
                            </Badge>
                          </div>
                        ))}
                        {client.students.length > 2 && (
                          <p className="text-white/60 text-xs">+{client.students.length - 2} more students</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openClientDetails(client)}
                      className="flex-1 text-white border-white/20 hover:bg-white/10"
                    >
                      <FolderOpen className="w-4 h-4 mr-1" />
                      View Case
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openUpdateNotes(client)}
                      className="flex-1 text-white border-white/20 hover:bg-white/10"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Update
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Client Details Dialog */}
        <Dialog open={showClientDetails} onOpenChange={setShowClientDetails}>
          <DialogContent className="bg-[#3E4161] border-slate-600 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                Client Case Details - {selectedClient?.parent.username}
              </DialogTitle>
            </DialogHeader>
            {selectedClient && (
              <div className="space-y-6">
                {/* Client Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Parent Name</Label>
                    <p className="text-white/80">{selectedClient.parent.username}</p>
                  </div>
                  <div>
                    <Label className="text-white">Email</Label>
                    <p className="text-white/80">{selectedClient.parent.email}</p>
                  </div>
                  <div>
                    <Label className="text-white">Case Type</Label>
                    <p className="text-white/80">{selectedClient.caseType || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-white">Priority</Label>
                    <Badge className={`${getPriorityColor(selectedClient.priority)} text-white`}>
                      {selectedClient.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Students */}
                <div>
                  <Label className="text-white text-lg">Students</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    {selectedClient.students.map((student) => (
                      <Card key={student.id} className="bg-slate-700 border-slate-600">
                        <CardContent className="p-4">
                          <h4 className="text-white font-medium">{student.firstName} {student.lastName}</h4>
                          <div className="space-y-1 mt-2 text-sm">
                            {student.gradeLevel && <p className="text-white/80">Grade: {student.gradeLevel}</p>}
                            {student.schoolName && <p className="text-white/80">School: {student.schoolName}</p>}
                            <p className="text-white/80">IEP Status: 
                              <Badge className={`ml-2 ${student.iepStatus === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                {student.iepStatus}
                              </Badge>
                            </p>
                            {student.nextIepDate && (
                              <p className="text-white/80">Next IEP: {formatDate(student.nextIepDate)}</p>
                            )}
                          </div>
                          <Button 
                            size="sm" 
                            className="mt-3 bg-blue-600 hover:bg-blue-700"
                            onClick={() => window.location.href = `/student/${student.id}/documents`}
                          >
                            View Documents
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Case Notes */}
                {selectedClient.notes && (
                  <div>
                    <Label className="text-white text-lg">Case Notes</Label>
                    <div className="mt-2 p-4 bg-slate-700 rounded-lg">
                      <p className="text-white/80 whitespace-pre-wrap">{selectedClient.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Update Notes Dialog */}
        <Dialog open={showUpdateNotes} onOpenChange={setShowUpdateNotes}>
          <DialogContent className="bg-[#3E4161] border-slate-600 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                Update Case - {selectedClient?.parent.username}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-white">Next Meeting Date</Label>
                <Input
                  type="datetime-local"
                  value={nextMeeting}
                  onChange={(e) => setNextMeeting(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label className="text-white">Case Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this case, recent communications, action items..."
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={6}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => setShowUpdateNotes(false)}
                  variant="outline"
                  className="flex-1 text-white border-slate-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateClient}
                  disabled={updateClientMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {updateClientMutation.isPending ? "Updating..." : "Update Case"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}