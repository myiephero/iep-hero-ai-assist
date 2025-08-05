import { useState, useEffect } from 'react';
import { Download, Smartphone, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { usePWA } from '@/hooks/use-pwa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function PWAFeatures() {
  const { isInstallable, installApp, isInstalled, isOnline, updateAvailable, updateApp } = usePWA();
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <div className="space-y-4">
      {/* PWA Status Card */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            App Installation
            {isInstalled && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Installed
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Install My IEP Hero as a native app for the best experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isInstalled && isInstallable && (
            <div className="flex items-center gap-2">
              <Button onClick={installApp} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Install App
              </Button>
            </div>
          )}
          
          {isInstalled && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Smartphone className="h-4 w-4" />
              App is installed and ready to use
            </div>
          )}
          
          {!isInstallable && !isInstalled && (
            <div className="text-sm text-gray-600">
              <p>To install My IEP Hero:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>iOS:</strong> Tap Share → Add to Home Screen</li>
                <li><strong>Android:</strong> Tap Menu → Install App</li>
                <li><strong>Desktop:</strong> Look for install icon in address bar</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
            {!isOnline && (
              <span className="text-sm text-gray-600">
                Limited functionality available
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* App Updates */}
      {updateAvailable && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <RefreshCw className="h-5 w-5" />
              Update Available
            </CardTitle>
            <CardDescription className="text-blue-600">
              A new version of My IEP Hero is available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={updateApp} variant="outline" className="border-blue-300 text-blue-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Update Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* App Features */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>App Benefits</CardTitle>
          <CardDescription>
            Why install the My IEP Hero app?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Faster loading and better performance
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Works offline for basic features
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Native app experience on your device
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Quick access from home screen
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Push notifications for important updates
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}