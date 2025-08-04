import { WifiOff, Wifi } from 'lucide-react';
import { usePWA } from '@/hooks/use-pwa';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function OfflineIndicator() {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <Alert className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-sm border-yellow-500 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
      <WifiOff className="h-4 w-4" />
      <AlertDescription className="text-sm">
        You're offline. Some features may be limited.
      </AlertDescription>
    </Alert>
  );
}