import React, { useEffect } from 'react';
import { View, Share, ScrollView } from 'react-native';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { useStore } from '@/store/useStore';
import AirlineLogo from '@/components/AirlineLogo';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function SuccessScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { latestBooking, resetSelection } = useStore();

  // Animation values
  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    // Celebration haptic on mount
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    checkOpacity.value = withDelay(100, withTiming(1, { duration: 300 }));
    checkScale.value = withDelay(100, withSpring(1, { damping: 10, stiffness: 200 }));
    contentOpacity.value = withDelay(500, withTiming(1, { duration: 400 }));
  }, []);

  const checkmarkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const handleShare = async () => {
    if (!latestBooking) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Share.share({
      message: `🏄‍♂️ I just booked an Audi e-foil session in the Maldives!\n\n✈️ Flight: ${latestBooking.flightNo}\n🕐 Session: ${latestBooking.slotStart} - ${latestBooking.slotEnd}\n📍 Location: Malé Lagoon\n\nJoin me! Book at foilTribe Adventures.com`,
    });
  };

  const handleViewBookings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resetSelection();
    router.replace('/screens/my-bookings');
  };

  const handleBookAnother = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    resetSelection();
    router.replace('/arrivals');
  };

  if (!latestBooking) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-4">
        <Icon name="AlertCircle" size={48} color={colors.placeholder} />
        <ThemedText className="text-xl font-bold mt-4">No booking found</ThemedText>
        <Button title="Go Home" onPress={() => router.replace('/')} className="mt-6" />
      </View>
    );
  }


  return (
    <View className="flex-1 bg-background">
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Success Header */}
        <LinearGradient
          colors={[colors.highlight, '#00A6F4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: insets.top + 40, paddingBottom: 48, alignItems: 'center' }}
        >
          <Animated.View 
            className="w-24 h-24 rounded-full bg-white items-center justify-center mb-6"
            style={checkmarkStyle}
          >
            <Icon name="Check" size={48} color={colors.highlight} strokeWidth={3} />
          </Animated.View>
          
          <AnimatedView animation="fadeIn" delay={400}>
            <ThemedText className="text-white text-3xl font-bold text-center">
              You're Booked!
            </ThemedText>
            <ThemedText className="text-white/80 text-center mt-2">
              Get ready to fly over paradise
            </ThemedText>
          </AnimatedView>
        </LinearGradient>

        {/* Confirmation Code */}
        <Animated.View style={contentStyle}>
          <View className="px-4 -mt-6">
            <View 
              className="bg-secondary rounded-2xl p-5 items-center"
              style={shadowPresets.large}
            >
              <ThemedText className="opacity-50 text-sm mb-1">Confirmation Code</ThemedText>
              <ThemedText 
                className="text-3xl font-bold tracking-widest"
                style={{ color: colors.highlight }}
              >
                {latestBooking.confirmationCode}
              </ThemedText>
            </View>
          </View>

          {/* Booking Details */}
          <View className="px-4 mt-6">
            <ThemedText className="text-xl font-bold mb-4">Booking Details</ThemedText>
            
            <View className="bg-secondary rounded-2xl overflow-hidden" style={shadowPresets.card}>
              {/* Flight Info */}
              <View className="p-4 flex-row items-center border-b border-border">
                <AirlineLogo airlineCode={latestBooking.airlineCode} size={48} style={{ marginRight: 16 }} />
                <View className="flex-1">
                  <ThemedText className="font-bold text-lg">{latestBooking.flightNo}</ThemedText>
                  <ThemedText className="opacity-50">
                    {latestBooking.originCity} → Malé
                  </ThemedText>
                </View>
                <View className="items-end">
                  <ThemedText className="font-bold">{latestBooking.arrivalTime}</ThemedText>
                  <ThemedText className="opacity-50 text-sm">Arrival</ThemedText>
                </View>
              </View>

              {/* Session Details */}
              <View className="p-4">
                <DetailRow icon="Clock" label="Session Time" value={`${latestBooking.slotStart} - ${latestBooking.slotEnd}`} />
                <DetailRow icon="Calendar" label="Date" value={new Date(latestBooking.dateISO).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} />
                <DetailRow icon="MapPin" label="Location" value="Malé Lagoon Dock" />
                <DetailRow icon="Waves" label="Duration" value="45 minutes" isLast />
              </View>
            </View>
          </View>

          {/* Next Steps */}
          <View className="px-4 mt-6">
            <ThemedText className="text-xl font-bold mb-4">Next Steps</ThemedText>
            
            <View className="bg-secondary rounded-2xl p-4" style={shadowPresets.card}>
              <NextStepItem 
                number="1" 
                title="Check WhatsApp" 
                description="We'll send meeting point details" 
              />
              <NextStepItem 
                number="2" 
                title="Arrive 15 min early" 
                description="Time for safety briefing" 
              />
              <NextStepItem 
                number="3" 
                title="Bring sunscreen" 
                description="We provide everything else" 
                isLast
              />
            </View>
          </View>

          {/* Share Banner */}
          <View className="px-4 mt-6">
            <View 
              className="bg-secondary rounded-2xl p-5 flex-row items-center"
              style={shadowPresets.card}
            >
              <View className="w-12 h-12 rounded-full bg-highlight/10 items-center justify-center mr-4">
                <Icon name="Share2" size={24} color={colors.highlight} />
              </View>
              <View className="flex-1">
                <ThemedText className="font-bold">Share Your Booking</ThemedText>
                <ThemedText className="opacity-50 text-sm">Let your crew know!</ThemedText>
              </View>
              <Button 
                title="Share" 
                variant="secondary" 
                size="small" 
                onPress={handleShare} 
              />
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Actions */}
      <View 
        className="absolute bottom-0 left-0 right-0 bg-background border-t border-border px-4 pt-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button 
              title="View Bookings" 
              variant="secondary" 
              onPress={handleViewBookings} 
            />
          </View>
          <View className="flex-1">
            <Button 
              title="Book Another" 
              onPress={handleBookAnother} 
            />
          </View>
        </View>
      </View>
    </View>
  );
}

function DetailRow({ icon, label, value, isLast }: {
  icon: string;
  label: string;
  value: string;
  isLast?: boolean;
}) {
  const colors = useThemeColors();
  return (
    <View className={`flex-row items-center justify-between py-3 ${!isLast ? 'border-b border-border' : ''}`}>
      <View className="flex-row items-center">
        <Icon name={icon as any} size={18} color={colors.placeholder} className="mr-3" />
        <ThemedText className="opacity-60">{label}</ThemedText>
      </View>
      <ThemedText className="font-semibold">{value}</ThemedText>
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
    <View className={`flex-row ${!isLast ? 'mb-4 pb-4 border-b border-border' : ''}`}>
      <View 
        className="w-8 h-8 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: colors.highlight }}
      >
        <ThemedText className="text-white font-bold text-sm">{number}</ThemedText>
      </View>
      <View className="flex-1">
        <ThemedText className="font-semibold">{title}</ThemedText>
        <ThemedText className="text-sm opacity-50">{description}</ThemedText>
      </View>
    </View>
  );
}
