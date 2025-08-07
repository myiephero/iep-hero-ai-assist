import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Mail, Calendar, Phone, MessageSquare, User, Clock, FileText, ArrowRight, Download, Save, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface AdvocateInfo {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  avatar?: string;
}

interface MatchData {
  id: string;
  parentId: string;
  advocateId: string;
  meetingDate: string;
  contactMethod: string;
  parentAvailability: string;
  concerns: string;
  helpAreas: string[];
  gradeLevel: string;
  schoolDistrict: string;
  status: string;
  createdAt: string;
}

interface AdvocateMatchConfirmationProps {
  matchData: MatchData;
  onComplete: () => void;
}

const advocateDatabase: Record<string, AdvocateInfo> = {
  'advocate-demo-1': {
    id: 'advocate-demo-1',
    name: 'Sarah Mitchell',
    specialty: 'Special Education Law',
    experience: '15+ years advocating for students with disabilities'
  },
  'advocate-demo-2': {
    id: 'advocate-demo-2',
    name: 'David Chen',
    specialty: 'IEP Compliance',
    experience: '12+ years ensuring proper IEP implementation'
  },
  'advocate-demo-3': {
    id: 'advocate-demo-3',
    name: 'Maria Rodriguez',
    specialty: 'Behavioral Support',
    experience: '10+ years in behavioral intervention planning'
  },
  'advocate-demo-4': {
    id: 'advocate-demo-4',
    name: 'Jennifer Thompson',
    specialty: 'Transition Planning',
    experience: '8+ years in post-secondary transition services'
  }
};

const animationSequence = [
  { step: 1, title: 'Processing Your Request', duration: 1500 },
  { step: 2, title: 'Matching You with an Expert', duration: 2000 },
  { step: 3, title: 'Sending Notifications', duration: 1800 },
  { step: 4, title: 'Confirming Your Match', duration: 1200 }
];

export function AdvocateMatchConfirmation({ matchData, onComplete }: AdvocateMatchConfirmationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch user's students for assignment
  const { data: students } = useQuery({
    queryKey: ['/api/students'],
    enabled: !!user,
  });

  // Save to Vault mutation
  const saveToVaultMutation = useMutation({
    mutationFn: async () => {
      const content = generateMatchSummary();
      return apiRequest('/api/documents/generate', 'POST', {
        content,
        type: 'advocate_match',
        generatedBy: 'Advocate Matcher',
        displayName: `IEP Advocate Match - ${advocate.name}`,
        studentId: selectedStudentId || undefined,
      });
    },
    onSuccess: () => {
      toast({
        title: "Saved to Vault",
        description: "Advocate match details saved to your document vault.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed", 
        description: error.message || "Failed to save to vault.",
        variant: "destructive"
      });
    },
  });

  // Assign to Student mutation
  const assignToStudentMutation = useMutation({
    mutationFn: async (studentId: string) => {
      const content = generateMatchSummary();
      return apiRequest('/api/documents/generate', 'POST', {
        content,
        type: 'advocate_match',
        generatedBy: 'Advocate Matcher',
        displayName: `IEP Advocate Match - ${advocate.name}`,
        studentId: studentId,
      });
    },
    onSuccess: (data, studentId) => {
      const student = (students as any[])?.find((s: any) => s.id === studentId);
      toast({
        title: "Assigned Successfully",
        description: `Advocate match assigned to ${student?.firstName} ${student?.lastName}'s records.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/students'] });
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      setShowAssignDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Assignment Failed",
        description: error.message || "Failed to assign to student.",
        variant: "destructive"
      });
    },
  });

  const advocate = advocateDatabase[matchData.advocateId] || {
    id: matchData.advocateId,
    name: 'Professional Advocate',
    specialty: 'IEP Support',
    experience: 'Experienced in special education advocacy'
  };

  useEffect(() => {
    const runSequence = async () => {
      for (let i = 0; i < animationSequence.length; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, animationSequence[i].duration));
      }
      setIsComplete(true);
      setTimeout(() => setShowDetails(true), 500);
    };

    runSequence();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getContactIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'zoom': return <MessageSquare className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const generateMatchSummary = () => {
    return `IEP Advocate Match Summary

Advocate Information:
- Name: ${advocate.name}
- Specialty: ${advocate.specialty}
- Experience: ${advocate.experience}

Match Details:
- Meeting Date: ${formatDate(matchData.meetingDate)}
- Contact Method: ${matchData.contactMethod}
- Your Availability: ${matchData.parentAvailability}

Areas of Support:
${matchData.helpAreas.map(area => `- ${area}`).join('\n')}

Your Concerns:
${matchData.concerns}

Child Information:
- Grade Level: ${matchData.gradeLevel}
- School District: ${matchData.schoolDistrict}

Next Steps:
1. Your advocate will receive your request within 15 minutes
2. They'll contact you within 24 hours to schedule your meeting
3. You'll receive a confirmation email with next steps

Match ID: ${matchData.id}
Created: ${formatDate(matchData.createdAt)}
`;
  };

  const handleDownload = () => {
    const content = generateMatchSummary();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IEP_Advocate_Match_${advocate.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Advocate match summary downloaded successfully.",
    });
  };

  if (!isComplete) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl"
        >
          <div className="text-center space-y-6">
            {/* Animated Logo/Icon */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center"
            >
              <User className="w-8 h-8 text-white" />
            </motion.div>

            {/* Progress Steps */}
            <div className="space-y-4">
              {animationSequence.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: index <= currentStep ? 1 : 0.3,
                    x: 0
                  }}
                  className="flex items-center space-x-3"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    index < currentStep 
                      ? 'bg-green-500' 
                      : index === currentStep 
                        ? 'bg-blue-500' 
                        : 'bg-gray-300'
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-xs font-bold text-white">{item.step}</span>
                    )}
                  </div>
                  <span className={`text-sm ${
                    index <= currentStep ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'
                  }`}>
                    {item.title}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Loading Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / animationSequence.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
      >
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Match Confirmed!</h2>
          <p className="text-green-100">You've been successfully connected with an IEP advocate</p>
        </div>

        {/* Match Details */}
        <div className="p-6 space-y-6">
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                {/* Advocate Card */}
                <Card className="border-2 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                          {advocate.name}
                        </h3>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                          {advocate.specialty}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {advocate.experience}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Matched
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Meeting Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">Meeting Date</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(matchData.meetingDate)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        {getContactIcon(matchData.contactMethod)}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">Contact Method</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {matchData.contactMethod}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Help Areas */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">Areas of Support</p>
                        <div className="flex flex-wrap gap-2">
                          {matchData.helpAreas.map((area, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      What Happens Next?
                    </h4>
                    <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                      <div className="flex items-center space-x-2">
                        <ArrowRight className="w-3 h-3" />
                        <span>Your advocate will receive your request within 15 minutes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ArrowRight className="w-3 h-3" />
                        <span>They'll contact you within 24 hours to schedule your meeting</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ArrowRight className="w-3 h-3" />
                        <span>You'll receive a confirmation email with next steps</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4 pt-4"
            >
              {/* Enhanced Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3">
                <Button 
                  onClick={handleDownload}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Plan
                </Button>
                
                <Button 
                  onClick={() => saveToVaultMutation.mutate()}
                  variant="outline"
                  disabled={saveToVaultMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saveToVaultMutation.isPending ? "Saving..." : "Save to Vault"}
                </Button>
                
                <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Assign to Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign to Student</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Select which student this advocate match should be assigned to:
                      </p>
                      <Select onValueChange={setSelectedStudentId} value={selectedStudentId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a student" />
                        </SelectTrigger>
                        <SelectContent>
                          {(students as any[])?.map((student: any) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.firstName} {student.lastName} - Grade {student.grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => assignToStudentMutation.mutate(selectedStudentId)}
                          disabled={!selectedStudentId || assignToStudentMutation.isPending}
                        >
                          {assignToStudentMutation.isPending ? "Assigning..." : "Assign"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              {/* Return to Dashboard Button */}
              <div className="flex justify-center">
                <Button onClick={onComplete} className="px-8">
                  Return to Dashboard
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}