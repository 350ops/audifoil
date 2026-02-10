'use client';

import Link from 'next/link';
import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';

const SETTINGS_ITEMS = [
  { href: '/settings/profile', icon: 'User', label: 'Profile', desc: 'Manage your profile information' },
  { href: '/settings/notifications', icon: 'Bell', label: 'Notifications', desc: 'Customize your notifications' },
];

export default function SettingsPage() {
  const { user, profile, signOut, isDemoMode } = useAuth();

  return (
    <div className="pb-20">
      <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
        <AnimatedDiv animation="fadeIn">
          <h1 className="text-3xl font-bold">Settings</h1>
        </AnimatedDiv>

        {/* Profile card */}
        <AnimatedDiv animation="fadeIn" delay={100} className="mt-6">
          <Link href="/settings/profile" className="flex items-center gap-4 rounded-2xl border border-border bg-secondary p-5 transition-shadow hover:shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-highlight/10 text-xl font-bold text-highlight">
              {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : 'Set up your profile'}</h3>
              <p className="text-sm text-muted">{user?.email || 'Demo mode'}</p>
              {isDemoMode && <span className="mt-1 inline-block rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-600">Demo</span>}
            </div>
            <Icon name="ChevronRight" size={20} className="text-muted" />
          </Link>
        </AnimatedDiv>

        {/* Settings list */}
        <div className="mt-6 space-y-2">
          {SETTINGS_ITEMS.map((item, i) => (
            <AnimatedDiv key={item.href} animation="fadeIn" delay={150 + i * 40}>
              <Link href={item.href} className="flex items-center gap-4 rounded-xl border border-border bg-secondary p-4 transition-shadow hover:shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background">
                  <Icon name={item.icon} size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.label}</h3>
                  <p className="text-xs text-muted">{item.desc}</p>
                </div>
                <Icon name="ChevronRight" size={18} className="text-muted" />
              </Link>
            </AnimatedDiv>
          ))}
        </div>

        {/* Theme */}
        <AnimatedDiv animation="fadeIn" delay={250} className="mt-4">
          <div className="flex items-center justify-between rounded-xl border border-border bg-secondary p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background">
                <Icon name="Palette" size={20} />
              </div>
              <div>
                <h3 className="font-medium">Theme</h3>
                <p className="text-xs text-muted">Switch between light and dark mode</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </AnimatedDiv>

        {/* Sign out */}
        <AnimatedDiv animation="fadeIn" delay={300} className="mt-6">
          <button
            onClick={signOut}
            className="flex w-full items-center gap-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-red-500 transition-colors hover:bg-red-500/10"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
              <Icon name="LogOut" size={20} color="#EF4444" />
            </div>
            <span className="font-medium">Sign Out</span>
          </button>
        </AnimatedDiv>
      </div>
    </div>
  );
}
