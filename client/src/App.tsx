import { Auth } from "@/components/Auth";
import { IEPGenerator } from "@/components/IEPGenerator";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div>
      {user ? <IEPGenerator /> : <Auth />}
      <Toaster />
    </div>
  );
}

export default App;