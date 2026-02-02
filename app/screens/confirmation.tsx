import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AirlineLogo from '@/components/AirlineLogo';
import AnimatedView from '@/components/AnimatedView';
import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import ThemedText from '@/components/ThemedText';
import { useEfoil } from '@/contexts/EfoilContext';
import useThemeColors from '@/contexts/ThemeColors';
import { shadowPresets } from '@/utils/useShadow';

export default function ConfirmationScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { bookings, setSelectedFlight, setSelectedSlot } = useEfoil();

  // Find the booking
  const booking = bookings.find((b) => b.id === bookingId) || bookings[bookings.length - 1];

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
      <View className="flex-1 items-center justify-center bg-background">
        <ThemedText>Booking not found</ThemedText>
        <Button title="Go Home" onPress={handleDone} className="mt-4" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top }}>
        {/* Success Header */}
        <View className="items-center px-4 pb-6 pt-8">
          <Animated.View
            style={[checkAnimatedStyle]}
            className="mb-6 h-24 w-24 items-center justify-center rounded-full">
            <LinearGradient
              colors={['#22C55E', '#16A34A']}
              style={{
                height: '100%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 9999,
              }}>
              <Icon name="Check" size={48} color="white" strokeWidth={3} />
            </LinearGradient>
          </Animated.View>

          <AnimatedView animation="fadeIn" duration={400} delay={500}>
            <ThemedText className="text-center text-3xl font-bold">Booking Confirmed!</ThemedText>
            <ThemedText className="mt-2 text-center text-lg opacity-60">
              Get ready to fly over paradise
            </ThemedText>
          </AnimatedView>
        </View>

        {/* Confirmation Code */}
        <View className="mb-6 px-4">
          <AnimatedView animation="scaleIn" duration={300} delay={600}>
            <View className="items-center rounded-2xl bg-secondary p-5" style={shadowPresets.card}>
              <ThemedText className="mb-1 text-sm opacity-50">Confirmation Code</ThemedText>
              <ThemedText
                className="text-3xl font-bold tracking-widest"
                style={{ color: colors.highlight }}>
                {booking.confirmationCode}
              </ThemedText>
            </View>
          </AnimatedView>
        </View>

        {/* Booking Details Card */}
        <View className="mb-6 px-4">
          <AnimatedView animation="fadeIn" duration={400} delay={700}>
            <View className="overflow-hidden rounded-2xl bg-secondary" style={shadowPresets.card}>
              {/* Header with gradient */}
              <LinearGradient
                colors={[colors.highlight, colors.oceanLight || '#00A6F4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ padding: 16 }}>
                <View className="flex-row items-center">
                  <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-white/20">
                    <Icon name="Waves" size={24} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-white">
                      E-Foil Adventure
                    </Text>
                    <Text className="text-white/80">
                      45 min • Fly above the Indian Ocean
                    </Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Details */}
              <View className="p-4">
                <DetailRow
                  icon="Clock"
                  label="Session Time"
                  value={`${booking.slot.startTime} - ${booking.slot.endTime}`}
                  isFirst
                />
                <DetailRow icon="Calendar" label="Date" value="Today" />
                <DetailRow icon="MapPin" label="Location" value="Malé Lagoon Dock" />

                {/* Flight */}
                <View className="flex-row items-center border-t border-border py-3">
                  <AirlineLogo
                    airlineCode={booking.flight.airlineCode}
                    size={32}
                    style={{ marginRight: 12 }}
                  />
                  <View className="flex-1">
                    <ThemedText className="text-sm opacity-50">Your Flight</ThemedText>
                    <ThemedText className="font-semibold">
                      {booking.flight.flightNumber} • Arrives {booking.flight.arrivalTime}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>
          </AnimatedView>
        </View>

        {/* What's Included */}
        <View className="mb-6 px-4">
          <ThemedText className="mb-3 text-lg font-bold">What's Included</ThemedText>
          <AnimatedView animation="fadeIn" duration={400} delay={800}>
            <View className="rounded-xl bg-secondary p-4" style={shadowPresets.card}>
              <IncludedItem icon="Waves" text="Premium Audi e-foil equipment" />
              <IncludedItem icon="GraduationCap" text="Professional 1-on-1 instruction" />
              <IncludedItem icon="Shield" text="Life jacket & safety gear" />
              <IncludedItem icon="Droplets" text="Wetsuit (if needed)" />
              <IncludedItem icon="Camera" text="Action photos of your session" isLast />
            </View>
          </AnimatedView>
        </View>

        {/* Next Steps */}
        <View className="mb-6 px-4">
          <ThemedText className="mb-3 text-lg font-bold">Your Journey</ThemedText>
          <AnimatedView animation="fadeIn" duration={400} delay={850}>
            <View className="rounded-xl bg-secondary p-4" style={shadowPresets.card}>
              <NextStepItem
                number="1"
                title="Arrive in Malé"
                description={`Flight lands at ${booking.flight.arrivalTime}`}
              />
              <NextStepItem
                number="2"
                title="Meet Your Instructor"
                description="Look for blue audiFoil flags at the lagoon dock"
              />
              <NextStepItem
                number="3"
                title="Quick Safety Briefing"
                description="10-minute intro to e-foiling basics"
              />
              <NextStepItem
                number="4"
                title="Take Flight!"
                description={`Your 45-min adventure starts at ${booking.slot.startTime}`}
                isLast
              />
            </View>
          </AnimatedView>
        </View>

        {/* Share Section */}
        <View className="mb-8 px-4">
          <AnimatedView animation="scaleIn" duration={300} delay={900}>
            <Pressable
              onPress={handleShare}
              className="flex-row items-center rounded-xl bg-secondary p-4"
              style={shadowPresets.card}>
              <View className="bg-highlight/10 mr-4 h-12 w-12 items-center justify-center rounded-xl">
                <Icon name="Share2" size={24} color={colors.highlight} />
              </View>
              <View className="flex-1">
                <ThemedText className="font-semibold">Share Your Booking</ThemedText>
                <ThemedText className="text-sm opacity-50">
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
        className="absolute bottom-0 left-0 right-0 border-t border-border bg-background px-4 pt-4"
        style={{ paddingBottom: insets.bottom + 16 }}>
        <Button title="Done" onPress={handleDone} iconEnd="Check" />
      </View>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
  isFirst,
}: {
  icon: string;
  label: string;
  value: string;
  isFirst?: boolean;
}) {
  const colors = useThemeColors();
  return (
    <View className={`flex-row items-center py-3 ${isFirst ? '' : 'border-t border-border'}`}>
      <Icon name={icon as any} size={18} color={colors.placeholder} style={{ marginRight: 12 }} />
      <View className="flex-1">
        <ThemedText className="text-sm opacity-50">{label}</ThemedText>
        <ThemedText className="font-semibold">{value}</ThemedText>
      </View>
    </View>
  );
}

function IncludedItem({
  icon,
  text,
  isLast,
}: {
  icon: string;
  text: string;
  isLast?: boolean;
}) {
  const colors = useThemeColors();
  return (
    <View className={`flex-row items-center ${!isLast ? 'mb-3' : ''}`}>
      <View
        className="mr-3 h-8 w-8 items-center justify-center rounded-full"
        style={{ backgroundColor: `${colors.highlight}15` }}>
        <Icon name={icon as any} size={16} color={colors.highlight} />
      </View>
      <ThemedText className="flex-1">{text}</ThemedText>
      <Icon name="Check" size={16} color="#22C55E" />
    </View>
  );
}

function NextStepItem({
  number,
  title,
  description,
  isLast,
}: {
  number: string;
  title: string;
  description: string;
  isLast?: boolean;
}) {
  const colors = useThemeColors();
  return (
    <View className={`flex-row ${!isLast ? 'mb-4' : ''}`}>
      <View
        className="mr-3 h-7 w-7 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.highlight }}>
        <Text className="text-sm font-bold text-white">{number}</Text>
      </View>
      <View className="flex-1">
        <ThemedText className="font-semibold">{title}</ThemedText>
        <ThemedText className="text-sm opacity-50">{description}</ThemedText>
      </View>
    </View>
  );
}
