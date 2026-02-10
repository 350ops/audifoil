'use client';

import { cn } from '@/lib/utils';
import Icon from './Icon';
import type { FormattedTrip } from '@/data/tripsDb';

interface TripCardProps {
  trip: FormattedTrip;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function TripCard({ trip, isSelected, onSelect }: TripCardProps) {
  const isFull = trip.spotsRemaining === 0;

  return (
    <button
      onClick={onSelect}
      disabled={isFull}
      className={cn(
        'w-full rounded-2xl border p-4 text-left transition-all',
        isSelected
          ? 'border-highlight bg-highlight/5 shadow-md'
          : 'border-border bg-secondary hover:border-highlight/50 hover:shadow-sm',
        isFull && 'opacity-50 cursor-not-allowed'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', isSelected ? 'bg-highlight/20' : 'bg-background')}>
            <Icon name={trip.isSunset ? 'Sunset' : 'Sun'} size={20} color={isSelected ? '#FF0039' : undefined} />
          </div>
          <div>
            <p className="font-semibold">{trip.startTime} - {trip.endTime}</p>
            <p className="text-sm text-muted">{trip.dateLabel}</p>
          </div>
        </div>

        <div className="text-right">
          <p className={cn('text-lg font-bold', trip.isAtBasePrice ? 'text-green-500' : 'text-foreground')}>
            ${trip.pricePerPerson}
          </p>
          <p className="text-xs text-muted">per person</p>
        </div>
      </div>

      {/* Capacity bar */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: trip.maxSpots }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-6 w-6 rounded-full flex items-center justify-center text-xs',
                i < trip.bookedCount ? 'bg-highlight/20 text-highlight' : 'bg-background text-muted'
              )}
            >
              <Icon name="User" size={12} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          {trip.isPopular && (
            <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-500">Popular</span>
          )}
          {isFull ? (
            <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500">Full</span>
          ) : (
            <span className="text-xs text-muted">{trip.spotsRemaining} spot{trip.spotsRemaining !== 1 ? 's' : ''} left</span>
          )}
        </div>
      </div>

      {/* Price drop hint */}
      {!trip.isAtBasePrice && trip.guestsNeededForNextTier > 0 && (
        <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-1.5">
          <Icon name="TrendingDown" size={14} color="#22c55e" />
          <span className="text-xs font-medium text-green-600">
            {trip.guestsNeededForNextTier} more → ${trip.nextTierPrice}/person
          </span>
        </div>
      )}
    </button>
  );
}
