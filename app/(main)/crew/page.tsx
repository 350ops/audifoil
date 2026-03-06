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
        <Image src={LOCAL_IMAGES.crewOnABoat} alt="Maldives Water Sports team" fill className="object-cover" priority />
        <div className="gradient-hero absolute inset-0" />
        <div className="relative flex h-full flex-col justify-end p-6 lg:p-12">
          <div className="mx-auto w-full max-w-7xl">
            <div className="flex items-center gap-3">
              <Icon name="Info" size={28} color="white" />
              <h1 className="text-4xl font-bold text-white lg:text-5xl">About Us</h1>
            </div>
            <p className="mt-3 max-w-2xl text-lg text-white/90">
              Your trusted partner for world-class ocean activities, unforgettable memories, and unmatched service in the heart of paradise.
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
              At Maldives Water Sports, we believe every traveler deserves to experience the magic of the Maldives. Whether it&apos;s a romantic honeymoon, a family adventure, or a peaceful solo retreat, we design every excursion to create unforgettable memories with personalized service and a safety-first approach.
            </p>
          </AnimatedDiv>
        </section>

        {/* What sets us apart */}
        <section className="mt-12">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-2xl font-bold">What Sets Us Apart</h2>
            <p className="mt-2 text-muted">Three pillars that define our service.</p>
          </AnimatedDiv>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Expert Local Guides', desc: 'Our team knows Maldivian waters, reefs, and safety protocols inside and out.', icon: 'Map' },
              { title: 'Modern & Well-Maintained Equipment', desc: 'Boats, jet skis, and diving gear regularly serviced for your safety and comfort.', icon: 'Wrench' },
              { title: 'Personalized & Friendly Service', desc: 'We customize activities based on your interests, schedule, and budget.', icon: 'Heart' },
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
              <h2 className="text-2xl font-bold">Our Experiences</h2>
              <p className="mt-3 text-white/90 max-w-2xl leading-relaxed">
                From full-day South Ari Atoll adventures with dolphins and sandbanks, to sunset fishing trips, cruise excursions, Maafushi Island tours, resort day visits, and thrilling water sports — we offer the complete Maldives experience.
              </p>
              <p className="mt-4 text-white/80 text-sm">
                Whether you&apos;re seeking adventure or relaxation, our team will help you find the perfect excursion tailored to your desires.
              </p>
              <div className="mt-6">
                <Button title="Browse Excursions" variant="ghost" size="large" rounded="full"
                  className="border-2 border-white text-white hover:bg-white/10"
                  iconEnd="ArrowRight" href="/activities" />
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
