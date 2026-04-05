'use client';

import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';

const STEPS = [
  { step: '1', title: 'Choose Your Location', desc: 'Pick Hulhumale (10 min from the airport) or Maafushi Island. Both offer calm, crystal-clear lagoon conditions perfect for learning.', icon: 'MapPin' },
  { step: '2', title: 'Pick Your Date & Time', desc: 'Check availability and select a session that fits your schedule. Morning and afternoon slots available daily.', icon: 'Calendar' },
  { step: '3', title: 'Book & Pay Online', desc: 'Secure your spot with instant online payment. Free cancellation up to 24 hours before your session.', icon: 'CreditCard' },
  { step: '4', title: 'Meet Your Instructor', desc: 'Show up at the beach. Your certified instructor will brief you on safety, board controls, and riding technique.', icon: 'Users' },
  { step: '5', title: 'Fly Over Paradise', desc: 'Within minutes, you\'ll be gliding — then flying — above the turquoise Maldivian lagoon. An experience you\'ll never forget.', icon: 'Zap' },
];

const FAQS = [
  { q: 'What is eFoiling?', a: 'An eFoil is an electric-powered surfboard with a hydrofoil underneath. Using a wireless hand controller, you accelerate until the board lifts above the water — and you fly. No waves or wind needed.' },
  { q: 'Do I need any prior experience?', a: 'Not at all! Our lessons are designed for complete beginners. Most riders are above the water within their first 60-minute session. Your instructor guides you every step of the way.' },
  { q: 'Is it safe?', a: 'Yes. Every board has a wireless kill-switch that stops the motor if you fall off. You\'ll wear a helmet and life jacket. A certified instructor is always in the water with you, and sessions take place in calm lagoon conditions.' },
  { q: 'What should I wear?', a: 'A swimsuit or board shorts. We provide all safety equipment (helmet, life jacket). Sunscreen is recommended. No special shoes needed.' },
  { q: 'How long is a session?', a: 'Each lesson is 60 minutes. This includes a brief land briefing (5-10 minutes) and 50-55 minutes of water time.' },
  { q: 'Where are the lessons?', a: 'We currently operate at two locations: Hulhumale Beach (10 minutes from Velana International Airport) and Maafushi Island (popular tourist island with ferry access from Male).' },
  { q: 'Can I book for two people?', a: 'Yes! Sessions accommodate 1-2 riders. Your instructor will alternate between riders, so each person gets plenty of riding time.' },
  { q: 'Can my resort or yacht offer eFoil to guests?', a: 'Absolutely. We partner with resorts, yachts, guesthouses, and watersport centers across the Maldives. Revenue share model with zero investment needed. Visit our For Partners page to learn more.' },
];

export default function HowItWorksPage() {
  return (
    <div className="pb-20">
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <AnimatedDiv animation="fadeIn">
          <h1 className="text-center text-4xl font-bold">How It Works</h1>
          <p className="mt-3 text-center text-lg text-muted">Book your eFoil lesson in 5 simple steps</p>
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
            <p className="mt-2 text-center text-muted">Everything you need to know about eFoiling in the Maldives.</p>
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
            <a
              href="https://wa.me/9607772241?text=Hey!%20I'd%20like%20to%20book%20an%20eFoil%20lesson%20in%20the%20Maldives."
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white hover:opacity-90 transition-opacity"
            >
              <Icon name="MessageCircle" size={20} color="white" />
              Chat on WhatsApp
            </a>
            <Button href="/book" title="Book a Lesson" variant="cta" size="large" rounded="full" iconEnd="ArrowRight" />
          </div>
        </AnimatedDiv>
      </div>
    </div>
  );
}
