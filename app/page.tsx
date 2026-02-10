'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/Button';
import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';
import { LOCAL_IMAGES } from '@/data/activities';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-screen min-h-[600px]">
        <Image
          src="/img/imagesmaldivesa/sandbank.jpg"
          alt="Maldives sandbank aerial"
          fill
          className="object-cover"
          priority
        />
        <div className="gradient-hero absolute inset-0" />

        <div className="relative flex h-full flex-col justify-between p-6 lg:p-12">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/img/imagesmaldivesa/logoboho.png" alt="Boho Waves" width={32} height={32} className="rounded-md" />
              <span className="text-sm font-semibold tracking-[0.2em] text-white/80">BohoWaves</span>
            </div>
            <Link
              href="/login"
              className="rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Sign In
            </Link>
          </div>

          {/* Hero content */}
          <div className="max-w-2xl">
            <AnimatedDiv animation="slideInBottom" delay={100}>
              <h1 className="text-5xl font-bold leading-tight text-white lg:text-7xl">
                Your Maldives<br />Adventure
              </h1>
            </AnimatedDiv>
            <AnimatedDiv animation="slideInBottom" delay={200}>
              <p className="mt-4 text-lg leading-relaxed text-white/90 lg:text-xl">
                5 hours. Dolphins, reefs, sandbank, e-foil.<br />
                All in one unforgettable day.
              </p>
            </AnimatedDiv>
            <AnimatedDiv animation="slideInBottom" delay={300}>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center rounded-xl bg-white/25 px-5 py-3 backdrop-blur-sm">
                  <span className="text-xl font-bold text-white">From $80</span>
                  <span className="ml-2 text-base text-white/80">/ person</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/70">
                  <Icon name="Star" size={16} color="#FFD700" />
                  <span className="text-sm font-medium">4.9 (312 reviews)</span>
                </div>
              </div>
            </AnimatedDiv>

            <AnimatedDiv animation="scaleIn" delay={400}>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  href="/explore"
                  title="Explore Experiences"
                  variant="cta"
                  size="large"
                  rounded="full"
                  iconEnd="ArrowRight"
                />
                <Button
                  href="/signup"
                  title="Create Account"
                  variant="ghost"
                  size="large"
                  rounded="full"
                  className="border border-white/30 text-white hover:bg-white/10"
                />
              </div>
            </AnimatedDiv>
          </div>
        </div>
      </div>

      {/* Quick features */}
      <div className="bg-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <AnimatedDiv animation="fadeIn">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: 'Fish', title: 'Swim with Dolphins', desc: '95% sighting rate' },
                { icon: 'Waves', title: 'Snorkel Pristine Reefs', desc: 'Turtles, sharks & tropical fish' },
                { icon: 'Zap', title: 'Fly an E-Foil', desc: 'Included for every guest' },
                { icon: 'Sun', title: 'Private Sandbank', desc: 'Your own island + picnic lunch' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-border p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-highlight/10">
                    <Icon name={item.icon} size={24} color="#FF0039" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedDiv>

          {/* CTA */}
          <AnimatedDiv animation="scaleIn" delay={200}>
            <div className="mt-12 text-center">
              <Button
                href="/explore"
                title="View All Experiences"
                variant="cta"
                size="large"
                rounded="full"
                iconEnd="ArrowRight"
              />
            </div>
          </AnimatedDiv>
        </div>
      </div>
    </div>
  );
}
