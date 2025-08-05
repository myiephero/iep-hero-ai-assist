import { Auth } from "@/components/Auth";
import { IEPGenerator } from "@/components/IEPGenerator";
import { MessagingInterface } from "@/components/messaging/MessagingInterface";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { MessageCircle, FileText, ArrowLeft } from "lucide-react";
import { useState } from "react";

function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'iep' | 'messages'>('iep');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <Auth />
        <Toaster />
      </div>
    );
  }

  return (
    <div>
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">My IEP Hero</h1>
              <div className="flex gap-2">
                <Button
                  variant={currentView === 'iep' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('iep')}
                  size="sm"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  IEP Goals
                </Button>
                <Button
                  variant={currentView === 'messages' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('messages')}
                  size="sm"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Messages
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {currentView === 'iep' ? <IEPGenerator /> : <MessagingInterface />}
      <Toaster />
    </div>
  );
}

export default App;