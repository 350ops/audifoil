'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Icon from './Icon';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

const NAV_LINKS = [
  { href: '/explore', label: 'Explore', icon: 'Compass' },
  { href: '/activities', label: 'Activities', icon: 'Waves' },
  { href: '/bookings', label: 'Bookings', icon: 'CalendarCheck' },
  { href: '/crew', label: 'Crew', icon: 'Plane' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-secondary/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/explore" className="flex items-center gap-2">
          <Image src="/img/imagesmaldivesa/logoboho.png" alt="Boho Waves" width={36} height={36} className="rounded-md" />
          <span className="text-lg font-bold tracking-wider text-foreground">Boho Waves</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                pathname === link.href || pathname.startsWith(link.href + '/')
                  ? 'bg-highlight/10 text-highlight'
                  : 'text-muted hover:bg-secondary hover:text-foreground'
              )}
            >
              <Icon name={link.icon} size={18} />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <div className="hidden items-center gap-3 md:flex">
              <Link href="/settings" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:text-foreground transition-colors">
                <Icon name="Settings" size={18} />
              </Link>
              <button onClick={signOut} className="rounded-lg px-3 py-2 text-sm text-muted hover:text-foreground transition-colors">
                <Icon name="LogOut" size={18} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="hidden rounded-full bg-highlight px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity md:inline-flex">
              Sign In
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-foreground md:hidden"
          >
            <Icon name={mobileOpen ? 'X' : 'Menu'} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-secondary px-4 pb-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors',
                pathname === link.href ? 'bg-highlight/10 text-highlight' : 'text-muted hover:text-foreground'
              )}
            >
              <Icon name={link.icon} size={20} />
              {link.label}
            </Link>
          ))}
          <div className="mt-3 border-t border-border pt-3">
            {user ? (
              <>
                <Link href="/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 text-muted hover:text-foreground">
                  <Icon name="Settings" size={20} /> Settings
                </Link>
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-muted hover:text-foreground">
                  <Icon name="LogOut" size={20} /> Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center rounded-full bg-highlight px-4 py-3 text-white font-medium">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
