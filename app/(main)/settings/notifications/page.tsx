'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';

interface NotifSetting {
  id: string;
  label: string;
  desc: string;
  enabled: boolean;
}

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<NotifSetting[]>([
    { id: 'booking', label: 'Booking Updates', desc: 'Trip confirmations and changes', enabled: true },
    { id: 'group', label: 'Group Updates', desc: 'When someone joins your trip', enabled: true },
    { id: 'promo', label: 'Promotions', desc: 'Special offers and discounts', enabled: false },
    { id: 'summary', label: 'Weekly Summary', desc: 'Upcoming trips and activity', enabled: true },
  ]);

  const toggle = (id: string) => {
    setSettings((s) => s.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item));
  };

  return (
    <div className="pb-20">
      <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
        <AnimatedDiv animation="fadeIn">
          <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors">
            <Icon name="ArrowLeft" size={16} /> Back
          </button>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="mt-2 text-muted">Manage your notification preferences</p>
        </AnimatedDiv>

        <div className="mt-6 space-y-3">
          {settings.map((item, i) => (
            <AnimatedDiv key={item.id} animation="fadeIn" delay={100 + i * 40}>
              <div className="flex items-center justify-between rounded-xl border border-border bg-secondary p-4">
                <div>
                  <h3 className="font-medium">{item.label}</h3>
                  <p className="text-xs text-muted">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggle(item.id)}
                  className={`relative h-7 w-12 rounded-full transition-colors ${item.enabled ? 'bg-highlight' : 'bg-border'}`}
                >
                  <div className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${item.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </AnimatedDiv>
          ))}
        </div>
      </div>
    </div>
  );
}
