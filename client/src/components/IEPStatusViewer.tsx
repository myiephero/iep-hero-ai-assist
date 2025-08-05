import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';

interface IEPStatus {
  id: string;
  studentName: string;
  status: 'Draft' | 'In Review' | 'Finalized' | 'Needs Updates';
  lastModified: string;
  nextMeeting?: string;
  progress: number;
}

const mockIEPs: IEPStatus[] = [
  {
    id: 'iep-001',
    studentName: 'Emma Johnson',
    status: 'In Review',
    lastModified: '2 days ago',
    nextMeeting: 'March 15, 2025',
    progress: 85
  },
  {
    id: 'iep-002', 
    studentName: 'Alex Johnson',
    status: 'Draft',
    lastModified: '1 week ago',
    nextMeeting: 'February 28, 2025',
    progress: 60
  },
  {
    id: 'iep-003',
    studentName: 'Michael Smith', 
    status: 'Finalized',
    lastModified: '3 weeks ago',
    progress: 100
  }
];

export function IEPStatusViewer() {
  const [, setLocation] = useLocation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'In Review': return 'bg-blue-100 text-blue-800';
      case 'Finalized': return 'bg-green-100 text-green-800';
      case 'Needs Updates': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Your IEP Documents</h3>
        <Button 
          onClick={() => setLocation('/iep-goal-generator')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Create New IEP
        </Button>
      </div>
      
      <div className="space-y-3">
        {mockIEPs.map((iep) => (
          <Card key={iep.id} className="bg-white border border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-slate-900">{iep.studentName} - IEP</h4>
                    <Badge className={getStatusColor(iep.status)}>
                      {iep.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>Last updated: {iep.lastModified}</span>
                    {iep.nextMeeting && (
                      <span>Next meeting: {iep.nextMeeting}</span>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${iep.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-600">{iep.progress}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  {iep.status === 'Draft' && (
                    <Button 
                      size="sm"
                      onClick={() => setLocation('/iep-goal-generator')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Resume
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}