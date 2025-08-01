import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, CalendarPlus, BarChart3 } from "lucide-react";

interface QuickActionsProps {
  onUploadDocument: () => void;
  onScheduleMeeting: () => void;
  onGenerateReport: () => void;
}

export default function QuickActions({
  onUploadDocument,
  onScheduleMeeting,
  onGenerateReport,
}: QuickActionsProps) {
  const actions = [
    {
      label: "Upload Document",
      icon: Upload,
      onClick: onUploadDocument,
      color: "bg-blue-50 text-primary hover:bg-blue-100",
    },
    {
      label: "Schedule Meeting",
      icon: CalendarPlus,
      onClick: onScheduleMeeting,
      color: "bg-green-50 text-green-600 hover:bg-green-100",
    },
    {
      label: "Generate Report",
      icon: BarChart3,
      onClick: onGenerateReport,
      color: "bg-orange-50 text-orange-600 hover:bg-orange-100",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`w-full justify-start ${action.color}`}
              onClick={action.onClick}
            >
              <action.icon className="h-4 w-4 mr-3" />
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
