'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function EditProfilePage() {
  const router = useRouter();
  const { profile, updateProfile } = useAuth();
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({ first_name: firstName, last_name: lastName, location });
    if (error) setMessage('Failed to save: ' + error.message);
    else setMessage('Profile updated!');
    setSaving(false);
  };

  return (
    <div className="pb-20">
      <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
        <AnimatedDiv animation="fadeIn">
          <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors">
            <Icon name="ArrowLeft" size={16} /> Back
          </button>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </AnimatedDiv>

        <AnimatedDiv animation="fadeIn" delay={100} className="mt-6">
          {/* Avatar */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-highlight/10 text-3xl font-bold text-highlight">
              {firstName?.[0] || '?'}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">First Name</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted focus:border-highlight focus:outline-none focus:ring-1 focus:ring-highlight" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Last Name</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted focus:border-highlight focus:outline-none focus:ring-1 focus:ring-highlight" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted focus:border-highlight focus:outline-none focus:ring-1 focus:ring-highlight" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input type="email" value={profile?.email || ''} disabled
                className="w-full rounded-xl border border-border bg-darker px-4 py-3 text-muted cursor-not-allowed" />
            </div>
          </div>

          {message && (
            <p className={`mt-4 text-sm ${message.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          )}

          <Button title="Save Changes" variant="cta" size="large" rounded="xl" className="mt-6 w-full" onPress={handleSave} loading={saving} />
        </AnimatedDiv>
      </div>
    </div>
  );
}
