import React, { useState, useCallback, useMemo } from 'react';
import { View, ScrollView, Pressable, FlatList } from 'react-native';
import Header from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { Chip } from '@/components/Chip';
import { CardScroller } from '@/components/CardScroller';
import { Button } from '@/components/Button';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { useStore } from '@/store/useStore';
import { ActivitySlot, getStatusMessage } from '@/data/activities';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import GroupFillBar from '@/components/GroupFillBar';
import AirlineBadges from '@/components/AirlineBadges';

export default function SelectTimeScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const {
    selectedActivity,
    activitySlots,
    selectedActivitySlot,
    setSelectedActivitySlot,
    seatCount,
    setSeatCount,
  } = useStore();
  const [selectedDate, setSelectedDate] = useState<string>('Today');

  const handleSlotSelect = useCallback((slot: ActivitySlot) => {
    const spotsLeft = slot.capacity - slot.seatsFilled;
    if (slot.status !== 'full' && spotsLeft > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedActivitySlot(slot);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [setSelectedActivitySlot]);

  const handleContinue = useCallback(() => {
    if (selectedActivitySlot) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push('/screens/activity-checkout');
    }
  }, [selectedActivitySlot]);

  // Get unique dates
  const dates = useMemo(() => {
    const uniqueDates = [...new Set(activitySlots.map(s => s.dateLabel))];
    return uniqueDates;
  }, [activitySlots]);

  // Filter slots by selected date
  const filteredSlots = useMemo(() => {
    return activitySlots.filter(s => s.dateLabel === selectedDate);
  }, [activitySlots, selectedDate]);

  if (!selectedActivity) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ThemedText>No activity selected</ThemedText>
        <Button title="Go Back" onPress={() => router.back()} className="mt-4" />
      </View>
    );
  }

  const capacity = selectedActivity.capacity;
  const isPrivate = selectedActivity.isPrivate;
  const maxSeats = isPrivate ? 1 : Math.min(capacity, 4); // Max 4 seats per booking for group trips

  return (
    <View className="flex-1 bg-background">
      <Header showBackButton title="Select Time" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 180 }}
      >
        {/* Activity Summary */}
        <View className="px-4 pt-4">
          <AnimatedView animation="scaleIn">
            <View className="bg-secondary rounded-2xl p-4 flex-row items-center" style={shadowPresets.card}>
              <View
                className="w-14 h-14 rounded-xl items-center justify-center mr-4"
                style={{ backgroundColor: colors.highlight + '15' }}
              >
                <Icon name="Waves" size={28} color={colors.highlight} />
              </View>
              <View className="flex-1">
                <ThemedText className="font-bold text-lg">{selectedActivity.title}</ThemedText>
                <ThemedText className="opacity-50">
                  {selectedActivity.durationMin} min · {isPrivate ? `$${selectedActivity.seatPriceFromUsd}` : `$${selectedActivity.seatPriceFromUsd}/seat`}
                </ThemedText>
              </View>
            </View>
          </AnimatedView>
        </View>

        {/* Seat Count Selector (for group experiences) */}
        {!isPrivate && maxSeats > 1 && (
          <View className="px-4 mt-6">
            <ThemedText className="text-lg font-bold mb-3">Number of Seats</ThemedText>
            <View className="bg-secondary rounded-2xl p-4 flex-row items-center justify-between" style={shadowPresets.card}>
              <View className="flex-row items-center">
                <Icon name="Users" size={20} color={colors.highlight} />
                <ThemedText className="ml-3">
                  {seatCount} Seat{seatCount !== 1 ? 's' : ''}
                </ThemedText>
              </View>
              <View className="flex-row items-center">
                <Pressable
                  onPress={() => {
                    if (seatCount > 1) {
                      Haptics.selectionAsync();
                      setSeatCount(seatCount - 1);
                    }
                  }}
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: seatCount > 1 ? colors.highlight + '15' : colors.border }}
                >
                  <Icon name="Minus" size={20} color={seatCount > 1 ? colors.highlight : colors.placeholder} />
                </Pressable>
                <ThemedText className="font-bold text-xl mx-4">{seatCount}</ThemedText>
                <Pressable
                  onPress={() => {
                    if (seatCount < maxSeats) {
                      Haptics.selectionAsync();
                      setSeatCount(seatCount + 1);
                    }
                  }}
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: seatCount < maxSeats ? colors.highlight + '15' : colors.border }}
                >
                  <Icon name="Plus" size={20} color={seatCount < maxSeats ? colors.highlight : colors.placeholder} />
                </Pressable>
              </View>
            </View>
            <ThemedText className="text-xs opacity-40 mt-2 px-1">
              Max {maxSeats} seats per booking · Join other travelers on the same trip
            </ThemedText>
          </View>
        )}

        {/* Date Selector */}
        <View className="mt-6">
          <View className="px-4 mb-3">
            <ThemedText className="text-lg font-bold">Select Date</ThemedText>
          </View>
          <CardScroller space={10}>
            {dates.map(date => (
              <Chip
                key={date}
                label={date}
                isSelected={selectedDate === date}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedDate(date);
                }}
              />
            ))}
          </CardScroller>
        </View>

        {/* Time Slots Grid */}
        <View className="px-4 mt-6">
          <View className="flex-row items-center justify-between mb-3">
            <ThemedText className="text-lg font-bold">Available Times</ThemedText>
            <View className="flex-row items-center">
              <Icon name="Sunset" size={14} color="#F59E0B" />
              <ThemedText className="text-sm opacity-50 ml-1">Sunset slot</ThemedText>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-3">
            {filteredSlots.map((slot, index) => (
              <AnimatedView key={slot.id} animation="scaleIn" delay={index * 40} className="w-[48%]">
                <SlotCard
                  slot={slot}
                  isSelected={selectedActivitySlot?.id === slot.id}
                  onPress={() => handleSlotSelect(slot)}
                />
              </AnimatedView>
            ))}
          </View>

          {filteredSlots.length === 0 && (
            <View className="items-center py-12">
              <Icon name="Calendar" size={48} color={colors.placeholder} />
              <ThemedText className="text-lg font-semibold mt-4">No slots available</ThemedText>
              <ThemedText className="opacity-50 text-center mt-1">
                Try selecting a different date
              </ThemedText>
            </View>
          )}
        </View>

        {/* Legend */}
        <View className="px-4 mt-6">
          <View className="bg-secondary rounded-xl p-4" style={shadowPresets.small}>
            <View className="flex-row items-center justify-around">
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#22C55E' }} />
                <ThemedText className="text-sm opacity-60">Confirmed</ThemedText>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#F59E0B' }} />
                <ThemedText className="text-sm opacity-60">Almost there</ThemedText>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors.highlight }} />
                <ThemedText className="text-sm opacity-60">Filling</ThemedText>
              </View>
            </View>
            {!isPrivate && (
              <ThemedText className="text-xs opacity-40 text-center mt-3">
                Trips confirm once {selectedActivity.minToRun}+ seats are filled
              </ThemedText>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-background border-t border-border px-4 pt-4"
        style={[shadowPresets.large, { paddingBottom: insets.bottom + 16 }]}
      >
        {selectedActivitySlot ? (
          <>
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <ThemedText className="text-sm opacity-50">Selected</ThemedText>
                <ThemedText className="font-bold text-lg">
                  {selectedActivitySlot.startTime} · {selectedActivitySlot.dateLabel}
                </ThemedText>
                {!isPrivate && (
                  <ThemedText className="text-xs opacity-50">
                    {selectedActivitySlot.seatsFilled}/{selectedActivitySlot.capacity} seats filled
                  </ThemedText>
                )}
              </View>
              <View className="items-end">
                <ThemedText className="text-sm opacity-50">
                  {seatCount} seat{seatCount !== 1 ? 's' : ''} × ${selectedActivitySlot.seatPrice}
                </ThemedText>
                <ThemedText className="font-bold text-2xl" style={{ color: colors.highlight }}>
                  ${selectedActivitySlot.seatPrice * seatCount}
                </ThemedText>
              </View>
            </View>
            <Button
              title={isPrivate ? 'Continue to Checkout' : 'Join This Trip'}
              onPress={handleContinue}
              iconEnd="ArrowRight"
              size="large"
            />
          </>
        ) : (
          <View className="items-center py-2">
            <ThemedText className="opacity-50">Select a time slot to continue</ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

// Slot Card Component with Group-Fill UI
function SlotCard({ slot, isSelected, onPress }: {
  slot: ActivitySlot;
  isSelected: boolean;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  const spotsLeft = slot.capacity - slot.seatsFilled;
  const isAvailable = slot.status !== 'full' && spotsLeft > 0;

  // Get status color
  const getStatusColor = () => {
    switch (slot.status) {
      case 'confirmed': return '#22C55E';
      case 'almost_full': return '#F59E0B';
      case 'full': return '#6B7280';
      default: return colors.highlight;
    }
  };

  // Get status label
  const getStatusLabel = () => {
    switch (slot.status) {
      case 'confirmed': return 'Confirmed';
      case 'almost_full': return 'Almost there';
      case 'full': return 'Full';
      default: return `${slot.seatsFilled}/${slot.capacity} filled`;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={!isAvailable}
      className="rounded-xl overflow-hidden"
      style={({ pressed }) => [
        shadowPresets.card,
        {
          backgroundColor: isSelected ? colors.highlight : colors.secondary,
          opacity: isAvailable ? (pressed ? 0.8 : 1) : 0.5,
          transform: [{ scale: pressed && isAvailable ? 0.97 : 1 }],
        }
      ]}
    >
      <View className="p-4">
        {/* Time + Badges */}
        <View className="flex-row items-center justify-between mb-1">
          <ThemedText
            className="font-bold text-xl"
            style={isSelected ? { color: 'white' } : undefined}
          >
            {slot.startTime}
          </ThemedText>
          <View className="flex-row items-center">
            {slot.isSunset && (
              <Icon name="Sunset" size={14} color={isSelected ? 'white' : '#F59E0B'} />
            )}
            {slot.isPopular && (
              <Icon name="Flame" size={14} color={isSelected ? 'white' : '#EF4444'} className="ml-1" />
            )}
          </View>
        </View>

        {/* Price per seat */}
        <ThemedText
          className="text-sm font-semibold mb-2"
          style={isSelected ? { color: 'white' } : { color: colors.highlight }}
        >
          ${slot.seatPrice}/seat
        </ThemedText>

        {/* Group Fill Progress */}
        {slot.capacity > 1 && (
          <View className="mb-2">
            <View
              className="h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : colors.border }}
            >
              <View
                className="h-full rounded-full"
                style={{
                  width: `${(slot.seatsFilled / slot.capacity) * 100}%`,
                  backgroundColor: isSelected ? 'white' : getStatusColor(),
                }}
              />
            </View>
            <View className="flex-row items-center justify-between mt-1">
              <ThemedText
                className="text-xs"
                style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : colors.placeholder }}
              >
                {getStatusLabel()}
              </ThemedText>
              <ThemedText
                className="text-xs"
                style={{ color: isSelected ? 'rgba(255,255,255,0.6)' : colors.placeholder }}
              >
                {spotsLeft} left
              </ThemedText>
            </View>
          </View>
        )}

        {/* Airline Badges */}
        {slot.airlineBadges.length > 0 && (
          <View className="flex-row flex-wrap gap-1">
            {slot.airlineBadges.slice(0, 2).map((code, i) => (
              <View
                key={i}
                className="px-1.5 py-0.5 rounded"
                style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : colors.highlight + '20' }}
              >
                <ThemedText
                  className="text-[10px] font-bold"
                  style={isSelected ? { color: 'white' } : { color: colors.highlight }}
                >
                  {code}
                </ThemedText>
              </View>
            ))}
            {slot.airlineBadges.length > 2 && (
              <ThemedText
                className="text-[10px]"
                style={{ color: isSelected ? 'rgba(255,255,255,0.6)' : colors.placeholder }}
              >
                +{slot.airlineBadges.length - 2} crew
              </ThemedText>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}
