import { useState } from 'react';
import { Send, Share2, Loader2, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMobile } from '@/hooks/use-mobile';
import { apiRequest } from '@/lib/queryClient';

export function MobileMemoryQA() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shareWithAdvocate, setShareWithAdvocate] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { canShare, canVibrate } = useMobile();
  const { toast } = useToast();

  // Speech Recognition for voice input
  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice input not supported",
        description: "Your browser doesn't support speech recognition",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      if (canVibrate) navigator.vibrate(100);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(prev => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      toast({
        title: "Voice input error",
        description: "Could not process speech input",
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/memory-query', {
        prompt: question,
        share: shareWithAdvocate
      });

      const data = await response.json();
      setAnswer(data.answer);
      
      if (shareWithAdvocate && data.shared) {
        toast({
          title: "Shared with advocate",
          description: "Your question and answer have been shared with your advocate",
        });
        if (canVibrate) navigator.vibrate([100, 50, 100]);
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get answer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const shareAnswer = async () => {
    if (!canShare || !answer) return;

    try {
      await navigator.share({
        title: 'IEP Memory Q&A',
        text: `Q: ${question}\n\nA: ${answer}`,
        url: window.location.href
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(`Q: ${question}\n\nA: ${answer}`);
      toast({
        title: "Copied to clipboard",
        description: "Answer copied to clipboard for sharing",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          Memory Q&A
          <span className="text-sm text-muted-foreground font-normal">
            Mobile
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question Input */}
        <div className="space-y-2">
          <Label htmlFor="question">Ask a question about your IEP</Label>
          <div className="relative">
            <Textarea
              id="question"
              placeholder="What services are included in my child's IEP?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[80px] pr-12 resize-none"
              disabled={isLoading}
            />
            {('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={startVoiceInput}
                disabled={isLoading || isListening}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4 text-red-500" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Share Option */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="share"
            checked={shareWithAdvocate}
            onCheckedChange={setShareWithAdvocate}
            disabled={isLoading}
          />
          <Label htmlFor="share" className="text-sm">
            Share this answer with my advocate
          </Label>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!question.trim() || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Getting Answer...' : 'Ask Question'}
        </Button>

        {/* Answer Display */}
        {answer && (
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-medium text-sm">Answer:</h4>
                {canShare && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={shareAnswer}
                    className="h-6 w-6 p-0"
                  >
                    <Share2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <p className="text-sm leading-relaxed">{answer}</p>
              {shareWithAdvocate && (
                <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  ✅ Shared with your advocate
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Voice Input Status */}
        {isListening && (
          <div className="text-center text-sm text-muted-foreground">
            🎤 Listening... Speak now
          </div>
        )}
      </CardContent>
    </Card>
  );
}