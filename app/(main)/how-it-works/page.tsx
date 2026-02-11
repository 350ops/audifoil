'use client';

import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';

const STEPS = [
  { step: '1', title: 'Browse Our Excursions', desc: 'Explore our special excursions including full-day adventures, sunset cruises, fishing trips, island tours, and water sports activities.', icon: 'Compass' },
  { step: '2', title: 'Pick Your Date', desc: 'Check availability and select a date that works for your schedule.', icon: 'Calendar' },
  { step: '3', title: 'Book via WhatsApp', desc: 'Contact us on WhatsApp at +960 7772241 to confirm your booking. Quick, easy, and personal.', icon: 'MessageCircle' },
  { step: '4', title: 'We Handle the Rest', desc: 'Transportation, equipment, refreshments, and expert guides — everything is arranged for you.', icon: 'Package' },
  { step: '5', title: 'Show Up & Enjoy', desc: 'Just bring sunscreen and a sense of adventure. We take care of everything else for an unforgettable day in paradise.', icon: 'Smile' },
];

const FAQS = [
  { q: 'What water sports activities do you offer?', a: 'We offer a wide range of activities including full-day island adventures (South Ari Atoll, Maafushi Island), sunset fishing, sunset cruises with dolphin search, Malahini Kuda Bandos resort day visits, kayak rentals, and jet ski rentals.' },
  { q: 'Do I need prior experience for water sports?', a: 'No prior experience is needed! Our activities are designed for all skill levels. Professional instructors provide safety briefings and guidance for activities like jet skiing and snorkeling.' },
  { q: 'How can I book an excursion or water sport?', a: 'Booking is easy! Simply contact us on WhatsApp at +960 7772241 and our team will help you find the perfect excursion and confirm your booking.' },
  { q: 'Are the excursions safe for children and families?', a: 'Many of our excursions are family-friendly, including the sunset cruise, kayak rental, and sandbank visits. Life jackets are provided for all guests, and our experienced crew ensures safety at every step.' },
  { q: 'Can I customize my excursion package?', a: 'We offer personalized and friendly service — our team will customize activities based on your interests, schedule, and budget. Contact us on WhatsApp to discuss your perfect trip.' },
  { q: 'How do I reach the islands or resorts for the excursions?', a: 'All transportation is included in our excursion packages. We arrange scenic boat rides from Malé or Hulhumalé to all destinations.' },
  { q: 'What should I bring for water sports and excursions?', a: 'We provide all necessary equipment including snorkeling gear, life jackets, and fishing equipment. Just bring sunscreen, a swimsuit, a towel, and your sense of adventure!' },
];

export default function HowItWorksPage() {
  return (
    <div className="pb-20">
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <AnimatedDiv animation="fadeIn">
          <h1 className="text-center text-4xl font-bold">How It Works</h1>
          <p className="mt-3 text-center text-lg text-muted">Book your Maldives excursion in 5 simple steps</p>
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
            <a
              href="https://wa.me/9607772241?text=Hey!%20I'd%20like%20to%20book%20an%20excursion%20with%20Maldives%20Water%20Sports."
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white hover:opacity-90 transition-opacity"
            >
              <Icon name="MessageCircle" size={20} color="white" />
              Book via WhatsApp
            </a>
            <Button href="/activities" title="Browse Excursions" variant="cta" size="large" rounded="full" iconEnd="ArrowRight" />
          </div>
        </AnimatedDiv>
      </div>
    </div>
  );
}
