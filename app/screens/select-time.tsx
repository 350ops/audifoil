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
import { ActivitySlot } from '@/data/activities';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

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
  } = useStore();
  const [selectedDate, setSelectedDate] = useState<string>('Today');

  const handleSlotSelect = useCallback((slot: ActivitySlot) => {
    if (slot.spotsRemaining > 0) {
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

  const maxGuests = selectedActivity.maxGuests;
  const minGuests = selectedActivity.minGuests;

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
                <ThemedText className="opacity-50">{selectedActivity.durationMin} min · ${selectedActivity.priceFromUsd}/person</ThemedText>
              </View>
            </View>
          </AnimatedView>
        </View>

        {/* Guest Count Selector */}
        {maxGuests > 1 && (
          <View className="px-4 mt-6">
            <ThemedText className="text-lg font-bold mb-3">Number of Guests</ThemedText>
            <View className="bg-secondary rounded-2xl p-4 flex-row items-center justify-between" style={shadowPresets.card}>
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
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: guestCount > minGuests ? colors.highlight + '15' : colors.border }}
                >
                  <Icon name="Minus" size={20} color={guestCount > minGuests ? colors.highlight : colors.placeholder} />
                </Pressable>
                <ThemedText className="font-bold text-xl mx-4">{guestCount}</ThemedText>
                <Pressable
                  onPress={() => {
                    if (guestCount < maxGuests) {
                      Haptics.selectionAsync();
                      setGuestCount(guestCount + 1);
                    }
                  }}
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: guestCount < maxGuests ? colors.highlight + '15' : colors.border }}
                >
                  <Icon name="Plus" size={20} color={guestCount < maxGuests ? colors.highlight : colors.placeholder} />
                </Pressable>
              </View>
            </View>
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
          <View className="bg-secondary rounded-xl p-4 flex-row items-center justify-around" style={shadowPresets.small}>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
              <ThemedText className="text-sm opacity-60">Available</ThemedText>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-red-400 mr-2" />
              <ThemedText className="text-sm opacity-60">Full</ThemedText>
            </View>
            <View className="flex-row items-center">
              <Icon name="Flame" size={12} color="#EF4444" />
              <ThemedText className="text-sm opacity-60 ml-1">Popular</ThemedText>
            </View>
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
                  {selectedActivitySlot.startTime} - {selectedActivitySlot.endTime}
                </ThemedText>
              </View>
              <View className="items-end">
                <ThemedText className="text-sm opacity-50">Total</ThemedText>
                <ThemedText className="font-bold text-2xl" style={{ color: colors.highlight }}>
                  ${selectedActivitySlot.price * guestCount}
                </ThemedText>
              </View>
            </View>
            <Button
              title="Continue to Checkout"
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

// Slot Card Component
function SlotCard({ slot, isSelected, onPress }: {
  slot: ActivitySlot;
  isSelected: boolean;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  const isAvailable = slot.spotsRemaining > 0;

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
        <View className="flex-row items-center justify-between mb-2">
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

        <ThemedText
          className="text-sm mb-3"
          style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : colors.placeholder }}
        >
          {slot.startTime} - {slot.endTime}
        </ThemedText>

        {/* Booked By */}
        {slot.bookedBy.length > 0 && (
          <View className="flex-row flex-wrap gap-1 mb-3">
            {slot.bookedBy.slice(0, 2).map((booking, i) => (
              <View
                key={i}
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : colors.highlight + '20' }}
              >
                <ThemedText
                  className="text-xs font-medium"
                  style={isSelected ? { color: 'white' } : { color: colors.highlight }}
                >
                  {booking.label}
                </ThemedText>
              </View>
            ))}
          </View>
        )}

        {/* Availability */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: isAvailable ? '#22C55E' : '#EF4444' }}
            />
            <ThemedText
              className="text-xs"
              style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : colors.placeholder }}
            >
              {isAvailable ? `${slot.spotsRemaining} left` : 'Full'}
            </ThemedText>
          </View>
          <ThemedText
            className="font-bold"
            style={isSelected ? { color: 'white' } : { color: colors.highlight }}
          >
            ${slot.price}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}
