'use client';

import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export default function Icon({ name, size = 24, color, className, onClick }: IconProps) {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return null;

  return (
    <IconComponent
      size={size}
      color={color}
      className={cn(onClick && 'cursor-pointer hover:opacity-70 transition-opacity', className)}
      onClick={onClick}
    />
  );
}
