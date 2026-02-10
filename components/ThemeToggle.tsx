'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Icon from './Icon';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-9 w-9" />;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-lg p-2 text-muted hover:text-foreground hover:bg-secondary transition-colors"
      aria-label="Toggle theme"
    >
      <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={20} />
    </button>
  );
}
