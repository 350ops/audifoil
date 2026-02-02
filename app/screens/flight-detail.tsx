import React, { useEffect, useState, useCallback } from 'react';
import { View, Pressable, FlatList } from 'react-native';
import Header from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { useStore } from '@/store/useStore';
import { Slot, getAirlineColor } from '@/data/types';
import AirlineLogo from '@/components/AirlineLogo';
import { SlotCardSkeleton } from '@/components/SkeletonCard';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FlightDetailScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { selectedFlight, currentSlots, selectedSlot, setSelectedSlot, generateSlots } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedFlight) {
      generateSlots(selectedFlight);
      const timer = setTimeout(() => setIsLoading(false), 600);
      return () => clearTimeout(timer);
    }
  }, [selectedFlight]);

  const handleSlotSelect = useCallback((slot: Slot) => {
    if (slot.available) {
      setSelectedSlot(slot);
    }
  }, [setSelectedSlot]);

  const handleContinue = () => {
    if (selectedSlot) {
      router.push('/screens/checkout');
    }
  };

  if (!selectedFlight) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ThemedText>No flight selected</ThemedText>
        <Button title="Select Flight" onPress={() => router.back()} className="mt-4" />
      </View>
    );
  }

  const airlineColor = getAirlineColor(selectedFlight.airlineCode);

  const renderSlotCard = useCallback(({ item, index }: { item: Slot; index: number }) => (
    <AnimatedView animation="scaleIn" duration={250} delay={index * 40}>
      <SlotCard
        slot={item}
        isSelected={selectedSlot?.id === item.id}
        onPress={() => handleSlotSelect(item)}
      />
    </AnimatedView>
  ), [selectedSlot, handleSlotSelect]);

  const keyExtractor = useCallback((item: Slot) => item.id, []);

  return (
    <View className="flex-1 bg-background">
      <Header showBackButton title="Select Time Slot" />
      
      <View className="flex-1">
        {/* Flight Summary Card */}
        <View className="px-4 pt-4">
          <AnimatedView animation="scaleIn" duration={300}>
            <View className="bg-secondary rounded-2xl p-4" style={shadowPresets.card}>
              <View className="flex-row items-center">
                <AirlineLogo airlineCode={selectedFlight.airlineCode} size={56} style={{ marginRight: 16 }} />
                <View className="flex-1">
                  <ThemedText className="font-bold text-xl">{selectedFlight.flightNo}</ThemedText>
                  <ThemedText className="opacity-50">{selectedFlight.airline}</ThemedText>
                </View>
                <View className="items-end">
                  <ThemedText className="font-bold text-2xl">{selectedFlight.timeLocal}</ThemedText>
                  <ThemedText className="opacity-50 text-sm">
                    {selectedFlight.originCode} → MLE
                  </ThemedText>
                </View>
              </View>
            </View>
          </AnimatedView>
        </View>

        {/* Session Info */}
        <View className="px-4 mt-6 mb-4">
          <View className="flex-row items-center mb-2">
            <Icon name="Waves" size={22} color={colors.highlight} />
            <ThemedText className="font-bold text-xl ml-2">E-Foil Sessions</ThemedText>
          </View>
          <ThemedText className="opacity-60">
            45-minute sessions starting 1 hour after arrival. Pick your slot below.
          </ThemedText>
        </View>

        {/* Slots Grid */}
        {isLoading ? (
          <View className="px-4 flex-row flex-wrap gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <View key={i} className="w-[48%]">
                <SlotCardSkeleton />
              </View>
            ))}
          </View>
        ) : (
          <FlatList
            data={currentSlots}
            renderItem={renderSlotCard}
            keyExtractor={keyExtractor}
            numColumns={2}
            columnWrapperStyle={{ paddingHorizontal: 16, gap: 12 }}
            contentContainerStyle={{ paddingBottom: 200, gap: 12 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center py-12 px-4">
                <Icon name="CalendarX" size={48} color={colors.placeholder} />
                <ThemedText className="text-lg font-semibold mt-4">No slots available</ThemedText>
                <ThemedText className="opacity-50 text-center mt-1">
                  All sessions for this flight are fully booked
                </ThemedText>
              </View>
            }
          />
        )}

        {/* Legend */}
        <View className="px-4 py-3 bg-background border-t border-border">
          <View className="flex-row items-center justify-center gap-6">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
              <ThemedText className="text-sm opacity-60">Available</ThemedText>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-red-400 mr-2" />
              <ThemedText className="text-sm opacity-60">Booked</ThemedText>
            </View>
            <View className="flex-row items-center">
              <Icon name="Flame" size={14} color="#EF4444" />
              <ThemedText className="text-sm opacity-60 ml-1">Popular</ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom CTA */}
      <View 
        className="absolute bottom-0 left-0 right-0 bg-background border-t border-border px-4 pt-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        {selectedSlot ? (
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <ThemedText className="opacity-50 text-sm">Selected Session</ThemedText>
              <ThemedText className="font-bold text-lg">
                {selectedSlot.startLocal} - {selectedSlot.endLocal}
              </ThemedText>
            </View>
            <View className="items-end">
              <ThemedText className="opacity-50 text-sm">Price</ThemedText>
              <ThemedText className="font-bold text-2xl" style={{ color: colors.highlight }}>
                $150
              </ThemedText>
            </View>
          </View>
        ) : (
          <ThemedText className="text-center opacity-50 mb-4">
            Select a time slot to continue
          </ThemedText>
        )}
        
        <Button
          title="Continue to Checkout"
          onPress={handleContinue}
          disabled={!selectedSlot}
          iconEnd="ArrowRight"
        />
      </View>
    </View>
  );
}

// Slot Card Component
const SlotCard = React.memo(function SlotCard({ slot, isSelected, onPress }: {
  slot: Slot;
  isSelected: boolean;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  
  return (
    <Pressable
      onPress={onPress}
      disabled={!slot.available}
      className="flex-1 rounded-xl overflow-hidden min-h-[140px]"
      style={[
        shadowPresets.card,
        {
          backgroundColor: isSelected ? colors.highlight : colors.secondary,
          opacity: slot.available ? 1 : 0.5,
        }
      ]}
    >
      <View className="p-4 flex-1">
        {/* Time + Popular Badge */}
        <View className="flex-row items-center justify-between mb-1">
          <ThemedText 
            className="font-bold text-xl"
            style={isSelected ? { color: 'white' } : undefined}
          >
            {slot.startLocal}
          </ThemedText>
          {slot.isPopular && slot.available && (
            <Icon name="Flame" size={16} color={isSelected ? 'white' : '#EF4444'} />
          )}
        </View>
        
        <ThemedText 
          className="text-sm mb-3"
          style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : colors.placeholder }}
        >
          {slot.startLocal} - {slot.endLocal}
        </ThemedText>

        {/* Crew Badges */}
        {slot.peers.length > 0 && (
          <View className="flex-row flex-wrap gap-1 mb-2">
            {slot.peers.slice(0, 2).map((peer) => (
              <View
                key={peer.id}
                className="px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: isSelected 
                    ? 'rgba(255,255,255,0.2)' 
                    : getAirlineColor(peer.airlineCode)
                }}
              >
                <ThemedText className="text-white text-xs font-medium">
                  {peer.airlineCode}
                </ThemedText>
              </View>
            ))}
            {slot.bookedCount > 2 && (
              <View
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : colors.border }}
              >
                <ThemedText 
                  className="text-xs font-medium"
                  style={isSelected ? { color: 'white' } : undefined}
                >
                  +{slot.bookedCount - 2}
                </ThemedText>
              </View>
            )}
          </View>
        )}

        {/* Status + Price */}
        <View className="flex-row items-center justify-between mt-auto">
          <View className="flex-row items-center">
            <View 
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: slot.available ? '#22C55E' : '#EF4444' }}
            />
            <ThemedText 
              className="text-xs"
              style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : colors.placeholder }}
            >
              {slot.available ? 'Available' : 'Booked'}
            </ThemedText>
          </View>
          <ThemedText 
            className="font-bold"
            style={isSelected ? { color: 'white' } : { color: colors.highlight }}
          >
            $150
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
});
