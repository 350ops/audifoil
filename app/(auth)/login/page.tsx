'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import AnimatedDiv from '@/components/AnimatedDiv';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithOAuth, signInAsDemo, demoModeAvailable } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true); setError('');
    const { error } = await signIn(email, password);
    if (error) { setError(error.message); setLoading(false); }
    else router.push('/explore');
  };

  const handleOAuth = async (provider: 'apple' | 'google') => {
    const { error } = await signInWithOAuth(provider);
    if (error) setError(error.message);
  };

  const handleDemo = async () => {
    const { error } = await signInAsDemo();
    if (error) setError(error.message);
    else router.push('/explore');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <AnimatedDiv animation="slideInBottom">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2">
            <Image src="/img/imagesmaldivesa/logoboho.png" alt="Boho Waves" width={40} height={40} className="rounded-md" />
            <span className="text-2xl font-bold tracking-wider">Boho Waves</span>
          </Link>
          <h1 className="text-center text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-center text-muted">Sign in to your account</p>
        </AnimatedDiv>

        <AnimatedDiv animation="fadeIn" delay={100} className="mt-8 space-y-4">
          {/* OAuth buttons */}
          <button
            onClick={() => handleOAuth('google')}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-secondary py-3 font-medium transition-colors hover:bg-background"
          >
            <Icon name="Chrome" size={20} /> Continue with Google
          </button>
          <button
            onClick={() => handleOAuth('apple')}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-primary py-3 font-medium text-invert transition-opacity hover:opacity-90"
          >
            <Icon name="Apple" size={20} /> Continue with Apple
          </button>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Email form */}
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@bohowaves.com"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted focus:border-highlight focus:outline-none focus:ring-1 focus:ring-highlight"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-foreground placeholder:text-muted focus:border-highlight focus:outline-none focus:ring-1 focus:ring-highlight"
              />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button title="Sign In" variant="cta" size="large" rounded="xl" className="w-full" onPress={handleSignIn} loading={loading} />

          <Link href="/forgot-password" className="block text-center text-sm text-highlight hover:underline">
            Forgot password?
          </Link>

          <p className="text-center text-sm text-muted">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-highlight hover:underline">Sign up</Link>
          </p>

          {demoModeAvailable && (
            <button onClick={handleDemo} className="w-full text-center text-sm text-muted hover:text-foreground transition-colors">
              Try Demo Mode
            </button>
          )}
        </AnimatedDiv>
      </div>
    </div>
  );
}
