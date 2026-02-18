'use client';

import { cn } from '@/lib/utils';

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
  pauseOnHover?: boolean;
}

export default function Marquee({
  children,
  className,
  speed = 'normal',
  pauseOnHover = false,
}: MarqueeProps) {
  const speedClass = {
    slow: 'animate-marquee-slow',
    normal: 'animate-marquee',
    fast: 'animate-marquee-fast',
  }[speed];

  return (
    <div
      className={cn(
        'group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]',
        className
      )}
    >
      <div
        className={cn(
          'flex shrink-0 items-center gap-6',
          speedClass,
          pauseOnHover && 'group-hover:[animation-play-state:paused]'
        )}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          'flex shrink-0 items-center gap-6',
          speedClass,
          pauseOnHover && 'group-hover:[animation-play-state:paused]'
        )}
      >
        {children}
      </div>
    </div>
  );
}
