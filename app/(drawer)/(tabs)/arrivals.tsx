import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, RefreshControl, Pressable, FlatList, TextInput } from 'react-native';
import Header from 'components/Header';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { Chip } from '@/components/Chip';
import { CardScroller } from '@/components/CardScroller';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { useStore } from '@/store/useStore';
import { mockArrivalsToday, filterFlights, getAvailableSlotsCount } from '@/data';
import { Flight } from '@/data/types';
import AirlineLogo from '@/components/AirlineLogo';
import { FlightCardSkeleton } from '@/components/SkeletonCard';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ArrivalsScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { setSelectedFlight } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ontime' | 'landed'>('all');

  // Simulate loading delay
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

  // Filter flights based on search and status
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
    setSelectedFlight(flight);
    router.push('/screens/flight-detail');
  }, [setSelectedFlight]);

  const renderFlightCard = useCallback(({ item, index }: { item: Flight; index: number }) => (
    <AnimatedView animation="scaleIn" duration={300} delay={index * 40}>
      <FlightCard
        flight={item}
        availableSlots={getAvailableSlotsCount(item)}
        onPress={() => handleFlightPress(item)}
      />
    </AnimatedView>
  ), [handleFlightPress]);

  const keyExtractor = useCallback((item: Flight) => item.id, []);

  return (
    <View className="flex-1 bg-background">
      <Header
        leftComponent={
          <View className="flex-row items-center">
            <Icon name="Plane" size={24} color={colors.highlight} />
            <ThemedText className="text-xl font-bold ml-2">MLE Arrivals</ThemedText>
          </View>
        }
        rightComponents={[
          <Icon name="RefreshCw" size={20} onPress={onRefresh} />
        ]}
      />
      
      <View className="flex-1 px-4">
        {/* Header Section */}
        <View className="pt-4 pb-4">
          <ThemedText className="text-3xl font-bold">Today's Flights</ThemedText>
          <ThemedText className="opacity-60 mt-1">
            Select your flight to view available e-foil sessions
          </ThemedText>
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
            placeholder="Search airline, flight, or city..."
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
            onPress={() => setStatusFilter('all')}
          />
          <Chip
            isSelected={statusFilter === 'ontime'}
            label="On Time"
            icon="Clock"
            onPress={() => setStatusFilter('ontime')}
          />
          <Chip
            isSelected={statusFilter === 'landed'}
            label="Landed"
            icon="Check"
            onPress={() => setStatusFilter('landed')}
          />
        </CardScroller>

        {/* Flight List */}
        {isLoading ? (
          <View>
            {[1, 2, 3, 4].map(i => (
              <FlightCardSkeleton key={i} />
            ))}
          </View>
        ) : (
          <FlatList
            data={filteredFlights}
            renderItem={renderFlightCard}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View className="items-center py-12">
                <Icon name="SearchX" size={48} color={colors.placeholder} />
                <ThemedText className="text-lg font-semibold mt-4">No flights found</ThemedText>
                <ThemedText className="opacity-50 text-center mt-1">
                  Try adjusting your search or filters
                </ThemedText>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

interface FlightCardProps {
  flight: Flight;
  availableSlots: number;
  onPress: () => void;
}

const FlightCard = React.memo(function FlightCard({ flight, availableSlots, onPress }: FlightCardProps) {
  const colors = useThemeColors();

  const statusConfig = {
    'On time': { bg: 'rgba(34, 197, 94, 0.15)', color: '#22C55E' },
    'Landed': { bg: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' },
    'Delayed': { bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' },
  };

  const status = statusConfig[flight.status];

  return (
    <Pressable
      onPress={onPress}
      className="bg-secondary rounded-2xl p-4 mb-3 overflow-hidden"
      style={shadowPresets.card}
    >
      {/* Top Row: Airline + Flight Number */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <AirlineLogo airlineCode={flight.airlineCode} size={44} style={{ marginRight: 12 }} />
          <View>
            <ThemedText className="font-bold text-lg">{flight.flightNo}</ThemedText>
            <ThemedText className="opacity-50 text-sm">{flight.airline}</ThemedText>
          </View>
        </View>
        
        {/* Status Badge */}
        <View className="px-3 py-1 rounded-full" style={{ backgroundColor: status.bg }}>
          <ThemedText className="text-sm font-medium" style={{ color: status.color }}>
            {flight.status}
          </ThemedText>
        </View>
      </View>

      {/* Route Info */}
      <View className="flex-row items-center mb-4">
        <View className="flex-1">
          <ThemedText className="text-2xl font-bold">{flight.originCode}</ThemedText>
          <ThemedText className="opacity-50 text-sm">{flight.originCity}</ThemedText>
        </View>
        <View className="flex-row items-center px-4">
          <View className="h-px w-8 bg-border" />
          <Icon name="Plane" size={20} color={colors.highlight} className="mx-2" />
          <View className="h-px w-8 bg-border" />
        </View>
        <View className="flex-1 items-end">
          <ThemedText className="text-2xl font-bold">MLE</ThemedText>
          <ThemedText className="opacity-50 text-sm">Malé</ThemedText>
        </View>
      </View>

      {/* Bottom Row: Time + Available Slots */}
      <View className="flex-row items-center justify-between pt-3 border-t border-border">
        <View className="flex-row items-center">
          <Icon name="Clock" size={16} color={colors.icon} className="opacity-50 mr-2" />
          <ThemedText className="font-semibold">{flight.timeLocal}</ThemedText>
        </View>
        
        <View className="flex-row items-center">
          <Icon name="Waves" size={16} color={colors.highlight} className="mr-2" />
          <ThemedText style={{ color: colors.highlight }} className="font-semibold">
            {availableSlots} slots
          </ThemedText>
          <Icon name="ChevronRight" size={18} color={colors.highlight} className="ml-1" />
        </View>
      </View>
    </Pressable>
  );
});
