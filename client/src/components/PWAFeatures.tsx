import { useState, useEffect } from 'react';
import { Smartphone, Download, Wifi, WifiOff, Bell, Share, Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/use-pwa';
import { useMobile } from '@/hooks/use-mobile';

export function PWAFeatures() {
  const { isInstallable, isInstalled, isOnline, installApp } = usePWA();
  const { isMobile, canShare, canVibrate, deviceType, screenSize } = useMobile();
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        new Notification('IEP Hero', {
          body: 'You will now receive notifications for important updates!',
          icon: '/pwa-192x192.svg'
        });
      }
    }
  };

  const testShare = async () => {
    if (canShare) {
      try {
        await navigator.share({
          title: 'My IEP Hero',
          text: 'Check out this amazing IEP management platform!',
          url: window.location.href
        });
      } catch (error) {
        console.log('Share canceled or failed');
      }
    }
  };

  const testVibration = () => {
    if (canVibrate) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  };

  const features = [
    {
      name: 'App Installation',
      description: isInstalled ? 'App is installed' : isInstallable ? 'Ready to install' : 'Not available',
      icon: Download,
      available: isInstallable || isInstalled,
      status: isInstalled ? 'active' : isInstallable ? 'ready' : 'unavailable',
      action: isInstallable ? installApp : undefined
    },
    {
      name: 'Offline Support',
      description: isOnline ? 'Currently online' : 'Working offline',
      icon: isOnline ? Wifi : WifiOff,
      available: true,
      status: isOnline ? 'active' : 'offline'
    },
    {
      name: 'Push Notifications',
      description: notificationPermission === 'granted' ? 'Enabled' : notificationPermission === 'denied' ? 'Blocked' : 'Available',
      icon: Bell,
      available: 'Notification' in window,
      status: notificationPermission === 'granted' ? 'active' : notificationPermission === 'denied' ? 'blocked' : 'available',
      action: notificationPermission === 'default' ? requestNotificationPermission : undefined
    },
    {
      name: 'Native Sharing',
      description: canShare ? 'Available' : 'Not supported',
      icon: Share,
      available: canShare,
      status: canShare ? 'active' : 'unavailable',
      action: canShare ? testShare : undefined
    },
    {
      name: 'Haptic Feedback',
      description: canVibrate ? 'Available' : 'Not supported',
      icon: Smartphone,
      available: canVibrate,
      status: canVibrate ? 'active' : 'unavailable',
      action: canVibrate ? testVibration : undefined
    },
    {
      name: 'Camera Access',
      description: 'mediaDevices' in navigator ? 'Available' : 'Not supported',
      icon: Camera,
      available: 'mediaDevices' in navigator,
      status: 'mediaDevices' in navigator ? 'active' : 'unavailable'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Mobile Features
        </CardTitle>
        <CardDescription>
          Device: {deviceType} • Screen: {screenSize.width}×{screenSize.height}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <feature.icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium text-sm">{feature.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {feature.description}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    feature.status === 'active'
                      ? 'default'
                      : feature.status === 'ready'
                      ? 'secondary'
                      : feature.status === 'blocked'
                      ? 'destructive'
                      : 'outline'
                  }
                  className="text-xs"
                >
                  {feature.status}
                </Badge>
                {feature.action && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={feature.action}
                    className="h-6 px-2 text-xs"
                  >
                    Test
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {isMobile && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              🎉 Mobile experience optimized! Add to home screen for the best experience.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}