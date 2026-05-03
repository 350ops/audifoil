'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-browser';

const BOAT_TYPES = [
  { value: 'dhoni', label: 'Traditional dhoni' },
  { value: 'speedboat', label: 'Speedboat' },
  { value: 'fishing', label: 'Fishing boat' },
  { value: 'other', label: 'Other' },
];

const EXPERIENCE_OPTIONS = [
  'Snorkeling',
  'Sandbank visit',
  'Dolphin watching',
  'Sunset cruise',
  'Traditional fishing',
  'Resort drop-off',
  'Private charter',
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export default function HostApplyPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Captain
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [yearsAtSea, setYearsAtSea] = useState('');
  const [bio, setBio] = useState('');
  const [languages, setLanguages] = useState<string[]>(['Dhivehi']);

  // Boat
  const [boatName, setBoatName] = useState('');
  const [boatType, setBoatType] = useState('dhoni');
  const [capacity, setCapacity] = useState('8');
  const [lengthFt, setLengthFt] = useState('');

  // Experiences offered
  const [experiences, setExperiences] = useState<string[]>([]);

  const toggle = (list: string[], v: string, setter: (next: string[]) => void) => {
    setter(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      router.push('/signup?next=/host/apply');
      return;
    }

    if (!displayName || !phone || !boatName) {
      setError('Please fill in your name, phone, and boat name.');
      return;
    }

    setSubmitting(true);

    try {
      const slug = `${slugify(displayName)}-${Math.random().toString(36).slice(2, 6)}`;

      const { data: host, error: hostErr } = await supabase
        .from('hosts')
        .insert({
          user_id: user.id,
          slug,
          display_name: displayName,
          bio: bio || null,
          phone_e164: phone,
          whatsapp_e164: phone,
          languages,
          years_at_sea: yearsAtSea ? Number(yearsAtSea) : null,
          status: 'pending',
        } as any)
        .select()
        .single();

      if (hostErr) throw hostErr;

      const boatSlug = `${slugify(boatName)}-${Math.random().toString(36).slice(2, 6)}`;
      const { error: boatErr } = await supabase
        .from('boats')
        .insert({
          host_id: host.id,
          slug: boatSlug,
          name: boatName,
          type: boatType,
          capacity: Number(capacity) || 8,
          length_ft: lengthFt ? Number(lengthFt) : null,
          description: experiences.length ? `Trips offered: ${experiences.join(', ')}` : null,
          is_active: false,
        } as any);

      if (boatErr) throw boatErr;

      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 lg:px-8">
        <AnimatedDiv animation="scaleIn">
          <div className="rounded-2xl border border-border bg-secondary p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <Icon name="Check" size={32} color="#22C55E" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">Application received</h1>
            <p className="mt-2 text-muted">
              We&apos;ll review your details and message you on WhatsApp within 48 hours to confirm a quick verification visit at the Phase 2 dock.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button href="/explore" title="Back to home" variant="outline" rounded="full" />
            </div>
          </div>
        </AnimatedDiv>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 lg:px-8">
      <AnimatedDiv animation="fadeIn">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-sm text-muted hover:text-foreground"
        >
          <Icon name="ArrowLeft" size={16} /> Back
        </button>
        <h1 className="text-3xl font-bold">List your boat</h1>
        <p className="mt-2 text-muted">
          Tell us about you and your boat. Verification details (ID, boat registration) come after we approve your application.
        </p>
      </AnimatedDiv>

      {!user && (
        <AnimatedDiv animation="fadeIn" delay={50} className="mt-6">
          <div className="flex items-start gap-3 rounded-xl border border-highlight/30 bg-highlight/5 p-4 text-sm">
            <Icon name="Info" size={18} color="#FF0039" className="mt-0.5 shrink-0" />
            <div>
              You&apos;ll be asked to create an account when you submit. Already have one? <a href="/login" className="font-medium text-highlight hover:underline">Sign in</a>.
            </div>
          </div>
        </AnimatedDiv>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <AnimatedDiv animation="fadeIn" delay={100}>
          <div className="rounded-2xl border border-border bg-secondary p-5">
            <h2 className="font-semibold">About you</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Captain Ahmed"
                  className="input"
                />
              </Field>
              <Field label="WhatsApp number" required>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+960 7XXXXXX"
                  className="input"
                />
              </Field>
              <Field label="Years at sea">
                <input
                  type="number"
                  min={0}
                  value={yearsAtSea}
                  onChange={(e) => setYearsAtSea(e.target.value)}
                  placeholder="e.g. 12"
                  className="input"
                />
              </Field>
              <Field label="Languages">
                <div className="flex flex-wrap gap-2">
                  {['Dhivehi', 'English', 'Hindi', 'Arabic'].map((l) => {
                    const on = languages.includes(l);
                    return (
                      <button
                        type="button"
                        key={l}
                        onClick={() => toggle(languages, l, setLanguages)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                          on
                            ? 'border-highlight bg-highlight/10 text-highlight'
                            : 'border-border text-muted hover:text-foreground'
                        }`}
                      >
                        {l}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field label="A short bio (optional)" full>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Where you fish, what you love about being on the water — guests want to know who they're going out with."
                  className="input"
                />
              </Field>
            </div>
          </div>
        </AnimatedDiv>

        <AnimatedDiv animation="fadeIn" delay={150}>
          <div className="rounded-2xl border border-border bg-secondary p-5">
            <h2 className="font-semibold">About your boat</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Boat name" required>
                <input
                  type="text"
                  value={boatName}
                  onChange={(e) => setBoatName(e.target.value)}
                  placeholder="e.g. Blue Dhoni"
                  className="input"
                />
              </Field>
              <Field label="Boat type">
                <select
                  value={boatType}
                  onChange={(e) => setBoatType(e.target.value)}
                  className="input"
                >
                  {BOAT_TYPES.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Capacity (guests)">
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Length (ft, optional)">
                <input
                  type="number"
                  min={10}
                  value={lengthFt}
                  onChange={(e) => setLengthFt(e.target.value)}
                  placeholder="e.g. 32"
                  className="input"
                />
              </Field>
            </div>
          </div>
        </AnimatedDiv>

        <AnimatedDiv animation="fadeIn" delay={200}>
          <div className="rounded-2xl border border-border bg-secondary p-5">
            <h2 className="font-semibold">What trips do you run?</h2>
            <p className="mt-1 text-sm text-muted">Pick everything you&apos;re comfortable doing. You can change this later.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {EXPERIENCE_OPTIONS.map((e) => {
                const on = experiences.includes(e);
                return (
                  <button
                    type="button"
                    key={e}
                    onClick={() => toggle(experiences, e, setExperiences)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      on
                        ? 'border-highlight bg-highlight/10 text-highlight'
                        : 'border-border text-muted hover:text-foreground'
                    }`}
                  >
                    {e}
                  </button>
                );
              })}
            </div>
          </div>
        </AnimatedDiv>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-3 text-sm text-red-500">
            <Icon name="AlertCircle" size={16} />
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted">
            By applying you agree to our <a href="/terms" className="underline">terms</a> and to a verification visit at the Phase 2 dock.
          </p>
          <Button
            title={submitting ? 'Submitting…' : 'Submit application'}
            variant="cta"
            size="large"
            rounded="full"
            iconEnd="ArrowRight"
            disabled={submitting}
          />
        </div>
      </form>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--border, #e5e7eb);
          background: var(--background, #fff);
          padding: 0.75rem 1rem;
          color: inherit;
          font-size: 0.95rem;
          outline: none;
        }
        :global(.input:focus) {
          border-color: #ff0039;
          box-shadow: 0 0 0 1px #ff0039;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
  required,
  full,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1 block text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-highlight">*</span>}
      </span>
      {children}
    </label>
  );
}
