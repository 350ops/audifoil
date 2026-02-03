import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

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

interface FlightDateCalendarProps {
  /** Available dates for the selected airline (YYYY-MM-DD) */
  availableDates: string[];
  /** Currently selected date (YYYY-MM-DD) */
  value?: string | null;
  onChange: (dateStr: string) => void;
  /** First month to show (default: first month in availableDates or current) */
  initialMonth?: { year: number; month: number };
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

export function FlightDateCalendar({
  availableDates,
  value,
  onChange,
  initialMonth,
  className = '',
}: FlightDateCalendarProps) {
  const colors = useThemeColors();
  const dateSet = useMemo(() => new Set(availableDates), [availableDates]);

  const [viewYear, setViewYear] = useState(() => {
    if (initialMonth) return initialMonth.year;
    if (availableDates.length) {
      const first = availableDates[0];
      return parseInt(first.slice(0, 4), 10);
    }
    return new Date().getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    if (initialMonth) return initialMonth.month;
    if (availableDates.length) {
      const first = availableDates[0];
      return parseInt(first.slice(5, 7), 10) - 1;
    }
    return new Date().getMonth();
  });

  const grid = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstWeekday = getFirstWeekday(viewYear, viewMonth);
    const cells: { day: number | null; dateStr: string | null; enabled: boolean }[] = [];

    for (let i = 0; i < firstWeekday; i++) {
      cells.push({ day: null, dateStr: null, enabled: false });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = toDateKey(viewYear, viewMonth + 1, day);
      cells.push({ day, dateStr, enabled: dateSet.has(dateStr) });
    }
    return cells;
  }, [viewYear, viewMonth, dateSet]);

  const canPrev = useMemo(() => {
    if (availableDates.length === 0) return false;
    const min = availableDates[0];
    const minYear = parseInt(min.slice(0, 4), 10);
    const minMonth = parseInt(min.slice(5, 7), 10) - 1;
    return viewYear > minYear || (viewYear === minYear && viewMonth > minMonth);
  }, [availableDates, viewYear, viewMonth]);

  const canNext = useMemo(() => {
    if (availableDates.length === 0) return false;
    const max = availableDates[availableDates.length - 1];
    const maxYear = parseInt(max.slice(0, 4), 10);
    const maxMonth = parseInt(max.slice(5, 7), 10) - 1;
    return viewYear < maxYear || (viewYear === maxYear && viewMonth < maxMonth);
  }, [availableDates, viewYear, viewMonth]);

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
      <View className="mb-4 flex-row items-center justify-between">
        <Pressable
          onPress={canPrev ? goPrev : undefined}
          disabled={!canPrev}
          className="-ml-2 p-2"
          hitSlop={12}>
          <Icon name="ChevronLeft" size={24} color={canPrev ? colors.text : colors.placeholder} />
        </Pressable>
        <ThemedText className="text-lg font-semibold" style={{ color: colors.text }}>
          {MONTHS[viewMonth]} {viewYear}
        </ThemedText>
        <Pressable
          onPress={canNext ? goNext : undefined}
          disabled={!canNext}
          className="-mr-2 p-2"
          hitSlop={12}>
          <Icon name="ChevronRight" size={24} color={canNext ? colors.text : colors.placeholder} />
        </Pressable>
      </View>

      <View className="mb-2 flex-row">
        {WEEKDAYS.map((d) => (
          <View key={d} className="flex-1 items-center">
            <ThemedText className="text-xs font-medium" style={{ color: colors.textMuted }}>
              {d}
            </ThemedText>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {grid.map((cell, i) => (
          <View key={i} className="aspect-square w-[14.28%] items-center justify-center p-0.5">
            {cell.day === null ? (
              <View />
            ) : (
              <Pressable
                onPress={cell.enabled ? () => onChange(cell.dateStr!) : undefined}
                disabled={!cell.enabled}
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{
                  backgroundColor:
                    value === cell.dateStr
                      ? colors.highlight
                      : cell.enabled
                        ? 'transparent'
                        : 'transparent',
                  opacity: cell.enabled ? 1 : 0.35,
                }}>
                <ThemedText
                  className="text-base font-medium"
                  style={{
                    color:
                      value === cell.dateStr
                        ? '#ffffff'
                        : cell.enabled
                          ? colors.text
                          : colors.textMuted,
                  }}>
                  {cell.day}
                </ThemedText>
              </Pressable>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
