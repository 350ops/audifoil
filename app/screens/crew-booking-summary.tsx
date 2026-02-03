import React, { useMemo } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import Header from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useStore } from '@/store/useStore';
import { ACTIVITIES, MALDIVES_ADVENTURE_ID, ActivitySlot } from '@/data/activities';

export default function CrewBookingSummaryScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { setSelectedActivity, setSelectedActivitySlot, setGuestCount } = useStore();
  
  const params = useLocalSearchParams<{
    date: string;
    dateLabel: string;
    startTime: string;
    endTime: string;
    duration: string;
    seats: string;
    totalPrice: string;
    seatPrice: string;
    itinerary: string;
  }>();

  const seats = parseInt(params.seats || '1', 10);
  const seatPrice = parseInt(params.seatPrice || '80', 10);
  const totalPrice = parseInt(params.totalPrice || '80', 10);
  const duration = parseInt(params.duration || '5', 10);

  const itinerarySteps = useMemo(() => {
    if (duration === 5) {
      return [
        { time: params.startTime, title: 'Departure', description: 'Board the boat at Malé harbor', icon: 'Anchor' },
        { time: addMinutes(params.startTime, 30), title: 'Lagoon Cruise', description: 'Scenic cruise through crystal waters', icon: 'Ship' },
        { time: addMinutes(params.startTime, 90), title: 'Snorkel Stop', description: 'Explore vibrant coral reefs', icon: 'Waves' },
        { time: addMinutes(params.startTime, 150), title: 'Fishing Option', description: 'Try traditional Maldivian fishing', icon: 'Fish' },
        { time: addMinutes(params.startTime, 210), title: 'Sandbank Photo Stop', description: 'Pristine white sandbank experience', icon: 'Camera' },
        { time: params.endTime, title: 'Return', description: 'Arrive back at Malé harbor', icon: 'MapPin' },
      ];
    }
    return [
      { time: params.startTime, title: 'Departure', description: 'Board the boat at Malé harbor', icon: 'Anchor' },
      { time: addMinutes(params.startTime, 30), title: 'Lagoon Cruise', description: 'Scenic cruise through crystal waters', icon: 'Ship' },
      { time: addMinutes(params.startTime, 75), title: 'Snorkel Stop', description: 'Explore vibrant coral reefs', icon: 'Waves' },
      { time: addMinutes(params.startTime, 135), title: 'Quick Sandbank Pass', description: 'Photo opportunity at the sandbank', icon: 'Camera' },
      { time: params.endTime, title: 'Return', description: 'Arrive back at Malé harbor', icon: 'MapPin' },
    ];
  }, [duration, params.startTime, params.endTime]);

  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Find the Maldives Adventure activity
    const activity = ACTIVITIES.find(a => a.id === MALDIVES_ADVENTURE_ID);
    if (!activity) {
      console.error('Activity not found');
      return;
    }
    
    // Create a slot from the params
    const slot: ActivitySlot = {
      id: `crew-booking-${Date.now()}`,
      activityId: MALDIVES_ADVENTURE_ID,
      startTime: params.startTime || '09:00',
      endTime: params.endTime || '14:00',
      date: params.date || new Date().toISOString().split('T')[0],
      dateLabel: params.dateLabel || 'Today',
      price: seatPrice,
      spotsRemaining: 6 - seats, // Assume 6 max spots
      maxSpots: 6,
      isSunset: false,
      isPopular: false,
      isPrivate: false,
      bookedBy: [],
    };
    
    // Set the store values
    setSelectedActivity(activity);
    setSelectedActivitySlot(slot);
    setGuestCount(seats);
    
    // Navigate to checkout
    router.push('/screens/activity-checkout');
  };

  return (
    <View className="flex-1 bg-background">
      <Header showBackButton title="Trip Summary" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 180 }}
      >
        {/* Summary Card */}
        <View className="px-4 pt-4">
          <AnimatedView animation="scaleIn">
            <View className="bg-secondary rounded-2xl overflow-hidden" style={shadowPresets.large}>
              {/* Header Banner */}
              <View 
                className="p-4"
                style={{ backgroundColor: colors.highlight }}
              >
                <View className="flex-row items-center">
                  <View className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center mr-3">
                    <Icon name="Users" size={24} color="white" />
                  </View>
                  <View className="flex-1">
                    <ThemedText className="text-white font-bold text-lg">Crew Shared Trip</ThemedText>
                    <ThemedText className="text-white/80 text-sm">{duration} hour adventure</ThemedText>
                  </View>
                </View>
              </View>

              {/* Trip Details */}
              <View className="p-4">
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <Icon name="Calendar" size={18} color={colors.highlight} />
                    <ThemedText className="font-semibold ml-2">{params.dateLabel}</ThemedText>
                  </View>
                  <View className="flex-row items-center">
                    <Icon name="Clock" size={18} color={colors.highlight} />
                    <ThemedText className="font-semibold ml-2">{params.startTime} - {params.endTime}</ThemedText>
                  </View>
                </View>

                <View className="bg-background rounded-xl p-3">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <ThemedText className="text-sm" style={{ color: colors.textMuted }}>Your seats</ThemedText>
                      <ThemedText className="font-bold text-xl" style={{ color: colors.text }}>{seats} seat{seats > 1 ? 's' : ''}</ThemedText>
                    </View>
                    <View className="items-end">
                      <ThemedText className="text-sm" style={{ color: colors.textMuted }}>Price per seat</ThemedText>
                      <ThemedText className="font-bold text-xl" style={{ color: colors.text }}>${seatPrice}</ThemedText>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </AnimatedView>
        </View>

        {/* Itinerary */}
        <View className="px-4 mt-6">
          <AnimatedView animation="fadeIn" delay={100}>
            <ThemedText className="mb-4" style={{ fontSize: 22, fontWeight: '700', color: '#000000', letterSpacing: -0.5 }}>Your Itinerary</ThemedText>
            <View className="bg-secondary rounded-2xl p-4" style={shadowPresets.card}>
              {itinerarySteps.map((step, index) => (
                <View key={index} className="flex-row">
                  {/* Timeline */}
                  <View className="items-center mr-4">
                    <View 
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: colors.highlight + '15' }}
                    >
                      <Icon name={step.icon as any} size={18} color={colors.highlight} />
                    </View>
                    {index < itinerarySteps.length - 1 && (
                      <View 
                        className="w-0.5 flex-1 my-1"
                        style={{ backgroundColor: colors.border, minHeight: 30 }}
                      />
                    )}
                  </View>
                  
                  {/* Content */}
                  <View className={`flex-1 ${index < itinerarySteps.length - 1 ? 'pb-4' : ''}`}>
                    <ThemedText className="text-xs" style={{ color: colors.textMuted }}>{step.time}</ThemedText>
                    <ThemedText className="font-bold" style={{ color: colors.text }}>{step.title}</ThemedText>
                    <ThemedText className="text-sm" style={{ color: colors.textMuted }}>{step.description}</ThemedText>
                  </View>
                </View>
              ))}
            </View>
          </AnimatedView>
        </View>

        {/* Crew Matching Info */}
        <View className="px-4 mt-6">
          <AnimatedView animation="fadeIn" delay={200}>
            <View className="bg-secondary rounded-2xl p-4" style={shadowPresets.card}>
              <View className="flex-row items-center mb-3">
                <View 
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: colors.highlight + '15' }}
                >
                  <Icon name="Plane" size={18} color={colors.highlight} />
                </View>
                <ThemedText className="font-bold text-lg flex-1" style={{ color: colors.text }}>Crew Matching</ThemedText>
              </View>
              
              {seats < 4 ? (
                <View>
                  <ThemedText className="leading-5" style={{ color: colors.textMuted }}>
                    You're joining a shared trip! We'll automatically match you with other airline crew to fill the remaining seats.
                  </ThemedText>
                  <View className="bg-background rounded-xl p-3 mt-3 flex-row items-center">
                    <Icon name="Info" size={16} color={colors.highlight} />
                    <ThemedText className="text-sm ml-2 flex-1" style={{ color: colors.textMuted }}>
                      Trip confirms when 4 total seats are filled. Free reschedule until confirmed.
                    </ThemedText>
                  </View>
                </View>
              ) : (
                <View>
                  <ThemedText className="leading-5" style={{ color: colors.textMuted }}>
                    With {seats} seats booked, your trip will likely confirm immediately!
                  </ThemedText>
                  <View className="bg-green-500/10 rounded-xl p-3 mt-3 flex-row items-center">
                    <Icon name="CheckCircle" size={16} color="#22C55E" />
                    <ThemedText className="text-sm ml-2 flex-1" style={{ color: '#22C55E' }}>
                      Ready for instant confirmation
                    </ThemedText>
                  </View>
                </View>
              )}
            </View>
          </AnimatedView>
        </View>

        {/* What's Included */}
        <View className="px-4 mt-6">
          <AnimatedView animation="fadeIn" delay={300}>
            <ThemedText className="mb-4" style={{ fontSize: 22, fontWeight: '700', color: '#000000', letterSpacing: -0.5 }}>What's Included</ThemedText>
            <View className="bg-secondary rounded-2xl p-4" style={shadowPresets.card}>
              {[
                'Professional captain & crew',
                'Snorkeling equipment',
                'Refreshments & snacks',
                'Fishing gear (5h trips)',
                'Safety equipment',
                'Photos of your trip',
              ].map((item, index) => (
                <View key={index} className={`flex-row items-center ${index > 0 ? 'mt-3' : ''}`}>
                  <Icon name="Check" size={16} color="#22C55E" />
                  <ThemedText className="ml-3">{item}</ThemedText>
                </View>
              ))}
            </View>
          </AnimatedView>
        </View>

        {/* Cancellation Policy */}
        <View className="px-4 mt-6">
          <AnimatedView animation="fadeIn" delay={400}>
            <View className="bg-green-500/10 rounded-2xl p-4 flex-row items-start">
              <Icon name="Shield" size={20} color="#22C55E" />
              <View className="ml-3 flex-1">
                <ThemedText className="font-bold" style={{ color: '#22C55E' }}>Free Cancellation</ThemedText>
                <ThemedText className="text-sm mt-1" style={{ color: colors.textMuted }}>
                  Cancel for free until the trip is confirmed (4 seats filled). After confirmation, cancel up to 24 hours before departure.
                </ThemedText>
              </View>
            </View>
          </AnimatedView>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-background border-t border-border px-4 pt-4"
        style={[shadowPresets.large, { paddingBottom: insets.bottom + 16 }]}
      >
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <ThemedText className="text-sm" style={{ color: colors.textMuted }}>Total for {seats} seat{seats > 1 ? 's' : ''}</ThemedText>
            <ThemedText className="font-bold text-3xl" style={{ color: colors.text }}>
              ${totalPrice}
            </ThemedText>
          </View>
          <View className="items-end">
            <ThemedText className="text-xs" style={{ color: colors.textMuted }}>per seat</ThemedText>
            <ThemedText className="font-semibold text-lg" style={{ color: colors.text }}>${seatPrice}</ThemedText>
          </View>
        </View>

        <Button
          title="Confirm Booking"
          onPress={handleConfirm}
          iconEnd="ArrowRight"
          size="large"
          variant="cta"
          rounded="full"
        />
      </View>
    </View>
  );
}

// Helper to add minutes to time string
function addMinutes(timeStr: string, minutes: number): string {
  if (!timeStr) return '';
  const [hours, mins] = timeStr.split(':').map(Number);
  const totalMins = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMins / 60) % 24;
  const newMins = totalMins % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
}
