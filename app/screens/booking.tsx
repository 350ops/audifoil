import React, { useMemo } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import Header from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { useEfoil, TimeSlot, AIRLINE_COLORS } from '@/contexts/EfoilContext';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function BookingScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { selectedFlight, getSlotsForFlight, selectedSlot, setSelectedSlot, flights, setSelectedFlight } = useEfoil();

  // If no flight selected, show flight selection
  const flight = selectedFlight || flights[0];
  
  const slots = useMemo(() => {
    if (!flight) return [];
    return getSlotsForFlight(flight.id);
  }, [flight?.id]);

  const handleSlotPress = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedSlot(slot);
    }
  };

  const handleContinue = () => {
    if (selectedSlot && flight) {
      setSelectedFlight(flight);
      router.push('/screens/checkout');
    }
  };

  if (!flight) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ThemedText>No flight selected</ThemedText>
        <Button title="Select Flight" onPress={() => router.push('/arrivals')} className="mt-4" />
      </View>
    );
  }

  const airlineColor = AIRLINE_COLORS[flight.airlineCode] || colors.highlight;

  return (
    <View className="flex-1 bg-background">
      <Header
        showBackButton
        title="Select Time Slot"
        rightComponents={[
          <Icon name="HelpCircle" size={22} onPress={() => {}} />
        ]}
      />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Selected Flight Card */}
        <View className="px-4 pt-4">
          <AnimatedView animation="scaleIn" duration={300}>
            <View className="bg-secondary rounded-2xl p-4" style={shadowPresets.card}>
              <View className="flex-row items-center">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: airlineColor }}
                >
                  <ThemedText className="text-white font-bold">{flight.airlineCode}</ThemedText>
                </View>
                <View className="flex-1">
                  <ThemedText className="font-bold text-lg">{flight.flightNumber}</ThemedText>
                  <ThemedText className="opacity-50">{flight.airline}</ThemedText>
                </View>
                <View className="items-end">
                  <ThemedText className="font-bold text-xl">{flight.arrivalTime}</ThemedText>
                  <ThemedText className="opacity-50 text-sm">{flight.origin} → MLE</ThemedText>
                </View>
              </View>
            </View>
          </AnimatedView>
        </View>

        {/* Session Info */}
        <View className="px-4 mt-6">
          <View className="flex-row items-center mb-3">
            <Icon name="Waves" size={20} color={colors.highlight} />
            <ThemedText className="font-bold text-lg ml-2">E-Foil Sessions</ThemedText>
          </View>
          <ThemedText className="opacity-60 mb-4">
            45-minute sessions starting 1 hour after your arrival. Select a slot below.
          </ThemedText>
        </View>

        {/* Time Slots Grid */}
        <View className="px-4">
          <View className="flex-row flex-wrap gap-3">
            {slots.map((slot, index) => (
              <AnimatedView
                key={slot.id}
                animation="scaleIn"
                duration={250}
                delay={index * 40}
                className="w-[48%]"
              >
                <SlotCard
                  slot={slot}
                  isSelected={selectedSlot?.id === slot.id}
                  onPress={() => handleSlotPress(slot)}
                />
              </AnimatedView>
            ))}
          </View>
        </View>

        {/* Legend */}
        <View className="px-4 mt-6">
          <View className="flex-row items-center gap-6">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
              <ThemedText className="text-sm opacity-60">Available</ThemedText>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-red-400 mr-2" />
              <ThemedText className="text-sm opacity-60">Fully Booked</ThemedText>
            </View>
            <View className="flex-row items-center">
              <Icon name="Flame" size={14} color="#EF4444" />
              <ThemedText className="text-sm opacity-60 ml-1">Popular</ThemedText>
            </View>
          </View>
        </View>

        <View className="h-40" />
      </ScrollView>

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
                {selectedSlot.startTime} - {selectedSlot.endTime}
              </ThemedText>
            </View>
            <View className="items-end">
              <ThemedText className="opacity-50 text-sm">Price</ThemedText>
              <ThemedText className="font-bold text-2xl" style={{ color: colors.highlight }}>
                ${selectedSlot.price}
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
function SlotCard({ slot, isSelected, onPress }: {
  slot: TimeSlot;
  isSelected: boolean;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  
  return (
    <Pressable
      onPress={onPress}
      disabled={!slot.available}
      className="rounded-xl overflow-hidden"
      style={[
        shadowPresets.card,
        {
          backgroundColor: isSelected ? colors.highlight : colors.secondary,
          opacity: slot.available ? 1 : 0.5,
        }
      ]}
    >
      <View className="p-4">
        {/* Time */}
        <View className="flex-row items-center justify-between mb-2">
          <ThemedText 
            className="font-bold text-lg"
            style={isSelected ? { color: 'white' } : undefined}
          >
            {slot.startTime}
          </ThemedText>
          {slot.isPopular && (
            <View className="flex-row items-center">
              <Icon name="Flame" size={14} color={isSelected ? 'white' : '#EF4444'} />
            </View>
          )}
        </View>
        
        <ThemedText 
          className="text-sm mb-3"
          style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : colors.placeholder }}
        >
          {slot.startTime} - {slot.endTime}
        </ThemedText>

        {/* Crew Badges */}
        {slot.bookedBy.length > 0 && (
          <View className="flex-row items-center gap-1 mb-2">
            {slot.bookedBy.map((crew) => (
              <View
                key={crew.id}
                className="px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: isSelected 
                    ? 'rgba(255,255,255,0.2)' 
                    : AIRLINE_COLORS[crew.airlineCode] || colors.highlight 
                }}
              >
                <ThemedText className="text-white text-xs font-medium">
                  {crew.airlineCode} ×{crew.count}
                </ThemedText>
              </View>
            ))}
          </View>
        )}

        {/* Status */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View 
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: slot.available ? '#22C55E' : '#EF4444' }}
            />
            <ThemedText 
              className="text-xs"
              style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : colors.placeholder }}
            >
              {slot.available ? 'Available' : 'Full'}
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
