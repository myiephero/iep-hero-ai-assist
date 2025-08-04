// iep-goal-generator.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function IEPGoalGenerator() {
  const [area, setArea] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2 text-slate-900">IEP Goal Generator</h1>
      <p className="text-slate-600 mb-6">
        Describe the area your child needs support in and we'll generate SMART IEP goals for you.
      </p>

      <div className="space-y-4">
        <Textarea
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="e.g., reading comprehension, social skills, fine motor development, math problem solving"
          className="min-h-[100px] border-slate-300"
          rows={4}
        />

        <Button 
          disabled={loading || !area.trim()} 
          onClick={generateGoals}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? 'Generating Goals...' : 'Generate SMART Goals'}
        </Button>
      </div>

      {goals.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Suggested IEP Goals</h2>
          <p className="text-sm text-slate-600 mb-4">
            These goals follow the SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound)
          </p>
          {goals.map((goal, index) => (
            <Card key={index} className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-600 font-semibold text-sm px-2 py-1 rounded">
                    Goal {index + 1}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed flex-1">{goal}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              💡 <strong>Tip:</strong> These generated goals can be customized to better fit your child's specific needs. 
              Discuss them with your IEP team during your next meeting.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}