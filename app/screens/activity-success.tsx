import React, { useEffect } from 'react';
import { View, ScrollView, Share } from 'react-native';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { useStore } from '@/store/useStore';
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

export default function ActivitySuccessScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { latestActivityBooking, resetActivitySelection } = useStore();

  // Animation values
  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
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
    if (!latestActivityBooking) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { activity, slot } = latestActivityBooking;
    await Share.share({
      message: `I just booked ${activity.title} in the Maldives!\n\nDate: ${slot.dateLabel}\nTime: ${slot.startTime} - ${slot.endTime}\nLocation: ${activity.meetingPoint}\n\nJoin me! Book at foilTribe Adventures.com`,
    });
  };

  const handleViewBookings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resetActivitySelection();
    router.replace('/bookings');
  };

  const handleExploreMore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    resetActivitySelection();
    router.replace('/');
  };

  if (!latestActivityBooking) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-4">
        <Icon name="AlertCircle" size={48} color={colors.placeholder} />
        <ThemedText className="text-xl font-bold mt-4">No booking found</ThemedText>
        <Button title="Go Home" onPress={() => router.replace('/')} className="mt-6" />
      </View>
    );
  }

  const { activity, slot, confirmationCode, seats, seatPrice, totalPrice, hasEfoilAddon, efoilAddonPrice } = latestActivityBooking;

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Success Header */}
        <LinearGradient
          colors={[colors.highlight, '#0077B6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="items-center"
          style={{ paddingTop: insets.top + 40, paddingBottom: 60 }}
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
              Get ready for an amazing experience
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
                {confirmationCode}
              </ThemedText>
            </View>
          </View>

          {/* Booking Details */}
          <View className="px-4 mt-6">
            <ThemedText className="text-xl font-bold mb-4">Booking Details</ThemedText>

            <View className="bg-secondary rounded-2xl overflow-hidden" style={shadowPresets.card}>
              {/* Activity Info */}
              <View className="p-4 flex-row items-center border-b border-border">
                <View
                  className="w-14 h-14 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: colors.highlight + '15' }}
                >
                  <Icon name="Waves" size={28} color={colors.highlight} />
                </View>
                <View className="flex-1">
                  <ThemedText className="font-bold text-lg">{activity.title}</ThemedText>
                  <ThemedText className="opacity-50">{activity.subtitle}</ThemedText>
                </View>
              </View>

              {/* Session Details */}
              <View className="p-4">
                <DetailRow icon="Calendar" label="Date" value={slot.dateLabel} />
                <DetailRow icon="Clock" label="Time" value={`${slot.startTime} - ${slot.endTime}`} />
                <DetailRow icon="Users" label="Seats" value={`${seats} seat${seats !== 1 ? 's' : ''}`} />
                <DetailRow icon="MapPin" label="Location" value={activity.meetingPoint} />
                <DetailRow icon="Timer" label="Duration" value={`${activity.durationMin} minutes`} isLast />
              </View>
            </View>
          </View>

          {/* Pricing Summary */}
          <View className="px-4 mt-6">
            <ThemedText className="text-xl font-bold mb-4">Payment Summary</ThemedText>

            <View className="bg-secondary rounded-2xl p-4" style={shadowPresets.card}>
              <View className="flex-row justify-between mb-3">
                <ThemedText className="opacity-60">
                  {seats} seat{seats !== 1 ? 's' : ''} × ${seatPrice}
                </ThemedText>
                <ThemedText className="font-medium">${(seats * seatPrice).toFixed(2)}</ThemedText>
              </View>
              {hasEfoilAddon && efoilAddonPrice && (
                <View className="flex-row justify-between mb-3">
                  <ThemedText className="opacity-60">E-Foil Session</ThemedText>
                  <ThemedText className="font-medium">${efoilAddonPrice.toFixed(2)}</ThemedText>
                </View>
              )}
              <View className="flex-row justify-between pt-3 border-t border-border">
                <ThemedText className="font-bold text-lg">Total Paid</ThemedText>
                <ThemedText className="font-bold text-xl" style={{ color: colors.highlight }}>
                  ${totalPrice.toFixed(2)}
                </ThemedText>
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
                <ThemedText className="opacity-50 text-sm">Invite friends to join!</ThemedText>
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
              title="Explore More"
              onPress={handleExploreMore}
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
