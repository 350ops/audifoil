'use client';

import Image from 'next/image';
import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { LOCAL_IMAGES, PARTNER_TYPES, PARTNER_BENEFITS } from '@/data/activities';

const PARTNER_STEPS = [
  { step: '1', title: 'Apply to Partner', desc: 'Reach out via WhatsApp or the form below. We\'ll discuss your location, capacity, and goals.', icon: 'MessageCircle' },
  { step: '2', title: 'We Set Everything Up', desc: 'We deliver eFoil equipment to your location and train your team on operations and safety.', icon: 'Package' },
  { step: '3', title: 'Your Guests Book & Ride', desc: 'Guests book sessions through our platform. We handle payments, scheduling, and customer support.', icon: 'CalendarCheck' },
  { step: '4', title: 'You Earn Revenue Share', desc: 'Receive your share from every booking. No upfront cost, no risk — just new revenue.', icon: 'TrendingUp' },
];

const PARTNER_FAQS = [
  { q: 'Do I need to invest anything upfront?', a: 'No. We provide all eFoil equipment, boards, batteries, chargers, and safety gear at zero cost to you. We also handle maintenance.' },
  { q: 'How does the revenue share work?', a: 'You earn a percentage of every booking made at your location. The exact share depends on your location type and volume — we\'ll discuss details during onboarding.' },
  { q: 'Do I need trained staff?', a: 'We provide full training for your team. Alternatively, we can supply certified instructors who operate at your location.' },
  { q: 'What locations are you looking for?', a: 'We partner with resorts, yachts, guesthouses, safari boats, and watersport centers anywhere in the Maldives. If you have calm water access, we can work together.' },
  { q: 'How quickly can we get started?', a: 'Most partnerships are operational within 2-4 weeks of initial contact, including equipment delivery and staff training.' },
  { q: 'What about insurance and liability?', a: 'We carry comprehensive insurance covering all eFoil operations. Safety is our top priority — every session includes certified instruction and full safety equipment.' },
];

export default function PartnersPage() {
  return (
    <div className="pb-20">
      {/* Hero */}
      <div className="relative h-[55vh] min-h-[400px]">
        <Image src={LOCAL_IMAGES.island} alt="Maldives resort aerial view" fill className="object-cover" priority />
        <div className="gradient-hero absolute inset-0" />
        <div className="relative flex h-full flex-col justify-end p-6 lg:p-12">
          <div className="mx-auto w-full max-w-7xl">
            <AnimatedDiv animation="slideInBottom">
              <div className="flex items-center gap-3 mb-3">
                <Icon name="Handshake" size={28} color="white" />
                <span className="rounded-full border border-white/30 px-3 py-1 text-sm text-white/80 backdrop-blur-sm">Revenue Share Model</span>
              </div>
              <h1 className="text-4xl font-bold text-white lg:text-6xl">
                Partner With<br />eFoil Maldives
              </h1>
              <p className="mt-4 max-w-xl text-lg text-white/90">
                Offer the most exciting water sport in the world to your guests. No investment needed — we provide everything. You earn from every session.
              </p>
            </AnimatedDiv>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Key Value Prop */}
        <section className="mt-12">
          <AnimatedDiv animation="fadeIn">
            <div className="gradient-cta rounded-2xl p-8 text-white lg:p-10">
              <h2 className="text-2xl font-bold">Zero Investment. Instant Revenue.</h2>
              <p className="mt-3 text-white/90 max-w-2xl leading-relaxed">
                We bring the eFoil equipment, the booking platform, the marketing, and the expertise. You bring the location and the guests. Together, we create an unforgettable experience — and a new revenue stream for your business.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4 max-w-md">
                <div className="text-center">
                  <div className="text-3xl font-bold">$0</div>
                  <div className="text-xs text-white/70">Upfront cost</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-xs text-white/70">Equipment provided</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-xs text-white/70">Support & maintenance</div>
                </div>
              </div>
            </div>
          </AnimatedDiv>
        </section>

        {/* Partner Types */}
        <section className="mt-16">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-3xl font-bold">Who We Partner With</h2>
            <p className="mt-2 text-muted">eFoil fits seamlessly into any hospitality or water sports business.</p>
          </AnimatedDiv>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PARTNER_TYPES.map((partner, i) => (
              <AnimatedDiv key={partner.id} animation="scaleIn" delay={100 + i * 60}>
                <div className="rounded-2xl border border-border bg-secondary p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-highlight/10">
                    <Icon name={partner.icon} size={24} color="#FF0039" />
                  </div>
                  <h3 className="text-lg font-bold">{partner.title}</h3>
                  <p className="mt-2 text-sm text-muted">{partner.description}</p>
                </div>
              </AnimatedDiv>
            ))}
          </div>
        </section>

        {/* How It Works for Partners */}
        <section className="mt-16">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-2 text-muted">From first contact to first revenue in weeks.</p>
          </AnimatedDiv>
          <div className="mt-8 space-y-6">
            {PARTNER_STEPS.map((step, i) => (
              <AnimatedDiv key={step.step} animation="slideInBottom" delay={100 + i * 80}>
                <div className="flex gap-6 rounded-2xl border border-border bg-secondary p-6 shadow-sm">
                  <div className="flex shrink-0 flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-highlight text-lg font-bold text-white">
                      {step.step}
                    </div>
                    {i < PARTNER_STEPS.length - 1 && <div className="mt-2 h-full w-0.5 bg-border" />}
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
        </section>

        {/* Benefits */}
        <section className="mt-16">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-3xl font-bold">Partner Benefits</h2>
            <p className="mt-2 text-muted">Everything you need to offer world-class eFoil experiences.</p>
          </AnimatedDiv>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PARTNER_BENEFITS.map((benefit, i) => (
              <AnimatedDiv key={benefit.title} animation="scaleIn" delay={100 + i * 60}>
                <div className="rounded-2xl border border-border bg-secondary p-5 shadow-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-highlight/10">
                    <Icon name={benefit.icon} size={20} color="#FF0039" />
                  </div>
                  <h3 className="font-bold">{benefit.title}</h3>
                  <p className="mt-1 text-sm text-muted">{benefit.description}</p>
                </div>
              </AnimatedDiv>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-2 text-muted">Everything you need to know about partnering with us.</p>
          </AnimatedDiv>
          <div className="mt-8 space-y-4">
            {PARTNER_FAQS.map((faq, i) => (
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
        <section className="mt-16">
          <AnimatedDiv animation="scaleIn">
            <div className="rounded-2xl border border-border bg-secondary p-8 text-center shadow-sm">
              <h2 className="text-2xl font-bold">Ready to Partner?</h2>
              <p className="mt-2 text-muted">Get in touch and we&apos;ll have you set up in weeks — not months.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <a
                  href="https://wa.me/9607772241?text=Hey!%20I'm%20interested%20in%20becoming%20an%20eFoil%20Maldives%20partner.%20I%20operate%20a%20"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <Icon name="MessageCircle" size={20} color="white" />
                  Contact via WhatsApp
                </a>
                <Button
                  title="Book a Lesson First"
                  variant="cta"
                  rounded="full"
                  size="large"
                  iconEnd="ArrowRight"
                  href="/book"
                />
              </div>
            </div>
          </AnimatedDiv>
        </section>
      </div>
    </div>
  );
}
