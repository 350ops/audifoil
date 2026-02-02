import React, { useEffect } from 'react';
import { View, Pressable, ScrollView, Share } from 'react-native';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { useEfoil, AIRLINE_COLORS } from '@/contexts/EfoilContext';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  withTiming 
} from 'react-native-reanimated';

export default function ConfirmationScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { bookings, setSelectedFlight, setSelectedSlot } = useEfoil();

  // Find the booking
  const booking = bookings.find(b => b.id === bookingId) || bookings[bookings.length - 1];

  // Animation values
  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);

  useEffect(() => {
    checkOpacity.value = withDelay(300, withTiming(1, { duration: 300 }));
    checkScale.value = withDelay(300, withSpring(1, { damping: 12, stiffness: 200 }));
  }, []);

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkOpacity.value,
  }));

  const handleDone = () => {
    // Reset selections
    setSelectedFlight(null);
    setSelectedSlot(null);
    router.replace('/(drawer)/(tabs)');
  };

  const handleShare = async () => {
    if (!booking) return;
    
    try {
      await Share.share({
        message: `I just booked an Audi e-foil session in the Maldives! 🌊\n\nSession: ${booking.slot.startTime} - ${booking.slot.endTime}\nConfirmation: ${booking.confirmationCode}\n\n#audiFoil #Maldives`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  if (!booking) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ThemedText>Booking not found</ThemedText>
        <Button title="Go Home" onPress={handleDone} className="mt-4" />
      </View>
    );
  }

  const airlineColor = AIRLINE_COLORS[booking.flight.airlineCode] || colors.highlight;

  return (
    <View className="flex-1 bg-background">
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top }}
      >
        {/* Success Header */}
        <View className="items-center pt-8 pb-6 px-4">
          <Animated.View 
            style={[checkAnimatedStyle]}
            className="w-24 h-24 rounded-full items-center justify-center mb-6"
          >
            <LinearGradient
              colors={['#22C55E', '#16A34A']}
              className="w-full h-full rounded-full items-center justify-center"
            >
              <Icon name="Check" size={48} color="white" strokeWidth={3} />
            </LinearGradient>
          </Animated.View>
          
          <AnimatedView animation="fadeIn" duration={400} delay={500}>
            <ThemedText className="text-3xl font-bold text-center">Booking Confirmed!</ThemedText>
            <ThemedText className="opacity-60 text-center mt-2 text-lg">
              Get ready to fly over paradise
            </ThemedText>
          </AnimatedView>
        </View>

        {/* Confirmation Code */}
        <View className="px-4 mb-6">
          <AnimatedView animation="scaleIn" duration={300} delay={600}>
            <View 
              className="bg-secondary rounded-2xl p-5 items-center"
              style={shadowPresets.card}
            >
              <ThemedText className="opacity-50 text-sm mb-1">Confirmation Code</ThemedText>
              <ThemedText 
                className="text-3xl font-bold tracking-widest"
                style={{ color: colors.highlight }}
              >
                {booking.confirmationCode}
              </ThemedText>
            </View>
          </AnimatedView>
        </View>

        {/* Booking Details Card */}
        <View className="px-4 mb-6">
          <AnimatedView animation="fadeIn" duration={400} delay={700}>
            <View className="bg-secondary rounded-2xl overflow-hidden" style={shadowPresets.card}>
              {/* Header with gradient */}
              <LinearGradient
                colors={[colors.highlight, colors.oceanLight || '#00A6F4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="p-4"
              >
                <View className="flex-row items-center">
                  <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mr-4">
                    <Icon name="Waves" size={24} color="white" />
                  </View>
                  <View>
                    <ThemedText className="text-white font-bold text-lg">
                      Audi E-Foil Session
                    </ThemedText>
                    <ThemedText className="text-white/80">
                      45 minutes • Professional instruction
                    </ThemedText>
                  </View>
                </View>
              </LinearGradient>

              {/* Details */}
              <View className="p-4">
                {/* Time */}
                <DetailRow 
                  icon="Clock" 
                  label="Session Time" 
                  value={`${booking.slot.startTime} - ${booking.slot.endTime}`}
                />
                
                {/* Date */}
                <DetailRow 
                  icon="Calendar" 
                  label="Date" 
                  value="Today"
                />
                
                {/* Location */}
                <DetailRow 
                  icon="MapPin" 
                  label="Location" 
                  value="Malé Lagoon Dock"
                />

                {/* Flight */}
                <View className="flex-row items-center py-3 border-t border-border">
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: airlineColor }}
                  >
                    <ThemedText className="text-white text-xs font-bold">
                      {booking.flight.airlineCode}
                    </ThemedText>
                  </View>
                  <View className="flex-1">
                    <ThemedText className="opacity-50 text-sm">Your Flight</ThemedText>
                    <ThemedText className="font-semibold">
                      {booking.flight.flightNumber} • Arrives {booking.flight.arrivalTime}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>
          </AnimatedView>
        </View>

        {/* Next Steps */}
        <View className="px-4 mb-6">
          <ThemedText className="font-bold text-lg mb-3">Next Steps</ThemedText>
          <AnimatedView animation="fadeIn" duration={400} delay={800}>
            <View className="bg-secondary rounded-xl p-4" style={shadowPresets.card}>
              <NextStepItem 
                number="1" 
                title="Land in Malé" 
                description={`Your flight arrives at ${booking.flight.arrivalTime}`}
              />
              <NextStepItem 
                number="2" 
                title="Meet at the dock" 
                description="Look for our audiFoil team with the blue flags"
              />
              <NextStepItem 
                number="3" 
                title="Gear up" 
                description="We'll provide all equipment and safety briefing"
              />
              <NextStepItem 
                number="4" 
                title="Fly!" 
                description={`Your session starts at ${booking.slot.startTime}`}
                isLast
              />
            </View>
          </AnimatedView>
        </View>

        {/* Share Section */}
        <View className="px-4 mb-8">
          <AnimatedView animation="scaleIn" duration={300} delay={900}>
            <Pressable
              onPress={handleShare}
              className="bg-secondary rounded-xl p-4 flex-row items-center"
              style={shadowPresets.card}
            >
              <View className="w-12 h-12 rounded-xl bg-highlight/10 items-center justify-center mr-4">
                <Icon name="Share2" size={24} color={colors.highlight} />
              </View>
              <View className="flex-1">
                <ThemedText className="font-semibold">Share Your Booking</ThemedText>
                <ThemedText className="opacity-50 text-sm">
                  Let your crew know you're flying today!
                </ThemedText>
              </View>
              <Icon name="ChevronRight" size={20} color={colors.placeholder} />
            </Pressable>
          </AnimatedView>
        </View>

        <View className="h-32" />
      </ScrollView>

      {/* Bottom Button */}
      <View 
        className="absolute bottom-0 left-0 right-0 bg-background px-4 pt-4 border-t border-border"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Button
          title="Done"
          onPress={handleDone}
          iconEnd="Check"
        />
      </View>
    </View>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  const colors = useThemeColors();
  return (
    <View className="flex-row items-center py-3 border-t border-border first:border-t-0">
      <Icon name={icon as any} size={18} color={colors.placeholder} className="mr-3" />
      <View className="flex-1">
        <ThemedText className="opacity-50 text-sm">{label}</ThemedText>
        <ThemedText className="font-semibold">{value}</ThemedText>
      </View>
    </View>
  );
}

function NextStepItem({ number, title, description, isLast }: {
  number: string;
  title: string;
  description: string;
  isLast?: boolean;
}) {
  const colors = useThemeColors();
  return (
    <View className={`flex-row ${!isLast ? 'mb-4' : ''}`}>
      <View 
        className="w-7 h-7 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: colors.highlight }}
      >
        <ThemedText className="text-white font-bold text-sm">{number}</ThemedText>
      </View>
      <View className="flex-1">
        <ThemedText className="font-semibold">{title}</ThemedText>
        <ThemedText className="opacity-50 text-sm">{description}</ThemedText>
      </View>
    </View>
  );
}
