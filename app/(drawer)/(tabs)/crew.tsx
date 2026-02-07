import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ActionSheetRef } from 'react-native-actions-sheet';

import ActionSheetThemed from '@/components/ActionSheetThemed';
import { Button } from '@/components/Button';
import Header from '@/components/Header';
import Icon from '@/components/Icon';
import ThemedText from '@/components/ThemedText';
import Select from '@/components/forms/Select';
import useThemeColors from '@/contexts/ThemeColors';
import { FEATURED_AIRLINES, FEATURED_CODES } from '@/data/airlineLogos';
import {
  getAirlinesFromFlights,
  getArrivalsForAirline,
  getAirlineName,
} from '@/data/flightsMle';
import { ACTIVITIES, MALDIVES_ADVENTURE_ID } from '@/data/activities';
import { useStore } from '@/store/useStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_PADDING = 16;
const GRID_GAP = 8;
const COLS = 4;
const TILE_SIZE = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP * (COLS - 1)) / COLS;

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const DAYS_LABEL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = d.toDateString() === now.toDateString();
  const isTomorrow = d.toDateString() === tomorrow.toDateString();

  const prefix = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : DAYS_LABEL[d.getDay()];
  return `${prefix}, ${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

// ──────────────────────────────────────────────
// Inline Calendar Component (iOS-style)
// ──────────────────────────────────────────────

function InlineCalendar({
  selectedDate,
  onSelectDate,
  minDate,
}: {
  selectedDate: string | null;
  onSelectDate: (dateStr: string) => void;
  minDate: Date;
}) {
  const colors = useThemeColors();
  const today = new Date();
  const todayStr = toDateStr(today);
  const minDateStr = toDateStr(minDate);

  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const calendarWidth = SCREEN_WIDTH - GRID_PADDING * 2;
  const cellSize = Math.floor(calendarWidth / 7);

  const goNextMonth = () => {
    Haptics.selectionAsync();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const goPrevMonth = () => {
    Haptics.selectionAsync();
    const now = new Date();
    const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    // Don't go before current month
    if (prevYear < now.getFullYear() || (prevYear === now.getFullYear() && prevMonth < now.getMonth())) return;
    setViewMonth(prevMonth);
    setViewYear(prevYear);
  };

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = Array(firstDay).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  const canGoPrev = (() => {
    const now = new Date();
    return viewYear > now.getFullYear() || (viewYear === now.getFullYear() && viewMonth > now.getMonth());
  })();

  return (
    <View
      className="overflow-hidden rounded-2xl"
      style={{ backgroundColor: colors.secondary, borderWidth: 1, borderColor: colors.border }}
    >
      {/* Header: Month Year + arrows */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <ThemedText className="text-base font-semibold">
          {MONTHS[viewMonth]} {viewYear}
        </ThemedText>
        <View className="flex-row items-center gap-6">
          <Pressable onPress={goPrevMonth} style={{ opacity: canGoPrev ? 1 : 0.25 }}>
            <Icon name="ChevronLeft" size={20} color={colors.highlight} />
          </Pressable>
          <Pressable onPress={goNextMonth}>
            <Icon name="ChevronRight" size={20} color={colors.highlight} />
          </Pressable>
        </View>
      </View>

      {/* Day-of-week header */}
      <View className="flex-row px-4 pb-1">
        {DAYS_SHORT.map((d) => (
          <View key={d} style={{ width: cellSize, alignItems: 'center' }}>
            <ThemedText style={{ fontSize: 11, fontWeight: '600' }} className="opacity-30">
              {d}
            </ThemedText>
          </View>
        ))}
      </View>

      {/* Weeks */}
      <View className="px-4 pb-3">
        {weeks.map((week, wi) => (
          <View key={wi} className="flex-row">
            {week.map((day, di) => {
              if (day === null) {
                return <View key={di} style={{ width: cellSize, height: cellSize }} />;
              }

              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isPast = dateStr < minDateStr;
              const isSelected = dateStr === selectedDate;
              const isToday = dateStr === todayStr;

              return (
                <Pressable
                  key={di}
                  onPress={() => {
                    if (!isPast) {
                      Haptics.selectionAsync();
                      onSelectDate(dateStr);
                    }
                  }}
                  disabled={isPast}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isSelected && (
                    <View
                      style={{
                        position: 'absolute',
                        width: cellSize - 6,
                        height: cellSize - 6,
                        borderRadius: (cellSize - 6) / 2,
                        backgroundColor: colors.highlight + '18',
                        borderWidth: 1.5,
                        borderColor: colors.highlight,
                      }}
                    />
                  )}
                  <ThemedText
                    style={{
                      fontSize: 17,
                      fontWeight: isSelected ? '600' : '400',
                      color: isPast
                        ? colors.border
                        : isSelected || isToday
                          ? colors.highlight
                          : colors.text,
                    }}
                  >
                    {day}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

export default function CrewScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { setSelectedActivity, setSelectedCrewLayover } = useStore();

  const [selectedAirlineCode, setSelectedAirlineCode] = useState<string | null>(null);
  const [selectedFlightNumber, setSelectedFlightNumber] = useState<string | number | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const othersSheetRef = useRef<ActionSheetRef>(null);

  // "Others" airlines — those not in the featured grid
  const otherAirlines = useMemo(() => {
    return getAirlinesFromFlights().filter((a) => !FEATURED_CODES.has(a.value as string));
  }, []);

  // Arrival flight options for selected airline
  const arrivalOptions = useMemo(() => {
    if (!selectedAirlineCode) return [];
    return getArrivalsForAirline(selectedAirlineCode).map(({ value, label, flight }) => ({
      value,
      label: `${flight.flightNumber} — arrives ${flight.timeLocal}`,
      flight,
    }));
  }, [selectedAirlineCode]);

  // Selected flight object
  const selectedFlight = useMemo(() => {
    if (!selectedAirlineCode || !selectedFlightNumber) return null;
    return getArrivalsForAirline(selectedAirlineCode).find(
      (f) => f.value === selectedFlightNumber
    )?.flight ?? null;
  }, [selectedAirlineCode, selectedFlightNumber]);

  // Min selectable date: today
  const minDate = useMemo(() => new Date(), []);

  const handleSelectAirline = useCallback((code: string) => {
    Haptics.selectionAsync();
    setSelectedAirlineCode(code);
    setSelectedFlightNumber(undefined);
    setSelectedDate(null);
  }, []);

  const handleOthersPress = useCallback(() => {
    Haptics.selectionAsync();
    othersSheetRef.current?.show();
  }, []);

  const handleOtherAirlineSelect = useCallback((code: string) => {
    othersSheetRef.current?.hide();
    handleSelectAirline(code);
  }, [handleSelectAirline]);

  const handleBookTrip = useCallback(() => {
    if (!selectedFlight || !selectedDate) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setSelectedCrewLayover({
      arrival: selectedFlight,
      departure: selectedFlight,
      dateStr: selectedDate,
    });

    const maldivesAdventure = ACTIVITIES.find((a) => a.id === MALDIVES_ADVENTURE_ID);
    if (maldivesAdventure) {
      setSelectedActivity(maldivesAdventure);
      router.push('/screens/activity-detail');
    }
  }, [selectedFlight, selectedDate, setSelectedCrewLayover, setSelectedActivity]);

  const canBook = Boolean(selectedFlight && selectedDate);
  const selectedAirlineName = selectedAirlineCode ? getAirlineName(selectedAirlineCode) : null;

  return (
    <View className="flex-1 bg-background">
      <Header title="Airline Crew" rightComponents={[]} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: GRID_PADDING, paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <ThemedText
          className="mb-1 mt-2"
          style={{ fontSize: 20, fontWeight: '700', letterSpacing: -0.5 }}
        >
          Your airline
        </ThemedText>
        <ThemedText className="mb-3 text-sm opacity-50">
          Tap your airline, select your flight, and pick a date.
        </ThemedText>

        {/* ── Airline Logo Grid ── */}
        <View className="flex-row flex-wrap" style={{ gap: GRID_GAP }}>
          {FEATURED_AIRLINES.map((airline) => {
            const isSelected = selectedAirlineCode === airline.code;
            return (
              <Pressable
                key={airline.code}
                onPress={() => handleSelectAirline(airline.code)}
                style={[
                  {
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                    borderRadius: 14,
                    backgroundColor: isSelected ? colors.highlight + '12' : colors.secondary,
                    borderWidth: isSelected ? 2 : 1,
                    borderColor: isSelected ? colors.highlight : colors.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 6,
                  },
                ]}
              >
                <Image
                  source={airline.logo}
                  style={{ width: TILE_SIZE - 24, height: TILE_SIZE - 34, borderRadius: 6 }}
                  resizeMode="contain"
                />
                <ThemedText
                  className="mt-1 text-center"
                  style={{ fontSize: 9, lineHeight: 11 }}
                  numberOfLines={1}
                >
                  {airline.name}
                </ThemedText>
              </Pressable>
            );
          })}

          {/* Others tile */}
          <Pressable
            onPress={handleOthersPress}
            style={[
              {
                width: TILE_SIZE,
                height: TILE_SIZE,
                borderRadius: 14,
                backgroundColor:
                  selectedAirlineCode && !FEATURED_CODES.has(selectedAirlineCode)
                    ? colors.highlight + '12'
                    : colors.secondary,
                borderWidth:
                  selectedAirlineCode && !FEATURED_CODES.has(selectedAirlineCode) ? 2 : 1,
                borderColor:
                  selectedAirlineCode && !FEATURED_CODES.has(selectedAirlineCode)
                    ? colors.highlight
                    : colors.border,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 6,
              },
            ]}
          >
            <Icon name="MoreHorizontal" size={28} color={colors.icon} />
            <ThemedText className="mt-1 text-center" style={{ fontSize: 9, lineHeight: 11 }}>
              {selectedAirlineCode && !FEATURED_CODES.has(selectedAirlineCode)
                ? selectedAirlineName
                : 'Others'}
            </ThemedText>
          </Pressable>
        </View>

        {/* ── Arrival Flight Selector ── */}
        {selectedAirlineCode && (
          <View className="mt-4">
            <Select
              label={`${selectedAirlineName} — arrival into MLE`}
              placeholder="Select your flight"
              options={arrivalOptions}
              value={selectedFlightNumber}
              onChange={(v) => {
                setSelectedFlightNumber(v);
                setSelectedDate(null);
              }}
              variant="classic"
            />
          </View>
        )}

        {/* ── Date Calendar ── */}
        {selectedFlight && (
          <View className="mt-4">
            <ThemedText className="mb-2 font-medium">When would you like to go?</ThemedText>
            <InlineCalendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              minDate={minDate}
            />
          </View>
        )}

        {/* ── Trip Summary + CTA ── */}
        {canBook && selectedDate && selectedFlight && (
          <View className="mt-4">
            <View
              className="mb-4 flex-row items-center rounded-xl p-3"
              style={{ backgroundColor: colors.highlight + '10' }}
            >
              <Icon name="Calendar" size={20} color={colors.highlight} />
              <View className="ml-3 flex-1">
                <ThemedText className="text-sm opacity-50">Trip date</ThemedText>
                <ThemedText className="text-base font-bold">
                  {formatDateLabel(selectedDate)}
                </ThemedText>
              </View>
              <View className="items-end">
                <ThemedText className="text-sm opacity-50">Flight arrives</ThemedText>
                <ThemedText className="text-base font-bold">{selectedFlight.timeLocal}</ThemedText>
              </View>
            </View>

            <Button
              title="Book this trip"
              onPress={handleBookTrip}
              iconEnd="ArrowRight"
              size="large"
              variant="cta"
              rounded="full"
            />
          </View>
        )}
      </ScrollView>

      {/* ── Others ActionSheet ── */}
      <ActionSheetThemed ref={othersSheetRef} gestureEnabled>
        <View className="px-4 pb-4 pt-2">
          <ThemedText className="mb-4 text-lg font-bold">Select your airline</ThemedText>
          {otherAirlines.map((airline) => (
            <Pressable
              key={airline.value}
              onPress={() => handleOtherAirlineSelect(airline.value as string)}
              className="flex-row items-center rounded-xl px-4 py-3.5"
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? colors.highlight + '10' : 'transparent',
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <Icon name="Plane" size={18} color={colors.icon} />
              <ThemedText className="ml-3 font-medium">{airline.label}</ThemedText>
            </Pressable>
          ))}
        </View>
      </ActionSheetThemed>
    </View>
  );
}
