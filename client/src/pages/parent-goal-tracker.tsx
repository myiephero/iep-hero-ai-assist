import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { ArrowLeft, TrendingUp, Calendar, AlertTriangle, Plus, FileText, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, isAfter, isBefore, addDays } from "date-fns";

const progressNoteSchema = z.object({
  content: z.string().min(1, "Please enter a note"),
  goalId: z.string().min(1, "Goal ID is required"),
});

type ProgressNoteForm = z.infer<typeof progressNoteSchema>;

interface Goal {
  id: string;
  title: string;
  description: string;
  status: "Not Started" | "In Progress" | "Completed";
  progress: number;
  dueDate: string;
  targetDate: string;
  studentId: string;
  createdAt: string;
  updatedAt: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  gradeLevel: string;
  schoolName: string;
}

interface ProgressNote {
  id: string;
  content: string;
  goalId: string;
  studentId: string;
  createdAt: string;
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Completed":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "In Progress":
      return <Clock className="h-4 w-4 text-blue-500" />;
    case "Not Started":
      return <XCircle className="h-4 w-4 text-gray-400" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "In Progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Not Started":
      return "bg-gray-100 text-gray-600 border-gray-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

function isDueSoon(dueDate: string): boolean {
  const due = new Date(dueDate);
  const sevenDaysFromNow = addDays(new Date(), 7);
  return isBefore(due, sevenDaysFromNow) && isAfter(due, new Date());
}

function isOverdue(dueDate: string): boolean {
  return isBefore(new Date(dueDate), new Date());
}

export default function ParentGoalTracker() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string>("");

  const form = useForm<ProgressNoteForm>({
    resolver: zodResolver(progressNoteSchema),
    defaultValues: {
      content: "",
      goalId: "",
    },
  });

  // Fetch students for the logged-in parent
  const { data: students = [], isLoading: studentsLoading } = useQuery<Student[]>({
    queryKey: ['/api/students'],
    enabled: !!user,
  });

  // Fetch goals for selected student
  const { data: goals = [], isLoading: goalsLoading } = useQuery<Goal[]>({
    queryKey: ['/api/goals', selectedStudentId],
    enabled: !!selectedStudentId,
  });

  // Fetch progress notes for selected student
  const { data: progressNotes = [] } = useQuery<ProgressNote[]>({
    queryKey: ['/api/progress-notes', selectedStudentId],
    enabled: !!selectedStudentId,
  });

  // Add progress note mutation
  const addNoteMutation = useMutation({
    mutationFn: async (data: ProgressNoteForm) => {
      const response = await apiRequest('POST', '/api/progress-notes', {
        ...data,
        studentId: selectedStudentId,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Failed to add note`);
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Note Added",
        description: "Progress note has been saved successfully.",
      });
      setNoteDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/progress-notes', selectedStudentId] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Note",
        description: error.message || "Unable to save progress note. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate vault snapshot mutation
  const generateSnapshotMutation = useMutation({
    mutationFn: async () => {
      const selectedStudent = students.find(s => s.id === selectedStudentId);
      if (!selectedStudent) throw new Error("Student not found");

      const snapshotData = {
        studentId: selectedStudentId,
        studentName: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
        goals,
        progressNotes: progressNotes.filter(note => 
          goals.some(goal => goal.id === note.goalId)
        ),
        generatedAt: new Date().toISOString(),
      };

      const response = await apiRequest('POST', '/api/goal-tracker/snapshot', snapshotData);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Failed to generate snapshot`);
      }
      
      return await response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Snapshot Saved",
        description: `Goal tracker snapshot saved to vault: ${result.filename}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Generate Snapshot",
        description: error.message || "Unable to generate snapshot. Please try again.",
        variant: "destructive",
      });
    },
  });

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const completedGoals = goals.filter(g => g.status === "Completed").length;
  const inProgressGoals = goals.filter(g => g.status === "In Progress").length;
  const overdueGoals = goals.filter(g => isOverdue(g.dueDate)).length;
  const dueSoonGoals = goals.filter(g => isDueSoon(g.dueDate)).length;

  const handleAddNote = (goalId: string) => {
    setSelectedGoalId(goalId);
    form.setValue("goalId", goalId);
    setNoteDialogOpen(true);
  };

  const onSubmitNote = (data: ProgressNoteForm) => {
    addNoteMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard-parent">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                Goal Tracker
              </h1>
              <p className="text-slate-600 mt-1">Monitor your child's IEP goal progress</p>
            </div>
          </div>
        </div>

        {/* Student Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Select Child</CardTitle>
            <CardDescription>Choose which child's goals you want to track</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Select your child..." />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} - {student.gradeLevel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedStudentId && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{completedGoals}</p>
                      <p className="text-sm text-slate-600">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{inProgressGoals}</p>
                      <p className="text-sm text-slate-600">In Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Calendar className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{dueSoonGoals}</p>
                      <p className="text-sm text-slate-600">Due Soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{overdueGoals}</p>
                      <p className="text-sm text-slate-600">Overdue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">
                {selectedStudent?.firstName}'s Goals ({goals.length})
              </h2>
              <Button 
                onClick={() => generateSnapshotMutation.mutate()} 
                disabled={generateSnapshotMutation.isPending || goals.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                {generateSnapshotMutation.isPending ? "Generating..." : "Save Snapshot to Vault"}
              </Button>
            </div>

            {/* Goals List */}
            {goalsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full" />
              </div>
            ) : goals.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No Goals Found</h3>
                  <p className="text-slate-600 mb-4">No IEP goals have been created for {selectedStudent?.firstName} yet.</p>
                  <Link href="/goal-generator">
                    <Button>Create First Goal</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {goals.map((goal) => {
                  const goalNotes = progressNotes.filter(note => note.goalId === goal.id);
                  const isGoalOverdue = isOverdue(goal.dueDate);
                  const isGoalDueSoon = isDueSoon(goal.dueDate);
                  
                  return (
                    <Card key={goal.id} className={`${isGoalOverdue ? 'border-red-200 bg-red-50' : isGoalDueSoon ? 'border-yellow-200 bg-yellow-50' : ''}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getStatusIcon(goal.status)}
                              <CardTitle className="text-lg">{goal.title}</CardTitle>
                              <Badge className={getStatusColor(goal.status)}>
                                {goal.status}
                              </Badge>
                              {isGoalOverdue && (
                                <Badge variant="destructive">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Overdue
                                </Badge>
                              )}
                              {isGoalDueSoon && !isGoalOverdue && (
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Due Soon
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="text-base">{goal.description}</CardDescription>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAddNote(goal.id)}
                            className="ml-4"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Note
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Progress Bar */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-slate-700">Progress</span>
                              <span className="text-sm text-slate-600">{goal.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${goal.progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Due Date */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-slate-500" />
                              <span className="text-slate-600">
                                Due: {format(new Date(goal.dueDate), 'MMM dd, yyyy')}
                              </span>
                            </div>
                            <span className="text-slate-500">
                              Updated: {format(new Date(goal.updatedAt), 'MMM dd, yyyy')}
                            </span>
                          </div>

                          {/* Recent Notes */}
                          {goalNotes.length > 0 && (
                            <div className="border-t pt-4">
                              <h4 className="text-sm font-medium text-slate-700 mb-2">Recent Notes ({goalNotes.length})</h4>
                              <div className="space-y-2">
                                {goalNotes.slice(-2).map((note) => (
                                  <div key={note.id} className="bg-slate-50 p-3 rounded-lg">
                                    <p className="text-sm text-slate-700">{note.content}</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                      {format(new Date(note.createdAt), 'MMM dd, yyyy - h:mm a')}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Add Note Dialog */}
        <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Progress Note</DialogTitle>
              <DialogDescription>
                Add a note about this goal's progress, observations, or updates.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitNote)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your progress note here..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setNoteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={addNoteMutation.isPending}
                  >
                    {addNoteMutation.isPending ? "Saving..." : "Save Note"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}