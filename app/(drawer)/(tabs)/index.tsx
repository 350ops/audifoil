import React, { useState, useCallback, useEffect } from 'react';
import { View, RefreshControl, Pressable, ImageBackground, Dimensions } from 'react-native';
import ThemedScroller from 'components/ThemeScroller';
import Header from 'components/Header';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import { CardScroller } from '@/components/CardScroller';
import Icon from '@/components/Icon';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { useStore } from '@/store/useStore';
import { mockArrivalsToday, getPopularSlotsToday, getAvailableSlotsCount } from '@/data';
import { Flight, getAirlineColor } from '@/data/types';
import AirlineLogo from '@/components/AirlineLogo';
import { StatsCardSkeleton } from '@/components/SkeletonCard';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { setSelectedFlight, bookings, loadBookingsFromStorage, demoUser } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load bookings on mount
  useEffect(() => {
    loadBookingsFromStorage();
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setIsLoading(true);
    loadBookingsFromStorage();
    setTimeout(() => {
      setRefreshing(false);
      setIsLoading(false);
    }, 600);
  }, []);

  const handleFlightPress = useCallback((flight: Flight) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFlight(flight);
    router.push('/screens/flight-detail');
  }, [setSelectedFlight]);

  // Get stats
  const totalFlights = mockArrivalsToday.length;
  const totalAvailableSlots = mockArrivalsToday.reduce((sum, f) => sum + getAvailableSlotsCount(f), 0);
  const popularSlots = getPopularSlotsToday();

  // Get next 3 flights
  const upcomingFlights = mockArrivalsToday.slice(0, 3);

  // Format today's date
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <View className="flex-1 bg-background">
      <ThemedScroller
        className="!px-0"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />
        }
      >
        {/* Hero Section with integrated header */}
        <View style={{ height: 280 }}>
          <ImageBackground
            source={require('@/assets/img/efoil.jpg')}
            className="flex-1"
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.2)', colors.bg]}
              locations={[0, 0.7, 1]}
              style={{ flex: 1 }}
            >
              {/* Header Row */}
              <View 
                className="flex-row items-center justify-between px-4"
                style={{ paddingTop: insets.top + 8 }}
              >
                <View className="flex-row items-center">
                  <Icon name="Waves" size={26} color="white" />
                  <ThemedText className="text-lg font-bold ml-2 text-white">audiFoil</ThemedText>
                </View>
                <Icon name="Bell" size={22} color="white" onPress={() => router.push('/screens/notifications')} />
              </View>
              
              {/* Welcome Text */}
              <View className="flex-1 justify-end px-4 pb-8">
                <AnimatedView animation="fadeIn" duration={600}>
                  <ThemedText className="text-white/60 text-sm">{dateStr}</ThemedText>
                  <ThemedText className="text-white text-2xl font-bold mt-1">
                    Welcome back, {demoUser?.name || 'Traveler'}
                  </ThemedText>
                  <ThemedText className="text-white/60 text-sm mt-1">
                    Ready to fly over the Indian Ocean?
                  </ThemedText>
                </AnimatedView>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Quick Stats */}
        <View className="px-4 -mt-8">
          {isLoading ? (
            <StatsCardSkeleton />
          ) : (
            <AnimatedView animation="scaleIn" duration={400} delay={100}>
              <View 
                className="bg-secondary rounded-2xl p-4 flex-row"
                style={shadowPresets.large}
              >
                <StatItem icon="Plane" value={totalFlights} label="Flights Today" />
                <View className="w-px bg-border mx-3" />
                <StatItem icon="Waves" value={totalAvailableSlots} label="Slots Available" highlight />
                <View className="w-px bg-border mx-3" />
                <StatItem icon="CalendarCheck" value={bookings.length} label="My Bookings" />
              </View>
            </AnimatedView>
          )}
        </View>

        {/* Primary CTA Cards */}
        <View className="px-4 mt-6">
          <View className="flex-row gap-3">
            <AnimatedView animation="scaleIn" duration={300} delay={150} className="flex-1">
              <QuickActionCard
                icon="Plane"
                title="Check Arrivals"
                subtitle="View all MLE flights"
                onPress={() => router.push('/arrivals')}
                variant="highlight"
              />
            </AnimatedView>
            <AnimatedView animation="scaleIn" duration={300} delay={200} className="flex-1">
              <QuickActionCard
                icon="Waves"
                title="Book a Slot"
                subtitle="Reserve your session"
                onPress={() => router.push('/arrivals')}
              />
            </AnimatedView>
          </View>
        </View>

        {/* Today's Popular Slots */}
        {popularSlots.length > 0 && (
          <View className="mt-6">
            <View className="flex-row items-center justify-between px-4 mb-4">
              <ThemedText className="text-2xl font-bold">Popular Slots</ThemedText>
              <View className="flex-row items-center">
                <Icon name="Flame" size={16} color="#EF4444" />
                <ThemedText className="text-sm opacity-60 ml-1">High demand</ThemedText>
              </View>
            </View>
            
            <CardScroller space={12} className="pl-4">
              {popularSlots.map(({ flight, slot }, index) => (
                <AnimatedView key={slot.id} animation="scaleIn" duration={300} delay={250 + index * 50}>
                  <PopularSlotCard 
                    flight={flight} 
                    slot={slot} 
                    onPress={() => handleFlightPress(flight)} 
                  />
                </AnimatedView>
              ))}
            </CardScroller>
          </View>
        )}

        {/* Next Arrivals */}
        <View className="mt-6">
          <View className="flex-row items-center justify-between px-4 mb-4">
            <ThemedText className="text-2xl font-bold">Next Arrivals</ThemedText>
            <Pressable onPress={() => router.push('/arrivals')} className="flex-row items-center">
              <ThemedText style={{ color: colors.highlight }} className="font-medium">See All</ThemedText>
              <Icon name="ChevronRight" size={18} color={colors.highlight} />
            </Pressable>
          </View>
          
          <CardScroller space={12} className="pl-4">
            {upcomingFlights.map((flight, index) => (
              <AnimatedView key={flight.id} animation="scaleIn" duration={300} delay={300 + index * 50}>
                <MiniFlightCard flight={flight} onPress={() => handleFlightPress(flight)} />
              </AnimatedView>
            ))}
          </CardScroller>
        </View>

        {/* The E-Foil Experience */}
        <View className="px-4 mt-6">
          <ThemedText className="text-2xl font-bold mb-4">The E-Foil Experience</ThemedText>
          <AnimatedView animation="fadeIn" duration={400} delay={350}>
            <View className="bg-secondary rounded-2xl p-5" style={shadowPresets.card}>
              <ThemedText className="opacity-70 mb-4 leading-5">
                Experience the thrill of flying above the crystal-clear waters of the Maldives on a premium Audi e-foil. No waves needed – our electric hydrofoils let you glide silently above the Indian Ocean.
              </ThemedText>
              
              <View className="flex-row flex-wrap" style={{ gap: 8, marginBottom: 16 }}>
                <FeatureTag icon="Zap" text="Electric powered" />
                <FeatureTag icon="Volume2" text="Silent ride" />
                <FeatureTag icon="GraduationCap" text="No experience needed" />
                <FeatureTag icon="Shield" text="Safety gear included" />
                <FeatureTag icon="Clock" text="45-min sessions" />
                <FeatureTag icon="Users" text="1-on-1 instruction" />
              </View>
              
              <View className="bg-background rounded-xl p-3">
                <View className="flex-row items-center">
                  <Icon name="Info" size={16} color={colors.highlight} />
                  <ThemedText className="text-sm ml-2 flex-1 opacity-70">
                    Sessions timed with your flight arrival – start flying 1 hour after you land!
                  </ThemedText>
                </View>
              </View>
            </View>
          </AnimatedView>
        </View>

        {/* How It Works */}
        <View className="px-4 mt-6">
          <ThemedText className="text-2xl font-bold mb-4">How to Book</ThemedText>
          <AnimatedView animation="fadeIn" duration={400} delay={400}>
            <View className="bg-secondary rounded-2xl p-5" style={shadowPresets.card}>
              <StepItem number="1" title="Find Your Flight" description="We sync with MLE arrivals" />
              <StepItem number="2" title="Pick a Session" description="Choose your preferred time slot" />
              <StepItem number="3" title="Book Instantly" description="Secure checkout with Apple Pay" />
              <StepItem number="4" title="Fly Over Paradise" description="Meet us at the lagoon dock" isLast />
            </View>
          </AnimatedView>
        </View>

        {/* CTA Banner */}
        <View className="px-4 mt-8">
          <AnimatedView animation="scaleIn" duration={400} delay={400}>
            <Pressable
              onPress={() => router.push('/arrivals')}
              className="rounded-2xl overflow-hidden"
              style={shadowPresets.card}
            >
              <LinearGradient
                colors={['#0077B6', '#00A6F4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ padding: 24 }}
              >
                <View className="flex-row items-center justify-between">
                  <View style={{ flex: 1, marginRight: 24 }}>
                    <ThemedText className="text-white text-xl font-bold">Ready to Fly?</ThemedText>
                    <ThemedText className="text-white/70 text-sm" style={{ marginTop: 4 }}>Book your e-foil session now</ThemedText>
                  </View>
                  <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="ArrowRight" size={22} color="#0077B6" />
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          </AnimatedView>
        </View>

        <View className="h-40" />
      </ThemedScroller>
    </View>
  );
}

// Stat Item Component
function StatItem({ icon, value, label, highlight }: { 
  icon: string; 
  value: number; 
  label: string; 
  highlight?: boolean;
}) {
  const colors = useThemeColors();
  return (
    <View className="flex-1 items-center">
      <Icon name={icon as any} size={20} color={highlight ? colors.highlight : colors.icon} />
      <ThemedText 
        className="text-2xl font-bold mt-1"
        style={highlight ? { color: colors.highlight } : undefined}
      >
        {value}
      </ThemedText>
      <ThemedText className="text-xs opacity-50">{label}</ThemedText>
    </View>
  );
}

// Quick Action Card Component
function QuickActionCard({ icon, title, subtitle, onPress, variant }: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  variant?: 'default' | 'highlight';
}) {
  const colors = useThemeColors();
  const isHighlight = variant === 'highlight';

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      className="rounded-2xl p-4"
      style={({ pressed }) => [
        shadowPresets.card,
        {
          backgroundColor: isHighlight ? colors.highlight : colors.secondary,
          transform: [{ scale: pressed ? 0.97 : 1 }],
          opacity: pressed ? 0.9 : 1,
        }
      ]}
    >
      <View 
        className="w-12 h-12 rounded-xl items-center justify-center mb-3"
        style={{ backgroundColor: isHighlight ? 'rgba(255,255,255,0.2)' : colors.bg }}
      >
        <Icon name={icon as any} size={24} color={isHighlight ? 'white' : colors.highlight} />
      </View>
      <ThemedText 
        className="font-bold text-base"
        style={isHighlight ? { color: 'white' } : undefined}
      >
        {title}
      </ThemedText>
      <ThemedText 
        className="text-sm mt-0.5"
        style={{ color: isHighlight ? 'rgba(255,255,255,0.7)' : colors.placeholder }}
      >
        {subtitle}
      </ThemedText>
    </Pressable>
  );
}

// Popular Slot Card Component
function PopularSlotCard({ flight, slot, onPress }: {
  flight: Flight;
  slot: any;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  const airlineColor = getAirlineColor(flight.airlineCode);

  return (
    <Pressable
      onPress={onPress}
      className="bg-secondary rounded-2xl p-4 overflow-hidden"
      style={({ pressed }) => [
        shadowPresets.card,
        { width: width * 0.7, transform: [{ scale: pressed ? 0.98 : 1 }] }
      ]}
    >
      {/* Popular Badge */}
      <View className="absolute top-3 right-3 flex-row items-center bg-red-500/10 px-2 py-1 rounded-full">
        <Icon name="Flame" size={12} color="#EF4444" />
        <ThemedText className="text-xs font-medium ml-1" style={{ color: '#EF4444' }}>Popular</ThemedText>
      </View>
      
      {/* Flight Info */}
      <View className="flex-row items-center mb-3">
        <AirlineLogo airlineCode={flight.airlineCode} size={40} style={{ marginRight: 12 }} />
        <View>
          <ThemedText className="font-bold">{flight.flightNo}</ThemedText>
          <ThemedText className="text-sm opacity-50">{flight.originCity}</ThemedText>
        </View>
      </View>
      
      {/* Slot Time */}
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <ThemedText className="opacity-50 text-xs">Session</ThemedText>
          <ThemedText className="font-bold text-xl" style={{ color: colors.highlight }}>
            {slot.startLocal} - {slot.endLocal}
          </ThemedText>
        </View>
        <ThemedText className="font-bold text-lg">$150</ThemedText>
      </View>
      
      {/* Peer Badges */}
      {slot.peers?.length > 0 && (
        <View className="flex-row items-center">
          <ThemedText className="text-xs opacity-50 mr-2">Already booked:</ThemedText>
          {slot.peers.slice(0, 2).map((peer: any) => (
            <View
              key={peer.id}
              className="px-2 py-1 rounded-full mr-1"
              style={{ backgroundColor: getAirlineColor(peer.airlineCode) }}
            >
              <ThemedText className="text-white text-xs font-medium">{peer.airlineCode}</ThemedText>
            </View>
          ))}
          {slot.bookedCount > 2 && (
            <ThemedText className="text-xs opacity-50">+{slot.bookedCount - 2} more</ThemedText>
          )}
        </View>
      )}
    </Pressable>
  );
}

// Mini Flight Card Component
function MiniFlightCard({ flight, onPress }: { flight: Flight; onPress: () => void }) {
  const colors = useThemeColors();
  const airlineColor = getAirlineColor(flight.airlineCode);

  const statusConfig = {
    'On time': { bg: 'rgba(34, 197, 94, 0.15)', color: '#22C55E' },
    'Landed': { bg: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' },
    'Delayed': { bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' },
  };
  const status = statusConfig[flight.status];

  return (
    <Pressable
      onPress={onPress}
      className="bg-secondary rounded-2xl p-4"
      style={({ pressed }) => [
        shadowPresets.card,
        { width: width * 0.65, transform: [{ scale: pressed ? 0.98 : 1 }] }
      ]}
    >
      <View className="flex-row items-center mb-3">
        <AirlineLogo airlineCode={flight.airlineCode} size={40} style={{ marginRight: 12 }} />
        <View className="flex-1">
          <ThemedText className="font-bold">{flight.flightNo}</ThemedText>
          <ThemedText className="text-sm opacity-50">{flight.airline}</ThemedText>
        </View>
        <View className="px-2 py-1 rounded-full" style={{ backgroundColor: status.bg }}>
          <ThemedText className="text-xs font-medium" style={{ color: status.color }}>
            {flight.status}
          </ThemedText>
        </View>
      </View>
      
      <View className="flex-row items-center justify-between">
        <View>
          <ThemedText className="opacity-50 text-xs">From</ThemedText>
          <ThemedText className="font-bold text-lg">{flight.originCode}</ThemedText>
        </View>
        <Icon name="ArrowRight" size={18} color={colors.placeholder} />
        <View>
          <ThemedText className="opacity-50 text-xs">Arrives</ThemedText>
          <ThemedText className="font-bold text-lg">{flight.timeLocal}</ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

// Feature Tag Component
function FeatureTag({ icon, text }: { icon: string; text: string }) {
  const colors = useThemeColors();
  return (
    <View className="flex-row items-center bg-background rounded-full px-3 py-1.5">
      <Icon name={icon as any} size={14} color={colors.highlight} />
      <ThemedText className="text-xs ml-1.5">{text}</ThemedText>
    </View>
  );
}

// Step Item Component
function StepItem({ number, title, description, isLast }: {
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
