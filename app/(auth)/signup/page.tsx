'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import AnimatedDiv from '@/components/AnimatedDiv';
import { useAuth } from '@/contexts/AuthContext';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, signInWithOAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    const { error } = await signUp(email, password);
    if (error) { setError(error.message); setLoading(false); }
    else { setSuccess(true); setLoading(false); }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <AnimatedDiv animation="scaleIn">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <Icon name="CheckCircle" size={32} color="#22C55E" />
            </div>
            <h1 className="text-2xl font-bold">Check your email</h1>
            <p className="mt-3 text-muted">We&apos;ve sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account.</p>
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
            <Image src="/img/imagesmaldivesa/logoboho.png" alt="Boho Waves" width={40} height={40} className="rounded-md" />
            <span className="text-2xl font-bold tracking-wider">Boho Waves</span>
          </Link>
          <h1 className="text-center text-3xl font-bold">Create account</h1>
          <p className="mt-2 text-center text-muted">Start your Maldives adventure</p>
        </AnimatedDiv>

        <AnimatedDiv animation="fadeIn" delay={100} className="mt-8 space-y-4">
          <button
            onClick={() => signInWithOAuth('google')}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-secondary py-3 font-medium transition-colors hover:bg-background"
          >
            <Icon name="Chrome" size={20} /> Continue with Google
          </button>
          <button
            onClick={() => signInWithOAuth('apple')}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-primary py-3 font-medium text-invert transition-opacity hover:opacity-90"
          >
            <Icon name="Apple" size={20} /> Continue with Apple
          </button>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@bohowaves.com"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted focus:border-highlight focus:outline-none focus:ring-1 focus:ring-highlight" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-foreground placeholder:text-muted focus:border-highlight focus:outline-none focus:ring-1 focus:ring-highlight" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
              </button>
            </div>
            {password && (
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${password.length >= i * 3 ? 'bg-green-500' : 'bg-border'}`} />
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button title="Create Account" variant="cta" size="large" rounded="xl" className="w-full" onPress={handleSignUp} loading={loading} />

          <p className="text-center text-sm text-muted">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-highlight hover:underline">Sign in</Link>
          </p>
        </AnimatedDiv>
      </div>
    </div>
  );
}
