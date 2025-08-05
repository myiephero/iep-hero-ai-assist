import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Edit, Trash2, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface ProgressNote {
  id: string;
  date: string;
  serviceType: string;
  promisedSupport: string;
  actualProgress: string;
  concerns: string;
  status: 'on-track' | 'behind' | 'exceeding';
  nextSteps: string;
}

export default function ProgressNotes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<ProgressNote[]>([
    {
      id: '1',
      date: '2024-01-15',
      serviceType: 'Speech Therapy',
      promisedSupport: '2x weekly 30-minute sessions for articulation',
      actualProgress: 'Child showing improvement in /r/ sound production',
      concerns: 'Sessions sometimes cancelled due to therapist absence',
      status: 'behind',
      nextSteps: 'Request makeup sessions for missed appointments'
    }
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<ProgressNote | null>(null);
  const [formData, setFormData] = useState({
    serviceType: '',
    promisedSupport: '',
    actualProgress: '',
    concerns: '',
    status: 'on-track' as const,
    nextSteps: ''
  });

  // Check if user has Hero plan access - force enable for demo accounts
  const hasHeroAccess = user?.planStatus === 'heroOffer' || 
                        user?.email === 'parent@demo.com' ||
                        (process.env.NODE_ENV === 'development' && user?.role === 'parent');

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
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Progress Notes</h2>
              <p className="text-gray-600 mb-6">
                Track your child's progress and compare it to promised supports. Available with Hero Plan ($495/year).
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.serviceType || !formData.promisedSupport || !formData.actualProgress) {
      toast({
        title: "Missing Information",
        description: "Please fill in service type, promised support, and actual progress.",
        variant: "destructive",
      });
      return;
    }

    const newNote: ProgressNote = {
      id: editingNote?.id || Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...formData
    };

    if (editingNote) {
      setNotes(prev => prev.map(note => note.id === editingNote.id ? newNote : note));
      toast({
        title: "Note Updated",
        description: "Progress note has been updated successfully.",
      });
    } else {
      setNotes(prev => [newNote, ...prev]);
      toast({
        title: "Note Added",
        description: "New progress note has been created.",
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      serviceType: '',
      promisedSupport: '',
      actualProgress: '',
      concerns: '',
      status: 'on-track',
      nextSteps: ''
    });
    setIsEditing(false);
    setEditingNote(null);
  };

  const editNote = (note: ProgressNote) => {
    setFormData({
      serviceType: note.serviceType,
      promisedSupport: note.promisedSupport,
      actualProgress: note.actualProgress,
      concerns: note.concerns,
      status: note.status,
      nextSteps: note.nextSteps
    });
    setEditingNote(note);
    setIsEditing(true);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast({
      title: "Note Deleted",
      description: "Progress note has been removed.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'exceeding': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'behind': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800';
      case 'exceeding': return 'bg-blue-100 text-blue-800';
      case 'behind': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard-parent">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Notes</h1>
              <p className="text-gray-600">Track your child's progress and compare to promised supports</p>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              Hero Plan
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          {/* Add/Edit Note Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                {isEditing ? 'Edit Progress Note' : 'Add New Progress Note'}
              </CardTitle>
              <CardDescription>
                Document services provided vs. what was promised in the IEP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serviceType">Service Type *</Label>
                  <Input
                    id="serviceType"
                    placeholder="e.g., Speech Therapy, OT, Reading Support"
                    value={formData.serviceType}
                    onChange={(e) => handleInputChange('serviceType', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Current Status *</Label>
                  <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on-track">On Track</SelectItem>
                      <SelectItem value="exceeding">Exceeding Expectations</SelectItem>
                      <SelectItem value="behind">Behind Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="promisedSupport">Promised Support (per IEP) *</Label>
                <Textarea
                  id="promisedSupport"
                  placeholder="What support was promised in the IEP? Include frequency, duration, goals..."
                  value={formData.promisedSupport}
                  onChange={(e) => handleInputChange('promisedSupport', e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="actualProgress">Actual Progress *</Label>
                <Textarea
                  id="actualProgress"
                  placeholder="What progress has actually been made? Include specific observations..."
                  value={formData.actualProgress}
                  onChange={(e) => handleInputChange('actualProgress', e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="concerns">Concerns (Optional)</Label>
                <Textarea
                  id="concerns"
                  placeholder="Any concerns about service delivery, missed sessions, etc..."
                  value={formData.concerns}
                  onChange={(e) => handleInputChange('concerns', e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="nextSteps">Next Steps (Optional)</Label>
                <Textarea
                  id="nextSteps"
                  placeholder="What needs to happen next? Follow-up actions, requests..."
                  value={formData.nextSteps}
                  onChange={(e) => handleInputChange('nextSteps', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                  {isEditing ? 'Update Note' : 'Add Note'}
                </Button>
                {isEditing && (
                  <Button onClick={resetForm} variant="outline">
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes List */}
          <Card>
            <CardHeader>
              <CardTitle>Progress History</CardTitle>
              <CardDescription>
                {notes.length} notes recorded
              </CardDescription>
            </CardHeader>
            <CardContent>
              {notes.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No progress notes yet. Add your first note above to start tracking.
                </p>
              ) : (
                <div className="space-y-4">
                  {notes.map((note) => (
                    <div key={note.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{note.serviceType}</h3>
                          <Badge className={`text-xs ${getStatusColor(note.status)}`}>
                            {getStatusIcon(note.status)}
                            <span className="ml-1 capitalize">{note.status.replace('-', ' ')}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{new Date(note.date).toLocaleDateString()}</span>
                          <Button onClick={() => editNote(note)} variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button onClick={() => deleteNote(note.id)} variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700 mb-1">Promised Support:</p>
                          <p className="text-gray-600">{note.promisedSupport}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 mb-1">Actual Progress:</p>
                          <p className="text-gray-600">{note.actualProgress}</p>
                        </div>
                      </div>

                      {note.concerns && (
                        <div className="mt-3">
                          <p className="font-medium text-gray-700 mb-1">Concerns:</p>
                          <p className="text-gray-600 text-sm">{note.concerns}</p>
                        </div>
                      )}

                      {note.nextSteps && (
                        <div className="mt-3">
                          <p className="font-medium text-gray-700 mb-1">Next Steps:</p>
                          <p className="text-gray-600 text-sm">{note.nextSteps}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}