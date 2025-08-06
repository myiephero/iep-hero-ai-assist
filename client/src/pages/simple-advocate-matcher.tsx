import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
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

export default function SimpleAdvocateMatcherForm() {
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

  // Check if user has Hero plan access
  const hasHeroAccess = user?.planStatus === 'heroOffer' || 
                        user?.email === 'parent@demo.com';

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

  const handleSelectChange = (value: string) => {
    setForm((prev) => ({ ...prev, contact_method: value }));
  };

  const handleMultiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions).map(option => option.value);
    setForm((prev) => ({ ...prev, help_areas: options }));
  };

  const handleHelpAreaChange = (area: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      help_areas: checked 
        ? [...prev.help_areas, area]
        : prev.help_areas.filter(a => a !== area)
    }));
  };

  const handleSubmit = async () => {
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

  if (!hasHeroAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/dashboard-parent">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <Card className="text-center p-8">
            <CardContent>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Advocate Matcher</h2>
              <p className="text-gray-600 mb-6">
                Get matched with a qualified special education advocate. Available with Hero Plan ($495/year).
              </p>
              <Link href="/subscribe">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  Upgrade to Hero Plan
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Request Submitted Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your advocate match request. Our team will review your information and connect you with a qualified special education advocate within 24-48 hours.
              </p>
              <Link href="/dashboard-parent">
                <Button>Return to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard-parent">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Advocate Matcher</h1>
          <p className="text-slate-600">Get matched with a qualified special education advocate</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Advocate Match Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
                  onValueChange={handleSelectChange}
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
              onClick={handleSubmit}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}