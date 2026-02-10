'use client';

import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';

const STEPS = [
  { step: '1', title: 'Browse & Pick a Date', desc: 'Choose from our curated Maldives experiences. Check the calendar for available trips and select a date that works.', icon: 'Calendar' },
  { step: '2', title: 'Reserve Your Spot', desc: 'Tap "Join Trip" to reserve your spot. No upfront payment — you only pay once the trip is confirmed.', icon: 'UserPlus' },
  { step: '3', title: 'Share with Friends', desc: 'Share your trip link with friends or crew. The more people who join, the lower the price for everyone.', icon: 'Share2' },
  { step: '4', title: 'Pay Securely', desc: 'Once your group is set, complete payment through our secure Stripe checkout. Each person pays for their own ticket.', icon: 'CreditCard' },
  { step: '5', title: 'Show Up & Enjoy', desc: 'We handle hotel pickup, equipment, food, and drinks. Just bring sunscreen and a swimsuit — we take care of everything else.', icon: 'Smile' },
];

const FAQS = [
  { q: 'What if the weather is bad?', a: 'If conditions are unsafe, we reschedule at no extra cost. You can also cancel for a full refund up to 24 hours before.' },
  { q: 'Do I need swimming experience?', a: 'No! All activities are suitable for beginners. Life jackets are provided, and our crew is trained in water safety.' },
  { q: 'What about the e-foil?', a: 'The Audi e-foil comes with a private instructor. Most guests are flying within 10 minutes. No prior experience needed.' },
  { q: 'How does group pricing work?', a: 'Price per person decreases as the group grows. At 5 guests, everyone pays just $80. Share the link to fill your group.' },
  { q: 'Can I book for a private group?', a: 'Absolutely! Contact us on WhatsApp for private bookings. Prices start from $350 for 1-2 guests.' },
];

export default function HowItWorksPage() {
  return (
    <div className="pb-20">
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <AnimatedDiv animation="fadeIn">
          <h1 className="text-center text-4xl font-bold">How It Works</h1>
          <p className="mt-3 text-center text-lg text-muted">Booking your Maldives adventure in 5 simple steps</p>
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
          <Button href="/activities" title="Browse Experiences" variant="cta" size="large" rounded="full" iconEnd="ArrowRight" />
        </AnimatedDiv>
      </div>
    </div>
  );
}
