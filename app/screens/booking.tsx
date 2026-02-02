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
          <Icon key="help" name="HelpCircle" size={22} onPress={() => {}} />
        ]}
      />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Your Flight - Compact */}
        <View className="px-4 pt-4">
          <AnimatedView animation="scaleIn" duration={300}>
            <View className="bg-secondary rounded-xl p-3 flex-row items-center" style={shadowPresets.card}>
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: airlineColor }}
              >
                <ThemedText className="text-white font-bold text-sm">{flight.airlineCode}</ThemedText>
              </View>
              <View className="flex-1">
                <ThemedText className="font-semibold">{flight.flightNumber}</ThemedText>
                <ThemedText className="text-xs opacity-50">{flight.airline}</ThemedText>
              </View>
              <View className="items-end">
                <ThemedText className="font-bold text-lg">{flight.arrivalTime}</ThemedText>
                <ThemedText className="opacity-50 text-xs">{flight.origin} → MLE</ThemedText>
              </View>
            </View>
          </AnimatedView>
        </View>

        {/* E-Foil Experience Info */}
        <View className="px-4 mt-6">
          <View className="flex-row items-center mb-3">
            <Icon name="Waves" size={20} color={colors.highlight} />
            <ThemedText className="font-bold text-lg ml-2">E-Foil Experience</ThemedText>
          </View>
          <ThemedText className="opacity-60 mb-4">
            Glide above crystal-clear waters on a premium Audi e-foil. Each 45-minute session includes professional instruction and all safety gear.
          </ThemedText>
          
          {/* Experience Highlights */}
          <View className="flex-row flex-wrap mb-4" style={{ gap: 8 }}>
            <View className="flex-row items-center bg-secondary rounded-full px-3 py-1.5">
              <Icon name="Clock" size={14} color={colors.highlight} />
              <ThemedText className="text-xs ml-1.5">45 min session</ThemedText>
            </View>
            <View className="flex-row items-center bg-secondary rounded-full px-3 py-1.5">
              <Icon name="GraduationCap" size={14} color={colors.highlight} />
              <ThemedText className="text-xs ml-1.5">Expert instructor</ThemedText>
            </View>
            <View className="flex-row items-center bg-secondary rounded-full px-3 py-1.5">
              <Icon name="Shield" size={14} color={colors.highlight} />
              <ThemedText className="text-xs ml-1.5">Safety gear included</ThemedText>
            </View>
            <View className="flex-row items-center bg-secondary rounded-full px-3 py-1.5">
              <Icon name="Zap" size={14} color={colors.highlight} />
              <ThemedText className="text-xs ml-1.5">No experience needed</ThemedText>
            </View>
          </View>
        </View>

        {/* Available Sessions */}
        <View className="px-4">
          <ThemedText className="font-bold text-lg mb-3">Available Sessions</ThemedText>
          <View className="flex-row flex-wrap" style={{ gap: 12 }}>
            {slots.map((slot, index) => (
              <View key={slot.id} style={{ width: '48%' }}>
                <AnimatedView animation="scaleIn" duration={250} delay={index * 40}>
                  <SlotCard
                    slot={slot}
                    isSelected={selectedSlot?.id === slot.id}
                    onPress={() => handleSlotPress(slot)}
                  />
                </AnimatedView>
              </View>
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
  const spotsLeft = slot.available ? Math.max(1, 4 - slot.bookedBy.length) : 0;
  
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
        {/* Time & Popular Badge */}
        <View className="flex-row items-center justify-between mb-1">
          <ThemedText 
            className="font-bold text-xl"
            style={isSelected ? { color: 'white' } : undefined}
          >
            {slot.startTime}
          </ThemedText>
          {slot.isPopular && (
            <Icon name="Flame" size={16} color={isSelected ? 'white' : '#EF4444'} />
          )}
        </View>
        
        <ThemedText 
          className="text-sm mb-3"
          style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : colors.placeholder }}
        >
          to {slot.endTime}
        </ThemedText>

        {/* Session Info */}
        <View className="flex-row items-center mb-3">
          <Icon 
            name="Waves" 
            size={14} 
            color={isSelected ? 'rgba(255,255,255,0.7)' : colors.placeholder} 
          />
          <ThemedText 
            className="text-xs ml-1"
            style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : colors.placeholder }}
          >
            45 min • Instructor included
          </ThemedText>
        </View>

        {/* Status & Price */}
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
              {slot.available ? `${spotsLeft} spots left` : 'Full'}
            </ThemedText>
          </View>
          <ThemedText 
            className="font-bold text-lg"
            style={isSelected ? { color: 'white' } : { color: colors.highlight }}
          >
            ${slot.price}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}
