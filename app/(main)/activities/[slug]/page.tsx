'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import Image from 'next/image';
import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import ImageCarousel from '@/components/ImageCarousel';
import { ACTIVITIES, LOCAL_IMAGES } from '@/data/activities';
import { useStore } from '@/store/useStore';

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { setSelectedActivity } = useStore();

  const activity = useMemo(() => ACTIVITIES.find((a) => a.id === slug), [slug]);

  if (!activity) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Activity not found</h2>
          <Button href="/activities" title="Back to Activities" variant="outline" className="mt-4" />
        </div>
      </div>
    );
  }

  const images = activity.media.map((m) => m.src || m.uri).filter(Boolean) as string[];

  const handleBook = () => {
    setSelectedActivity(activity);
    router.push('/booking/select-time');
  };

  return (
    <div className="pb-20">
      {/* Hero carousel */}
      <ImageCarousel images={images} height={480} className="lg:rounded-b-3xl" />

      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        {/* Title section */}
        <AnimatedDiv animation="slideInBottom" delay={100} className="mt-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold lg:text-4xl">{activity.title}</h1>
              <p className="mt-2 text-lg text-muted">{activity.subtitle}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  <Icon name="Star" size={16} color="#FFD700" />
                  <span className="font-medium">{activity.rating}</span>
                  <span className="text-sm text-muted">({activity.reviewCount} reviews)</span>
                </div>
                <span className="text-muted">·</span>
                <span className="text-sm text-muted">{activity.durationMin / 60}h · {activity.maxGuests} guests max</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-highlight">From ${activity.priceFromUsd}</div>
              <p className="text-sm text-muted">per person</p>
            </div>
          </div>
        </AnimatedDiv>

        {/* Tags */}
        <AnimatedDiv animation="fadeIn" delay={150} className="mt-6">
          <div className="flex flex-wrap gap-2">
            {activity.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-border bg-secondary px-3 py-1 text-sm">{tag}</span>
            ))}
          </div>
        </AnimatedDiv>

        {/* Highlights */}
        <AnimatedDiv animation="fadeIn" delay={200} className="mt-8">
          <h2 className="text-xl font-bold">Highlights</h2>
          <div className="mt-4 space-y-3">
            {activity.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-3">
                <Icon name="Sparkles" size={16} color="#FF0039" className="mt-1 shrink-0" />
                <span className="text-muted">{h}</span>
              </div>
            ))}
          </div>
        </AnimatedDiv>

        {/* What you'll do */}
        <AnimatedDiv animation="fadeIn" delay={250} className="mt-8">
          <h2 className="text-xl font-bold">What You&apos;ll Do</h2>
          <div className="mt-4 space-y-4">
            {activity.whatYoullDo.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-highlight text-sm font-bold text-white">{i + 1}</div>
                <p className="text-muted pt-1">{item}</p>
              </div>
            ))}
          </div>
        </AnimatedDiv>

        {/* What's included */}
        <AnimatedDiv animation="fadeIn" delay={300} className="mt-8">
          <h2 className="text-xl font-bold">What&apos;s Included</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {activity.included.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon name="Check" size={16} color="#22C55E" />
                <span className="text-sm text-muted">{item}</span>
              </div>
            ))}
          </div>
        </AnimatedDiv>

        {/* Safety */}
        <AnimatedDiv animation="fadeIn" delay={350} className="mt-8">
          <h2 className="text-xl font-bold">Safety</h2>
          <div className="mt-4 space-y-2">
            {activity.safety.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon name="Shield" size={16} color="#3B82F6" />
                <span className="text-sm text-muted">{item}</span>
              </div>
            ))}
          </div>
        </AnimatedDiv>

        {/* Meeting point */}
        <AnimatedDiv animation="fadeIn" delay={400} className="mt-8">
          <div className="rounded-2xl border border-border bg-secondary p-5">
            <div className="flex items-center gap-3">
              <Icon name="MapPin" size={20} color="#FF0039" />
              <div>
                <h3 className="font-semibold">Meeting Point</h3>
                <p className="text-sm text-muted">{activity.meetingPoint}</p>
              </div>
            </div>
          </div>
        </AnimatedDiv>

        {/* Book CTA - sticky bottom */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-secondary/90 p-4 backdrop-blur-xl lg:static lg:mt-10 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 lg:rounded-2xl lg:border lg:border-border lg:bg-secondary lg:p-6 lg:shadow-sm">
            <div>
              <span className="text-2xl font-bold text-highlight">${activity.priceFromUsd}</span>
              <span className="text-sm text-muted"> / person</span>
            </div>
            <Button title="Book Now" variant="cta" size="large" rounded="full" onPress={handleBook} iconEnd="ArrowRight" />
          </div>
        </div>
      </div>
    </div>
  );
}
