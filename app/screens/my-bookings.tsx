import React, { useEffect, useCallback } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import Header from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { useStore } from '@/store/useStore';
import { Booking } from '@/data/types';
import AirlineLogo from '@/components/AirlineLogo';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function MyBookingsScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { bookings, loadBookingsFromStorage } = useStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadBookingsFromStorage();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadBookingsFromStorage().then(() => setRefreshing(false));
  }, []);

  const renderBookingCard = useCallback(({ item, index }: { item: Booking; index: number }) => (
    <AnimatedView animation="scaleIn" duration={300} delay={index * 80}>
      <BookingCard booking={item} />
    </AnimatedView>
  ), []);

  const keyExtractor = useCallback((item: Booking) => item.id, []);

  return (
    <View className="flex-1 bg-background">
      <Header
        showBackButton
        title="My Bookings"
        rightComponents={[
          <Icon name="Calendar" size={20} />
        ]}
      />
      
      <FlatList
        data={[...bookings].reverse()} // Show newest first
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
        ListEmptyComponent={<EmptyState />}
        ListHeaderComponent={
          bookings.length > 0 ? (
            <View className="mb-4">
              <ThemedText className="text-2xl font-bold">Your Sessions</ThemedText>
              <ThemedText className="opacity-50">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</ThemedText>
            </View>
          ) : null
        }
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
        <Icon name="Waves" size={48} color={colors.highlight} />
      </View>
      <ThemedText className="text-2xl font-bold text-center">No Bookings Yet</ThemedText>
      <ThemedText className="text-center opacity-50 mt-2 mb-6">
        Ready to fly? Book your first e-foil session and experience the magic.
      </ThemedText>
      <Button
        title="Browse Sessions"
        iconStart="Plane"
        onPress={() => router.push('/arrivals')}
      />
    </View>
  );
}

const BookingCard = React.memo(function BookingCard({ booking }: { booking: Booking }) {
  const colors = useThemeColors();

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <View 
      className="bg-secondary rounded-2xl mb-4 overflow-hidden"
      style={shadowPresets.card}
    >
      {/* Header with gradient */}
      <LinearGradient
        colors={[colors.highlight, '#00A6F4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="p-4 flex-row items-center justify-between"
      >
        <View className="flex-row items-center">
          <Icon name="Waves" size={24} color="white" />
          <View className="ml-3">
            <ThemedText className="text-white font-bold">E-Foil Session</ThemedText>
            <ThemedText className="text-white/70 text-sm">
              {booking.slotStart} - {booking.slotEnd}
            </ThemedText>
          </View>
        </View>
        <View 
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          <ThemedText className="text-white text-sm font-medium">
            Confirmed
          </ThemedText>
        </View>
      </LinearGradient>

      {/* Content */}
      <View className="p-4">
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

        {/* Flight Info */}
        <View className="flex-row items-center mb-4">
          <AirlineLogo airlineCode={booking.airlineCode} size={40} style={{ marginRight: 12 }} />
          <View className="flex-1">
            <ThemedText className="font-semibold">{booking.flightNo}</ThemedText>
            <ThemedText className="text-sm opacity-50">
              {booking.originCity} → Malé • {booking.arrivalTime}
            </ThemedText>
          </View>
        </View>

        {/* Date & Location */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Icon name="Calendar" size={16} color={colors.placeholder} className="mr-2" />
            <ThemedText className="opacity-60">{formatDate(booking.dateISO)}</ThemedText>
          </View>
          <View className="flex-row items-center">
            <Icon name="MapPin" size={16} color={colors.placeholder} className="mr-2" />
            <ThemedText className="opacity-60">Malé Lagoon</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
});
