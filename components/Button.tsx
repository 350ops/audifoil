'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

type IconName = keyof typeof LucideIcons;

interface ButtonProps {
  title?: string;
  onPress?: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'cta';
  size?: 'small' | 'medium' | 'large';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  href?: string;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
  iconStart?: string;
  iconEnd?: string;
  iconSize?: number;
  children?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  loading = false,
  variant = 'primary',
  size = 'medium',
  rounded = 'lg',
  href,
  className = '',
  textClassName = '',
  disabled = false,
  iconStart,
  iconEnd,
  iconSize,
  children,
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.98]';

  const variantStyles = {
    primary: 'bg-primary text-invert hover:opacity-90',
    secondary: 'bg-secondary text-foreground hover:opacity-90 border border-border',
    outline: 'border border-border bg-transparent text-foreground hover:bg-secondary',
    ghost: 'bg-transparent text-foreground hover:bg-secondary',
    cta: 'bg-highlight text-white hover:opacity-90',
  };

  const sizeStyles = {
    small: 'py-2 px-4 text-sm',
    medium: 'py-3 px-5 text-base',
    large: 'py-4 px-6 text-lg',
  };

  const roundedStyles = {
    none: 'rounded-none', sm: 'rounded-sm', md: 'rounded-md',
    lg: 'rounded-lg', xl: 'rounded-xl', full: 'rounded-full',
  };

  const getIconSize = () => iconSize || (size === 'small' ? 16 : size === 'large' ? 20 : 18);

  const renderIcon = (name: string, position: 'start' | 'end') => {
    const IconComponent = (LucideIcons as any)[name];
    if (!IconComponent) return null;
    return <IconComponent size={getIconSize()} className={position === 'start' ? 'mr-2' : 'ml-2'} />;
  };

  const classes = cn(baseStyles, variantStyles[variant], sizeStyles[size], roundedStyles[rounded], disabled && 'opacity-50 cursor-not-allowed', className);

  const content = (
    <>
      {loading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <>
          {iconStart && renderIcon(iconStart, 'start')}
          {title && <span className={textClassName}>{title}</span>}
          {children}
          {iconEnd && renderIcon(iconEnd, 'end')}
        </>
      )}
    </>
  );

  if (href) {
    return <Link href={href} className={classes}>{content}</Link>;
  }

  return (
    <button onClick={onPress} disabled={loading || disabled} className={classes}>
      {content}
    </button>
  );
}
