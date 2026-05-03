'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@/components/Button';
import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';
import VideoPreview from '@/components/VideoPreview';
import { useStore } from '@/store/useStore';
import { LOCAL_IMAGES, ACTIVITIES, MALDIVES_ADVENTURE_ID } from '@/data/activities';

const EXPERIENCE_ITEMS = [
  { icon: 'Fish', title: 'Dolphin Watching', desc: 'Cruise to where spinner dolphins gather and observe them in their natural habitat. An exhilarating experience for all ages.' },
  { icon: 'Waves', title: 'Snorkeling Adventures', desc: 'Explore vibrant coral gardens teeming with tropical fish, sea turtles, reef sharks, and stingrays. All gear provided.' },
  { icon: 'Sun', title: 'Sandbank Escapes', desc: 'Step onto secluded sandbanks featuring powder-soft white sands and shallow warm waters. The ultimate photo opportunity.' },
  { icon: 'Anchor', title: 'Sunset Cruises', desc: 'Search for dolphins, enjoy resort sightseeing, and watch the sky light up with fiery, breathtaking sunset colors.' },
  { icon: 'Ship', title: 'Fishing Adventures', desc: 'Experience traditional Maldivian hand-line fishing and trolling techniques as the sun sets over the Indian Ocean.' },
  { icon: 'Zap', title: 'Thrilling Water Sports', desc: 'Jet ski across the crystal-clear Indian Ocean or kayak through calm lagoon waters. Options for every thrill level.' },
];

const STEPS = [
  { number: '1', title: 'Browse experiences', desc: 'Snorkeling, sandbank visits, fishing, dolphin trips — half-day or full-day.' },
  { number: '2', title: 'Pick a date and a captain', desc: 'See which Hulhumalé boats are free that day and who is running them.' },
  { number: '3', title: 'Book and pay online', desc: 'Confirmed instantly. Secure card, Apple Pay or Google Pay at checkout.' },
  { number: '4', title: 'Meet at Phase 2 jetty', desc: 'Your captain meets you at the dock. Gear, water and lunch included.' },
];

const VALUES = [
  { icon: 'Map', title: 'Local captains', desc: 'Every captain is a Hulhumalé fisherman who knows these waters, reefs and dolphin spots first-hand.' },
  { icon: 'Shield', title: 'Verified boats', desc: 'ID-checked captains, registered boats, life jackets for all, and a clear weather-cancellation policy.' },
  { icon: 'Heart', title: 'Fair to everyone', desc: 'Captains earn from a boat that would otherwise sit idle. You pay a fair, transparent price — no resort markup.' },
  { icon: 'Wrench', title: 'No middleman', desc: 'You book the captain directly. Message them on WhatsApp once confirmed. No agency, no kickbacks.' },
];

export default function ExplorePage() {
  const { loadActivityBookings, setSelectedActivity } = useStore();

  useEffect(() => { loadActivityBookings(); }, []);

  const navigateToBooking = () => {
    const adventure = ACTIVITIES.find((a) => a.id === MALDIVES_ADVENTURE_ID);
    if (adventure) {
      setSelectedActivity(adventure);
      window.location.href = '/activities/south-ari-atoll';
    }
  };

  return (
    <div className="pb-20">
      {/* HERO */}
      <div className="relative h-[60vh] min-h-[400px] lg:h-[70vh]">
        <Image src="/img/imagesmaldivesa/reefsnorkeling.jpg" alt="Reef snorkeling aerial" fill className="object-cover" priority />
        <div className="gradient-hero absolute inset-0" />
        <div className="relative flex h-full flex-col justify-end p-6 lg:p-12">
          <div className="mx-auto w-full max-w-7xl">
            <h1 className="text-4xl font-bold leading-tight text-white lg:text-6xl">
              Real boats.<br />Real captains.<br />A real day at sea.
            </h1>
            <p className="mt-3 text-lg text-white/90 lg:text-xl">
              maldivian.tours connects Hulhumalé&apos;s fishing boats — docked and idle most of the day — with travellers, expats and crew who want a genuine day on the water.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-xl bg-white/25 px-5 py-3 backdrop-blur-sm">
                <span className="text-xl font-bold text-white">From $25</span>
                <span className="ml-2 text-white/80">/ person</span>
              </div>
              <Button
                title="Book Now"
                variant="cta"
                size="large"
                rounded="full"
                iconEnd="ArrowRight"
                onPress={navigateToBooking}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* VIDEO TEASER */}
        <AnimatedDiv animation="fadeIn" delay={100} className="mt-8">
          <VideoPreview src="/img/imagesmaldivesa/snorkeling.mp4" height={300} rounded={16} />
          <p className="mt-2 text-center text-xs text-muted">A day on the water from Hulhumalé Phase 2</p>
        </AnimatedDiv>

        {/* WHAT YOU CAN DO */}
        <section className="mt-16">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-3xl font-bold">What you can do in a day</h2>
            <p className="mt-2 text-muted">Mix and match — most captains will combine two or three of these into one trip.</p>
          </AnimatedDiv>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {EXPERIENCE_ITEMS.map((item, i) => (
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

        {/* PRICING */}
        <section className="mt-16">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-3xl font-bold">Pick your day in minutes</h2>
            <p className="mt-2 text-muted">Transparent pricing per person. No hidden fees. Instant confirmation.</p>
          </AnimatedDiv>

          {/* Popular packages */}
          <AnimatedDiv animation="fadeIn" delay={200} className="mt-6">
            <div className="rounded-2xl border border-border bg-secondary p-6 shadow-sm">
              <h3 className="mb-4 font-bold text-lg">Popular experiences starting from:</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  'South Ari Atoll Full-Day Adventure',
                  'Maldivian Sunset Fishing Adventure',
                  'Maldivian Sunset Cruise',
                  'Malahini Kuda Bandos Day Visit',
                  'Maafushi Island Adventure Tour',
                  'Kayak Rental',
                  'Jet Ski Rental',
                  'Professional media content available',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <Icon name="Check" size={16} color="#22C55E" className="mt-0.5 shrink-0" />
                    <span className="text-sm text-muted">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedDiv>
        </section>

        {/* PARADISE RETREATS */}
        <section className="mt-16">
          <AnimatedDiv animation="fadeIn">
            <div className="gradient-cta overflow-hidden rounded-2xl p-8 text-white shadow-lg lg:p-10">
              <div className="mb-4 flex items-center gap-3">
                <Icon name="Palmtree" size={24} color="white" />
                <h2 className="text-2xl font-bold">Paradise Retreats</h2>
              </div>
              <p className="text-white/90 leading-relaxed max-w-2xl">
                Want to escape the city for a day? Most of our captains can also drop you at a nearby resort beach, a quiet uninhabited island, or a private sandbank for a few hours of sun and silence.
              </p>
              <p className="mt-3 text-white/90 leading-relaxed max-w-2xl">
                Snorkel a reef, picnic on the sand, swim in shallow turquoise water, then cruise back at sunset. Tell your captain what you&apos;re after — they&apos;ll tailor the day.
              </p>
              <div className="mt-6">
                <Button href="/activities" title="Browse experiences" variant="ghost" rounded="full" className="border border-white/30 text-white hover:bg-white/10" iconEnd="ArrowRight" />
              </div>
            </div>
          </AnimatedDiv>
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

        {/* VALUES */}
        <section className="mt-16">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-3xl font-bold">Why maldivian.tours</h2>
            <p className="mt-2 text-muted">A direct link between Hulhumalé&apos;s captains and you.</p>
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
              <h2 className="text-2xl font-bold">Ready for a day on the water?</h2>
              <p className="mt-2 text-muted">Find a captain, pick a date, pay online. That&apos;s it.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Button
                  title="Browse experiences"
                  variant="cta"
                  rounded="full"
                  size="large"
                  iconEnd="ArrowRight"
                  href="/activities"
                />
                <Button
                  title="I own a boat"
                  variant="outline"
                  rounded="full"
                  size="large"
                  href="/host"
                />
              </div>
            </div>
          </AnimatedDiv>
        </section>
      </div>
    </div>
  );
}
