'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import AnimatedDiv from '@/components/AnimatedDiv';
import { supabase } from '@/lib/supabase-browser';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (!email) { setError('Please enter your email'); return; }
    setLoading(true); setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    if (error) { setError(error.message); setLoading(false); }
    else { setSent(true); setLoading(false); }
  };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <AnimatedDiv animation="scaleIn">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-highlight/10">
              <Icon name="Mail" size={32} color="#FF0039" />
            </div>
            <h1 className="text-2xl font-bold">Check your email</h1>
            <p className="mt-3 text-muted">We&apos;ve sent a password reset link to <strong>{email}</strong></p>
            <Button href="/login" title="Back to Sign In" variant="outline" rounded="full" className="mt-6" />
          </div>
        </AnimatedDiv>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <AnimatedDiv animation="slideInBottom">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2">
            <Image src="/img/imagesmaldivesa/logoboho.png" alt="Maldives Water Sports" width={40} height={40} className="rounded-md" />
            <span className="text-2xl font-bold tracking-wider">Maldives Water Sports</span>
          </Link>
          <h1 className="text-center text-3xl font-bold">Reset password</h1>
          <p className="mt-2 text-center text-muted">Enter your email to receive a reset link</p>
        </AnimatedDiv>

        <AnimatedDiv animation="fadeIn" delay={100} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@maldiveswatersports.com"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted focus:border-highlight focus:outline-none focus:ring-1 focus:ring-highlight" />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button title="Send Reset Link" variant="cta" size="large" rounded="xl" className="w-full" onPress={handleReset} loading={loading} />
          <Link href="/login" className="block text-center text-sm text-muted hover:text-foreground">Back to Sign In</Link>
        </AnimatedDiv>
      </div>
    </div>
  );
}
