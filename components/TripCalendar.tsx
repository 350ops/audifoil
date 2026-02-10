'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface TripCalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  datesWithTrips?: string[];
  allDatesAvailable?: boolean;
}

export default function TripCalendar({ selectedDate, onSelectDate, datesWithTrips = [], allDatesAvailable = false }: TripCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result: { date: string; day: number; isPast: boolean; hasTrips: boolean; isToday: boolean }[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dateStr = date.toISOString().split('T')[0];
      result.push({
        date: dateStr,
        day: d,
        isPast: date < today,
        hasTrips: allDatesAvailable ? !(date < today) : datesWithTrips.includes(dateStr),
        isToday: date.getTime() === today.getTime(),
      });
    }

    return { days: result, startOffset };
  }, [currentMonth, datesWithTrips]);

  const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="rounded-2xl border border-border bg-secondary p-4">
      {/* Month navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="rounded-lg p-2 hover:bg-background transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <span className="font-semibold">{monthLabel}</span>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="rounded-lg p-2 hover:bg-background transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>

      {/* Day labels */}
      <div className="mb-2 grid grid-cols-7 text-center text-xs font-medium text-muted">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: days.startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.days.map(({ date, day, isPast, hasTrips, isToday }) => (
          <button
            key={date}
            onClick={() => !isPast && onSelectDate(date)}
            disabled={isPast}
            className={cn(
              'relative flex h-10 items-center justify-center rounded-lg text-sm transition-all',
              isPast && 'text-muted/40 cursor-not-allowed',
              !isPast && 'hover:bg-highlight/10 cursor-pointer',
              selectedDate === date && 'bg-highlight text-white font-bold hover:bg-highlight',
              isToday && selectedDate !== date && 'font-bold ring-1 ring-highlight/50',
            )}
          >
            {day}
            {hasTrips && selectedDate !== date && (
              <span className="absolute bottom-1 h-1 w-1 rounded-full bg-highlight" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
