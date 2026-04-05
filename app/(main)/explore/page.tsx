'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import VideoPreview from '@/components/VideoPreview';
import { ACTIVITIES, LOCAL_IMAGES, PARTNER_TYPES } from '@/data/activities';
import { useStore } from '@/store/useStore';

const STEPS = [
  { number: '1', title: 'Choose your location', desc: 'Pick Hulhumale (near the airport) or Maafushi Island.' },
  { number: '2', title: 'Pick your date & time', desc: 'Check availability and select a session that works for you.' },
  { number: '3', title: 'Book & pay online', desc: 'Secure your spot instantly with our simple checkout.' },
  { number: '4', title: 'Show up & fly', desc: 'Meet your instructor at the beach. You\'ll be flying in minutes.' },
];

const VALUES = [
  { icon: 'Zap', title: 'Fly on Day One', desc: 'Most riders are above the water within their first session. Our step-by-step coaching makes it easy.' },
  { icon: 'Shield', title: 'Safety First', desc: 'Certified instructors, wireless kill-switch, helmet, and life jacket on every ride.' },
  { icon: 'Heart', title: 'Personalized Coaching', desc: 'Sessions are 1-on-1 or 1-on-2. Your instructor adapts to your pace and comfort.' },
  { icon: 'Globe', title: 'Paradise Setting', desc: 'Ride in calm, crystal-clear lagoons surrounded by the stunning Maldivian scenery.' },
];

export default function ExplorePage() {
  const { setSelectedActivity } = useStore();
  const router = useRouter();

  const handleBookLocation = (activityId: string) => {
    const activity = ACTIVITIES.find((a) => a.id === activityId);
    if (activity) {
      setSelectedActivity(activity);
      router.push(`/book/${activityId}`);
    }
  };

  return (
    <div className="pb-20">
      {/* HERO */}
      <div className="relative h-[60vh] min-h-[400px] lg:h-[70vh]">
        <Image src={LOCAL_IMAGES.efoilNew} alt="eFoil flying over Maldives lagoon" fill className="object-cover" priority />
        <div className="gradient-hero absolute inset-0" />
        <div className="relative flex h-full flex-col justify-end p-6 lg:p-12">
          <div className="mx-auto w-full max-w-7xl">
            <h1 className="text-4xl font-bold leading-tight text-white lg:text-6xl">
              Fly Over<br />Paradise
            </h1>
            <p className="mt-3 text-lg text-white/90 lg:text-xl">
              60-minute eFoil lessons in the Maldives. No experience needed — rise above the lagoon and fly.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-xl bg-white/25 px-5 py-3 backdrop-blur-sm">
                <span className="text-xl font-bold text-white">From $150</span>
                <span className="ml-2 text-white/80">/ session</span>
              </div>
              <Button
                title="Book a Lesson"
                variant="cta"
                size="large"
                rounded="full"
                iconEnd="ArrowRight"
                href="/book"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* VIDEO TEASER */}
        <AnimatedDiv animation="fadeIn" delay={100} className="mt-8">
          <VideoPreview src="/videos/foiling-maldives.mp4" height={300} rounded={16} />
          <p className="mt-2 text-center text-xs text-muted">Experience eFoiling in the Maldives</p>
        </AnimatedDiv>

        {/* WHAT IS EFOILING */}
        <section className="mt-16">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-3xl font-bold">What is eFoiling?</h2>
            <p className="mt-4 text-muted leading-relaxed max-w-3xl">
              An eFoil is an electric-powered surfboard with a hydrofoil that lifts you above the water. Using a wireless hand controller, you accelerate smoothly until the board rises — and suddenly you&apos;re flying silently over the ocean. It&apos;s the closest thing to magic on water.
            </p>
            <p className="mt-3 text-muted leading-relaxed max-w-3xl">
              No waves, no wind, no experience needed. Just you, the board, and the turquoise Maldivian lagoon beneath you.
            </p>
          </AnimatedDiv>
        </section>

        {/* CHOOSE YOUR LOCATION */}
        <section className="mt-16">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-3xl font-bold">Choose Your Location</h2>
            <p className="mt-2 text-muted">Two stunning spots to learn and ride.</p>
          </AnimatedDiv>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {ACTIVITIES.map((activity, i) => {
              const locationName = activity.id === 'efoil-hulhumale' ? 'Hulhumale' : 'Maafushi';
              const locationDesc = activity.id === 'efoil-hulhumale'
                ? '10 minutes from Velana International Airport. Perfect for a session before or after your flight.'
                : 'Popular tourist island with stunning lagoon. Combine with a day trip for the ultimate Maldives experience.';

              return (
                <AnimatedDiv key={activity.id} animation="scaleIn" delay={100 + i * 80}>
                  <div
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm transition-shadow hover:shadow-md"
                    onClick={() => handleBookLocation(activity.id)}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={activity.media[0]?.src || LOCAL_IMAGES.efoilNew}
                        alt={activity.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="gradient-overlay absolute inset-0" />
                      <div className="absolute bottom-4 left-4">
                        <div className="flex items-center gap-2">
                          <Icon name="MapPin" size={18} color="white" />
                          <span className="text-lg font-bold text-white">{locationName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-muted">{locationDesc}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-bold">${activity.priceFromUsd}/person</span>
                        <div className="flex items-center gap-1">
                          <Icon name="Star" size={14} color="#FFD700" />
                          <span className="text-sm">{activity.rating}</span>
                          <span className="text-xs text-muted">({activity.reviewCount})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedDiv>
              );
            })}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mt-16">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-2 text-muted">Four steps. Zero hassle.</p>
          </AnimatedDiv>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <AnimatedDiv key={step.number} animation="scaleIn" delay={100 + i * 80}>
                <div className="relative rounded-2xl border border-border bg-secondary p-6 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-highlight font-bold text-white">
                    {step.number}
                  </div>
                  <h3 className="font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted">{step.desc}</p>
                </div>
              </AnimatedDiv>
            ))}
          </div>
        </section>

        {/* FOR PARTNERS CTA */}
        <section className="mt-16">
          <AnimatedDiv animation="fadeIn">
            <div className="gradient-cta overflow-hidden rounded-2xl p-8 text-white shadow-lg lg:p-10">
              <div className="mb-4 flex items-center gap-3">
                <Icon name="Handshake" size={24} color="white" />
                <h2 className="text-2xl font-bold">Partner With eFoil Maldives</h2>
              </div>
              <p className="text-white/90 leading-relaxed max-w-2xl">
                Revenue share model. No investment needed. We provide all eFoil equipment, training, and the booking platform. Your resort, yacht, guesthouse, or watersport center earns from every session.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {PARTNER_TYPES.slice(0, 3).map((pt) => (
                  <span key={pt.id} className="rounded-full border border-white/30 px-3 py-1 text-sm text-white/80">{pt.title}</span>
                ))}
                <span className="rounded-full border border-white/30 px-3 py-1 text-sm text-white/80">+2 more</span>
              </div>
              <div className="mt-6">
                <Button href="/partners" title="Learn More" variant="ghost" rounded="full" className="border border-white/30 text-white hover:bg-white/10" iconEnd="ArrowRight" />
              </div>
            </div>
          </AnimatedDiv>
        </section>

        {/* WHY EFOIL MALDIVES */}
        <section className="mt-16">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-3xl font-bold">Why eFoil Maldives</h2>
            <p className="mt-2 text-muted">The ultimate water sport experience in paradise.</p>
          </AnimatedDiv>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((val) => (
              <AnimatedDiv key={val.title} animation="scaleIn" delay={100}>
                <div className="rounded-2xl border border-border bg-secondary p-5 shadow-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-highlight/10">
                    <Icon name={val.icon} size={20} color="#FF0039" />
                  </div>
                  <h3 className="mb-1 font-semibold">{val.title}</h3>
                  <p className="text-xs text-muted">{val.desc}</p>
                </div>
              </AnimatedDiv>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16">
          <AnimatedDiv animation="scaleIn">
            <div className="rounded-2xl border border-border bg-secondary p-8 text-center shadow-sm">
              <h2 className="text-2xl font-bold">Ready to Fly?</h2>
              <p className="mt-2 text-muted">Book your eFoil lesson in minutes. Beginners welcome.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <a
                  href="https://wa.me/9607772241?text=Hey!%20I'd%20like%20to%20book%20an%20eFoil%20lesson%20in%20the%20Maldives."
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <Icon name="MessageCircle" size={20} color="white" />
                  Chat on WhatsApp
                </a>
                <Button
                  title="Book a Lesson"
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
