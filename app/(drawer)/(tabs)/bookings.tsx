import React, { useEffect, useCallback } from 'react';
import { View, FlatList, RefreshControl, Pressable, ImageBackground } from 'react-native';
import Header from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { useStore } from '@/store/useStore';
import { ActivityBooking, EFOIL_ADDON, MALDIVES_ADVENTURE_ID } from '@/data/activities';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function BookingsScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { activityBookings, loadActivityBookings } = useStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadActivityBookings();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadActivityBookings().then(() => setRefreshing(false));
  }, [loadActivityBookings]);

  const handleBookingPress = useCallback((booking: ActivityBooking) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Could navigate to booking detail screen
  }, []);

  const renderBookingCard = useCallback(({ item, index }: { item: ActivityBooking; index: number }) => (
    <AnimatedView animation="scaleIn" duration={300} delay={index * 80}>
      <BookingCard booking={item} onPress={() => handleBookingPress(item)} />
    </AnimatedView>
  ), [handleBookingPress]);

  const keyExtractor = useCallback((item: ActivityBooking) => item.id, []);

  // Sort bookings newest first
  const sortedBookings = [...activityBookings].reverse();

  return (
    <View className="flex-1 bg-background">
      <Header
        title="My Bookings"
        rightComponents={[
          <Icon key="calendar" name="Calendar" size={22} />,
        ]}
      />

      <FlatList
        data={sortedBookings}
        renderItem={renderBookingCard}
        keyExtractor={keyExtractor}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: insets.bottom + 100,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          sortedBookings.length > 0 ? (
            <View className="mb-4">
              <ThemedText className="text-2xl font-bold">Your Experiences</ThemedText>
              <ThemedText className="opacity-50">
                {sortedBookings.length} booking{sortedBookings.length !== 1 ? 's' : ''}
              </ThemedText>
            </View>
          ) : null
        }
        ListEmptyComponent={<EmptyState />}
      />
    </View>
  );
}

function EmptyState() {
  const colors = useThemeColors();
  return (
    <View className="flex-1 items-center justify-center py-16 px-8">
      <View
        className="w-24 h-24 rounded-full items-center justify-center mb-6"
        style={{ backgroundColor: colors.highlight + '15' }}
      >
        <Icon name="Calendar" size={48} color={colors.highlight} />
      </View>
      <ThemedText className="text-2xl font-bold text-center">No Bookings Yet</ThemedText>
      <ThemedText className="text-center opacity-50 mt-2 mb-6">
        Ready to explore? Book your first premium experience in the Maldives.
      </ThemedText>
      <Button
        title="Explore Activities"
        iconStart="Sparkles"
        onPress={() => router.push('/')}
      />
    </View>
  );
}

function BookingCard({ booking, onPress }: { booking: ActivityBooking; onPress: () => void }) {
  const colors = useThemeColors();
  const { activity, slot } = booking;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const statusColors = {
    confirmed: { bg: 'rgba(34, 197, 94, 0.15)', color: '#22C55E', label: 'Confirmed' },
    pending: { bg: 'rgba(234, 179, 8, 0.15)', color: '#EAB308', label: 'Pending' },
    completed: { bg: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', label: 'Completed' },
    cancelled: { bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', label: 'Cancelled' },
  };
  const status = statusColors[booking.status];

  return (
    <Pressable
      onPress={onPress}
      className="mb-4 rounded-2xl overflow-hidden"
      style={({ pressed }) => [
        shadowPresets.card,
        { transform: [{ scale: pressed ? 0.98 : 1 }] }
      ]}
    >
      {/* Header with activity image */}
      <ImageBackground
        source={activity.media[0].localSource || { uri: activity.media[0].uri }}
        style={{ height: 120 }}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={{ flex: 1, justifyContent: 'flex-end', padding: 16 }}
        >
          <View className="flex-row items-center justify-between">
            <ThemedText className="text-white font-bold text-lg">{activity.title}</ThemedText>
            <View className="px-3 py-1 rounded-full" style={{ backgroundColor: status.bg }}>
              <ThemedText className="text-xs font-semibold" style={{ color: status.color }}>
                {status.label}
              </ThemedText>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>

      {/* Booking Details */}
      <View className="bg-secondary p-4">
        {/* Confirmation Code */}
        <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-border">
          <ThemedText className="opacity-50">Confirmation</ThemedText>
          <ThemedText
            className="font-bold text-lg tracking-wider"
            style={{ color: colors.highlight }}
          >
            {booking.confirmationCode}
          </ThemedText>
        </View>

        {/* Date & Time */}
        <View className="flex-row items-center mb-3">
          <View className="w-10 h-10 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: colors.highlight + '15' }}>
            <Icon name="Calendar" size={20} color={colors.highlight} />
          </View>
          <View className="flex-1">
            <ThemedText className="font-semibold">{formatDate(slot.date)}</ThemedText>
            <ThemedText className="text-sm opacity-50">
              {slot.startTime} - {slot.endTime}
            </ThemedText>
          </View>
          <View className="items-end">
            <ThemedText className="font-bold text-lg">${booking.totalPrice}</ThemedText>
            <ThemedText className="text-xs opacity-50">
              {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
            </ThemedText>
          </View>
        </View>

        {/* Location */}
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: colors.highlight + '15' }}>
            <Icon name="MapPin" size={20} color={colors.highlight} />
          </View>
          <View className="flex-1">
            <ThemedText className="font-semibold">Meeting Point</ThemedText>
            <ThemedText className="text-sm opacity-50">{activity.meetingPoint}</ThemedText>
          </View>
        </View>

        {/* E-Foil Add-on CTA — only for confirmed Maldives Adventure bookings */}
        {activity.id === MALDIVES_ADVENTURE_ID &&
          (booking.status === 'confirmed' || booking.status === 'pending') && (
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // TODO: Navigate to add-on purchase flow
            }}
            className="mt-4 pt-4 border-t border-border flex-row items-center justify-between"
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: colors.highlight + '15' }}>
                <Icon name="Zap" size={20} color={colors.highlight} />
              </View>
              <View className="flex-1">
                <ThemedText className="font-semibold">Add E-Foil Experience</ThemedText>
                <ThemedText className="text-sm opacity-50">
                  ${EFOIL_ADDON.priceUsd}/person · {EFOIL_ADDON.durationLabel}
                </ThemedText>
              </View>
            </View>
            <Icon name="ChevronRight" size={20} color={colors.highlight} />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}
