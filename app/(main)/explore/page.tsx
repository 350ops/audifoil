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
  { number: '1', title: 'Browse excursions', desc: 'Explore our special excursions, water sports, and paradise retreats.' },
  { number: '2', title: 'Pick your date', desc: 'Check availability and select a date that works for you.' },
  { number: '3', title: 'Book via WhatsApp', desc: 'Contact us on WhatsApp at +960 7772241 to confirm your booking.' },
  { number: '4', title: 'Show up and enjoy', desc: 'We handle transportation, equipment, and refreshments — just bring your sense of adventure.' },
];

const VALUES = [
  { icon: 'Map', title: 'Expert Local Guides', desc: 'Our team knows the Maldivian waters, reefs, and safety protocols to give you the best experience.' },
  { icon: 'Wrench', title: 'Modern Equipment', desc: 'Our boats, jet skis, and gear are regularly serviced and well-maintained for your safety and comfort.' },
  { icon: 'Heart', title: 'Personalized Service', desc: 'We customize activities based on your interests, schedule, and budget. Every trip is tailored to you.' },
  { icon: 'Shield', title: 'Safety First', desc: 'Certified instructors, life jackets for all, and weather-dependent departures ensure your safety at every step.' },
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
              Find Your Perfect<br />Excursion
            </h1>
            <p className="mt-3 text-lg text-white/90 lg:text-xl">
              Dive into adventure with Maldives Water Sports — world-class ocean activities, unforgettable memories, and unmatched service in the heart of paradise.
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
          <p className="mt-2 text-center text-xs text-muted">A day on the water with Maldives Water Sports</p>
        </AnimatedDiv>

        {/* OUR SPECIAL EXCURSIONS */}
        <section className="mt-16">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-3xl font-bold">Our Special Excursions</h2>
            <p className="mt-2 text-muted">From full-day adventures to thrilling water sports — we have something for everyone.</p>
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
            <h2 className="text-3xl font-bold">Find Your Perfect Excursion in Minutes</h2>
            <p className="mt-2 text-muted">Transparent pricing. No hidden fees. Book easily via WhatsApp.</p>
          </AnimatedDiv>

          {/* Popular packages */}
          <AnimatedDiv animation="fadeIn" delay={200} className="mt-6">
            <div className="rounded-2xl border border-border bg-secondary p-6 shadow-sm">
              <h3 className="mb-4 font-bold text-lg">Popular excursions starting from:</h3>
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
                Escape to unmatched serenity. Our resorts offer an array of indulgent experiences — from gourmet dining with fresh local and international cuisine to rejuvenating spa treatments, or simply relaxing in a private villa overlooking the sparkling ocean.
              </p>
              <p className="mt-3 text-white/90 leading-relaxed max-w-2xl">
                For the adventurous, enjoy snorkeling among vibrant coral reefs, private sunset cruises, island-hopping excursions, and cultural tours to nearby local islands. Every detail is designed to create unforgettable memories.
              </p>
              <div className="mt-6">
                <Button href="/activities" title="Explore Excursions" variant="ghost" rounded="full" className="border border-white/30 text-white hover:bg-white/10" iconEnd="ArrowRight" />
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
            <h2 className="text-3xl font-bold">Why Maldives Water Sports</h2>
            <p className="mt-2 text-muted">Your trusted partner for world-class ocean activities.</p>
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
              <h2 className="text-2xl font-bold">Ready for Your Maldives Adventure?</h2>
              <p className="mt-2 text-muted">Book your perfect excursion in minutes.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <a
                  href="https://wa.me/9607772241?text=Hey!%20I'd%20like%20to%20book%20an%20excursion%20with%20Maldives%20Water%20Sports."
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <Icon name="MessageCircle" size={20} color="white" />
                  Book via WhatsApp
                </a>
                <Button
                  title="Browse Excursions"
                  variant="cta"
                  rounded="full"
                  size="large"
                  iconEnd="ArrowRight"
                  href="/activities"
                />
              </div>
            </div>
          </AnimatedDiv>
        </section>
      </div>
    </div>
  );
}
