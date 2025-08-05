import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { supabase, IEPDraft } from '@/lib/supabase'
import { Wand2, Save, LogOut, FileText, Calendar, Mail } from 'lucide-react'

export function IEPGenerator() {
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  
  const [diagnosis, setDiagnosis] = useState('')
  const [suggestions, setSuggestions] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [drafts, setDrafts] = useState<IEPDraft[]>([])
  const [loadingDrafts, setLoadingDrafts] = useState(true)

  useEffect(() => {
    loadDrafts()
  }, [user])

  const loadDrafts = async () => {
    if (!user) return
    
    setLoadingDrafts(true)
    const { data, error } = await supabase
      .from('iep_drafts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      toast({
        title: "Error loading drafts",
        description: error.message,
        variant: "destructive",
      })
    } else {
      setDrafts(data || [])
    }
    setLoadingDrafts(false)
  }

  const generateIEPGoals = async () => {
    if (!diagnosis.trim()) {
      toast({
        title: "Please enter a diagnosis",
        description: "Diagnosis is required to generate IEP goals",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/generate-iep-goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ diagnosis }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate IEP goals')
      }

      const data = await response.json()
      setSuggestions(data.suggestions)
      
      toast({
        title: "IEP Goals Generated!",
        description: "Your personalized IEP goals and accommodations are ready.",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate IEP goals. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveToSupabase = async () => {
    if (!suggestions.trim()) {
      toast({
        title: "Nothing to save",
        description: "Please generate IEP goals first",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase
        .from('iep_drafts')
        .insert([
          {
            user_id: user!.id,
            diagnosis,
            suggestions,
          }
        ])

      if (error) throw error

      toast({
        title: "Saved successfully!",
        description: "Your IEP draft has been saved to your account.",
      })
      
      // Reload drafts
      loadDrafts()
      
      // Clear form
      setDiagnosis('')
      setSuggestions('')

      // Send advocate match notification email (example implementation)
      await sendAdvocateMatchEmail(user!.id)
      
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const sendAdvocateMatchEmail = async (parentId: string, advocateId?: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('No session available for email notification');
        return;
      }

      const response = await fetch('https://wktcfhegoxjearpzdxpz.supabase.co/functions/v1/send-advocate-match-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          parent_id: parentId,
          advocate_id: advocateId || "default-advocate-uuid" // Use actual advocate ID when available
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Advocate match email sent:', data);
        
        toast({
          title: "Notification sent!",
          description: "We've notified potential advocates about your IEP needs.",
        })
      }
    } catch (error) {
      console.error('Failed to send advocate match email:', error);
      // Don't show error to user as this is a background process
    }
  }

  const loadDraft = (draft: IEPDraft) => {
    setDiagnosis(draft.diagnosis)
    setSuggestions(draft.suggestions)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">IEP Goals Generator</h1>
                <p className="text-gray-600">AI-powered IEP goal creation</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline">{user?.email}</Badge>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Generator */}
          <div className="space-y-6">
            <Card className="bg-white border-0 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-blue-500" />
                  Generate IEP Goals
                </CardTitle>
                <CardDescription>
                  Enter your child's diagnosis to generate personalized IEP goals and accommodations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    Child's Diagnosis
                  </label>
                  <Input
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="e.g., Autism Spectrum Disorder, ADHD, Learning Disability, etc."
                    className="h-12"
                  />
                </div>

                <Button 
                  onClick={generateIEPGoals}
                  disabled={loading || !diagnosis.trim()}
                  className="w-full bg-blue-500 hover:bg-blue-600 h-12"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating Goals...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate IEP Goals
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            {suggestions && (
              <Card className="bg-white border-0 shadow-sm rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-500" />
                    Generated IEP Goals & Accommodations
                  </CardTitle>
                  <CardDescription>
                    Review and edit the generated content as needed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={suggestions}
                    onChange={(e) => setSuggestions(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                    placeholder="Generated IEP goals will appear here..."
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button 
                      onClick={saveToSupabase}
                      disabled={saving}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save to Supabase
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      onClick={() => sendAdvocateMatchEmail(user!.id)}
                      disabled={!suggestions.trim()}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Find Advocate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Previous Drafts */}
          <div>
            <Card className="bg-white border-0 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  Previous IEP Drafts
                </CardTitle>
                <CardDescription>
                  Your saved IEP goals and accommodations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingDrafts ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
                  </div>
                ) : drafts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No saved drafts yet</p>
                    <p className="text-sm">Generate and save your first IEP goals above</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {drafts.map((draft) => (
                      <div
                        key={draft.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => loadDraft(draft)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900 truncate">
                            {draft.diagnosis}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {new Date(draft.created_at).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {draft.suggestions.substring(0, 150)}...
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}