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
  { icon: 'Fish', title: 'Swim with Dolphins', desc: 'Cruise to the dolphin channel and swim alongside wild spinner dolphins. 95% sighting rate.' },
  { icon: 'Waves', title: 'Snorkel Pristine Reefs', desc: 'Two reef stops teeming with tropical fish, sea turtles, and reef sharks. All gear provided.' },
  { icon: 'Sun', title: 'Private Sandbank Picnic', desc: "Your own strip of white sand in the middle of the Indian Ocean. Lunch, drinks, and the best photos you'll ever take." },
  { icon: 'Zap', title: 'Fly an E-Foil', desc: "The highlight. Every guest tries the Audi e-foil — an electric surfboard that lifts you above the water. Resorts charge $150+ for 30 min. It's included." },
  { icon: 'Sunset', title: 'Golden Hour Cruise', desc: 'End the day cruising back as the sun sets over the Indian Ocean. Music, drinks, and memories that last.' },
  { icon: 'Camera', title: 'Professional Media Content', desc: 'GoPro, drone, underwater, and 360° cameras — professional-grade photos and video, available upon request.' },
];

const STEPS = [
  { number: '1', title: 'Pick a date', desc: 'Check upcoming trips. We run them most days, morning and afternoon.' },
  { number: '2', title: 'Reserve your spot', desc: 'Tap "Join Trip" and lock in your spot. No payment until the trip is confirmed.' },
  { number: '3', title: 'Spread the word', desc: 'Share your trip link with friends or colleagues. The more who join, the less everyone pays.' },
  { number: '4', title: 'Show up and enjoy', desc: 'We pick you up from Malé or Hulhumalé. Sunscreen and a swimsuit — we handle everything else.' },
];

const VALUES = [
  { icon: 'Map', title: 'Local Knowledge', desc: "We know the reefs, the dolphin channels, and the sandbanks that don't show up on Google Maps." },
  { icon: 'Users', title: 'Small Groups', desc: 'Max 5 people. No megaboat. No crowds. Just a small crew sharing an incredible day.' },
  { icon: 'Sparkles', title: 'Unfair Value', desc: 'An e-foil session alone costs $250+ at resorts. We include it with dolphins, snorkeling, and lunch — from $80.' },
  { icon: 'Heart', title: 'Community', desc: "Most guests come solo and leave with friends. One trip, and you'll want to tell everyone." },
];

export default function ExplorePage() {
  const { loadActivityBookings, setSelectedActivity } = useStore();

  useEffect(() => { loadActivityBookings(); }, []);

  const navigateToBooking = () => {
    const adventure = ACTIVITIES.find((a) => a.id === MALDIVES_ADVENTURE_ID);
    if (adventure) {
      setSelectedActivity(adventure);
      window.location.href = '/activities/maldives-adventure';
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
              Your Maldives<br />Adventure
            </h1>
            <p className="mt-3 text-lg text-white/90 lg:text-xl">
              5 hours. Dolphins, reefs, sandbank, e-foil.<br />All in one unforgettable day.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-xl bg-white/25 px-5 py-3 backdrop-blur-sm">
                <span className="text-xl font-bold text-white">$80</span>
                <span className="ml-2 text-white/80">/ person</span>
              </div>
              <Button
                title="Book Experience"
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
          <p className="mt-2 text-center text-xs text-muted">A day on the water with Boho Waves</p>
        </AnimatedDiv>

        {/* THE EXPERIENCE */}
        <section className="mt-16">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-3xl font-bold">One Day. Five Experiences.</h2>
            <p className="mt-2 text-muted">Everything the Maldives has to offer, packed into a single unforgettable day.</p>
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
            <h2 className="text-3xl font-bold">$80 / person</h2>
            <p className="mt-2 text-muted">One price. Everything included. No hidden fees.</p>
          </AnimatedDiv>

          {/* What's included */}
          <AnimatedDiv animation="fadeIn" delay={200} className="mt-6">
            <div className="rounded-2xl border border-border bg-secondary p-6 shadow-sm">
              <h3 className="mb-4 font-bold text-lg">Every trip includes:</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  '5-hour boat adventure',
                  'Dolphin swimming',
                  '2 snorkel reef stops + all gear',
                  'Private sandbank stop + picnic lunch',
                  'E-foil session for every guest (worth $150+)',
                  'Professional drone & 360-cam footage',
                  'Hotel pickup & drop-off',
                  'Drinks, snacks & refreshments all day',
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

        {/* FOR CABIN CREW */}
        <section className="mt-16">
          <AnimatedDiv animation="fadeIn">
            <div className="gradient-cta overflow-hidden rounded-2xl p-8 text-white shadow-lg lg:p-10">
              <div className="mb-4 flex items-center gap-3">
                <Icon name="Plane" size={24} color="white" />
                <h2 className="text-2xl font-bold">On a Layover in Malé?</h2>
              </div>
              <p className="text-white/90 leading-relaxed max-w-2xl">
                Boho Waves was started by a former airline crew member who knew there had to be a better way to experience the Maldives on a layover budget.
              </p>
              <p className="mt-3 text-white/90 leading-relaxed max-w-2xl">
                For $80, you and your crew get dolphins, snorkeling, a private sandbank, lunch, and an e-foil session — all in 5 hours, with pickup from your hotel.
              </p>
              <div className="mt-6">
                <Button href="/crew" title="Learn More" variant="ghost" rounded="full" className="border border-white/30 text-white hover:bg-white/10" iconEnd="ArrowRight" />
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
            <h2 className="text-3xl font-bold">What We&apos;re About</h2>
            <p className="mt-2 text-muted">Small groups. Big experiences. Real value.</p>
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
              <h2 className="text-2xl font-bold">Ready?</h2>
              <p className="mt-2 text-muted">Your best day in the Maldives is one click away.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <a
                  href="https://wa.me/960XXXXXXX?text=Hey!%20I'd%20like%20to%20book%20the%20Boho Waves%20Maldives%20Adventure."
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <Icon name="MessageCircle" size={20} color="white" />
                  Book via WhatsApp
                </a>
                <Button
                  title="Book Experience"
                  variant="cta"
                  rounded="full"
                  size="large"
                  iconEnd="ArrowRight"
                  onPress={navigateToBooking}
                />
              </div>
            </div>
          </AnimatedDiv>
        </section>
      </div>
    </div>
  );
}
