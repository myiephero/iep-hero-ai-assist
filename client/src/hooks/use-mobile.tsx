import { useState, useEffect } from 'react';

interface MobileFeatures {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
  canShare: boolean;
  canVibrate: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  screenSize: {
    width: number;
    height: number;
  };
}

export function useMobile(): MobileFeatures {
  const [features, setFeatures] = useState<MobileFeatures>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    orientation: 'landscape',
    canShare: false,
    canVibrate: false,
    deviceType: 'desktop',
    screenSize: { width: 0, height: 0 }
  });

  useEffect(() => {
    const updateFeatures = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      
      const orientation = height > width ? 'portrait' : 'landscape';
      
      const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
      
      const canShare = 'share' in navigator;
      const canVibrate = 'vibrate' in navigator;

      setFeatures({
        isMobile,
        isTablet,
        isDesktop,
        orientation,
        canShare,
        canVibrate,
        deviceType,
        screenSize: { width, height }
      });
    };

    updateFeatures();
    window.addEventListener('resize', updateFeatures);
    window.addEventListener('orientationchange', updateFeatures);

    return () => {
      window.removeEventListener('resize', updateFeatures);
      window.removeEventListener('orientationchange', updateFeatures);
    };
  }, []);

  return features;
}