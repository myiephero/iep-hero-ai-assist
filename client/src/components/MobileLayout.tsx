import { useMobile } from '@/hooks/use-mobile';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileLayout({ children, className = "" }: MobileLayoutProps) {
  const { isMobile } = useMobile();

  return (
    <div className={`${isMobile ? 'pb-16' : ''} ${className}`}>
      {children}
    </div>
  );
}