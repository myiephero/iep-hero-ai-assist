import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Brain, Send, Loader2 } from "lucide-react";

import { useToast } from "@/hooks/use-toast";

interface MemoryQAProps {
  userId: string;
  className?: string;
}

export default function MemoryQA({ userId, className }: MemoryQAProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{question: string, answer: string, timestamp: Date}>>([]);

  const { toast } = useToast();

  const suggestedQuestions = [
    "What services are provided in my IEP?",
    "When is my next IEP meeting scheduled?",
    "How is my child progressing on their goals?",
    "What accommodations are listed in the IEP?",
    "Who are the team members involved?"
  ];

  async function askMemory() {
    if (!question.trim()) {
      toast({
        title: "Please enter a question",
        description: "Type a question about your IEP to get started",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setAnswer("Thinking...");

    try {
      const res = await fetch("/api/memory-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, prompt: question })
      });

      if (!res.ok) {
        throw new Error("Failed to query memory");
      }

      const data = await res.json();
      const responseAnswer = data.answer || "I don't have enough information to answer that question about your IEP.";
      
      setAnswer(responseAnswer);
      
      // Add to conversation history
      setConversationHistory(prev => [...prev, {
        question,
        answer: responseAnswer,
        timestamp: new Date()
      }]);
      
      setQuestion(""); // Clear input after successful query
      
    } catch (error) {
      const errorMessage = "Sorry, I couldn't process your question right now. Please try again.";
      setAnswer(errorMessage);
      toast({
        title: "Error",
        description: "Failed to query your IEP information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  const handleSuggestedQuestion = (suggestedQ: string) => {
    setQuestion(suggestedQ);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      askMemory();
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Ask About Your IEP
          </CardTitle>
          <p className="text-sm text-gray-600">
            Get instant answers about your IEP goals, services, meetings, and progress using AI
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Suggested Questions */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((sq, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  onClick={() => handleSuggestedQuestion(sq)}
                >
                  {sq}
                </Badge>
              ))}
            </div>
          </div>

          {/* Question Input */}
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Ask anything about your IEP..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={loading}
            />
            <Button
              onClick={askMemory}
              disabled={loading || !question.trim()}
              className="px-3"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Current Answer */}
          {answer && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-2">
                  <MessageCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {answer}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Conversation History */}
      {conversationHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {conversationHistory.slice(-5).reverse().map((conv, index) => (
                <div key={index} className="border-l-2 border-gray-200 pl-4 space-y-2">
                  <div className="text-sm font-medium text-gray-900">
                    Q: {conv.question}
                  </div>
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {conv.answer}
                  </div>
                  <div className="text-xs text-gray-400">
                    {conv.timestamp.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}