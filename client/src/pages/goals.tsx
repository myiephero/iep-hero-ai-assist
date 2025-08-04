import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Edit, Trash2, Target, TrendingUp, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import type { Goal } from "@shared/schema";

const goalFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  studentId: z.string().optional(),
  status: z.enum(["Not Started", "In Progress", "Completed"]),
  progress: z.number().min(0).max(100),
  dueDate: z.date(),
});

type GoalFormData = z.infer<typeof goalFormSchema>;

const statusColors = {
  "Not Started": "bg-gray-600 text-white",
  "In Progress": "bg-blue-600 text-white", 
  "Completed": "bg-green-600 text-white"
};

export default function Goals() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: "",
      description: "",
      studentId: "",
      status: "Not Started",
      progress: 0,
      dueDate: new Date(),
    },
  });

  const { data: goals = [], isLoading } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
  });

  // Mock goals for demo
  const mockGoals = [
    {
      id: "1",
      title: "Improve Reading Comprehension",
      description: "Student will demonstrate improved reading comprehension skills",
      status: "In Progress" as const,
      progress: 75,
      dueDate: new Date("2024-06-15"),
    },
    {
      id: "2",
      title: "Math Problem Solving",
      description: "Student will solve multi-step math word problems",
      status: "In Progress" as const,
      progress: 45,
      dueDate: new Date("2024-05-30"),
    },
  ];

  const displayGoals = goals.length > 0 ? goals : mockGoals;
  const isHeroPlan = user?.planStatus === 'heroOffer';

  const createGoalMutation = useMutation({
    mutationFn: (data: GoalFormData) => apiRequest("POST", "/api/goals", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      setIsDialogOpen(false);
      setEditingGoal(null);
      form.reset();
      toast({
        title: "Success",
        description: "Goal created successfully",
      });
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: GoalFormData }) => 
      apiRequest("PATCH", `/api/goals/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      setIsDialogOpen(false);
      setEditingGoal(null);
      form.reset();
      toast({
        title: "Success",
        description: "Goal updated successfully",
      });
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/goals/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      toast({
        title: "Success",
        description: "Goal deleted successfully",
      });
    },
  });

  const onSubmit = (data: GoalFormData) => {
    if (editingGoal) {
      updateGoalMutation.mutate({ id: editingGoal.id, data });
    } else {
      createGoalMutation.mutate(data);
    }
  };

  const openEditDialog = (goal: Goal) => {
    setEditingGoal(goal);
    form.reset({
      title: goal.title,
      description: goal.description,
      status: goal.status,
      progress: goal.progress || 0,
      dueDate: new Date(goal.dueDate),
    });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingGoal(null);
    form.reset();
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1B2E] to-[#2C2F48] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#2C2F48]/95 backdrop-blur shadow-lg px-6 py-4 flex items-center justify-between border-b border-slate-600">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">My IEP Hero</h1>
          {isHeroPlan && (
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
              Hero Plan
            </Badge>
          )}
        </div>
        <nav className="space-x-4 flex items-center">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
              Dashboard
            </Button>
          </Link>
          <Button variant="ghost" className="text-white bg-slate-700">
            Goals
          </Button>
          <Link href="/documents">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
              Documents
            </Button>
          </Link>
          <div className="flex items-center gap-2 ml-4">
            <div className="text-right">
              <div className="text-sm font-medium text-white">{user?.username}</div>
              <div className="text-xs text-slate-400 capitalize">
                {user?.planStatus === 'heroOffer' ? 'Hero Plan' : 'Free Plan'}
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">IEP Goals</h2>
            <p className="text-slate-300">Track progress toward educational objectives</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={openNewDialog}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#2C2F48] border-slate-600 text-white">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {editingGoal ? "Edit Goal" : "Create New Goal"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Title</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-[#3E4161] border-slate-500 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="bg-[#3E4161] border-slate-500 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-[#3E4161] border-slate-500 text-white">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#3E4161] border-slate-500">
                              <SelectItem value="Not Started">Not Started</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="progress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Progress (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0} 
                              max={100} 
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                              className="bg-[#3E4161] border-slate-500 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-slate-300">Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "bg-[#3E4161] border-slate-500 text-white justify-start text-left font-normal",
                                  !field.value && "text-slate-400"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : "Pick a date"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={createGoalMutation.isPending || updateGoalMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {editingGoal ? "Update Goal" : "Create Goal"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full" />
          </div>
        ) : displayGoals.length > 0 ? (
          <div className="grid gap-4">
            {displayGoals.map((goal: any) => (
              <Card key={goal.id} className="bg-[#3E4161] border-slate-600">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">{goal.title}</CardTitle>
                      <p className="text-slate-300 mt-2">{goal.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(goal)}
                        className="border-slate-500 text-slate-300 hover:bg-slate-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteGoalMutation.mutate(goal.id)}
                        className="border-red-500 text-red-400 hover:bg-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Badge className={statusColors[goal.status as keyof typeof statusColors]}>
                        {goal.status}
                      </Badge>
                      <span className="text-sm text-slate-400">
                        Due: {format(new Date(goal.dueDate), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">Progress</span>
                        <span className="text-white">{goal.progress || 0}%</span>
                      </div>
                      <Progress 
                        value={goal.progress || 0} 
                        className="h-2 bg-slate-700"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No goals yet</h3>
            <p className="text-slate-400 mb-6">Create your first IEP goal to start tracking progress</p>
            <Button 
              onClick={openNewDialog}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}