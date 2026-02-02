import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, RefreshControl, Pressable, FlatList, TextInput, ImageBackground } from 'react-native';
import Header from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { Chip } from '@/components/Chip';
import { CardScroller } from '@/components/CardScroller';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { useStore } from '@/store/useStore';
import { mockArrivalsToday, filterFlights, getAvailableSlotsCount, getCrewBookingsCount } from '@/data';
import { Flight } from '@/data/types';
import AirlineLogo from '@/components/AirlineLogo';
import { FlightCardSkeleton } from '@/components/SkeletonCard';
import { ACTIVITIES, MEDIA } from '@/data/activities';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';

export default function CrewScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { setSelectedFlight, setSelectedActivity } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ontime' | 'landed'>('all');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setIsLoading(true);
    setTimeout(() => {
      setRefreshing(false);
      setIsLoading(false);
    }, 600);
  }, []);

  const filteredFlights = useMemo(() => {
    let flights = filterFlights(searchQuery);

    if (statusFilter === 'ontime') {
      flights = flights.filter(f => f.status === 'On time');
    } else if (statusFilter === 'landed') {
      flights = flights.filter(f => f.status === 'Landed');
    }

    return flights;
  }, [searchQuery, statusFilter]);

  const handleFlightPress = useCallback((flight: Flight) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFlight(flight);
    // Suggest e-foil activity based on flight
    setSelectedActivity(ACTIVITIES[0]); // Audi E-Foil
    router.push('/screens/activity-detail');
  }, [setSelectedFlight, setSelectedActivity]);

  const renderFlightCard = useCallback(({ item, index }: { item: Flight; index: number }) => (
    <AnimatedView animation="scaleIn" duration={300} delay={index * 40}>
      <FlightCard
        flight={item}
        availableSlots={getAvailableSlotsCount(item)}
        crewBookings={getCrewBookingsCount(item.id)}
        onPress={() => handleFlightPress(item)}
      />
    </AnimatedView>
  ), [handleFlightPress]);

  const keyExtractor = useCallback((item: Flight) => item.id, []);

  return (
    <View className="flex-1 bg-background">
      <Header
        title="Crew Shortcut"
        rightComponents={[
          <Icon key="refresh" name="RefreshCw" size={20} onPress={onRefresh} />,
        ]}
      />

      <FlatList
        data={filteredFlights}
        renderItem={renderFlightCard}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 100,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <>
            {/* Hero Banner */}
            <View className="my-4 rounded-2xl overflow-hidden" style={shadowPresets.card}>
              <ImageBackground
                source={{ uri: MEDIA.efoil.hero }}
                style={{ height: 160 }}
                resizeMode="cover"
              >
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={{ flex: 1, justifyContent: 'flex-end', padding: 16 }}
                >
                  <View className="flex-row items-center mb-2">
                    <Icon name="Plane" size={16} color="white" />
                    <ThemedText className="text-white font-medium ml-2">Crew Exclusive</ThemedText>
                  </View>
                  <ThemedText className="text-white text-xl font-bold">
                    Book based on your arrival
                  </ThemedText>
                  <ThemedText className="text-white/70 text-sm">
                    Select your flight to see available sessions
                  </ThemedText>
                </LinearGradient>
              </ImageBackground>
            </View>

            {/* Info Card */}
            <View className="bg-secondary rounded-2xl p-4 mb-4" style={shadowPresets.card}>
              <View className="flex-row items-center">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: colors.highlight + '15' }}
                >
                  <Icon name="Clock" size={24} color={colors.highlight} />
                </View>
                <View className="flex-1">
                  <ThemedText className="font-semibold">Sessions start 1 hour after landing</ThemedText>
                  <ThemedText className="text-sm opacity-50">
                    Enough time to clear customs and arrive relaxed
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Search Bar */}
            <View
              className="flex-row items-center bg-secondary rounded-xl px-4 py-3 mb-4"
              style={shadowPresets.small}
            >
              <Icon name="Search" size={20} color={colors.placeholder} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search flight or airline..."
                placeholderTextColor={colors.placeholder}
                className="flex-1 ml-3 text-base"
                style={{ color: colors.text }}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <Icon name="X" size={18} color={colors.placeholder} />
                </Pressable>
              )}
            </View>

            {/* Filter Chips */}
            <CardScroller className="mb-4" space={8}>
              <Chip
                isSelected={statusFilter === 'all'}
                label={`All (${mockArrivalsToday.length})`}
                onPress={() => {
                  Haptics.selectionAsync();
                  setStatusFilter('all');
                }}
              />
              <Chip
                isSelected={statusFilter === 'ontime'}
                label="On Time"
                icon="Clock"
                onPress={() => {
                  Haptics.selectionAsync();
                  setStatusFilter('ontime');
                }}
              />
              <Chip
                isSelected={statusFilter === 'landed'}
                label="Landed"
                icon="Check"
                onPress={() => {
                  Haptics.selectionAsync();
                  setStatusFilter('landed');
                }}
              />
            </CardScroller>

            {/* Section Title */}
            <ThemedText className="text-xl font-bold mb-3">Today's MLE Arrivals</ThemedText>

            {/* Loading State */}
            {isLoading && (
              <View>
                {[1, 2, 3].map(i => (
                  <FlightCardSkeleton key={i} />
                ))}
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center py-12">
              <Icon name="SearchX" size={48} color={colors.placeholder} />
              <ThemedText className="text-lg font-semibold mt-4">No flights found</ThemedText>
              <ThemedText className="opacity-50 text-center mt-1">
                Try adjusting your search or filters
              </ThemedText>
            </View>
          ) : null
        }
      />
    </View>
  );
}

interface FlightCardProps {
  flight: Flight;
  availableSlots: number;
  crewBookings: number;
  onPress: () => void;
}

const FlightCard = React.memo(function FlightCard({ flight, availableSlots, crewBookings, onPress }: FlightCardProps) {
  const colors = useThemeColors();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const statusConfig = {
    'On time': { bg: 'rgba(34, 197, 94, 0.2)', color: '#22C55E' },
    'Landed': { bg: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' },
    'Delayed': { bg: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' },
  };

  const status = statusConfig[flight.status];

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 rounded-2xl overflow-hidden"
      style={({ pressed }) => [
        { 
          transform: [{ scale: pressed ? 0.98 : 1 }], 
          opacity: pressed ? 0.9 : 1,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)',
        },
        shadowPresets.card,
      ]}
    >
      <BlurView
        intensity={isDark ? 40 : 60}
        tint={isDark ? 'dark' : 'light'}
        className="p-4"
        style={{ 
          backgroundColor: isDark ? 'rgba(30,30,40,0.5)' : 'rgba(255,255,255,0.7)',
        }}
      >
        {/* Crew Booking Badge */}
        {crewBookings > 0 && (
          <View 
            className="flex-row items-center px-3 py-1.5 rounded-full mb-3 self-start"
            style={{ backgroundColor: colors.highlight }}
          >
            <Icon name="Users" size={12} color="white" />
            <ThemedText className="text-white text-xs font-semibold ml-1.5">
              {crewBookings} {crewBookings === 1 ? 'person' : 'people'} joining!
            </ThemedText>
          </View>
        )}

        {/* Top Row: Airline + Flight Number */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View 
              className="rounded-xl overflow-hidden"
              style={{ 
                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)',
                padding: 4,
              }}
            >
              <AirlineLogo airlineCode={flight.airlineCode} size={40} />
            </View>
            <View className="ml-3">
              <ThemedText className="font-bold text-lg">{flight.flightNo}</ThemedText>
              <ThemedText className="opacity-60 text-sm">{flight.airline}</ThemedText>
            </View>
          </View>

          {/* Status Badge */}
          <View 
            className="px-3 py-1.5 rounded-full"
            style={{ 
              backgroundColor: status.bg,
              borderWidth: 1,
              borderColor: status.color + '40',
            }}
          >
            <ThemedText className="text-sm font-semibold" style={{ color: status.color }}>
              {flight.status}
            </ThemedText>
          </View>
        </View>

        {/* Route Info */}
        <View 
          className="flex-row items-center mb-4 py-3 px-4 rounded-xl"
          style={{ 
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          }}
        >
          <View className="flex-1">
            <ThemedText className="text-2xl font-bold">{flight.originCode}</ThemedText>
            <ThemedText className="opacity-50 text-sm">{flight.originCity}</ThemedText>
          </View>
          <View className="flex-row items-center px-4">
            <View 
              className="h-px w-6"
              style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }}
            />
            <View 
              className="mx-2 w-8 h-8 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.highlight + '20' }}
            >
              <Icon name="Plane" size={16} color={colors.highlight} />
            </View>
            <View 
              className="h-px w-6"
              style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }}
            />
          </View>
          <View className="flex-1 items-end">
            <ThemedText className="text-2xl font-bold">MLE</ThemedText>
            <ThemedText className="opacity-50 text-sm">Malé</ThemedText>
          </View>
        </View>

        {/* Bottom Row: Time + CTA */}
        <View 
          className="flex-row items-center justify-between pt-3"
          style={{ 
            borderTopWidth: 1, 
            borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          }}
        >
          <View className="flex-row items-center">
            <View 
              className="w-8 h-8 rounded-full items-center justify-center mr-2"
              style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
            >
              <Icon name="Clock" size={16} color={colors.icon} />
            </View>
            <ThemedText className="font-semibold text-lg">{flight.timeLocal}</ThemedText>
          </View>

          <View
            className="flex-row items-center px-4 py-2 rounded-full"
            style={{ backgroundColor: colors.highlight }}
          >
            <ThemedText className="text-white font-semibold text-sm mr-1">
              Book Experience
            </ThemedText>
            <Icon name="ChevronRight" size={16} color="white" />
          </View>
        </View>
      </BlurView>
    </Pressable>
  );
});
