import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

import Icon from '@/components/Icon';
import ThemedText from '@/components/ThemedText';
import useThemeColors from '@/contexts/ThemeColors';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface TripCalendarProps {
  /** Dates that have trips with availability (YYYY-MM-DD) */
  datesWithTrips?: string[];
  /** Currently selected date (YYYY-MM-DD) */
  value?: string | null;
  /** Called when user selects a date */
  onChange: (dateStr: string) => void;
  /** Loading state while fetching trip availability */
  loading?: boolean;
  /** Minimum selectable date (default: today) */
  minDate?: string;
  /** Maximum selectable date (default: 90 days from today) */
  maxDate?: string;
  className?: string;
}

function toDateKey(year: number, month: number, day: number): string {
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstWeekday(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function getToday(): string {
  const now = new Date();
  return toDateKey(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr + 'T12:00:00');
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

export function TripCalendar({
  datesWithTrips = [],
  value,
  onChange,
  loading = false,
  minDate,
  maxDate,
  className = '',
}: TripCalendarProps) {
  const colors = useThemeColors();

  // Default min/max dates
  const effectiveMinDate = minDate ?? getToday();
  const effectiveMaxDate = maxDate ?? addDays(getToday(), 90);

  // Set of dates with available trips
  const tripDatesSet = useMemo(() => new Set(datesWithTrips), [datesWithTrips]);

  // Initialize view to current month or selected value's month
  const [viewYear, setViewYear] = useState(() => {
    if (value) {
      return parseInt(value.slice(0, 4), 10);
    }
    return new Date().getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    if (value) {
      return parseInt(value.slice(5, 7), 10) - 1;
    }
    return new Date().getMonth();
  });

  // Build calendar grid
  const grid = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstWeekday = getFirstWeekday(viewYear, viewMonth);
    const cells: {
      day: number | null;
      dateStr: string | null;
      isSelectable: boolean;
      hasTrips: boolean;
      isToday: boolean;
    }[] = [];

    // Empty cells for days before first of month
    for (let i = 0; i < firstWeekday; i++) {
      cells.push({
        day: null,
        dateStr: null,
        isSelectable: false,
        hasTrips: false,
        isToday: false,
      });
    }

    const today = getToday();

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = toDateKey(viewYear, viewMonth + 1, day);
      const isInRange = dateStr >= effectiveMinDate && dateStr <= effectiveMaxDate;
      const hasTrips = tripDatesSet.has(dateStr);
      const isToday = dateStr === today;

      cells.push({
        day,
        dateStr,
        isSelectable: isInRange,
        hasTrips,
        isToday,
      });
    }

    return cells;
  }, [viewYear, viewMonth, effectiveMinDate, effectiveMaxDate, tripDatesSet]);

  // Navigation constraints
  const canPrev = useMemo(() => {
    const minYear = parseInt(effectiveMinDate.slice(0, 4), 10);
    const minMonth = parseInt(effectiveMinDate.slice(5, 7), 10) - 1;
    return viewYear > minYear || (viewYear === minYear && viewMonth > minMonth);
  }, [effectiveMinDate, viewYear, viewMonth]);

  const canNext = useMemo(() => {
    const maxYear = parseInt(effectiveMaxDate.slice(0, 4), 10);
    const maxMonth = parseInt(effectiveMaxDate.slice(5, 7), 10) - 1;
    return viewYear < maxYear || (viewYear === maxYear && viewMonth < maxMonth);
  }, [effectiveMaxDate, viewYear, viewMonth]);

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  return (
    <View className={`rounded-2xl border border-border bg-secondary p-4 ${className}`}>
      {/* Header with month navigation */}
      <View className="mb-4 flex-row items-center justify-between">
        <Pressable
          onPress={canPrev ? goPrev : undefined}
          disabled={!canPrev}
          className="-ml-2 p-2"
          hitSlop={12}>
          <Icon name="ChevronLeft" size={24} color={canPrev ? colors.text : colors.placeholder} />
        </Pressable>
        <View className="flex-row items-center">
          <ThemedText className="text-lg font-semibold" style={{ color: colors.text }}>
            {MONTHS[viewMonth]} {viewYear}
          </ThemedText>
          {loading && <ActivityIndicator size="small" color={colors.highlight} className="ml-2" />}
        </View>
        <Pressable
          onPress={canNext ? goNext : undefined}
          disabled={!canNext}
          className="-mr-2 p-2"
          hitSlop={12}>
          <Icon name="ChevronRight" size={24} color={canNext ? colors.text : colors.placeholder} />
        </Pressable>
      </View>

      {/* Weekday headers */}
      <View className="mb-2 flex-row">
        {WEEKDAYS.map((d) => (
          <View key={d} className="flex-1 items-center">
            <ThemedText className="text-xs font-medium" style={{ color: colors.textMuted }}>
              {d}
            </ThemedText>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View className="flex-row flex-wrap">
        {grid.map((cell, i) => (
          <View key={i} className="aspect-square w-[14.28%] items-center justify-center p-0.5">
            {cell.day === null ? (
              <View />
            ) : (
              <Pressable
                onPress={cell.isSelectable ? () => onChange(cell.dateStr!) : undefined}
                disabled={!cell.isSelectable}
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{
                  backgroundColor:
                    value === cell.dateStr
                      ? colors.highlight
                      : cell.isToday
                        ? colors.border
                        : 'transparent',
                  opacity: cell.isSelectable ? 1 : 0.35,
                }}>
                <ThemedText
                  className="text-base font-medium"
                  style={{
                    color:
                      value === cell.dateStr
                        ? '#ffffff'
                        : cell.isSelectable
                          ? colors.text
                          : colors.textMuted,
                  }}>
                  {cell.day}
                </ThemedText>
                {/* Availability indicator dot */}
                {cell.hasTrips && value !== cell.dateStr && (
                  <View
                    className="absolute bottom-1 h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: colors.highlight }}
                  />
                )}
              </Pressable>
            )}
          </View>
        ))}
      </View>

      {/* Legend */}
      <View className="mt-4 flex-row items-center justify-center gap-4">
        <View className="flex-row items-center">
          <View
            className="mr-1.5 h-2 w-2 rounded-full"
            style={{ backgroundColor: colors.highlight }}
          />
          <ThemedText className="text-xs" style={{ color: colors.textMuted }}>
            Has trips
          </ThemedText>
        </View>
        <View className="flex-row items-center">
          <View
            className="mr-1.5 h-2 w-2 rounded-full"
            style={{ backgroundColor: colors.border }}
          />
          <ThemedText className="text-xs" style={{ color: colors.textMuted }}>
            Today
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

export default TripCalendar;
