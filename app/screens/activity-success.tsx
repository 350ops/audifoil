import React, { useEffect } from 'react';
import { View, ScrollView, Share, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { useStore } from '@/store/useStore';
import { router, useLocalSearchParams } from 'expo-router';
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
  const params = useLocalSearchParams<{
    paymentLinkUrl?: string;
    bookingId?: string;
    pendingCount?: string;
  }>();

  const paymentLinkUrl = params.paymentLinkUrl || '';
  const bookingId = params.bookingId || '';
  const pendingCount = parseInt(params.pendingCount || '0', 10);

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

  const handleShareLink = async () => {
    if (!latestActivityBooking || !paymentLinkUrl) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { activity, slot, guests } = latestActivityBooking;
    await Share.share({
      message: `Join me on the ${activity.title}!\n\n${slot.dateLabel} · ${slot.startTime}\n${guests} spots total — pay your share ($80) here:\n${paymentLinkUrl}`,
    });
  };

  const handleCopyLink = async () => {
    if (paymentLinkUrl) {
      await Clipboard.setStringAsync(paymentLinkUrl);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleShareGeneric = async () => {
    if (!latestActivityBooking) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { activity, slot } = latestActivityBooking;
    await Share.share({
      message: `I just booked ${activity.title} in the Maldives!\n\nDate: ${slot.dateLabel}\nTime: ${slot.startTime} - ${slot.endTime}\nLocation: ${activity.meetingPoint}\n\nJoin me! Book at foiltribe.com`,
    });
  };

  const handleViewBookings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resetActivitySelection();
    router.replace('/bookings');
  };

  const handleViewTripStatus = () => {
    if (bookingId) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push({ pathname: '/screens/trip-status', params: { bookingId } });
    }
  };

  const handleExploreMore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    resetActivitySelection();
    router.replace('/');
  };

  if (!latestActivityBooking) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-4">
        <Icon name="AlertCircle" size={48} color={colors.placeholder} />
        <ThemedText className="mt-4 text-xl font-bold">No booking found</ThemedText>
        <Button title="Go Home" onPress={() => router.replace('/')} className="mt-6" />
      </View>
    );
  }

  const { activity, slot, confirmationCode, guests, totalPrice } = latestActivityBooking;

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
          style={{ paddingTop: insets.top + 40, paddingBottom: 60, alignItems: 'center' }}
        >
          <Animated.View
            className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-white"
            style={checkmarkStyle}
          >
            <Icon name="Check" size={48} color={colors.highlight} strokeWidth={3} />
          </Animated.View>

          <AnimatedView animation="fadeIn" delay={400}>
            <ThemedText className="text-center text-3xl font-bold text-white">
              You're Booked!
            </ThemedText>
            <ThemedText className="mt-2 text-center text-white/80">
              Get ready for an amazing experience
            </ThemedText>
          </AnimatedView>
        </LinearGradient>

        {/* Confirmation Code */}
        <Animated.View style={contentStyle}>
          <View className="-mt-6 px-4">
            <View
              className="items-center rounded-2xl bg-secondary p-5"
              style={shadowPresets.large}
            >
              <ThemedText className="mb-1 text-sm opacity-50">Confirmation Code</ThemedText>
              <ThemedText
                className="text-3xl font-bold tracking-widest"
                style={{ color: colors.highlight }}
              >
                {confirmationCode}
              </ThemedText>
            </View>
          </View>

          {/* ── Share Payment Link (only for group bookings) ── */}
          {pendingCount > 0 && paymentLinkUrl ? (
            <View className="mt-6 px-4">
              <View
                className="overflow-hidden rounded-2xl"
                style={[shadowPresets.card, { borderWidth: 2, borderColor: colors.highlight }]}
              >
                <LinearGradient
                  colors={[colors.highlight + '15', colors.highlight + '05']}
                  style={{ padding: 20 }}
                >
                  <View className="mb-3 flex-row items-center">
                    <Icon name="Share2" size={22} color={colors.highlight} />
                    <ThemedText className="ml-2 text-lg font-bold">Share with Your Crew</ThemedText>
                  </View>

                  <ThemedText className="mb-1 opacity-60">
                    {pendingCount} {pendingCount === 1 ? 'person' : 'people'} still {pendingCount === 1 ? 'needs' : 'need'} to pay.
                    Share this link so they can pay their own share (${80}/each).
                  </ThemedText>

                  {/* Payment link display */}
                  <View
                    className="mt-3 flex-row items-center rounded-xl bg-secondary p-3"
                    style={{ borderWidth: 1, borderColor: colors.border }}
                  >
                    <Icon name="Link" size={16} color={colors.highlight} />
                    <ThemedText className="ml-2 flex-1 text-sm" numberOfLines={1}>
                      {paymentLinkUrl}
                    </ThemedText>
                    <Pressable onPress={handleCopyLink} className="ml-2 p-1">
                      <Icon name="Copy" size={18} color={colors.highlight} />
                    </Pressable>
                  </View>

                  {/* Share buttons */}
                  <View className="mt-3 flex-row gap-3">
                    <View className="flex-1">
                      <Button
                        title="Share Link"
                        iconStart="Share"
                        onPress={handleShareLink}
                        variant="cta"
                        rounded="full"
                      />
                    </View>
                    <View className="flex-1">
                      <Button
                        title="Copy"
                        iconStart="Copy"
                        onPress={handleCopyLink}
                        variant="outline"
                        rounded="full"
                      />
                    </View>
                  </View>

                  {/* Track payments link */}
                  {bookingId ? (
                    <Pressable onPress={handleViewTripStatus} className="mt-3">
                      <ThemedText className="text-center text-sm font-medium" style={{ color: colors.highlight }}>
                        Track payments
                      </ThemedText>
                    </Pressable>
                  ) : null}
                </LinearGradient>
              </View>
            </View>
          ) : null}

          {/* Booking Details */}
          <View className="mt-6 px-4">
            <ThemedText className="mb-4 text-xl font-bold">Booking Details</ThemedText>

            <View className="overflow-hidden rounded-2xl bg-secondary" style={shadowPresets.card}>
              <View className="flex-row items-center border-b border-border p-4">
                <View
                  className="mr-4 h-14 w-14 items-center justify-center rounded-xl"
                  style={{ backgroundColor: colors.highlight + '15' }}
                >
                  <Icon name="Waves" size={28} color={colors.highlight} />
                </View>
                <View className="flex-1">
                  <ThemedText className="text-lg font-bold">{activity.title}</ThemedText>
                  <ThemedText className="opacity-50">{activity.subtitle}</ThemedText>
                </View>
              </View>

              <View className="p-4">
                <DetailRow icon="Calendar" label="Date" value={slot.dateLabel} />
                <DetailRow icon="Clock" label="Time" value={`${slot.startTime} - ${slot.endTime}`} />
                <DetailRow icon="Users" label="Guests" value={`${guests} guest${guests !== 1 ? 's' : ''}`} />
                <DetailRow icon="MapPin" label="Location" value={activity.meetingPoint} />
                <DetailRow icon="Timer" label="Duration" value={`${activity.durationMin} minutes`} isLast />
              </View>
            </View>
          </View>

          {/* Next Steps */}
          <View className="mt-6 px-4">
            <ThemedText className="mb-4 text-xl font-bold">Next Steps</ThemedText>

            <View className="rounded-2xl bg-secondary p-4" style={shadowPresets.card}>
              <NextStepItem
                number="1"
                title={pendingCount > 0 ? 'Share the payment link' : 'Check WhatsApp'}
                description={pendingCount > 0 ? 'Send it to your crew so they can pay their share' : "We'll send meeting point details"}
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

          {/* Generic share (for solo bookings or additional sharing) */}
          {pendingCount === 0 && (
            <View className="mt-6 px-4">
              <View
                className="flex-row items-center rounded-2xl bg-secondary p-5"
                style={shadowPresets.card}
              >
                <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-highlight/10">
                  <Icon name="Share2" size={24} color={colors.highlight} />
                </View>
                <View className="flex-1">
                  <ThemedText className="font-bold">Share Your Booking</ThemedText>
                  <ThemedText className="text-sm opacity-50">Tell friends about your trip!</ThemedText>
                </View>
                <Button
                  title="Share"
                  variant="secondary"
                  size="small"
                  onPress={handleShareGeneric}
                />
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Bottom Actions */}
      <View
        className="absolute bottom-0 left-0 right-0 border-t border-border bg-background px-4 pt-4"
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
        <Icon name={icon as any} size={18} color={colors.placeholder} />
        <ThemedText className="ml-3 opacity-60">{label}</ThemedText>
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
    <View className={`flex-row ${!isLast ? 'mb-4 border-b border-border pb-4' : ''}`}>
      <View
        className="mr-4 h-8 w-8 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.highlight }}
      >
        <ThemedText className="text-sm font-bold text-white">{number}</ThemedText>
      </View>
      <View className="flex-1">
        <ThemedText className="font-semibold">{title}</ThemedText>
        <ThemedText className="text-sm opacity-50">{description}</ThemedText>
      </View>
    </View>
  );
}
