'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';
import TripCalendar from '@/components/TripCalendar';
import TripCard from '@/components/TripCard';
import { SkeletonTripCard } from '@/components/SkeletonLoader';
import { useStore } from '@/store/useStore';
import { formatDateLabel, type FormattedTrip } from '@/data/tripsDb';
import { PRICE_TIERS } from '@/data/pricing';

// Generate default local trips for a date (always available, 10:00 AM daily)
function generateLocalTrips(date: string, activity: { id: string; maxGuests: number; durationMin: number; priceFromUsd: number }): FormattedTrip[] {
  const durationH = activity.durationMin / 60;
  const endHour = 10 + durationH;
  const endTime = `${Math.floor(endHour).toString().padStart(2, '0')}:${((endHour % 1) * 60).toString().padStart(2, '0')}`;

  return [
    {
      id: `local-${date}-10`,
      activityId: activity.id,
      startTime: '10:00',
      endTime,
      date,
      dateLabel: formatDateLabel(date),
      spotsRemaining: activity.maxGuests,
      maxSpots: activity.maxGuests,
      isPrivate: false,
      isSunset: false,
      isPopular: true,
      price: PRICE_TIERS.BASE,
      bookedBy: [],
      bookedCount: 0,
      pricePerPerson: PRICE_TIERS.BASE,
      nextTierPrice: PRICE_TIERS.BASE,
      guestsNeededForNextTier: 0,
      isAtBasePrice: true,
      bookingStatus: 'open',
    },
  ];
}

export default function SelectTimePage() {
  const router = useRouter();
  const {
    selectedActivity, dbActivity, dbTrips, tripsLoading, datesWithTrips,
    guestCount, setGuestCount, fetchDbActivity, fetchTripsForDate, fetchDatesWithTrips,
    setDbTrips,
  } = useStore();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<FormattedTrip | null>(null);
  const [localLoading, setLocalLoading] = useState(false);

  const activity = selectedActivity;

  useEffect(() => {
    if (activity && !dbActivity) {
      fetchDbActivity(activity.id);
    }
  }, [activity, dbActivity]);

  useEffect(() => {
    if (dbActivity) {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 60);
      fetchDatesWithTrips(today.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
    }
  }, [dbActivity]);

  const handleSelectDate = async (date: string) => {
    setSelectedDate(date);
    setSelectedTrip(null);
    setLocalLoading(true);

    // Try fetching from DB first
    const trips = await fetchTripsForDate(date);

    // If DB returned nothing, generate local fallback trips
    if ((!trips || trips.length === 0) && activity) {
      const localTrips = generateLocalTrips(date, {
        id: activity.id,
        maxGuests: activity.maxGuests,
        durationMin: activity.durationMin,
        priceFromUsd: activity.priceFromUsd,
      });
      setDbTrips(localTrips);
    }
    setLocalLoading(false);
  };

  const handleContinue = () => {
    if (selectedTrip) {
      router.push('/booking/checkout');
    }
  };

  if (!activity) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">No activity selected</h2>
          <Button href="/activities" title="Browse Activities" variant="outline" className="mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32">
      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <AnimatedDiv animation="fadeIn">
          <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors">
            <Icon name="ArrowLeft" size={16} /> Back
          </button>
          <h1 className="text-2xl font-bold lg:text-3xl">Select Date & Time</h1>
          <p className="mt-1 text-muted">{activity.title} · {activity.durationMin / 60}h</p>
        </AnimatedDiv>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Calendar */}
          <AnimatedDiv animation="fadeIn" delay={100}>
            <TripCalendar
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              datesWithTrips={datesWithTrips}
              allDatesAvailable
            />
          </AnimatedDiv>

          {/* Trip slots */}
          <div>
            <AnimatedDiv animation="fadeIn" delay={150}>
              <h2 className="mb-4 text-lg font-semibold">
                {selectedDate ? `Available trips` : 'Select a date'}
              </h2>
            </AnimatedDiv>

            {!selectedDate && (
              <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border">
                <p className="text-muted">Pick a date to see available trip times</p>
              </div>
            )}

            {selectedDate && (tripsLoading || localLoading) && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <SkeletonTripCard key={i} />)}
              </div>
            )}

            {selectedDate && !tripsLoading && !localLoading && dbTrips.length === 0 && (
              <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border">
                <p className="text-muted">No trips available for this date</p>
              </div>
            )}

            {selectedDate && !tripsLoading && !localLoading && dbTrips.length > 0 && (
              <div className="space-y-3">
                {dbTrips.map((trip) => (
                  <AnimatedDiv key={trip.id} animation="scaleIn" delay={50}>
                    <TripCard
                      trip={trip}
                      isSelected={selectedTrip?.id === trip.id}
                      onSelect={() => setSelectedTrip(trip)}
                    />
                  </AnimatedDiv>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Guest count */}
        {selectedTrip && (
          <AnimatedDiv animation="slideInBottom" delay={100} className="mt-8">
            <div className="rounded-2xl border border-border bg-secondary p-5">
              <h3 className="font-semibold">Number of Guests</h3>
              <div className="mt-3 flex items-center gap-4">
                <button
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-background transition-colors"
                >
                  <Icon name="Minus" size={16} />
                </button>
                <span className="text-2xl font-bold">{guestCount}</span>
                <button
                  onClick={() => setGuestCount(Math.min(selectedTrip.spotsRemaining, guestCount + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-background transition-colors"
                >
                  <Icon name="Plus" size={16} />
                </button>
                <span className="text-sm text-muted">({selectedTrip.spotsRemaining} spots available)</span>
              </div>
            </div>
          </AnimatedDiv>
        )}
      </div>

      {/* Sticky bottom CTA */}
      {selectedTrip && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-secondary/90 p-4 backdrop-blur-xl">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <div>
              <span className="text-2xl font-bold">${selectedTrip.pricePerPerson * guestCount}</span>
              <span className="text-sm text-muted"> total · ${selectedTrip.pricePerPerson}/person × {guestCount}</span>
            </div>
            <Button title="Continue to Checkout" variant="cta" size="large" rounded="full" onPress={handleContinue} iconEnd="ArrowRight" />
          </div>
        </div>
      )}
    </div>
  );
}
