import { useState } from "react";
import { useRoleAwareDashboard } from "@/utils/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Edit, Trash2, Mail, Calendar, Clock, AlertCircle, Phone, FileText } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Communication {
  id: string;
  date: string;
  type: 'email' | 'phone' | 'meeting' | 'letter';
  recipient: string;
  subject: string;
  summary: string;
  followUpNeeded: boolean;
  followUpDate?: string;
  status: 'sent' | 'received' | 'follow-up-needed' | 'resolved';
}

interface Deadline {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  type: 'iep-meeting' | 'evaluation' | 'response' | 'data-request' | 'other';
  status: 'upcoming' | 'overdue' | 'completed';
  relatedCommunication?: string;
}

export default function CommunicationPlan() {
  const { user } = useAuth();
  const { getDashboardRoute } = useRoleAwareDashboard();
  const { toast } = useToast();
  
  const [communications, setCommunications] = useState<Communication[]>([
    {
      id: '1',
      date: '2024-01-10',
      type: 'email',
      recipient: 'Ms. Johnson (Special Ed Teacher)',
      subject: 'Request for Progress Data',
      summary: 'Requested current data on reading goals and math objectives',
      followUpNeeded: true,
      followUpDate: '2024-01-17',
      status: 'follow-up-needed'
    }
  ]);

  const [deadlines, setDeadlines] = useState<Deadline[]>([
    {
      id: '1',
      title: 'Annual IEP Meeting',
      description: 'Review current IEP and set goals for next year',
      dueDate: '2024-02-15',
      type: 'iep-meeting',
      status: 'upcoming'
    }
  ]);

  const [activeTab, setActiveTab] = useState('communications');
  const [showCommForm, setShowCommForm] = useState(false);
  const [showDeadlineForm, setShowDeadlineForm] = useState(false);
  const [editingComm, setEditingComm] = useState<Communication | null>(null);
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);

  const [commForm, setCommForm] = useState({
    type: 'email' as const,
    recipient: '',
    subject: '',
    summary: '',
    followUpNeeded: false,
    followUpDate: '',
    status: 'sent' as const
  });

  const [deadlineForm, setDeadlineForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    type: 'other' as const,
    status: 'upcoming' as const
  });

  // Check if user has Hero plan access
  const hasHeroAccess = user?.planStatus === 'heroOffer' || 
                        user?.email === 'parent@demo.com';

  if (!hasHeroAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href={getDashboardRoute()}>
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <Card className="text-center p-8">
            <CardContent>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Communication Plan</h2>
              <p className="text-gray-600 mb-6">
                Track emails, deadlines, and key requests for your child's IEP. Available with Hero Plan ($495/year).
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

  const handleCommSubmit = () => {
    if (!commForm.recipient || !commForm.subject || !commForm.summary) {
      toast({
        title: "Missing Information",
        description: "Please fill in recipient, subject, and summary.",
        variant: "destructive",
      });
      return;
    }

    const newComm: Communication = {
      id: editingComm?.id || Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...commForm
    };

    if (editingComm) {
      setCommunications(prev => prev.map(comm => comm.id === editingComm.id ? newComm : comm));
      toast({ title: "Communication Updated", description: "Communication record has been updated." });
    } else {
      setCommunications(prev => [newComm, ...prev]);
      toast({ title: "Communication Added", description: "New communication record has been created." });
    }

    resetCommForm();
  };

  const handleDeadlineSubmit = () => {
    if (!deadlineForm.title || !deadlineForm.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and due date.",
        variant: "destructive",
      });
      return;
    }

    const newDeadline: Deadline = {
      id: editingDeadline?.id || Date.now().toString(),
      ...deadlineForm
    };

    if (editingDeadline) {
      setDeadlines(prev => prev.map(deadline => deadline.id === editingDeadline.id ? newDeadline : deadline));
      toast({ title: "Deadline Updated", description: "Deadline has been updated." });
    } else {
      setDeadlines(prev => [newDeadline, ...prev]);
      toast({ title: "Deadline Added", description: "New deadline has been created." });
    }

    resetDeadlineForm();
  };

  const resetCommForm = () => {
    setCommForm({
      type: 'email',
      recipient: '',
      subject: '',
      summary: '',
      followUpNeeded: false,
      followUpDate: '',
      status: 'sent'
    });
    setShowCommForm(false);
    setEditingComm(null);
  };

  const resetDeadlineForm = () => {
    setDeadlineForm({
      title: '',
      description: '',
      dueDate: '',
      type: 'other',
      status: 'upcoming'
    });
    setShowDeadlineForm(false);
    setEditingDeadline(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'received': return 'bg-green-100 text-green-800';
      case 'follow-up-needed': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-gray-100 text-gray-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'letter': return <FileText className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href={getDashboardRoute()}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Communication Plan</h1>
              <p className="text-gray-600">Track emails, deadlines, and key requests for your child's IEP</p>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              Hero Plan
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="communications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Communication Log</CardTitle>
                    <CardDescription>Track all communications with school staff</CardDescription>
                  </div>
                  <Button onClick={() => setShowCommForm(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Communication
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showCommForm && (
                  <div className="border rounded-lg p-4 mb-6 bg-gray-50">
                    <h3 className="font-medium mb-4">Add Communication Record</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label>Type</Label>
                        <Select value={commForm.type} onValueChange={(value: any) => setCommForm(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone Call</SelectItem>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="letter">Letter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select value={commForm.status} onValueChange={(value: any) => setCommForm(prev => ({ ...prev, status: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="received">Received</SelectItem>
                            <SelectItem value="follow-up-needed">Follow-up Needed</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label>Recipient</Label>
                        <Input
                          placeholder="e.g., Ms. Johnson (Special Ed Teacher)"
                          value={commForm.recipient}
                          onChange={(e) => setCommForm(prev => ({ ...prev, recipient: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Subject</Label>
                        <Input
                          placeholder="Brief subject or topic"
                          value={commForm.subject}
                          onChange={(e) => setCommForm(prev => ({ ...prev, subject: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Summary</Label>
                        <Textarea
                          placeholder="Key points discussed or requested..."
                          value={commForm.summary}
                          onChange={(e) => setCommForm(prev => ({ ...prev, summary: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      {commForm.followUpNeeded && (
                        <div>
                          <Label>Follow-up Date</Label>
                          <Input
                            type="date"
                            value={commForm.followUpDate}
                            onChange={(e) => setCommForm(prev => ({ ...prev, followUpDate: e.target.value }))}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 mt-4">
                      <Button onClick={handleCommSubmit}>Save Communication</Button>
                      <Button onClick={resetCommForm} variant="outline">Cancel</Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {communications.map((comm) => (
                    <div key={comm.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(comm.type)}
                          <h3 className="font-medium">{comm.subject}</h3>
                          <Badge className={`text-xs ${getStatusColor(comm.status)}`}>
                            {comm.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">{new Date(comm.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">To: {comm.recipient}</p>
                      <p className="text-sm">{comm.summary}</p>
                      {comm.followUpNeeded && comm.followUpDate && (
                        <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                          <AlertCircle className="w-4 h-4 inline mr-1 text-yellow-600" />
                          Follow-up needed by {new Date(comm.followUpDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deadlines" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Important Deadlines</CardTitle>
                    <CardDescription>Track key dates and requirements</CardDescription>
                  </div>
                  <Button onClick={() => setShowDeadlineForm(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Deadline
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showDeadlineForm && (
                  <div className="border rounded-lg p-4 mb-6 bg-gray-50">
                    <h3 className="font-medium mb-4">Add Deadline</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          placeholder="e.g., Annual IEP Meeting"
                          value={deadlineForm.title}
                          onChange={(e) => setDeadlineForm(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Due Date</Label>
                        <Input
                          type="date"
                          value={deadlineForm.dueDate}
                          onChange={(e) => setDeadlineForm(prev => ({ ...prev, dueDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Select value={deadlineForm.type} onValueChange={(value: any) => setDeadlineForm(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="iep-meeting">IEP Meeting</SelectItem>
                            <SelectItem value="evaluation">Evaluation</SelectItem>
                            <SelectItem value="response">Response Due</SelectItem>
                            <SelectItem value="data-request">Data Request</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          placeholder="Additional details about this deadline..."
                          value={deadlineForm.description}
                          onChange={(e) => setDeadlineForm(prev => ({ ...prev, description: e.target.value }))}
                          rows={2}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 mt-4">
                      <Button onClick={handleDeadlineSubmit}>Save Deadline</Button>
                      <Button onClick={resetDeadlineForm} variant="outline">Cancel</Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {deadlines.map((deadline) => (
                    <div key={deadline.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <h3 className="font-medium">{deadline.title}</h3>
                          <Badge className={`text-xs ${getStatusColor(deadline.status)}`}>
                            {deadline.status}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">{new Date(deadline.dueDate).toLocaleDateString()}</span>
                      </div>
                      {deadline.description && (
                        <p className="text-sm text-gray-600">{deadline.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Communications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{communications.length}</div>
                  <div className="text-sm text-gray-600">Total recorded</div>
                  <div className="mt-2 text-sm">
                    {communications.filter(c => c.status === 'follow-up-needed').length} need follow-up
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Deadlines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{deadlines.filter(d => d.status === 'upcoming').length}</div>
                  <div className="text-sm text-gray-600">Upcoming</div>
                  <div className="mt-2 text-sm">
                    {deadlines.filter(d => d.status === 'overdue').length} overdue
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {communications.filter(c => new Date(c.date).getMonth() === new Date().getMonth()).length}
                  </div>
                  <div className="text-sm text-gray-600">Communications sent</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}