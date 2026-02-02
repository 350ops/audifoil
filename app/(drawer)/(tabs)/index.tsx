import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Pressable,
  ImageBackground,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { useStore } from '@/store/useStore';
import {
  Activity,
  ACTIVITIES,
  getFeaturedActivities,
  getTrendingActivities,
  getSunsetActivities,
  getWaterSportsActivities,
  getBoatExperiences,
  MEDIA,
} from '@/data/activities';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');
const HERO_HEIGHT = height * 0.52;

export default function ExploreScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { setSelectedActivity, loadActivityBookings, demoUser } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  useEffect(() => {
    loadActivityBookings();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadActivityBookings();
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const handleActivityPress = useCallback((activity: Activity) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedActivity(activity);
    router.push('/screens/activity-detail');
  }, [setSelectedActivity]);

  const trendingActivities = getTrendingActivities();
  const sunsetActivities = getSunsetActivities();
  const waterSports = getWaterSportsActivities();
  const boatExperiences = getBoatExperiences();

  const heroImages = [
    { image: MEDIA.efoil.hero, title: 'Audi E-Foil', subtitle: 'Fly above paradise', activity: ACTIVITIES[0] },
    { image: MEDIA.boat.sunset, title: 'Sunset Cruises', subtitle: 'Golden hour magic', activity: ACTIVITIES[1] },
    { image: MEDIA.snorkel.reef, title: 'Reef Discovery', subtitle: 'Underwater wonders', activity: ACTIVITIES[2] },
    { image: MEDIA.sandbank.aerial, title: 'Private Islands', subtitle: 'Your own paradise', activity: ACTIVITIES[4] },
  ];

  const handleHeroScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index !== activeHeroIndex) {
      setActiveHeroIndex(index);
    }
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
        {/* Hero Carousel */}
        <View style={{ height: HERO_HEIGHT }}>
          <FlatList
            data={heroImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleHeroScroll}
            keyExtractor={(_, i) => `hero-${i}`}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => handleActivityPress(item.activity)}
                style={{ width, height: HERO_HEIGHT }}
              >
                <ImageBackground
                  source={{ uri: item.image }}
                  style={{ flex: 1 }}
                  resizeMode="cover"
                >
                  <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
                    locations={[0, 0.4, 1]}
                    style={{ flex: 1, justifyContent: 'space-between', padding: 20 }}
                  >
                    {/* Header */}
                    <View
                      className="flex-row items-center justify-between"
                      style={{ paddingTop: insets.top }}
                    >
                      <View className="flex-row items-center">
                        <Icon name="Waves" size={26} color="white" />
                        <ThemedText className="text-lg font-bold ml-2 text-white">audiFoil</ThemedText>
                      </View>
                      <Pressable
                        onPress={() => router.push('/screens/notifications')}
                        className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                      >
                        <Icon name="Bell" size={20} color="white" />
                      </Pressable>
                    </View>

                    {/* Hero Content */}
                    <View className="mb-8">
                      <View className="flex-row items-center mb-3">
                        <View className="bg-white/20 px-3 py-1.5 rounded-full mr-2">
                          <ThemedText className="text-white text-xs font-semibold">Featured</ThemedText>
                        </View>
                        {item.activity.isTrending && (
                          <View className="bg-red-500/90 px-3 py-1.5 rounded-full flex-row items-center">
                            <Icon name="TrendingUp" size={12} color="white" />
                            <ThemedText className="text-white text-xs font-semibold ml-1">Trending</ThemedText>
                          </View>
                        )}
                      </View>
                      <ThemedText className="text-white text-4xl font-bold">{item.title}</ThemedText>
                      <ThemedText className="text-white/80 text-lg mt-1">{item.subtitle}</ThemedText>
                      <View className="flex-row items-center mt-4">
                        <View className="bg-white/20 px-4 py-2 rounded-full flex-row items-center">
                          <ThemedText className="text-white font-bold">
                            From ${item.activity.priceFromUsd}
                          </ThemedText>
                          <ThemedText className="text-white/70 ml-2">
                            · {item.activity.durationMin} min
                          </ThemedText>
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </Pressable>
            )}
          />

          {/* Hero Pagination */}
          <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
            {heroImages.map((_, i) => (
              <View
                key={i}
                className="mx-1 rounded-full"
                style={{
                  width: i === activeHeroIndex ? 24 : 8,
                  height: 8,
                  backgroundColor: i === activeHeroIndex ? 'white' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </View>
        </View>

        {/* Quick Stats Bar */}
        <View className="px-4 py-4 -mt-6">
          <AnimatedView animation="scaleIn" delay={100}>
            <View
              className="bg-secondary rounded-2xl p-4 flex-row items-center justify-around"
              style={shadowPresets.large}
            >
              <QuickStat value="6" label="Experiences" icon="Sparkles" />
              <View className="w-px h-10 bg-border" />
              <QuickStat value="24" label="Booked today" icon="Users" />
              <View className="w-px h-10 bg-border" />
              <QuickStat value="4.9" label="Avg rating" icon="Star" />
            </View>
          </AnimatedView>
        </View>

        {/* Welcome Message */}
        <View className="px-4 mt-2 mb-2">
          <ThemedText className="text-2xl font-bold">
            Welcome{demoUser?.name ? `, ${demoUser.name}` : ''}
          </ThemedText>
          <ThemedText className="opacity-50">Discover premium experiences in the Maldives</ThemedText>
        </View>

        {/* Trending Section */}
        <Section
          title="Trending Now"
          subtitle="Most popular this week"
          icon="TrendingUp"
          delay={200}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          >
            {trendingActivities.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onPress={() => handleActivityPress(activity)}
                variant="large"
                index={index}
              />
            ))}
          </ScrollView>
        </Section>

        {/* Sunset Experiences */}
        <Section
          title="Sunset Experiences"
          subtitle="Golden hour magic"
          icon="Sunset"
          delay={300}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          >
            {sunsetActivities.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onPress={() => handleActivityPress(activity)}
                variant="medium"
                index={index}
              />
            ))}
          </ScrollView>
        </Section>

        {/* Water Sports */}
        <Section
          title="Water Sports"
          subtitle="Thrills on the lagoon"
          icon="Waves"
          delay={400}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          >
            {waterSports.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onPress={() => handleActivityPress(activity)}
                variant="medium"
                index={index}
              />
            ))}
          </ScrollView>
        </Section>

        {/* Boat Experiences */}
        <Section
          title="On the Water"
          subtitle="Cruises, fishing & more"
          icon="Ship"
          delay={500}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          >
            {boatExperiences.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onPress={() => handleActivityPress(activity)}
                variant="medium"
                index={index}
              />
            ))}
          </ScrollView>
        </Section>

        {/* All Activities CTA */}
        <View className="px-4 mt-8 mb-4">
          <AnimatedView animation="fadeIn" delay={600}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/activities');
              }}
              className="rounded-2xl overflow-hidden"
              style={shadowPresets.card}
            >
              <LinearGradient
                colors={[colors.highlight, '#0077B6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="p-5 flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mr-4">
                    <Icon name="Grid3X3" size={24} color="white" />
                  </View>
                  <View className="flex-1">
                    <ThemedText className="text-white font-bold text-lg">Browse All Activities</ThemedText>
                    <ThemedText className="text-white/70">{ACTIVITIES.length} unique experiences</ThemedText>
                  </View>
                </View>
                <Icon name="ChevronRight" size={24} color="white" />
              </LinearGradient>
            </Pressable>
          </AnimatedView>
        </View>
      </ScrollView>
    </View>
  );
}

// Quick Stat Component
function QuickStat({ value, label, icon }: { value: string; label: string; icon: string }) {
  const colors = useThemeColors();
  return (
    <View className="items-center">
      <View className="flex-row items-center">
        <Icon name={icon as any} size={16} color={colors.highlight} />
        <ThemedText className="font-bold text-xl ml-1">{value}</ThemedText>
      </View>
      <ThemedText className="text-xs opacity-50 mt-1">{label}</ThemedText>
    </View>
  );
}

// Section Component
function Section({
  title,
  subtitle,
  icon,
  children,
  delay = 0,
}: {
  title: string;
  subtitle: string;
  icon: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const colors = useThemeColors();
  return (
    <AnimatedView animation="fadeIn" delay={delay} className="mt-8">
      <View className="px-4 mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View
            className="w-10 h-10 rounded-xl items-center justify-center mr-3"
            style={{ backgroundColor: colors.highlight + '15' }}
          >
            <Icon name={icon as any} size={20} color={colors.highlight} />
          </View>
          <View className="flex-1">
            <ThemedText className="font-bold text-xl">{title}</ThemedText>
            <ThemedText className="text-sm opacity-50">{subtitle}</ThemedText>
          </View>
        </View>
      </View>
      {children}
    </AnimatedView>
  );
}

// Activity Card Component
function ActivityCard({
  activity,
  onPress,
  variant = 'medium',
  index = 0,
}: {
  activity: Activity;
  onPress: () => void;
  variant?: 'large' | 'medium' | 'small';
  index?: number;
}) {
  const colors = useThemeColors();

  const cardWidth = variant === 'large' ? width * 0.78 : variant === 'medium' ? width * 0.58 : width * 0.4;
  const cardHeight = variant === 'large' ? 260 : variant === 'medium' ? 200 : 160;

  return (
    <AnimatedView animation="scaleIn" delay={index * 60}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          {
            width: cardWidth,
            height: cardHeight,
            borderRadius: 20,
            overflow: 'hidden',
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
          shadowPresets.card,
        ]}
      >
        <ImageBackground
          source={{ uri: activity.media[0].uri }}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            locations={[0.3, 1]}
            style={{ flex: 1, justifyContent: 'flex-end', padding: 16 }}
          >
            {/* Badges */}
            <View className="flex-row items-center mb-2">
              {activity.isTrending && (
                <View className="bg-red-500/90 px-2 py-1 rounded-full flex-row items-center mr-2">
                  <Icon name="Flame" size={10} color="white" />
                  <ThemedText className="text-white text-xs font-semibold ml-1">Hot</ThemedText>
                </View>
              )}
              {activity.isPrivate && (
                <View className="bg-white/25 px-2 py-1 rounded-full">
                  <ThemedText className="text-white text-xs font-semibold">Private</ThemedText>
                </View>
              )}
            </View>

            {/* Title & Info */}
            <ThemedText className="text-white font-bold text-lg" numberOfLines={1}>
              {activity.title}
            </ThemedText>

            <View className="flex-row items-center mt-1">
              <View className="flex-row items-center">
                <Icon name="Star" size={12} color="#FFD700" fill="#FFD700" />
                <ThemedText className="text-white text-sm ml-1 font-medium">{activity.rating}</ThemedText>
              </View>
              <ThemedText className="text-white/60 text-sm ml-2">
                · {activity.durationMin} min
              </ThemedText>
            </View>

            {/* Price & Social Proof */}
            <View className="flex-row items-center justify-between mt-2">
              <ThemedText className="text-white font-bold text-base">
                From ${activity.priceFromUsd}
              </ThemedText>
              {activity.socialProof[0] && variant !== 'small' && (
                <ThemedText className="text-white/60 text-xs" numberOfLines={1}>
                  {activity.socialProof[0].label}
                </ThemedText>
              )}
            </View>
          </LinearGradient>
        </ImageBackground>
      </Pressable>
    </AnimatedView>
  );
}
