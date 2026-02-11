'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { ACTIVITIES, EXPERIENCE_HIGHLIGHTS, KAYAK_ADDON, JET_SKI_ADDON, MEDIA_PACKAGE, LOCAL_IMAGES, MALDIVES_ADVENTURE_ID } from '@/data/activities';
import { useStore } from '@/store/useStore';
import ImageCarousel from '@/components/ImageCarousel';
import VideoPreview from '@/components/VideoPreview';

const MEDIA_VIDEOS = [
  { src: '/videos/foiling-maldives.mp4', label: 'Water sports in the Maldives' },
  { src: '/videos/gliding.mp4', label: 'Gliding across the lagoon' },
  { src: '/videos/boat-trip.mov', label: 'On the boat' },
];

export default function ActivitiesPage() {
  const { setSelectedActivity } = useStore();
  const router = useRouter();
  const adventure = ACTIVITIES.find((a) => a.id === MALDIVES_ADVENTURE_ID);

  const handleBook = () => {
    if (adventure) {
      setSelectedActivity(adventure);
      router.push('/booking/select-time');
    }
  };

  return (
    <div className="pb-20">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Header */}
        <AnimatedDiv animation="fadeIn">
          <h1 className="text-3xl font-bold lg:text-4xl">Our Excursions & Water Sports</h1>
          <p className="mt-2 text-muted max-w-2xl">
            From full-day island adventures to thrilling jet ski rides — discover the best of the Maldives with our curated experiences.
          </p>
        </AnimatedDiv>

        {/* Experience Highlights */}
        <div className="mt-10 space-y-12">
          {EXPERIENCE_HIGHLIGHTS.map((highlight, index) => (
            <AnimatedDiv key={highlight.id} animation="fadeIn" delay={100 + index * 80}>
              <div className="overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm">
                <ImageCarousel images={highlight.images} height={320} overlay={
                  <div className="gradient-overlay flex h-full flex-col justify-end p-6">
                    <div className="flex items-center gap-2">
                      <Icon name={highlight.icon} size={20} color="white" />
                      <h3 className="text-xl font-bold text-white">{highlight.title}</h3>
                    </div>
                    <p className="text-sm text-white/70">{highlight.subtitle}</p>
                  </div>
                } />
                <div className="p-6">
                  <p className="text-muted leading-relaxed">{highlight.description}</p>
                </div>
              </div>
            </AnimatedDiv>
          ))}
        </div>

        {/* Thrilling Water Sports */}
        <AnimatedDiv animation="fadeIn" delay={500} className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Thrilling Water Sports</h2>
          <p className="text-muted mb-8">Glide, fly, dive — and truly experience the Maldivian waters with our certified instructors and safety-first approach.</p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Kayak */}
            <div className="overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm">
              <ImageCarousel images={KAYAK_ADDON.images} height={280} overlay={
                <div className="gradient-overlay flex h-full flex-col justify-end p-6">
                  <div className="flex items-center gap-2">
                    <Icon name="Ship" size={20} color="white" />
                    <h3 className="text-xl font-bold text-white">{KAYAK_ADDON.title}</h3>
                  </div>
                  <p className="text-sm text-white/70">From ${KAYAK_ADDON.priceUsd} · {KAYAK_ADDON.durationLabel}</p>
                </div>
              } />
              <div className="p-6">
                <p className="text-muted leading-relaxed">{KAYAK_ADDON.description}</p>
                <div className="mt-4 space-y-2">
                  {KAYAK_ADDON.includes.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Icon name="Check" size={14} color="#22C55E" />
                      <span className="text-sm text-muted">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Jet Ski */}
            <div className="overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm">
              <ImageCarousel images={JET_SKI_ADDON.images} height={280} overlay={
                <div className="gradient-overlay flex h-full flex-col justify-end p-6">
                  <div className="flex items-center gap-2">
                    <Icon name="Zap" size={20} color="white" />
                    <h3 className="text-xl font-bold text-white">{JET_SKI_ADDON.title}</h3>
                  </div>
                  <p className="text-sm text-white/70">From ${JET_SKI_ADDON.priceUsd} · {JET_SKI_ADDON.durationLabel}</p>
                </div>
              } />
              <div className="p-6">
                <p className="text-muted leading-relaxed">{JET_SKI_ADDON.description}</p>
                <div className="mt-4 space-y-2">
                  {JET_SKI_ADDON.includes.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Icon name="Check" size={14} color="#22C55E" />
                      <span className="text-sm text-muted">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedDiv>

        {/* Media Content */}
        <AnimatedDiv animation="fadeIn" delay={550} className="mt-12">
          <div className="rounded-2xl border border-border bg-secondary p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <Icon name="Camera" size={22} color="#FF0039" />
              <h3 className="text-xl font-bold">{MEDIA_PACKAGE.title}</h3>
            </div>
            <p className="text-muted leading-relaxed">{MEDIA_PACKAGE.description}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {MEDIA_VIDEOS.map((video, i) => (
                <div key={i}>
                  <VideoPreview src={video.src} height={180} rounded={12} />
                  <p className="mt-2 text-xs text-muted">{video.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {MEDIA_PACKAGE.equipment.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-highlight/10">
                    <Icon name={item.icon} size={16} color="#FF0039" />
                  </div>
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-highlight/5 p-4">
              <div className="flex items-start gap-2">
                <Icon name="Info" size={16} color="#FF0039" className="mt-0.5 shrink-0" />
                <span className="text-sm text-highlight">{MEDIA_PACKAGE.note}</span>
              </div>
            </div>
          </div>
        </AnimatedDiv>

        {/* All Activities Grid */}
        <section className="mt-16">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-2xl font-bold">All Excursions & Services</h2>
            <p className="mt-2 text-muted">Choose from our curated collection.</p>
          </AnimatedDiv>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ACTIVITIES.map((activity) => (
              <AnimatedDiv key={activity.id} animation="scaleIn" delay={100}>
                <Link
                  href={`/activities/${activity.id}`}
                  onClick={() => setSelectedActivity(activity)}
                  className="group block overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={activity.media[0]?.src || activity.media[0]?.uri || LOCAL_IMAGES.boat}
                      alt={activity.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {activity.isFeatured && (
                      <span className="absolute left-3 top-3 rounded-full bg-highlight px-2.5 py-0.5 text-xs font-medium text-white">Featured</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{activity.title}</h3>
                    <p className="mt-1 text-sm text-muted line-clamp-1">{activity.subtitle}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-bold">From ${activity.priceFromUsd}</span>
                      <div className="flex items-center gap-1">
                        <Icon name="Star" size={14} color="#FFD700" />
                        <span className="text-sm">{activity.rating}</span>
                        <span className="text-xs text-muted">({activity.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedDiv>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <AnimatedDiv animation="scaleIn" delay={200} className="mt-12">
          <div className="rounded-2xl border border-border bg-secondary p-8 text-center shadow-sm">
            <h2 className="text-2xl font-bold">Find Your Perfect Excursion in Minutes</h2>
            <p className="mt-2 text-muted">Dolphins, snorkeling, sandbanks, sunset cruises, island tours — unforgettable memories await.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/9607772241?text=Hey!%20I'd%20like%20to%20book%20an%20excursion%20with%20Maldives%20Water%20Sports."
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white hover:opacity-90 transition-opacity"
              >
                <Icon name="MessageCircle" size={20} color="white" />
                Book via WhatsApp
              </a>
              <Button href="/activities/south-ari-atoll" title="Book the Adventure" variant="cta" size="large" rounded="full" iconEnd="ArrowRight" />
            </div>
          </div>
        </AnimatedDiv>
      </div>

      {/* Sticky Book Footer */}
      {adventure && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-secondary/90 p-4 backdrop-blur-xl lg:hidden z-50">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
            <div>
              <span className="text-2xl font-bold text-highlight">${adventure.priceFromUsd}</span>
              <span className="text-sm text-muted"> / person</span>
            </div>
            <Button title="Book Now" variant="cta" size="large" rounded="full" onPress={handleBook} iconEnd="ArrowRight" />
          </div>
        </div>
      )}
    </div>
  );
}
