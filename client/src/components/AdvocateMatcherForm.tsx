import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

const HELP_AREAS = [
  'Meeting Prep',
  'Service Denial', 
  'Behavior Support',
  'Accommodations',
  'IEP Evaluation',
  'Transition Planning',
  'Legal Rights'
];

export default function AdvocateMatcherForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    meeting_date: '',
    contact_method: 'Zoom',
    parent_availability: '',
    concerns: '',
    help_areas: [] as string[],
    grade_level: '',
    school_district: '',
    document_urls: '',
    assigned_advocate_id: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/advocate-matches', 'POST', {
        parentId: user?.id,
        ...data,
        helpAreas: data.help_areas,
        availability: data.parent_availability,
        contactMethod: data.contact_method,
        meetingDate: data.meeting_date || undefined,
        schoolDistrict: data.school_district,
        gradeLevel: data.grade_level,
        documentUrls: data.document_urls ? [data.document_urls] : []
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Request Submitted",
        description: "Your advocate match request has been submitted successfully. You'll hear from us shortly!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit request",
        variant: "destructive",
      });
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleHelpAreaChange = (area: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      help_areas: checked 
        ? [...prev.help_areas, area]
        : prev.help_areas.filter(a => a !== area)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.concerns.trim() || !form.parent_availability.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in your concerns and availability.",
        variant: "destructive",
      });
      return;
    }

    if (form.help_areas.length === 0) {
      toast({
        title: "Missing Information", 
        description: "Please select at least one help area.",
        variant: "destructive",
      });
      return;
    }

    submitMutation.mutate(form);
  };

  if (submitted) {
    return (
      <Card className="max-w-xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Request Submitted Successfully!</h2>
          <p className="text-gray-600">
            Thank you for your advocate match request. Our team will review your information and connect you with a qualified special education advocate within 24-48 hours.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Advocate Matcher Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meeting_date">Preferred Meeting Date (Optional)</Label>
              <Input 
                type="date" 
                id="meeting_date"
                name="meeting_date" 
                value={form.meeting_date}
                onChange={handleChange} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_method">Preferred Contact Method</Label>
              <Select 
                value={form.contact_method} 
                onValueChange={(value) => handleSelectChange('contact_method', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Zoom">Video Call (Zoom)</SelectItem>
                  <SelectItem value="Phone">Phone Call</SelectItem>
                  <SelectItem value="Email">Email Exchange</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent_availability">Your Availability *</Label>
            <Textarea
              id="parent_availability"
              name="parent_availability"
              placeholder="Please describe your availability (e.g., weekday evenings, weekend mornings, specific times)"
              value={form.parent_availability}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="concerns">Main Concerns *</Label>
            <Textarea
              id="concerns"
              name="concerns"
              placeholder="Please describe your main concerns and what you hope to accomplish"
              value={form.concerns}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Areas Where You Need Help *</Label>
            <div className="grid grid-cols-2 gap-2">
              {HELP_AREAS.map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={area}
                    checked={form.help_areas.includes(area)}
                    onCheckedChange={(checked) => handleHelpAreaChange(area, !!checked)}
                  />
                  <Label htmlFor={area} className="text-sm">{area}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade_level">Child's Grade Level</Label>
              <Input
                id="grade_level"
                name="grade_level"
                placeholder="e.g., 3rd Grade"
                value={form.grade_level}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="school_district">School District</Label>
              <Input
                id="school_district"
                name="school_district"
                placeholder="Your child's school district"
                value={form.school_district}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="document_urls">Document Links (Optional)</Label>
            <Input
              id="document_urls"
              name="document_urls"
              type="url"
              placeholder="Paste link to IEP documents, evaluations, or other relevant files"
              value={form.document_urls}
              onChange={handleChange}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}