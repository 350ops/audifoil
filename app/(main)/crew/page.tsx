'use client';

import Image from 'next/image';
import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { LOCAL_IMAGES, ACTIVITIES, MALDIVES_ADVENTURE_ID } from '@/data/activities';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();
  const { setSelectedActivity } = useStore();

  const handleBookNow = () => {
    const adventure = ACTIVITIES.find((a) => a.id === MALDIVES_ADVENTURE_ID);
    if (adventure) {
      setSelectedActivity(adventure);
      router.push('/booking/select-time');
    }
  };

  return (
    <div className="pb-20">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[350px]">
        <Image src={LOCAL_IMAGES.crewOnABoat} alt="A captain on his boat in Hulhumalé" fill className="object-cover" priority />
        <div className="gradient-hero absolute inset-0" />
        <div className="relative flex h-full flex-col justify-end p-6 lg:p-12">
          <div className="mx-auto w-full max-w-7xl">
            <div className="flex items-center gap-3">
              <Icon name="Info" size={28} color="white" />
              <h1 className="text-4xl font-bold text-white lg:text-5xl">About maldivian.tours</h1>
            </div>
            <p className="mt-3 max-w-2xl text-lg text-white/90">
              A direct link between Hulhumalé&apos;s captains and travellers — without the resort markup or the agency middleman.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Our Mission */}
        <section className="mt-12">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-2xl font-bold">Why we built this</h2>
            <p className="mt-4 text-muted leading-relaxed max-w-3xl">
              Hulhumalé Phase 2 is full of fishing boats. They head out at night, dock back around 4 or 5 in the morning, and then sit idle for most of the day. Meanwhile tourists, expats and airline crew are paying resort prices for the same trips these boats already do. maldivian.tours is the bridge — a curated, verified marketplace where captains list their boats and travellers book directly.
            </p>
          </AnimatedDiv>
        </section>

        {/* What sets us apart */}
        <section className="mt-12">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-2xl font-bold">What makes us different</h2>
            <p className="mt-2 text-muted">Three things we won&apos;t compromise on.</p>
          </AnimatedDiv>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Real local captains', desc: 'Every captain is a Hulhumalé fisherman with their own ID-verified boat. No outsourced agencies, no anonymous operators.', icon: 'Map' },
              { title: 'A clear safety floor', desc: 'Boat registration on file, life jackets for everyone on board, weather-cancellation policy you can actually rely on.', icon: 'Shield' },
              { title: 'Transparent pricing', desc: 'You pay the captain&apos;s rate plus a small platform fee. No hidden commissions, no resort surcharges.', icon: 'Heart' },
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

        {/* Our Experiences */}
        <section className="mt-12">
          <AnimatedDiv animation="fadeIn">
            <div className="gradient-cta rounded-2xl p-8 text-white lg:p-10">
              <h2 className="text-2xl font-bold">For boat owners</h2>
              <p className="mt-3 text-white/90 max-w-2xl leading-relaxed">
                If you own a boat docked in Hulhumalé Phase 2, your boat probably sits idle from morning to late afternoon. List it on maldivian.tours and earn from those hours. We handle the bookings, payments and customer support — you just show up at the dock.
              </p>
              <p className="mt-4 text-white/80 text-sm">
                We verify your ID and boat registration, then your boat goes live with its own profile, calendar and reviews.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button title="List your boat" variant="ghost" size="large" rounded="full"
                  className="border-2 border-white text-white hover:bg-white/10"
                  iconEnd="ArrowRight" href="/host" />
                <Button title="Browse experiences" variant="ghost" size="large" rounded="full"
                  className="border border-white/40 text-white hover:bg-white/10"
                  href="/activities" />
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
                  <h3 className="font-bold">Our Location</h3>
                </div>
                <p className="text-sm text-muted">Nirolu magu 11, Lot 11549<br />Hulhumalé, Maldives</p>
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
                  <span>Facebook</span>
                  <span>Instagram</span>
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
