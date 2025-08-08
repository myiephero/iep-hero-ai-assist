import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, TrendingUp, Heart, Brain, AlertTriangle, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

interface EmotionEntry {
  id: string;
  emotion: string;
  intensity: number;
  trigger?: string;
  context: string;
  notes?: string;
  coping_strategies: string[];
  effectiveness?: number;
  recorded_by: string;
  mood_before?: number;
  mood_after?: number;
  date: string;
  time_of_day: string;
  duration?: number;
  support_needed: boolean;
  support_provided?: string;
  createdAt: string;
  studentId: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

const emotionOptions = [
  { value: "happy", label: "😊 Happy", color: "bg-yellow-500" },
  { value: "sad", label: "😢 Sad", color: "bg-blue-500" },
  { value: "angry", label: "😠 Angry", color: "bg-red-500" },
  { value: "anxious", label: "😰 Anxious", color: "bg-purple-500" },
  { value: "excited", label: "🤩 Excited", color: "bg-orange-500" },
  { value: "frustrated", label: "😤 Frustrated", color: "bg-pink-500" },
  { value: "calm", label: "😌 Calm", color: "bg-green-500" },
  { value: "overwhelmed", label: "😵 Overwhelmed", color: "bg-gray-500" }
];

const contextOptions = [
  "school", "home", "therapy", "social", "academic", "transition"
];

const timeOfDayOptions = [
  "morning", "afternoon", "evening", "night"
];

const copingStrategies = [
  "Deep breathing", "Counting to 10", "Taking a break", "Talking to someone",
  "Physical activity", "Drawing/Art", "Music", "Sensory tools", "Quiet space",
  "Positive self-talk", "Problem solving", "Mindfulness"
];

export default function EmotionTrackingDashboard() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStudent, setSelectedStudent] = useState("");
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  
  // Form state for new emotion entry
  const [emotionForm, setEmotionForm] = useState({
    emotion: "",
    intensity: 3,
    trigger: "",
    context: "",
    notes: "",
    coping_strategies: [] as string[],
    effectiveness: 3,
    recorded_by: "parent",
    mood_before: 3,
    mood_after: 3,
    time_of_day: "",
    duration: 0,
    support_needed: false,
    support_provided: ""
  });

  // Fetch students
  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ["/api/parent/students"],
    enabled: !!user
  });

  // Fetch emotion entries
  const { data: emotionEntries = [], isLoading } = useQuery<EmotionEntry[]>({
    queryKey: ["/api/emotion-entries", selectedStudent],
    queryFn: () => selectedStudent ? apiRequest(`/api/emotion-entries/${selectedStudent}`) : Promise.resolve([]),
    enabled: !!selectedStudent
  });

  // Create emotion entry mutation
  const createEmotionEntry = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/emotion-entries`, {
      method: "POST",
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      toast({ title: "Emotion entry saved successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/emotion-entries"] });
      setIsAddingEntry(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to save emotion entry", variant: "destructive" });
    }
  });

  const resetForm = () => {
    setEmotionForm({
      emotion: "",
      intensity: 3,
      trigger: "",
      context: "",
      notes: "",
      coping_strategies: [],
      effectiveness: 3,
      recorded_by: "parent",
      mood_before: 3,
      mood_after: 3,
      time_of_day: "",
      duration: 0,
      support_needed: false,
      support_provided: ""
    });
  };

  const handleSubmitEntry = () => {
    if (!selectedStudent || !emotionForm.emotion || !emotionForm.context || !emotionForm.time_of_day) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    createEmotionEntry.mutate({
      ...emotionForm,
      studentId: selectedStudent,
      date: new Date().toISOString()
    });
  };

  // Analytics calculations
  const getEmotionStats = () => {
    if (!emotionEntries.length) return null;

    const emotionCounts = emotionEntries.reduce((acc, entry) => {
      acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommon = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)[0];

    const avgIntensity = emotionEntries.reduce((sum, entry) => sum + entry.intensity, 0) / emotionEntries.length;
    
    const supportNeededCount = emotionEntries.filter(entry => entry.support_needed).length;
    const supportPercentage = (supportNeededCount / emotionEntries.length) * 100;

    return {
      mostCommonEmotion: mostCommon?.[0],
      avgIntensity: avgIntensity.toFixed(1),
      supportPercentage: supportPercentage.toFixed(0),
      totalEntries: emotionEntries.length
    };
  };

  const stats = getEmotionStats();

  const getEmotionColor = (emotion: string) => {
    return emotionOptions.find(opt => opt.value === emotion)?.color || "bg-gray-500";
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 2) return "text-green-600";
    if (intensity <= 3) return "text-yellow-600";
    return "text-red-600";
  };

  if (!user) {
    return <div>Please log in to access emotion tracking.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/dashboard-parent")}
              className="text-slate-400 hover:text-white mb-2"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-white">Emotion Tracking Dashboard</h1>
            <p className="text-slate-400">Monitor emotional well-being and identify patterns</p>
          </div>
          
          <Dialog open={isAddingEntry} onOpenChange={setIsAddingEntry}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Heart className="w-4 h-4 mr-2" />
                Track Emotion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add Emotion Entry</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Emotion *</Label>
                    <Select value={emotionForm.emotion} onValueChange={(value) => 
                      setEmotionForm(prev => ({ ...prev, emotion: value }))
                    }>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Select emotion" />
                      </SelectTrigger>
                      <SelectContent>
                        {emotionOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-slate-300">Intensity (1-5) *</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={emotionForm.intensity}
                      onChange={(e) => setEmotionForm(prev => ({ 
                        ...prev, 
                        intensity: parseInt(e.target.value) || 1 
                      }))}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Context *</Label>
                    <Select value={emotionForm.context} onValueChange={(value) => 
                      setEmotionForm(prev => ({ ...prev, context: value }))
                    }>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Select context" />
                      </SelectTrigger>
                      <SelectContent>
                        {contextOptions.map(context => (
                          <SelectItem key={context} value={context}>
                            {context.charAt(0).toUpperCase() + context.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-slate-300">Time of Day *</Label>
                    <Select value={emotionForm.time_of_day} onValueChange={(value) => 
                      setEmotionForm(prev => ({ ...prev, time_of_day: value }))
                    }>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOfDayOptions.map(time => (
                          <SelectItem key={time} value={time}>
                            {time.charAt(0).toUpperCase() + time.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300">What triggered this emotion?</Label>
                  <Input
                    value={emotionForm.trigger}
                    onChange={(e) => setEmotionForm(prev => ({ ...prev, trigger: e.target.value }))}
                    placeholder="E.g., homework assignment, loud noise, peer interaction"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Additional Notes</Label>
                  <Textarea
                    value={emotionForm.notes}
                    onChange={(e) => setEmotionForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional observations or details"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Duration (minutes)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={emotionForm.duration}
                      onChange={(e) => setEmotionForm(prev => ({ 
                        ...prev, 
                        duration: parseInt(e.target.value) || 0 
                      }))}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-slate-300">Support Needed?</Label>
                    <Select 
                      value={emotionForm.support_needed.toString()} 
                      onValueChange={(value) => 
                        setEmotionForm(prev => ({ ...prev, support_needed: value === "true" }))
                      }
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">No</SelectItem>
                        <SelectItem value="true">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddingEntry(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitEntry}
                    disabled={createEmotionEntry.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {createEmotionEntry.isPending ? "Saving..." : "Save Entry"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Student Selector */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Label className="text-slate-300">Select Student:</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger className="w-64 bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Choose a student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.firstName} {student.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {selectedStudent && (
          <>
            {/* Analytics Overview */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="text-2xl font-bold text-white">{stats.totalEntries}</div>
                        <div className="text-xs text-slate-400">Total Entries</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-400" />
                      <div>
                        <div className="text-lg font-bold text-white capitalize">
                          {stats.mostCommonEmotion}
                        </div>
                        <div className="text-xs text-slate-400">Most Common</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="text-2xl font-bold text-white">{stats.avgIntensity}</div>
                        <div className="text-xs text-slate-400">Avg Intensity</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                      <div>
                        <div className="text-2xl font-bold text-white">{stats.supportPercentage}%</div>
                        <div className="text-xs text-slate-400">Needed Support</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Emotion Entries */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Emotion Entries</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-slate-400">Loading emotion entries...</div>
                  </div>
                ) : emotionEntries.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <div className="text-slate-400 mb-2">No emotion entries yet</div>
                    <div className="text-sm text-slate-500">Start tracking emotions to see patterns and insights</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {emotionEntries.slice(0, 10).map((entry) => (
                      <div key={entry.id} className="bg-slate-700/50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getEmotionColor(entry.emotion)}`} />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white capitalize">{entry.emotion}</span>
                                <Badge variant="outline" className={getIntensityColor(entry.intensity)}>
                                  Intensity: {entry.intensity}/5
                                </Badge>
                                <Badge variant="outline" className="text-slate-300">
                                  {entry.context}
                                </Badge>
                              </div>
                              <div className="text-sm text-slate-400 mt-1">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {format(new Date(entry.date), "MMM d, yyyy")} • {entry.time_of_day}
                                {entry.duration && ` • ${entry.duration} min`}
                              </div>
                              {entry.trigger && (
                                <div className="text-sm text-slate-300 mt-1">
                                  <strong>Trigger:</strong> {entry.trigger}
                                </div>
                              )}
                              {entry.notes && (
                                <div className="text-sm text-slate-300 mt-1">
                                  {entry.notes}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {entry.support_needed && (
                              <Badge variant="destructive" className="text-xs">
                                Support Needed
                              </Badge>
                            )}
                            <div className="text-xs text-slate-500">
                              by {entry.recorded_by}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}