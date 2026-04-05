'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { ACTIVITIES, LOCAL_IMAGES } from '@/data/activities';
import { useStore } from '@/store/useStore';
import ImageCarousel from '@/components/ImageCarousel';

export default function BookPage() {
  const { setSelectedActivity } = useStore();
  const router = useRouter();

  const handleSelect = (activityId: string) => {
    const activity = ACTIVITIES.find((a) => a.id === activityId);
    if (activity) {
      setSelectedActivity(activity);
      router.push(`/book/${activityId}`);
    }
  };

  return (
    <div className="pb-20">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[350px]">
        <Image src={LOCAL_IMAGES.efoilMedium} alt="eFoil in the Maldives" fill className="object-cover" priority />
        <div className="gradient-hero absolute inset-0" />
        <div className="relative flex h-full flex-col justify-end p-6 lg:p-12">
          <div className="mx-auto w-full max-w-7xl">
            <AnimatedDiv animation="slideInBottom">
              <h1 className="text-4xl font-bold text-white lg:text-5xl">Book Your eFoil Lesson</h1>
              <p className="mt-3 max-w-xl text-lg text-white/90">
                Choose your location and fly over paradise. 60-minute sessions with certified instructors — beginners welcome.
              </p>
            </AnimatedDiv>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {/* Location cards */}
        <AnimatedDiv animation="fadeIn">
          <h2 className="text-2xl font-bold">Choose Your Location</h2>
          <p className="mt-2 text-muted">Two stunning locations across the Maldives.</p>
        </AnimatedDiv>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {ACTIVITIES.map((activity, i) => {
            const images = activity.media.map((m) => m.src || m.uri).filter(Boolean) as string[];
            const locationName = activity.id === 'efoil-hulhumale' ? 'Hulhumale' : 'Maafushi';

            return (
              <AnimatedDiv key={activity.id} animation="scaleIn" delay={100 + i * 100}>
                <div className="group overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm transition-shadow hover:shadow-md">
                  <ImageCarousel images={images} height={320} overlay={
                    <div className="gradient-overlay flex h-full flex-col justify-end p-6">
                      <div className="flex items-center gap-2">
                        <Icon name="MapPin" size={20} color="white" />
                        <h3 className="text-xl font-bold text-white">{locationName}</h3>
                      </div>
                      <p className="text-sm text-white/70">{activity.subtitle}</p>
                    </div>
                  } />
                  <div className="p-6">
                    <h3 className="text-lg font-bold">{activity.title}</h3>
                    <p className="mt-2 text-sm text-muted">{activity.meetingPoint}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Icon name="Star" size={14} color="#FFD700" />
                        <span className="text-sm font-medium">{activity.rating}</span>
                        <span className="text-xs text-muted">({activity.reviewCount} reviews)</span>
                      </div>
                      <span className="text-muted">·</span>
                      <span className="text-sm text-muted">{activity.durationMin} min</span>
                      <span className="text-muted">·</span>
                      <span className="text-sm font-semibold">${activity.priceFromUsd}/person</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {activity.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full border border-border px-2.5 py-0.5 text-xs">{tag}</span>
                      ))}
                    </div>

                    <div className="mt-6">
                      <Button
                        title={`Book at ${locationName}`}
                        variant="cta"
                        size="large"
                        rounded="full"
                        iconEnd="ArrowRight"
                        onPress={() => handleSelect(activity.id)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </AnimatedDiv>
            );
          })}
        </div>

        {/* Info section */}
        <AnimatedDiv animation="fadeIn" delay={300} className="mt-12">
          <div className="rounded-2xl border border-border bg-secondary p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-lg">Every lesson includes:</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                'eFoil board & all equipment',
                'Certified instructor (1-on-1 or 1-on-2)',
                'Safety gear — helmet & life jacket',
                '60-minute session',
                'Land briefing & water coaching',
                'Photos of your ride (on request)',
                'Wireless kill-switch safety system',
                'Calm lagoon conditions',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <Icon name="Check" size={16} color="#22C55E" className="mt-0.5 shrink-0" />
                  <span className="text-sm text-muted">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedDiv>

        {/* Partner CTA */}
        <AnimatedDiv animation="scaleIn" delay={400} className="mt-12">
          <div className="gradient-cta overflow-hidden rounded-2xl p-8 text-white shadow-lg lg:p-10">
            <div className="mb-4 flex items-center gap-3">
              <Icon name="Handshake" size={24} color="white" />
              <h2 className="text-2xl font-bold">Are You a Resort or Yacht Operator?</h2>
            </div>
            <p className="text-white/90 leading-relaxed max-w-2xl">
              Offer eFoil experiences to your guests with zero investment. We provide all equipment, training, and booking infrastructure. You earn revenue share from every session.
            </p>
            <div className="mt-6">
              <Button href="/partners" title="Learn About Partnerships" variant="ghost" rounded="full" className="border border-white/30 text-white hover:bg-white/10" iconEnd="ArrowRight" />
            </div>
          </div>
        </AnimatedDiv>
      </div>
    </div>
  );
}
