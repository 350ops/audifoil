'use client';

import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';

const STEPS = [
  { step: '1', title: 'Browse experiences', desc: 'Snorkeling, sandbank days, dolphin trips, sunset fishing — full-day or half-day, with a captain that fits your group size.', icon: 'Compass' },
  { step: '2', title: 'Pick a date and a captain', desc: 'See which Hulhumalé boats are free that day. Each captain has their own profile, photos, and reviews.', icon: 'Calendar' },
  { step: '3', title: 'Pay online', desc: 'Card, Apple Pay or Google Pay. Instant confirmation. Free cancellation up to 24h before the trip.', icon: 'CreditCard' },
  { step: '4', title: 'Meet at Phase 2 jetty', desc: 'Your captain will WhatsApp you the exact pickup spot. Gear, water and lunch are provided on board.', icon: 'MapPin' },
  { step: '5', title: 'Spend the day at sea', desc: 'Snorkel, swim, fish, photograph dolphins. Your captain knows the spots — just bring sunscreen and a swimsuit.', icon: 'Smile' },
];

const FAQS = [
  { q: 'Who runs the boats?', a: 'Local Hulhumalé fishermen. Most of our captains use their boats to fish overnight and dock back at Phase 2 around 4–5am. Their boats sit idle for most of the day — that&apos;s when you book them.' },
  { q: 'Where do we leave from?', a: 'Hulhumalé Phase 2 jetty. Once your booking is confirmed, your captain will WhatsApp you the exact meeting point and time.' },
  { q: 'What experiences can I book?', a: 'Snorkeling, sandbank visits, dolphin watching, traditional Maldivian fishing, sunset cruises, and full-day combinations of all of the above.' },
  { q: 'Is it safe for children and families?', a: 'Yes — half-day sandbank, snorkeling and sunset cruises are family-friendly. Every boat carries enough life jackets for all guests, including child sizes.' },
  { q: 'What if the weather is bad?', a: 'If your captain cancels because of weather, you get a full refund or can reschedule for free. If you cancel for any other reason 24h+ before the trip, you also get a full refund.' },
  { q: 'How do I pay?', a: 'Online at checkout — card, Apple Pay or Google Pay. Pricing is per person and shown upfront, no hidden fees.' },
  { q: 'I own a boat. Can I list it?', a: 'Yes — head to the “List your boat” page. We verify your ID and boat registration, then your boat goes live with its own profile and calendar.' },
];

export default function HowItWorksPage() {
  return (
    <div className="pb-20">
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <AnimatedDiv animation="fadeIn">
          <h1 className="text-center text-4xl font-bold">How it works</h1>
          <p className="mt-3 text-center text-lg text-muted">Book a day on a local boat in 5 steps</p>
        </AnimatedDiv>

        {/* Steps */}
        <div className="mt-12 space-y-6">
          {STEPS.map((step, i) => (
            <AnimatedDiv key={step.step} animation="slideInBottom" delay={100 + i * 80}>
              <div className="flex gap-6 rounded-2xl border border-border bg-secondary p-6 shadow-sm">
                <div className="flex shrink-0 flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-highlight text-lg font-bold text-white">
                    {step.step}
                  </div>
                  {i < STEPS.length - 1 && <div className="mt-2 h-full w-0.5 bg-border" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Icon name={step.icon} size={20} color="#FF0039" />
                    <h3 className="text-lg font-bold">{step.title}</h3>
                  </div>
                  <p className="mt-2 text-muted">{step.desc}</p>
                </div>
              </div>
            </AnimatedDiv>
          ))}
        </div>

        {/* FAQ */}
        <section className="mt-16">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-center text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-2 text-center text-muted">From quick answers to in-depth guidance, we&apos;re committed to making sure you feel confident.</p>
          </AnimatedDiv>
          <div className="mt-8 space-y-4">
            {FAQS.map((faq, i) => (
              <AnimatedDiv key={i} animation="fadeIn" delay={100 + i * 40}>
                <div className="rounded-2xl border border-border bg-secondary p-5">
                  <h3 className="font-semibold">{faq.q}</h3>
                  <p className="mt-2 text-sm text-muted">{faq.a}</p>
                </div>
              </AnimatedDiv>
            ))}
          </div>
        </section>

        {/* CTA */}
        <AnimatedDiv animation="scaleIn" delay={300} className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/activities" title="Browse experiences" variant="cta" size="large" rounded="full" iconEnd="ArrowRight" />
            <Button href="/host" title="I own a boat" variant="outline" size="large" rounded="full" />
          </div>
        </AnimatedDiv>
      </div>
    </div>
  );
}
