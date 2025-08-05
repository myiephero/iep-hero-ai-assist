// iep-goal-generator.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Plus, User } from 'lucide-react';
import { Link } from 'wouter';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';

export default function IEPGoalGeneratorPage() {
  const [area, setArea] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch students for parent users
  const { data: students = [] } = useQuery({
    queryKey: ['/api/students'],
    enabled: user?.role === 'parent',
  });

  const generateGoals = async () => {
    if (!area.trim()) {
      toast({
        title: "Please enter an area",
        description: "Describe the area your child needs support in.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setGoals([]);
    
    try {
      const response = await fetch('/api/generate-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ area: area.trim() })
      });

      if (!response.ok) {
        throw new Error('Failed to generate goals');
      }

      const data = await response.json();
      setGoals(data.goals || []);
      
      if (data.goals && data.goals.length > 0) {
        toast({
          title: "Goals Generated!",
          description: `Generated ${data.goals.length} SMART IEP goals for ${area}`,
        });
      }
    } catch (error) {
      console.error('Error generating goals:', error);
      toast({
        title: "Error",
        description: "Failed to generate goals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveGoalsToDatabase = async () => {
    if (goals.length === 0) {
      toast({
        title: "No goals to save",
        description: "Please generate goals first before saving.",
        variant: "destructive",
      });
      return;
    }

    if (user?.role === 'parent' && !selectedStudentId) {
      toast({
        title: "Please select a student",
        description: "Choose which student these goals are for.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    
    try {
      // Save each goal to the database
      const savePromises = goals.map((goalText, index) => {
        const goalData = {
          title: `${area} Goal ${index + 1}`,
          description: goalText,
          status: 'Not Started',
          progress: 0,
          dueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
          studentId: user?.role === 'parent' ? selectedStudentId : undefined,
          category: area || 'General'
        };
        
        return apiRequest('POST', '/api/goals', goalData);
      });

      await Promise.all(savePromises);
      
      // Invalidate goals cache to refresh the data
      await queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      
      toast({
        title: "Goals Saved!",
        description: `Successfully saved ${goals.length} goals to your IEP goals list.`,
      });
      
      // Clear the generated goals since they're now saved
      setGoals([]);
      setArea('');
      
    } catch (error) {
      console.error('Error saving goals:', error);
      toast({
        title: "Error",
        description: "Failed to save goals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveIndividualGoal = async (goalText: string, index: number) => {
    if (user?.role === 'parent' && !selectedStudentId) {
      toast({
        title: "Please select a student",
        description: "Choose which student this goal is for.",
        variant: "destructive",
      });
      return;
    }

    try {
      const goalData = {
        title: `${area} Goal ${index + 1}`,
        description: goalText,
        status: 'Not Started',
        progress: 0,
        dueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        studentId: user?.role === 'parent' ? selectedStudentId : undefined,
        category: area || 'General'
      };
      
      await apiRequest('POST', '/api/goals', goalData);
      await queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      
      toast({
        title: "Goal Saved!",
        description: `Goal ${index + 1} has been added to your IEP goals.`,
      });
      
    } catch (error) {
      console.error('Error saving individual goal:', error);
      toast({
        title: "Error",
        description: "Failed to save goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f2f7fd] to-[#eaf0f8] py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Link href="/dashboard-parent">
            <Button variant="ghost" className="mb-4 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold mb-3 text-slate-900">IEP Goal Generator</h1>
          <p className="text-lg text-slate-600">
            Describe the area your child needs support in and we'll generate SMART IEP goals for you.
          </p>
        </div>

        {/* Goal Generation Form */}
        <Card className="bg-white shadow-sm border border-slate-200 mb-8">
          <CardContent className="p-6">
            <div className="space-y-6">
              {user?.role === 'parent' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Student
                  </label>
                  {students.length === 0 ? (
                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                      <User className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-600 mb-2">No students found</p>
                      <Link href="/my-students">
                        <Button variant="outline" size="sm">
                          Create Student Profile
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a student..." />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student: any) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.firstName} {student.lastName}
                            {student.gradeLevel && ` (Grade ${student.gradeLevel})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="area" className="block text-sm font-medium text-slate-700 mb-2">
                  Area of Need
                </label>
                <Textarea
                  id="area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g., reading comprehension, social skills, fine motor development, math problem solving, communication skills, behavior management"
                  className="min-h-[120px] border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  rows={5}
                />
              </div>

              <Button 
                disabled={loading || !area.trim()} 
                onClick={generateGoals}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                size="lg"
              >
                {loading ? 'Generating SMART Goals...' : 'Generate IEP Goals'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Goals Display */}
        {goals.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900">Generated IEP Goals</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">{goals.length} goals generated</span>
                <Button 
                  onClick={saveGoalsToDatabase} 
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save All Goals
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700">
                <strong>About SMART Goals:</strong> These goals follow the SMART criteria - Specific, Measurable, Achievable, Relevant, and Time-bound. 
                They're designed to be professional-quality objectives for your child's IEP.
              </p>
            </div>

            <div className="space-y-4">
              {goals.map((goal, index) => (
                <Card key={index} className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 text-blue-700 font-bold text-sm px-3 py-1 rounded-full shrink-0">
                        Goal {index + 1}
                      </div>
                      <p className="text-slate-700 leading-relaxed flex-1">{goal}</p>
                      <Button
                        onClick={() => saveIndividualGoal(goal, index)}
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Save Goal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Next Steps</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Click "Save All Goals" to add these to your IEP goals tracker</li>
                <li>• Review these goals with your child's IEP team</li>
                <li>• Customize the goals to better fit your child's specific needs</li>
                <li>• Use the Progress Analyzer to monitor goal achievement</li>
                <li>• Set up regular progress reviews in the Meeting Prep tool</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}