import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Heart, 
  Zap, 
  Target, 
  Eye,
  Lightbulb,
  Settings,
  ArrowLeft,
  Download,
  Share2,
  Loader2,
  CheckCircle,
  Calendar,
  BookOpen,
  Users,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  age: number;
}

interface OTAssessment {
  studentId: string;
  fineMotorSkills: string;
  grossMotorSkills: string;
  sensoryProcessing: string;
  visualPerceptual: string;
  selfCareSkills: string;
  handwritingSkills: string;
  attentionFocus: string;
  organizationalSkills: string;
  socialParticipation: string;
  environmentalFactors: string;
  currentChallenges: string;
  strengths: string;
  previousOT: boolean;
  accommodationGoals: string;
}

interface OTRecommendation {
  category: string;
  activity: string;
  description: string;
  frequency: string;
  materials: string[];
  adaptations: string[];
  progressMarkers: string[];
}

const OccupationalTherapyRecommender: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState(1);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<OTRecommendation[]>([]);
  
  const [assessment, setAssessment] = useState<Partial<OTAssessment>>({
    fineMotorSkills: '',
    grossMotorSkills: '',
    sensoryProcessing: '',
    visualPerceptual: '',
    selfCareSkills: '',
    handwritingSkills: '',
    attentionFocus: '',
    organizationalSkills: '',
    socialParticipation: '',
    environmentalFactors: '',
    currentChallenges: '',
    strengths: '',
    previousOT: false,
    accommodationGoals: ''
  });

  // Fetch students for dropdown
  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ['/api/parent/students'],
    enabled: !!user
  });

  const generateOTRecommendations = useMutation({
    mutationFn: async (data: { studentId: string; assessment: Partial<OTAssessment> }) => {
      const response = await fetch('/api/generate-ot-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate recommendations');
      }
      
      return response.json();
    },
    onSuccess: (data: any) => {
      setRecommendations(data.recommendations);
      setStep(3);
      toast({
        title: "Success!",
        description: "OT recommendations generated successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate recommendations",
        variant: "destructive"
      });
    }
  });

  const handleAssessmentChange = (field: keyof OTAssessment, value: any) => {
    setAssessment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerateRecommendations = async () => {
    if (!selectedStudentId || !assessment.currentChallenges || !assessment.accommodationGoals) {
      toast({
        title: "Missing Information",
        description: "Please select a student and fill in the required fields",
        variant: "destructive"
      });
      return;
    }

    generateOTRecommendations.mutate({
      studentId: selectedStudentId,
      assessment: {
        ...assessment,
        studentId: selectedStudentId
      }
    });
  };

  const downloadRecommendations = () => {
    const selectedStudent = students.find((s: Student) => s.id === selectedStudentId);
    const content = `
OCCUPATIONAL THERAPY ACTIVITY & ADAPTATION RECOMMENDATIONS

Student: ${selectedStudent?.firstName} ${selectedStudent?.lastName}
Generated: ${new Date().toLocaleDateString()}

${recommendations.map((rec, index) => `
${index + 1}. ${rec.category.toUpperCase()}
Activity: ${rec.activity}
Description: ${rec.description}
Frequency: ${rec.frequency}
Materials Needed: ${rec.materials.join(', ')}
Adaptations: ${rec.adaptations.join(', ')}
Progress Markers: ${rec.progressMarkers.join(', ')}
`).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OT-Recommendations-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/dashboard-parent">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Activity className="w-8 h-8 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl">Occupational Therapy Activity & Adaptation Recommender</CardTitle>
                  <p className="text-gray-600">Generate personalized OT activities and adaptations for your child</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="student-select">Select Student</Label>
                  <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student: Student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.firstName} {student.lastName} (Grade {student.grade})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-green-600" />
                        <span>What This Tool Provides</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span className="text-sm">Personalized OT activities</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span className="text-sm">Environmental adaptations</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span className="text-sm">Progress tracking strategies</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span className="text-sm">Home and school implementation</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        <span>Assessment Areas</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Badge variant="outline">Fine & Gross Motor Skills</Badge>
                      <Badge variant="outline">Sensory Processing</Badge>
                      <Badge variant="outline">Visual Perceptual Skills</Badge>
                      <Badge variant="outline">Self-Care & Daily Living</Badge>
                      <Badge variant="outline">Handwriting & School Tasks</Badge>
                      <Badge variant="outline">Attention & Organization</Badge>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-center">
                  <Button 
                    onClick={() => setStep(2)}
                    disabled={!selectedStudentId}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Begin OT Assessment
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Progress value={50} className="w-32" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-6 h-6 text-blue-600" />
                <span>OT Assessment Profile</span>
              </CardTitle>
              <p className="text-gray-600">
                Complete this assessment to generate personalized OT recommendations
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fine-motor">Fine Motor Skills</Label>
                    <Select value={assessment.fineMotorSkills} onValueChange={(value) => handleAssessmentChange('fineMotorSkills', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="age-appropriate">Age Appropriate</SelectItem>
                        <SelectItem value="emerging">Emerging</SelectItem>
                        <SelectItem value="needs-support">Needs Support</SelectItem>
                        <SelectItem value="significant-challenges">Significant Challenges</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="gross-motor">Gross Motor Skills</Label>
                    <Select value={assessment.grossMotorSkills} onValueChange={(value) => handleAssessmentChange('grossMotorSkills', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="age-appropriate">Age Appropriate</SelectItem>
                        <SelectItem value="emerging">Emerging</SelectItem>
                        <SelectItem value="needs-support">Needs Support</SelectItem>
                        <SelectItem value="significant-challenges">Significant Challenges</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sensory-processing">Sensory Processing</Label>
                    <Select value={assessment.sensoryProcessing} onValueChange={(value) => handleAssessmentChange('sensoryProcessing', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="typical">Typical Processing</SelectItem>
                        <SelectItem value="sensory-seeking">Sensory Seeking</SelectItem>
                        <SelectItem value="sensory-avoiding">Sensory Avoiding</SelectItem>
                        <SelectItem value="mixed-patterns">Mixed Patterns</SelectItem>
                        <SelectItem value="significant-dysfunction">Significant Dysfunction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="visual-perceptual">Visual Perceptual Skills</Label>
                    <Select value={assessment.visualPerceptual} onValueChange={(value) => handleAssessmentChange('visualPerceptual', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="age-appropriate">Age Appropriate</SelectItem>
                        <SelectItem value="emerging">Emerging</SelectItem>
                        <SelectItem value="needs-support">Needs Support</SelectItem>
                        <SelectItem value="significant-challenges">Significant Challenges</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="self-care">Self-Care Skills</Label>
                    <Select value={assessment.selfCareSkills} onValueChange={(value) => handleAssessmentChange('selfCareSkills', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="independent">Independent</SelectItem>
                        <SelectItem value="minimal-assistance">Minimal Assistance</SelectItem>
                        <SelectItem value="moderate-assistance">Moderate Assistance</SelectItem>
                        <SelectItem value="maximum-assistance">Maximum Assistance</SelectItem>
                        <SelectItem value="dependent">Dependent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="handwriting">Handwriting Skills</Label>
                    <Select value={assessment.handwritingSkills} onValueChange={(value) => handleAssessmentChange('handwritingSkills', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="age-appropriate">Age Appropriate</SelectItem>
                        <SelectItem value="emerging">Emerging</SelectItem>
                        <SelectItem value="needs-support">Needs Support</SelectItem>
                        <SelectItem value="significant-challenges">Significant Challenges</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="attention">Attention & Focus</Label>
                    <Select value={assessment.attentionFocus} onValueChange={(value) => handleAssessmentChange('attentionFocus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="variable">Variable</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                        <SelectItem value="very-poor">Very Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="organizational">Organizational Skills</Label>
                    <Select value={assessment.organizationalSkills} onValueChange={(value) => handleAssessmentChange('organizationalSkills', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="developing">Developing</SelectItem>
                        <SelectItem value="needs-support">Needs Support</SelectItem>
                        <SelectItem value="significant-challenges">Significant Challenges</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="social">Social Participation</Label>
                    <Select value={assessment.socialParticipation} onValueChange={(value) => handleAssessmentChange('socialParticipation', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="developing">Developing</SelectItem>
                        <SelectItem value="limited">Limited</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="previous-ot"
                      checked={assessment.previousOT}
                      onCheckedChange={(checked) => handleAssessmentChange('previousOT', checked)}
                    />
                    <Label htmlFor="previous-ot">Has received OT services before</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="challenges">Current Challenges *</Label>
                  <Textarea
                    id="challenges"
                    placeholder="Describe the main challenges your child faces (e.g., difficulty with fine motor tasks, sensory sensitivities, organizational issues, etc.)"
                    value={assessment.currentChallenges}
                    onChange={(e) => handleAssessmentChange('currentChallenges', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="strengths">Child's Strengths</Label>
                  <Textarea
                    id="strengths"
                    placeholder="What does your child do well? What are their interests and motivators?"
                    value={assessment.strengths}
                    onChange={(e) => handleAssessmentChange('strengths', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="goals">OT Goals & Objectives *</Label>
                  <Textarea
                    id="goals"
                    placeholder="What specific skills or areas would you like to target? What are your goals for OT intervention?"
                    value={assessment.accommodationGoals}
                    onChange={(e) => handleAssessmentChange('accommodationGoals', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="environment">Environmental Factors</Label>
                  <Textarea
                    id="environment"
                    placeholder="Describe the home and school environments, any specific challenges or supports"
                    value={assessment.environmentalFactors}
                    onChange={(e) => handleAssessmentChange('environmentalFactors', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <Button 
                  onClick={handleGenerateRecommendations}
                  disabled={generateOTRecommendations.isPending || !assessment.currentChallenges || !assessment.accommodationGoals}
                  className="bg-blue-600 hover:bg-blue-700 px-8"
                >
                  {generateOTRecommendations.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Recommendations...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Generate OT Recommendations
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Step 3: Display Results
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assessment
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={downloadRecommendations}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share with Team
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-6 h-6 text-blue-600" />
              <span>OT Activity & Adaptation Recommendations</span>
            </CardTitle>
            <p className="text-gray-600">
              Personalized recommendations for {students.find((s: Student) => s.id === selectedStudentId)?.firstName} {students.find((s: Student) => s.id === selectedStudentId)?.lastName}
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map((recommendation, index) => (
            <Card key={index} className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <span>{recommendation.category}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">{recommendation.activity}</h4>
                  <p className="text-gray-700 text-sm">{recommendation.description}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-purple-700">Frequency</Label>
                  <p className="text-sm text-gray-600">{recommendation.frequency}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-purple-700">Materials Needed</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recommendation.materials.map((material, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-purple-700">Adaptations</Label>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1">
                    {recommendation.adaptations.map((adaptation, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{adaptation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Label className="text-sm font-medium text-purple-700">Progress Markers</Label>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1">
                    {recommendation.progressMarkers.map((marker, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Target className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{marker}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {recommendations.length === 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No recommendations generated yet. Please complete the assessment first.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default OccupationalTherapyRecommender;