import { useState } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { usePWA } from '@/hooks/use-pwa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function PWAInstallPrompt() {
  const { isInstallable, installApp, isInstalled } = usePWA();
  const [dismissed, setDismissed] = useState(() => {
    // Check if user has dismissed the prompt before
    return localStorage.getItem('pwa-install-dismissed') === 'true';
  });

  // Show install prompt if installable, not installed, and not permanently dismissed
  if (!isInstallable || isInstalled || dismissed) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm border-primary bg-background shadow-lg md:left-auto md:right-4 md:mx-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm">Install IEP Hero</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDismissed(true);
              localStorage.setItem('pwa-install-dismissed', 'true');
            }}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-xs">
          Install for faster access and offline functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={installApp}
            className="flex-1"
          >
            <Download className="mr-1 h-3 w-3" />
            Install
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDismissed(true);
              // Don't permanently dismiss when user clicks "Later" - allow it to show again
              localStorage.setItem('pwa-install-dismissed-temporarily', Date.now().toString());
            }}
          >
            Later
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}