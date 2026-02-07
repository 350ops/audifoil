import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Pressable,
  ImageBackground,
  Dimensions,
  Linking,
} from 'react-native';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { useStore } from '@/store/useStore';
import { LOCAL_IMAGES, ACTIVITIES, MALDIVES_ADVENTURE_ID } from '@/data/activities';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CrewQuickBookCard from '@/components/CrewQuickBookCard';
import VideoPreview from '@/components/VideoPreview';

const { width, height } = Dimensions.get('window');
const HERO_HEIGHT = height * 0.52;

const WHATSAPP_NUMBER = '960XXXXXXX'; // Replace with actual number

const EXPERIENCE_ITEMS = [
  {
    icon: 'Fish',
    title: 'Swim with Dolphins',
    desc: 'Cruise to the dolphin channel and swim alongside wild spinner dolphins. 95% sighting rate.',
  },
  {
    icon: 'Waves',
    title: 'Snorkel Pristine Reefs',
    desc: 'Two reef stops teeming with tropical fish, sea turtles, and reef sharks. All gear provided.',
  },
  {
    icon: 'Sun',
    title: 'Private Sandbank Picnic',
    desc: 'Your own strip of white sand in the middle of the Indian Ocean. Lunch, drinks, and the best photos you\'ll ever take.',
  },
  {
    icon: 'Zap',
    title: 'Fly an E-Foil',
    desc: 'The highlight. Every guest tries the Audi e-foil — an electric surfboard that lifts you above the water. Resorts charge $150+ for 30 min. It\'s included in your trip.',
  },
  {
    icon: 'Sunset',
    title: 'Golden Hour Cruise',
    desc: 'End the day cruising back as the sun sets over the Indian Ocean. Music, drinks, and memories that last.',
  },
  {
    icon: 'Camera',
    title: 'Professional Media Content',
    desc: 'GoPro, drone, underwater, and 360° cameras — professional-grade photos and video of your adventure, available upon request.',
  },
];

const STEPS = [
  { number: '1', title: 'Pick a date', desc: 'Check upcoming trips. We run them most days, morning and afternoon.' },
  { number: '2', title: 'Reserve your spot', desc: 'Tap "Join Trip" and lock in your spot via WhatsApp. No payment until the trip is confirmed.' },
  { number: '3', title: 'Spread the word', desc: 'Share your trip link with friends or colleagues. The more who join, the less everyone pays.' },
  { number: '4', title: 'Show up and enjoy', desc: 'We pick you up from Malé or Hulhumalé. Sunscreen and a swimsuit — we handle everything else.' },
];

const VALUES = [
  { icon: 'Map', title: 'Local Knowledge', desc: 'We know the reefs, the dolphin channels, and the sandbanks that don\'t show up on Google Maps.' },
  { icon: 'Users', title: 'Small Groups', desc: 'Max 5 people. No megaboat. No crowds. Just a small crew sharing an incredible day.' },
  { icon: 'Sparkles', title: 'Unfair Value', desc: 'An e-foil session alone costs $250+ at resorts. We include it with dolphins, snorkeling, and lunch — from $80.' },
  { icon: 'Heart', title: 'Community', desc: 'Most guests come solo and leave with friends. One trip, and you\'ll want to tell everyone.' },
];

export default function ExploreScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { loadActivityBookings, setSelectedActivity } = useStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadActivityBookings();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadActivityBookings();
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const navigateToExperience = useCallback(() => {
    const maldivesAdventure = ACTIVITIES.find((a) => a.id === MALDIVES_ADVENTURE_ID);
    if (maldivesAdventure) {
      setSelectedActivity(maldivesAdventure);
      router.push('/screens/activity-detail');
    }
  }, [setSelectedActivity]);

  const openWhatsApp = () => {
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=Hey! I'd like to learn more about the foiltribe Maldives Adventure.`);
  };

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
        {/* ──────────────────── HERO ──────────────────── */}
        <View style={{ height: HERO_HEIGHT }}>
          <ImageBackground
            source={LOCAL_IMAGES.boat}
            style={{ flex: 1, width }}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.85)']}
              locations={[0, 0.35, 1]}
              style={{ flex: 1, justifyContent: 'space-between', padding: 20 }}
            >
              {/* Top bar */}
              <View className="flex-row items-center justify-between" style={{ paddingTop: insets.top }}>
                <ThemedText className="text-sm font-semibold tracking-wider text-white/80">
                  foiltribe
                </ThemedText>
                <Pressable
                  onPress={() => router.push('/screens/notifications')}
                  className="h-10 w-10 items-center justify-center rounded-full bg-white/20"
                >
                  <Icon name="Bell" size={20} color="white" />
                </Pressable>
              </View>

              {/* Hero text */}
              <View className="mb-8">
                <ThemedText className="text-4xl font-bold leading-tight text-white">
                  Your Maldives{'\n'}Adventure
                </ThemedText>
                <ThemedText className="mt-2 text-lg leading-snug text-white/90">
                  5 hours. Dolphins, reefs, sandbank, e-foil.{'\n'}All in one unforgettable day.
                </ThemedText>
                <View className="mt-5 flex-row items-center">
                  <View className="flex-row items-center rounded-xl bg-white/25 px-4 py-2.5">
                    <ThemedText className="text-lg font-bold text-white">From $80</ThemedText>
                    <ThemedText className="ml-2 text-base text-white/80">/ person</ThemedText>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* ──────────────────── QUICK BOOK ──────────────────── */}
        <View className="px-4 py-4 -mt-6">
          <AnimatedView animation="scaleIn" delay={100}>
            <CrewQuickBookCard />
          </AnimatedView>
        </View>

        {/* ──────────────────── VIDEO TEASER ──────────────────── */}
        <View className="px-4 mt-2">
          <AnimatedView animation="fadeIn" delay={110}>
            <VideoPreview
              source={require('@/assets/img/imagesmaldivesa/videos/ocean-cruise.mov')}
              height={200}
              rounded={16}
            />
            <ThemedText className="mt-2 text-center text-xs opacity-30">
              A day on the water with foiltribe
            </ThemedText>
          </AnimatedView>
        </View>

        {/* ──────────────────── THE EXPERIENCE ──────────────────── */}
        <View className="px-4 mt-6">
          <AnimatedView animation="fadeIn" delay={120}>
            <ThemedText className="mb-1 text-2xl font-bold">One Day. Five Experiences.</ThemedText>
            <ThemedText className="mb-5 opacity-50">
              Everything the Maldives has to offer, packed into a single unforgettable day on the water.
            </ThemedText>
          </AnimatedView>

          <View className="gap-4">
            {EXPERIENCE_ITEMS.map((item, i) => (
              <AnimatedView key={item.title} animation="scaleIn" delay={140 + i * 60}>
                <View
                  className="flex-row rounded-2xl bg-secondary p-4"
                  style={shadowPresets.card}
                >
                  <View
                    className="mr-4 h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: colors.highlight + '15' }}
                  >
                    <Icon name={item.icon as any} size={24} color={colors.highlight} />
                  </View>
                  <View className="flex-1">
                    <ThemedText className="text-base font-bold">{item.title}</ThemedText>
                    <ThemedText className="mt-1 text-sm opacity-60">{item.desc}</ThemedText>
                  </View>
                </View>
              </AnimatedView>
            ))}
          </View>
        </View>

        {/* ──────────────────── PRICING ──────────────────── */}
        <View className="mt-10 px-4">
          <AnimatedView animation="fadeIn" delay={200}>
            <ThemedText className="mb-1 text-2xl font-bold">Transparent Pricing</ThemedText>
            <ThemedText className="mb-5 opacity-50">
              Per person. Depends on group size. Simple.
            </ThemedText>

            <View className="gap-3">
              {[
                { people: '5 guests', price: '$80', tag: 'Best value', highlight: true },
                { people: '4 guests', price: '$95', tag: null, highlight: false },
                { people: '3 guests', price: '$120', tag: null, highlight: false },
                { people: 'Private (1-2)', price: 'from $350', tag: null, highlight: false },
              ].map((tier) => (
                <View
                  key={tier.people}
                  className="flex-row items-center justify-between rounded-2xl bg-secondary p-4"
                  style={[
                    shadowPresets.small,
                    tier.highlight ? { borderWidth: 2, borderColor: colors.highlight } : {},
                  ]}
                >
                  <View className="flex-row items-center">
                    <Icon name="Users" size={18} color={tier.highlight ? colors.highlight : colors.icon} />
                    <ThemedText className="ml-3 font-medium">{tier.people}</ThemedText>
                    {tier.tag && (
                      <View className="ml-2 rounded-full px-2 py-0.5" style={{ backgroundColor: colors.highlight + '20' }}>
                        <ThemedText className="text-xs font-semibold" style={{ color: colors.highlight }}>
                          {tier.tag}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                  <ThemedText className="text-lg font-bold" style={tier.highlight ? { color: colors.highlight } : {}}>
                    {tier.price}
                  </ThemedText>
                </View>
              ))}
            </View>

            {/* What's included */}
            <View className="mt-5 rounded-2xl bg-secondary p-4" style={shadowPresets.card}>
              <ThemedText className="mb-3 font-bold">Every trip includes:</ThemedText>
              {[
                '5-hour boat adventure',
                'Dolphin swimming',
                '2 snorkel reef stops + all gear',
                'Private sandbank stop + picnic lunch',
                'E-foil session for every guest (worth $150+)',
                'Professional drone & 360-cam footage',
                'Hotel pickup & drop-off',
                'Drinks, snacks & refreshments all day',
              ].map((item) => (
                <View key={item} className="mb-2 flex-row items-start">
                  <Icon name="Check" size={16} color="#22C55E" />
                  <ThemedText className="ml-2 flex-1 text-sm opacity-70">{item}</ThemedText>
                </View>
              ))}
            </View>
          </AnimatedView>
        </View>

        {/* ──────────────────── FOR CABIN CREW ──────────────────── */}
        <View className="mt-10 px-4">
          <AnimatedView animation="fadeIn" delay={220}>
            <View className="overflow-hidden rounded-2xl" style={shadowPresets.card}>
              <LinearGradient
                colors={[colors.highlight, '#0284C7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ padding: 20 }}
              >
                <View className="mb-3 flex-row items-center">
                  <Icon name="Plane" size={22} color="white" />
                  <ThemedText className="ml-2 text-lg font-bold text-white">On a Layover in Malé?</ThemedText>
                </View>
                <ThemedText className="leading-relaxed text-white/90">
                  foiltribe was started by a former airline crew member who knew there had to be a better way to experience the Maldives on a layover budget.
                </ThemedText>
                <ThemedText className="mt-3 leading-relaxed text-white/90">
                  For $80, you and your crew get dolphins, snorkeling, a private sandbank, lunch, and an e-foil session — all in 5 hours, with pickup from your hotel.
                </ThemedText>
                <ThemedText className="mt-4 text-sm font-semibold text-white/80">How crew book:</ThemedText>
                <View className="mt-2 gap-2">
                  <ThemedText className="text-sm text-white/80">1. One person picks a date and taps "Join Trip"</ThemedText>
                  <ThemedText className="text-sm text-white/80">2. Share the link in your crew WhatsApp group</ThemedText>
                  <ThemedText className="text-sm text-white/80">3. Once 4-5 people join, everyone locks in $80</ThemedText>
                  <ThemedText className="text-sm text-white/80">4. We pick you up. Best day of your layover.</ThemedText>
                </View>
              </LinearGradient>
            </View>
          </AnimatedView>
        </View>

        {/* ──────────────────── HOW IT WORKS ──────────────────── */}
        <View className="mt-10 px-4">
          <AnimatedView animation="fadeIn" delay={240}>
            <ThemedText className="mb-1 text-2xl font-bold">How It Works</ThemedText>
            <ThemedText className="mb-5 opacity-50">Four steps. Zero hassle.</ThemedText>

            <View className="gap-4">
              {STEPS.map((step, i) => (
                <View key={step.number} className="flex-row">
                  <View className="mr-4 items-center">
                    <View
                      className="h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: colors.highlight }}
                    >
                      <ThemedText className="font-bold text-white">{step.number}</ThemedText>
                    </View>
                    {i < STEPS.length - 1 && (
                      <View className="mt-2 w-0.5 flex-1" style={{ backgroundColor: colors.border }} />
                    )}
                  </View>
                  <View className="mb-2 flex-1 rounded-xl bg-secondary p-4" style={shadowPresets.card}>
                    <ThemedText className="text-base font-bold">{step.title}</ThemedText>
                    <ThemedText className="mt-1 text-sm opacity-60">{step.desc}</ThemedText>
                  </View>
                </View>
              ))}
            </View>
          </AnimatedView>
        </View>

        {/* ──────────────────── VALUES ──────────────────── */}
        <View className="mt-10 px-4">
          <AnimatedView animation="fadeIn" delay={260}>
            <ThemedText className="mb-1 text-2xl font-bold">What We're About</ThemedText>
            <ThemedText className="mb-5 opacity-50">
              Small groups. Big experiences. Real value.
            </ThemedText>

            <View className="flex-row flex-wrap gap-3">
              {VALUES.map((val) => (
                <View
                  key={val.title}
                  className="w-[48%] rounded-xl bg-secondary p-4"
                  style={shadowPresets.card}
                >
                  <View
                    className="mb-3 h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: colors.highlight + '15' }}
                  >
                    <Icon name={val.icon as any} size={20} color={colors.highlight} />
                  </View>
                  <ThemedText className="mb-1 font-semibold">{val.title}</ThemedText>
                  <ThemedText className="text-xs opacity-50">{val.desc}</ThemedText>
                </View>
              ))}
            </View>
          </AnimatedView>
        </View>

        {/* ──────────────────── ABOUT ──────────────────── */}
        <View className="mt-10 px-4">
          <AnimatedView animation="fadeIn" delay={280}>
            <ThemedText className="mb-1 text-2xl font-bold">About foiltribe</ThemedText>
            <ThemedText className="mt-2 leading-relaxed opacity-60">
              We're a group of friends who believe the best way to experience the Maldives shouldn't cost a fortune or require a resort booking.
            </ThemedText>
            <ThemedText className="mt-3 leading-relaxed opacity-60">
              We combined an Audi e-foil, a boat that feels like home, and local knowledge you can't Google — and created a 5-hour experience that rivals anything a $500/night resort offers.
            </ThemedText>
          </AnimatedView>
        </View>

        {/* ──────────────────── CTA ──────────────────── */}
        <View className="mt-10 mb-8 px-4">
          <AnimatedView animation="scaleIn" delay={300}>
            <View className="items-center rounded-2xl bg-secondary p-6" style={shadowPresets.card}>
              <ThemedText className="mb-2 text-xl font-bold">Ready?</ThemedText>
              <ThemedText className="mb-4 text-center opacity-50">
                Your best day in the Maldives is one message away.
              </ThemedText>
              <Pressable
                onPress={openWhatsApp}
                className="w-full flex-row items-center justify-center rounded-full py-4"
                style={{ backgroundColor: '#25D366' }}
              >
                <Icon name="MessageCircle" size={20} color="white" />
                <ThemedText className="ml-2 font-semibold text-white">Book via WhatsApp</ThemedText>
              </Pressable>
              <Pressable
                onPress={navigateToExperience}
                className="mt-3"
              >
                <ThemedText className="text-sm font-medium" style={{ color: colors.highlight }}>
                  Or view the full experience
                </ThemedText>
              </Pressable>
            </View>
          </AnimatedView>
        </View>
      </ScrollView>
    </View>
  );
}
