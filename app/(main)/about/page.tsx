'use client';

import Image from 'next/image';
import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { LOCAL_IMAGES } from '@/data/activities';

export default function AboutPage() {
  return (
    <div className="pb-20">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[350px]">
        <Image src={LOCAL_IMAGES.efoilMedium} alt="eFoil Maldives team" fill className="object-cover" priority />
        <div className="gradient-hero absolute inset-0" />
        <div className="relative flex h-full flex-col justify-end p-6 lg:p-12">
          <div className="mx-auto w-full max-w-7xl">
            <div className="flex items-center gap-3">
              <Icon name="Info" size={28} color="white" />
              <h1 className="text-4xl font-bold text-white lg:text-5xl">About eFoil Maldives</h1>
            </div>
            <p className="mt-3 max-w-2xl text-lg text-white/90">
              Bringing the future of water sports to paradise — for riders and partners alike.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Our Mission */}
        <section className="mt-12">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="mt-4 text-muted leading-relaxed max-w-3xl">
              eFoil Maldives exists to make the world&apos;s most exciting water sport accessible to everyone visiting the Maldives. Whether you&apos;re a first-time rider stepping onto a board for the first time, or a resort looking to offer something truly extraordinary to your guests — we make it happen with zero friction and zero risk.
            </p>
          </AnimatedDiv>
        </section>

        {/* What sets us apart */}
        <section className="mt-12">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-2xl font-bold">What Sets Us Apart</h2>
            <p className="mt-2 text-muted">Three pillars that define our approach.</p>
          </AnimatedDiv>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Certified Instructors', desc: 'Every session is led by a trained, certified eFoil instructor who knows the local waters and conditions.', icon: 'Award' },
              { title: 'Premium Equipment', desc: 'We use the latest eFoil boards with wireless kill-switches, extended battery life, and safety-first design.', icon: 'Wrench' },
              { title: 'Partner-First Model', desc: 'We build partnerships, not competition. Resorts, yachts, and watersport centers earn from every booking.', icon: 'Handshake' },
            ].map((item, i) => (
              <AnimatedDiv key={item.title} animation="scaleIn" delay={100 + i * 60}>
                <div className="rounded-2xl border border-border bg-secondary p-5 shadow-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-highlight/10">
                    <Icon name={item.icon} size={20} color="#FF0039" />
                  </div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted">{item.desc}</p>
                </div>
              </AnimatedDiv>
            ))}
          </div>
        </section>

        {/* Our Vision */}
        <section className="mt-12">
          <AnimatedDiv animation="fadeIn">
            <div className="gradient-cta rounded-2xl p-8 text-white lg:p-10">
              <h2 className="text-2xl font-bold">Our Vision</h2>
              <p className="mt-3 text-white/90 max-w-2xl leading-relaxed">
                We envision a Maldives where every resort, every yacht, and every island has access to eFoil experiences. A network of partner locations where any visitor can book a session, learn to fly, and create memories that last a lifetime — all powered by a revenue-share model that benefits everyone.
              </p>
              <p className="mt-4 text-white/80 text-sm">
                From Hulhumale to the southern atolls, we&apos;re building the largest eFoil network in the Indian Ocean.
              </p>
              <div className="mt-6">
                <Button title="Become a Partner" variant="ghost" size="large" rounded="full"
                  className="border-2 border-white text-white hover:bg-white/10"
                  iconEnd="ArrowRight" href="/partners" />
              </div>
            </div>
          </AnimatedDiv>
        </section>

        {/* Contact Info */}
        <section className="mt-12">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-2xl font-bold">Get In Touch</h2>
          </AnimatedDiv>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatedDiv animation="scaleIn" delay={100}>
              <div className="rounded-2xl border border-border bg-secondary p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="MapPin" size={20} color="#FF0039" />
                  <h3 className="font-bold">Our Locations</h3>
                </div>
                <p className="text-sm text-muted">Hulhumale Beach<br />Maafushi Island<br />Maldives</p>
              </div>
            </AnimatedDiv>
            <AnimatedDiv animation="scaleIn" delay={160}>
              <div className="rounded-2xl border border-border bg-secondary p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="MessageCircle" size={20} color="#FF0039" />
                  <h3 className="font-bold">WhatsApp</h3>
                </div>
                <a href="https://wa.me/9607772241" target="_blank" rel="noopener noreferrer" className="text-sm text-highlight hover:underline">+960 7772241</a>
              </div>
            </AnimatedDiv>
            <AnimatedDiv animation="scaleIn" delay={220}>
              <div className="rounded-2xl border border-border bg-secondary p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="Globe" size={20} color="#FF0039" />
                  <h3 className="font-bold">Follow Us</h3>
                </div>
                <div className="flex gap-4 text-sm text-muted">
                  <span>Instagram</span>
                  <span>TikTok</span>
                  <span>YouTube</span>
                </div>
              </div>
            </AnimatedDiv>
          </div>
        </section>
      </div>
    </div>
  );
}
