import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AnimatedView from '@/components/AnimatedView';
import { Button } from '@/components/Button';
import Header from '@/components/Header';
import Icon from '@/components/Icon';
import PriceTierIndicator, { PriceDropIndicator } from '@/components/PriceTierIndicator';
import ThemedText from '@/components/ThemedText';
import { TripCalendar } from '@/components/TripCalendar';
import TripCard from '@/components/TripCard';
import useThemeColors from '@/contexts/ThemeColors';
import { ActivitySlot, formatDurationHours } from '@/data/activities';
import { getCrewExperienceConstraint } from '@/data/flightsMle';
import { getPriceTierInfo } from '@/data/pricing';
import {
  DbActivity,
  fetchActivityBySlug,
  fetchDatesWithTrips,
  formatDateLabel,
  FormattedTrip,
  formatTripsForUI,
  getNextNDays,
  getOrCreateTripsForDate,
} from '@/data/tripsDb';
import { useStore } from '@/store/useStore';
import { shadowPresets } from '@/utils/useShadow';

export default function SelectTimeScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const {
    selectedActivity,
    activitySlots,
    selectedActivitySlot,
    setSelectedActivitySlot,
    guestCount,
    setGuestCount,
    selectedCrewLayover,
  } = useStore();

  // Database state
  const [dbActivity, setDbActivity] = useState<DbActivity | null>(null);
  const [trips, setTrips] = useState<FormattedTrip[]>([]);
  const [datesWithTrips, setDatesWithTrips] = useState<string[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [loadingDates, setLoadingDates] = useState(false);
  const [useDatabase, setUseDatabase] = useState(false);

  // Selected date (YYYY-MM-DD format for database, label for legacy)
  const crewDateStr =
    selectedCrewLayover != null ? getCrewExperienceConstraint(selectedCrewLayover).dateStr : null;
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(crewDateStr);

  // For legacy mode (mock data)
  const crewDateLabel =
    selectedCrewLayover != null ? getCrewExperienceConstraint(selectedCrewLayover).dateLabel : null;
  const [selectedDateLabel, setSelectedDateLabel] = useState<string>(crewDateLabel ?? 'Today');

  // Calculate date range for calendar
  const dateRange = useMemo(() => {
    const dates = getNextNDays(90);
    return { start: dates[0], end: dates[dates.length - 1] };
  }, []);

  // Try to load activity from database
  useEffect(() => {
    async function loadDbActivity() {
      if (!selectedActivity) return;

      // Map activity ID to slug
      const slug = selectedActivity.id;
      const activity = await fetchActivityBySlug(slug);

      if (activity) {
        setDbActivity(activity);
        setUseDatabase(true);

        // Load dates with trips
        setLoadingDates(true);
        const dates = await fetchDatesWithTrips(activity.id, dateRange.start, dateRange.end);
        setDatesWithTrips(dates);
        setLoadingDates(false);

        // If crew has a date selected, load trips for that date
        if (crewDateStr) {
          setSelectedDateStr(crewDateStr);
          loadTripsForDate(activity, crewDateStr);
        }
      } else {
        // Fall back to mock data
        setUseDatabase(false);
      }
    }

    loadDbActivity();
  }, [selectedActivity?.id]);

  // Load trips when date changes (database mode)
  const loadTripsForDate = useCallback(
    async (activity: DbActivity, dateStr: string) => {
      setLoadingTrips(true);
      setSelectedActivitySlot(null);

      const dbTrips = await getOrCreateTripsForDate(
        activity.id,
        activity.slug,
        dateStr,
        activity.duration_min,
        activity.max_guests,
        activity.is_sunset ?? false
      );

      const formatted = await formatTripsForUI(dbTrips, activity);
      setTrips(formatted);
      setLoadingTrips(false);
    },
    [setSelectedActivitySlot]
  );

  // Handle date selection from calendar
  const handleDateSelect = useCallback(
    (dateStr: string) => {
      Haptics.selectionAsync();
      setSelectedDateStr(dateStr);
      setSelectedActivitySlot(null);

      if (useDatabase && dbActivity) {
        loadTripsForDate(dbActivity, dateStr);
      }
    },
    [useDatabase, dbActivity, loadTripsForDate, setSelectedActivitySlot]
  );

  // Handle trip selection
  const handleTripSelect = useCallback(
    (trip: FormattedTrip | ActivitySlot) => {
      if (trip.spotsRemaining > 0) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // Convert FormattedTrip to ActivitySlot format if needed
        const slot: ActivitySlot = {
          id: trip.id,
          activityId: 'activityId' in trip ? trip.activityId : (trip as ActivitySlot).activityId,
          startTime: trip.startTime,
          endTime: trip.endTime,
          date: 'date' in trip ? trip.date : (trip as ActivitySlot).date,
          dateLabel: 'dateLabel' in trip ? trip.dateLabel : (trip as ActivitySlot).dateLabel,
          spotsRemaining: trip.spotsRemaining,
          maxSpots: trip.maxSpots,
          isPrivate: trip.isPrivate,
          isSunset: trip.isSunset,
          isPopular: trip.isPopular,
          price: trip.price,
          bookedBy: trip.bookedBy,
        };
        setSelectedActivitySlot(slot);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    },
    [setSelectedActivitySlot]
  );

  const handleContinue = useCallback(() => {
    if (selectedActivitySlot) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push('/screens/activity-checkout');
    }
  }, [selectedActivitySlot]);

  // Legacy mode: Filter slots by selected date
  const legacyFilteredSlots = useMemo(() => {
    return activitySlots.filter((s) => s.dateLabel === selectedDateLabel);
  }, [activitySlots, selectedDateLabel]);

  // Sync legacy date selection
  useEffect(() => {
    if (!useDatabase && crewDateLabel && activitySlots.length > 0) {
      const labels = [...new Set(activitySlots.map((s) => s.dateLabel))];
      if (labels.includes(crewDateLabel)) setSelectedDateLabel(crewDateLabel);
      else if (labels[0]) setSelectedDateLabel(labels[0]);
    }
  }, [crewDateLabel, activitySlots, selectedCrewLayover, useDatabase]);

  if (!selectedActivity) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ThemedText>No activity selected</ThemedText>
        <Button title="Go Back" onPress={() => router.back()} className="mt-4" />
      </View>
    );
  }

  const maxGuests = selectedActivity.maxGuests;
  const minGuests = selectedActivity.minGuests;

  // Determine which trips to display
  const displayTrips = useDatabase ? trips : legacyFilteredSlots;
  const displayDateLabel = useDatabase
    ? selectedDateStr
      ? formatDateLabel(selectedDateStr)
      : 'Select a date'
    : selectedDateLabel;

  return (
    <View className="flex-1 bg-background">
      <Header showBackButton title="Select Date" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 180 }}>
        {/* Activity Summary */}
        <View className="px-4 pt-4">
          <AnimatedView animation="scaleIn">
            <View
              className="flex-row items-center rounded-2xl bg-secondary p-4"
              style={shadowPresets.card}>
              <View
                className="mr-4 h-14 w-14 items-center justify-center rounded-xl"
                style={{ backgroundColor: colors.highlight + '15' }}>
                <Icon name="Waves" size={28} color={colors.highlight} />
              </View>
              <View className="flex-1">
                <ThemedText className="text-lg font-bold" style={{ color: colors.text }}>
                  {selectedActivity.title}
                </ThemedText>
                <ThemedText style={{ color: colors.textMuted }}>
                  {formatDurationHours(selectedActivity.durationMin)} · $
                  {selectedActivity.priceFromUsd}/person
                </ThemedText>
              </View>
            </View>
          </AnimatedView>
        </View>

        {/* Calendar Date Selector */}
        <View className="mt-6 px-4">
          <ThemedText className="mb-3 text-lg font-bold" style={{ color: colors.text }}>
            Choose a Date
          </ThemedText>
          <TripCalendar
            value={selectedDateStr}
            onChange={handleDateSelect}
            datesWithTrips={datesWithTrips}
            loading={loadingDates}
            minDate={dateRange.start}
            maxDate={dateRange.end}
          />
        </View>

        {/* Trips for Selected Date */}
        {selectedDateStr && (
          <View className="mt-6 px-4">
            <View className="mb-3 flex-row items-center justify-between">
              <ThemedText className="text-lg font-bold" style={{ color: colors.text }}>
                Trips on {displayDateLabel}
              </ThemedText>
              <View className="flex-row items-center gap-3">
                <View className="flex-row items-center">
                  <Icon name="Users" size={14} color={colors.highlight} />
                  <ThemedText className="ml-1 text-sm" style={{ color: colors.textMuted }}>
                    Group
                  </ThemedText>
                </View>
                <View className="flex-row items-center">
                  <Icon name="Sunset" size={14} color="#F59E0B" />
                  <ThemedText className="ml-1 text-sm" style={{ color: colors.textMuted }}>
                    Sunset
                  </ThemedText>
                </View>
              </View>
            </View>

            {loadingTrips ? (
              <View className="items-center py-12">
                <ActivityIndicator size="large" color={colors.highlight} />
                <ThemedText className="mt-4" style={{ color: colors.textMuted }}>
                  Loading available trips...
                </ThemedText>
              </View>
            ) : (
              <>
                <View className="gap-3">
                  {displayTrips.map((trip, index) => (
                    <AnimatedView key={trip.id} animation="scaleIn" delay={index * 40}>
                      {useDatabase && 'bookedCount' in trip ? (
                        <TripCard
                          trip={trip as FormattedTrip}
                          isSelected={selectedActivitySlot?.id === trip.id}
                          onPress={() => handleTripSelect(trip)}
                        />
                      ) : (
                        <LegacyTripCard
                          trip={trip}
                          isSelected={selectedActivitySlot?.id === trip.id}
                          onPress={() => handleTripSelect(trip)}
                        />
                      )}
                    </AnimatedView>
                  ))}
                </View>

                {displayTrips.length === 0 && (
                  <View className="items-center py-12">
                    <Icon name="Calendar" size={48} color={colors.placeholder} />
                    <ThemedText className="mt-4 text-lg font-semibold">
                      No trips available
                    </ThemedText>
                    <ThemedText className="mt-1 text-center opacity-50">
                      Try selecting a different date
                    </ThemedText>
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* Guest Count Selector - After selecting trip */}
        {selectedActivitySlot && maxGuests > 1 && (
          <View className="mt-6 px-4">
            <ThemedText className="mb-3 text-lg font-bold" style={{ color: colors.text }}>
              Number of Guests
            </ThemedText>
            <View
              className="flex-row items-center justify-between rounded-2xl bg-secondary p-4"
              style={shadowPresets.card}>
              <View className="flex-row items-center">
                <Icon name="Users" size={20} color={colors.highlight} />
                <ThemedText className="ml-3">
                  {guestCount} Guest{guestCount !== 1 ? 's' : ''}
                </ThemedText>
              </View>
              <View className="flex-row items-center">
                <Pressable
                  onPress={() => {
                    if (guestCount > minGuests) {
                      Haptics.selectionAsync();
                      setGuestCount(guestCount - 1);
                    }
                  }}
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    backgroundColor:
                      guestCount > minGuests ? colors.highlight + '15' : colors.border,
                  }}>
                  <Icon
                    name="Minus"
                    size={20}
                    color={guestCount > minGuests ? colors.highlight : colors.placeholder}
                  />
                </Pressable>
                <ThemedText className="mx-4 text-xl font-bold">{guestCount}</ThemedText>
                <Pressable
                  onPress={() => {
                    if (guestCount < maxGuests) {
                      Haptics.selectionAsync();
                      setGuestCount(guestCount + 1);
                    }
                  }}
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    backgroundColor:
                      guestCount < maxGuests ? colors.highlight + '15' : colors.border,
                  }}>
                  <Icon
                    name="Plus"
                    size={20}
                    color={guestCount < maxGuests ? colors.highlight : colors.placeholder}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* Dynamic Pricing Info */}
        {useDatabase && (
          <View className="mt-6 px-4">
            <ThemedText className="mb-3 text-lg font-bold" style={{ color: colors.text }}>
              Group Pricing
            </ThemedText>
            <PriceTierIndicator currentGuests={0} newGuests={1} />
          </View>
        )}

        {/* Legend */}
        <View className="mt-6 px-4">
          <View
            className="flex-row items-center justify-around rounded-xl bg-secondary p-4"
            style={shadowPresets.small}>
            <View className="flex-row items-center">
              <Icon name="TrendingDown" size={12} color={colors.highlight} />
              <ThemedText className="ml-1 text-sm" style={{ color: colors.textMuted }}>
                Price drops
              </ThemedText>
            </View>
            <View className="flex-row items-center">
              <View
                className="mr-2 h-3 w-3 rounded-full"
                style={{ backgroundColor: colors.highlight }}
              />
              <ThemedText className="text-sm" style={{ color: colors.textMuted }}>
                Best rate
              </ThemedText>
            </View>
            <View className="flex-row items-center">
              <Icon name="Sunset" size={12} color="#F59E0B" />
              <ThemedText className="ml-1 text-sm" style={{ color: colors.textMuted }}>
                Sunset
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        className="absolute bottom-0 left-0 right-0 border-t border-border bg-background px-4 pt-4"
        style={[shadowPresets.large, { paddingBottom: insets.bottom + 16 }]}>
        {selectedActivitySlot ? (
          <>
            {/* Dynamic pricing info */}
            {(() => {
              const selectedTrip = displayTrips.find((t) => t.id === selectedActivitySlot.id);
              const bookedCount =
                selectedTrip && 'bookedCount' in selectedTrip
                  ? (selectedTrip as FormattedTrip).bookedCount
                  : 0;
              const tierInfo = getPriceTierInfo(bookedCount, guestCount);
              const totalPrice = tierInfo.currentPrice * guestCount;

              return (
                <>
                  <View className="mb-4 flex-row items-center justify-between">
                    <View>
                      <ThemedText className="text-sm" style={{ color: colors.textMuted }}>
                        {selectedActivitySlot.startTime} - {selectedActivitySlot.endTime}
                      </ThemedText>
                      <View className="flex-row items-center gap-2">
                        <ThemedText className="text-lg font-bold" style={{ color: colors.text }}>
                          ${tierInfo.currentPrice}/person
                        </ThemedText>
                        {guestCount > 1 && (
                          <ThemedText className="text-sm" style={{ color: colors.textMuted }}>
                            × {guestCount}
                          </ThemedText>
                        )}
                      </View>
                      {!tierInfo.isAtBasePrice && (
                        <PriceDropIndicator currentGuests={bookedCount} newGuests={guestCount} />
                      )}
                    </View>
                    <View className="items-end">
                      <ThemedText className="text-sm" style={{ color: colors.textMuted }}>
                        Total
                      </ThemedText>
                      <ThemedText className="text-2xl font-bold" style={{ color: colors.highlight }}>
                        ${totalPrice}
                      </ThemedText>
                    </View>
                  </View>
                  <Button
                    title="Continue to Checkout"
                    onPress={handleContinue}
                    iconEnd="ArrowRight"
                    size="large"
                    variant="cta"
                    rounded="full"
                  />
                </>
              );
            })()}
          </>
        ) : (
          <View className="items-center py-2">
            <ThemedText style={{ color: colors.textMuted }}>
              {selectedDateStr ? 'Select a trip to continue' : 'Select a date to see trips'}
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

// Legacy Trip Card Component (for mock data fallback)
function LegacyTripCard({
  trip,
  isSelected,
  onPress,
}: {
  trip: FormattedTrip | ActivitySlot;
  isSelected: boolean;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  const isAvailable = trip.spotsRemaining > 0;

  return (
    <Pressable
      onPress={onPress}
      disabled={!isAvailable}
      className="overflow-hidden rounded-2xl"
      style={({ pressed }) => [
        shadowPresets.card,
        {
          backgroundColor: isSelected ? colors.highlight : colors.secondary,
          opacity: isAvailable ? (pressed ? 0.8 : 1) : 0.5,
          transform: [{ scale: pressed && isAvailable ? 0.97 : 1 }],
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected ? colors.highlight : colors.border,
        },
      ]}>
      <View className="flex-row items-center p-4">
        {/* Left: Time Block */}
        <View
          className="mr-4 h-20 w-20 items-center justify-center rounded-xl"
          style={{
            backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : colors.highlight + '10',
          }}>
          <ThemedText
            className="text-xl font-bold"
            style={isSelected ? { color: 'white' } : { color: colors.highlight }}>
            {trip.startTime}
          </ThemedText>
          <ThemedText
            className="mt-0.5 text-xs"
            style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : colors.placeholder }}>
            to {trip.endTime}
          </ThemedText>
        </View>

        {/* Middle: Details */}
        <View className="flex-1">
          {/* Crew joining badges */}
          {trip.bookedBy.length > 0 ? (
            <View className="mb-2 flex-row flex-wrap gap-1.5">
              {trip.bookedBy.slice(0, 3).map((booking, i) => (
                <View
                  key={i}
                  className="rounded-full px-2 py-0.5"
                  style={{
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : colors.highlight + '15',
                  }}>
                  <ThemedText
                    className="text-xs font-medium"
                    style={isSelected ? { color: 'white' } : { color: colors.highlight }}>
                    {booking.label}
                  </ThemedText>
                </View>
              ))}
              {trip.bookedBy.length > 3 && (
                <ThemedText
                  className="text-xs"
                  style={{ color: isSelected ? 'rgba(255,255,255,0.6)' : colors.placeholder }}>
                  +{trip.bookedBy.length - 3} more
                </ThemedText>
              )}
            </View>
          ) : (
            <ThemedText
              className="mb-2 text-sm"
              style={{ color: isSelected ? 'rgba(255,255,255,0.6)' : colors.placeholder }}>
              No crew yet - be the first!
            </ThemedText>
          )}

          {/* Availability */}
          <View className="flex-row items-center">
            <View
              className="mr-1.5 h-2 w-2 rounded-full"
              style={{ backgroundColor: isAvailable ? '#22C55E' : '#EF4444' }}
            />
            <ThemedText
              className="text-sm"
              style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : colors.placeholder }}>
              {isAvailable ? `${trip.spotsRemaining} spots available` : 'Fully booked'}
            </ThemedText>
          </View>
        </View>

        {/* Right: Price + Icons */}
        <View className="items-end">
          <ThemedText
            className="text-xl font-bold"
            style={isSelected ? { color: 'white' } : { color: colors.highlight }}>
            ${trip.price}
          </ThemedText>
          {(trip.isSunset || trip.isPopular) && (
            <View className="mt-1 flex-row items-center gap-1">
              {trip.isSunset && (
                <Icon name="Sunset" size={16} color={isSelected ? 'white' : '#F59E0B'} />
              )}
              {trip.isPopular && (
                <Icon name="Flame" size={16} color={isSelected ? 'white' : '#EF4444'} />
              )}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
