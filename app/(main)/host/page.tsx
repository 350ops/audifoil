'use client';

import Image from 'next/image';
import Link from 'next/link';
import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { LOCAL_IMAGES } from '@/data/activities';

const PITCH = [
  {
    icon: 'DollarSign',
    title: 'Earn from idle hours',
    desc: 'Your boat is back at Phase 2 by 5am and sits there until you go out again. Those daylight hours can pay for your fuel and your kids’ school fees.',
  },
  {
    icon: 'Users',
    title: 'Real guests, real pay',
    desc: 'Tourists, expats and airline crew already in Hulhumálé. They pay online before the trip — no chasing cash, no agency middleman taking a cut.',
  },
  {
    icon: 'CalendarCheck',
    title: 'You set the calendar',
    desc: 'Block out fishing days, festivals, maintenance — anything. Guests can only book the days you mark as open.',
  },
  {
    icon: 'Shield',
    title: 'Verified and protected',
    desc: 'We check IDs and boat registrations on both sides. Clear weather-cancellation rules. You don’t lose money to no-shows.',
  },
];

const STEPS = [
  { n: '1', title: 'Apply in 5 minutes', desc: 'Tell us about you, your boat, and what kind of trips you run.' },
  { n: '2', title: 'We verify you', desc: 'A quick ID and boat-registration check. Usually done within 48 hours.' },
  { n: '3', title: 'Set your calendar and prices', desc: 'Pick which days you’re available and what you charge per person.' },
  { n: '4', title: 'Get bookings', desc: 'Confirmed online. We send each guest your WhatsApp once they pay.' },
];

const FAQ = [
  { q: 'Who is this for?', a: 'Owners of small or medium boats docked in Hulhumálé Phase 2 — mostly traditional fishing boats (dhonis) and small speedboats. If your boat sits idle most of the day, this is for you.' },
  { q: 'How much does maldivian.tours take?', a: 'A small platform fee on top of your price. Your full price goes to you; we add a fee that the guest pays. Exact amount is shown to you during onboarding.' },
  { q: 'How do I get paid?', a: 'Direct bank transfer in MVR or USD, every Monday for the previous week’s trips.' },
  { q: 'What if the weather is bad and I cancel?', a: 'No penalty if you cancel for safety. The guest is fully refunded and we help them rebook with you another day.' },
  { q: 'Do I need to speak English?', a: 'Helpful but not required. Many of our captains speak only Dhivehi — we translate the booking details and use simple WhatsApp messages for the rest.' },
];

export default function HostLandingPage() {
  return (
    <div className="pb-20">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[420px]">
        <Image
          src={LOCAL_IMAGES.crewOnABoat}
          alt="A captain working on his dhoni in Hulhumalé Phase 2"
          fill
          className="object-cover"
          priority
        />
        <div className="gradient-hero absolute inset-0" />
        <div className="relative flex h-full flex-col justify-end p-6 lg:p-12">
          <div className="mx-auto w-full max-w-7xl">
            <AnimatedDiv animation="slideInBottom">
              <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white backdrop-blur-sm">
                For Hulhum&aacute;l&eacute; captains
              </span>
              <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-white lg:text-6xl">
                Your boat is docked.<br />Make it earn.
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-white/90">
                List your boat on maldivian.tours and turn idle daylight hours into trips for travellers, expats and airline crew already in Hulhum&aacute;l&eacute;.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  href="/host/apply"
                  title="Apply to list your boat"
                  variant="cta"
                  size="large"
                  rounded="full"
                  iconEnd="ArrowRight"
                />
                <Link
                  href="#how"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/10"
                >
                  See how it works
                </Link>
              </div>
            </AnimatedDiv>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Why */}
        <section className="mt-16">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-3xl font-bold">Why list your boat with us</h2>
            <p className="mt-2 text-muted">A platform built around the way Phase 2 captains actually work.</p>
          </AnimatedDiv>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {PITCH.map((item, i) => (
              <AnimatedDiv key={item.title} animation="scaleIn" delay={100 + i * 60}>
                <div className="flex gap-4 rounded-2xl border border-border bg-secondary p-5 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-highlight/10">
                    <Icon name={item.icon} size={24} color="#FF0039" />
                  </div>
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted">{item.desc}</p>
                  </div>
                </div>
              </AnimatedDiv>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mt-16 scroll-mt-24">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-3xl font-bold">From apply to first trip</h2>
            <p className="mt-2 text-muted">Most captains take their first booking within a week of applying.</p>
          </AnimatedDiv>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <AnimatedDiv key={step.n} animation="scaleIn" delay={100 + i * 80}>
                <div className="rounded-2xl border border-border bg-secondary p-6 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-highlight font-bold text-white">
                    {step.n}
                  </div>
                  <h3 className="font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted">{step.desc}</p>
                </div>
              </AnimatedDiv>
            ))}
          </div>
        </section>

        {/* What you need */}
        <section className="mt-16">
          <AnimatedDiv animation="fadeIn">
            <div className="rounded-2xl border border-border bg-secondary p-6 shadow-sm lg:p-8">
              <h2 className="text-2xl font-bold">What you&apos;ll need to apply</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  'Your Maldivian National ID',
                  'Boat registration document',
                  'Insurance certificate (or willingness to add one)',
                  '4–6 clear photos of your boat',
                  'A bank account in your name (MVR or USD)',
                  'A WhatsApp number guests can reach you on',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <Icon name="Check" size={18} color="#22C55E" className="mt-0.5 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedDiv>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-3xl font-bold">Captain FAQ</h2>
          </AnimatedDiv>
          <div className="mt-6 space-y-3">
            {FAQ.map((f, i) => (
              <AnimatedDiv key={f.q} animation="fadeIn" delay={60 + i * 40}>
                <details className="group rounded-2xl border border-border bg-secondary p-5">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold">
                    {f.q}
                    <Icon name="ChevronDown" size={18} className="transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm text-muted">{f.a}</p>
                </details>
              </AnimatedDiv>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16">
          <AnimatedDiv animation="scaleIn">
            <div className="rounded-2xl border border-border bg-secondary p-8 text-center shadow-sm">
              <h2 className="text-2xl font-bold">Ready to list your boat?</h2>
              <p className="mt-2 text-muted">Application takes about 5 minutes. We&apos;ll be in touch within 48 hours.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Button
                  href="/host/apply"
                  title="Apply now"
                  variant="cta"
                  size="large"
                  rounded="full"
                  iconEnd="ArrowRight"
                />
                <Button
                  href="/explore"
                  title="See how guests browse"
                  variant="outline"
                  size="large"
                  rounded="full"
                />
              </div>
            </div>
          </AnimatedDiv>
        </section>
      </div>
    </div>
  );
}
