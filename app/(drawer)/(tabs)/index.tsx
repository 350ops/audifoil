import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Pressable,
  ImageBackground,
  Dimensions,
} from 'react-native';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { useStore } from '@/store/useStore';
import { LOCAL_IMAGES } from '@/data/activities';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CrewQuickBookCard from '@/components/CrewQuickBookCard';

const { width, height } = Dimensions.get('window');
const HERO_HEIGHT = height * 0.52;

export default function ExploreScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { loadActivityBookings } = useStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadActivityBookings();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadActivityBookings();
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.text} />
        }
      >
        {/* Hero — One experience */}
        <View style={{ height: HERO_HEIGHT }}>
          <ImageBackground
            source={LOCAL_IMAGES.lagoonBoat}
            style={{ flex: 1, width }}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.85)']}
              locations={[0, 0.4, 1]}
              style={{ flex: 1, justifyContent: 'space-between', padding: 20 }}
            >
              <View className="flex-row items-center justify-between" style={{ paddingTop: insets.top }}>
                <View className="flex-row items-center">
                  <Icon name="Waves" size={26} color="white" />
                  <ThemedText className="text-lg font-bold ml-2 text-white">foilTribe Adventures</ThemedText>
                </View>
                <Pressable
                  onPress={() => router.push('/screens/notifications')}
                  className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                >
                  <Icon name="Bell" size={20} color="white" />
                </Pressable>
              </View>

              <View className="mb-8">
                <ThemedText className="text-white text-4xl font-bold leading-tight">
                  Maldives Adventure
                </ThemedText>
                <ThemedText className="text-white/90 text-lg mt-2 leading-snug">
                  Dolphins · snorkel · sandbank · sunsets. All gear included.
                </ThemedText>
                <View className="flex-row items-center mt-5">
                  <View className="bg-white/25 px-4 py-2.5 rounded-xl flex-row items-center">
                    <ThemedText className="text-white font-bold text-lg">$80</ThemedText>
                    <ThemedText className="text-white/80 ml-2 text-base">per person · 3 or 5 hours</ThemedText>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Crew Quick Book Card */}
        <View className="px-4 py-4 -mt-6">
          <AnimatedView animation="scaleIn" delay={100}>
            <CrewQuickBookCard />
          </AnimatedView>
        </View>

        {/* The Experience — Airbnb-style white card */}
        <View className="px-4 mt-4">
          <AnimatedView animation="fadeIn" delay={110}>
            <View className="rounded-2xl p-5 overflow-hidden" style={[shadowPresets.card, { backgroundColor: '#FFFFFF' }]}>
              <ThemedText
                className="mb-1"
                style={{ fontSize: 26, fontWeight: '700', color: '#000000', letterSpacing: -0.5 }}
              >
                Maldives Adventure
              </ThemedText>
              <ThemedText className="mb-3 text-sm" style={{ color: colors.textMuted }}>What you get</ThemedText>
              <ThemedText className="leading-6 mb-4 text-base" style={{ color: colors.textMuted }}>
                Dolphins, reef sharks, snorkelling, sandbank stop, and golden-hour sunsets. Picnic lunch, all gear, and hotel pickup included. Nothing to bring — just show up.
              </ThemedText>
              <View className="flex-row items-center pt-3" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
                <ThemedText className="font-bold text-xl" style={{ color: '#000000' }}>$80</ThemedText>
                <ThemedText className="ml-2 text-base" style={{ color: colors.textMuted }}>/ person · 3 or 5 hours</ThemedText>
              </View>
            </View>
          </AnimatedView>
        </View>

        {/* Add-ons — Airbnb-style option cards */}
        <View className="px-4 mt-6">
          <AnimatedView animation="fadeIn" delay={130}>
            <ThemedText
              className="mb-4"
              style={{ fontSize: 22, fontWeight: '700', color: '#000000', letterSpacing: -0.5 }}
            >
              Add-ons
            </ThemedText>
            <View className="gap-3">
              {[
                { title: 'Audi e-foil', desc: 'Fly above the water', price: '$70 / 30 min', sub: '$120 / 1 hour' },
                { title: 'Fishing', desc: 'Traditional Maldivian fishing', price: '$70 total', sub: null },
                { title: 'Drone aerial 4K', desc: 'Pro video of your trip', price: '$30 pp', sub: null },
                { title: 'GoPro 360 rental', desc: 'Keep all your footage', price: '$25 pp', sub: null },
              ].map((item) => (
                <View key={item.title} className="rounded-2xl p-4 flex-row items-center justify-between overflow-hidden" style={[shadowPresets.small, { backgroundColor: '#FFFFFF' }]}>
                  <View className="flex-1">
                    <ThemedText className="font-semibold text-base" style={{ color: '#000000' }}>{item.title}</ThemedText>
                    <ThemedText className="text-sm mt-0.5" style={{ color: colors.textMuted }}>{item.desc}</ThemedText>
                  </View>
                  <View className="items-end">
                    <ThemedText className="font-semibold" style={{ color: '#000000' }}>{item.price}</ThemedText>
                    {item.sub && <ThemedText className="text-sm" style={{ color: colors.textMuted }}>{item.sub}</ThemedText>}
                  </View>
                </View>
              ))}
            </View>
          </AnimatedView>
        </View>

        {/* Crew note */}
        <View className="px-4 mt-6 mb-8">
          <Pressable onPress={() => router.push('/crew')}>
            <ThemedText className="text-center text-sm" style={{ color: colors.textMuted }}>
              Join with other airline crew and share the cost — tap for flights
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

