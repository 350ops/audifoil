import React, { useCallback } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  ImageBackground,
  Dimensions,
  FlatList,
} from 'react-native';
import Header from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { useStore } from '@/store/useStore';
import {
  ACTIVITIES,
  MALDIVES_ADVENTURE_ID,
  EXPERIENCE_HIGHLIGHTS,
  EFOIL_ADDON,
  MEDIA_PACKAGE,
  LOCAL_IMAGES,
} from '@/data/activities';
import VideoPreview from '@/components/VideoPreview';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = 220;

export default function ExperienceScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { setSelectedActivity, generateActivitySlots } = useStore();

  const handleBookExperience = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const maldivesAdventure = ACTIVITIES.find((a) => a.id === MALDIVES_ADVENTURE_ID);
    if (maldivesAdventure) {
      setSelectedActivity(maldivesAdventure);
      router.push('/screens/activity-detail');
    }
  }, [setSelectedActivity]);

  return (
    <View className="flex-1 bg-background">
      <Header
        title="The Experience"
        rightComponents={[
          <Icon key="share" name="Share" size={22} onPress={() => {}} />,
        ]}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {/* Intro */}
        <View className="px-4 pt-4 pb-2">
          <AnimatedView animation="fadeIn" delay={50}>
            <ThemedText className="text-2xl font-bold">
              What to Expect
            </ThemedText>
            <ThemedText className="mt-2 opacity-50">
              Our 5-hour Maldives Adventure packs the best of the Indian Ocean into one unforgettable day. Here's what you'll experience.
            </ThemedText>
          </AnimatedView>
        </View>

        {/* Experience Highlights */}
        {EXPERIENCE_HIGHLIGHTS.map((highlight, index) => (
          <AnimatedView
            key={highlight.id}
            animation="fadeIn"
            delay={100 + index * 80}
          >
            <HighlightSection highlight={highlight} index={index} />
          </AnimatedView>
        ))}

        {/* E-Foil Add-on Section */}
        <AnimatedView animation="fadeIn" delay={500}>
          <EfoilAddonSection />
        </AnimatedView>

        {/* Professional Media Content */}
        <AnimatedView animation="fadeIn" delay={550}>
          <MediaContentSection />
        </AnimatedView>

        {/* Summary / CTA */}
        <View className="mt-8 px-4">
          <AnimatedView animation="scaleIn" delay={600}>
            <View
              className="items-center rounded-2xl bg-secondary p-6"
              style={shadowPresets.card}
            >
              <ThemedText className="mb-2 text-xl font-bold">
                All This. One Trip. From $80.
              </ThemedText>
              <ThemedText className="mb-5 text-center opacity-50">
                Dolphins, snorkeling, sandbank, sunset cruise, lunch, drinks, hotel pickup — all included.
              </ThemedText>
              <Button
                title="Book the Experience"
                onPress={handleBookExperience}
                iconEnd="ArrowRight"
                size="large"
                variant="cta"
                rounded="full"
              />
            </View>
          </AnimatedView>
        </View>
      </ScrollView>
    </View>
  );
}

// ──────────────────────────────────────────────
// Highlight Section — image carousel + text
// ──────────────────────────────────────────────

function HighlightSection({
  highlight,
  index,
}: {
  highlight: (typeof EXPERIENCE_HIGHLIGHTS)[number];
  index: number;
}) {
  const colors = useThemeColors();
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleScroll = (event: any) => {
    const i = Math.round(event.nativeEvent.contentOffset.x / width);
    if (i !== activeIndex) setActiveIndex(i);
  };

  return (
    <View className="mt-6">
      {/* Image Carousel */}
      <View style={{ height: IMAGE_HEIGHT }}>
        <FlatList
          data={highlight.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          keyExtractor={(_, i) => `${highlight.id}-img-${i}`}
          renderItem={({ item }) => (
            <ImageBackground
              source={item}
              style={{ width, height: IMAGE_HEIGHT }}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)']}
                locations={[0.5, 1]}
                style={{ flex: 1, justifyContent: 'flex-end', padding: 16 }}
              >
                <View className="flex-row items-center">
                  <Icon name={highlight.icon as any} size={18} color="white" />
                  <ThemedText className="ml-2 text-lg font-bold text-white">
                    {highlight.title}
                  </ThemedText>
                </View>
                <ThemedText className="text-sm text-white/70">
                  {highlight.subtitle}
                </ThemedText>
              </LinearGradient>
            </ImageBackground>
          )}
        />

        {/* Pagination dots */}
        {highlight.images.length > 1 && (
          <View className="absolute bottom-3 left-0 right-0 flex-row justify-center">
            {highlight.images.map((_, i) => (
              <View
                key={i}
                className="mx-0.5 rounded-full"
                style={{
                  width: i === activeIndex ? 16 : 5,
                  height: 5,
                  backgroundColor: i === activeIndex ? 'white' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </View>
        )}
      </View>

      {/* Description */}
      <View className="px-4 pt-3">
        <ThemedText className="leading-relaxed opacity-60">
          {highlight.description}
        </ThemedText>
      </View>
    </View>
  );
}

// ──────────────────────────────────────────────
// E-Foil Add-on teaser
// ──────────────────────────────────────────────

function EfoilAddonSection() {
  const colors = useThemeColors();
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleScroll = (event: any) => {
    const i = Math.round(event.nativeEvent.contentOffset.x / width);
    if (i !== activeIndex) setActiveIndex(i);
  };

  return (
    <View className="mt-8">
      {/* Image carousel */}
      <View style={{ height: IMAGE_HEIGHT }}>
        <FlatList
          data={EFOIL_ADDON.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          keyExtractor={(_, i) => `efoil-img-${i}`}
          renderItem={({ item }) => (
            <ImageBackground
              source={item}
              style={{ width, height: IMAGE_HEIGHT }}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                locations={[0.4, 1]}
                style={{ flex: 1, justifyContent: 'flex-end', padding: 16 }}
              >
                <View className="flex-row items-center">
                  <Icon name="Zap" size={18} color="white" />
                  <ThemedText className="ml-2 text-lg font-bold text-white">
                    {EFOIL_ADDON.title}
                  </ThemedText>
                </View>
                <ThemedText className="text-sm text-white/70">
                  Optional add-on · ${EFOIL_ADDON.priceUsd}/person
                </ThemedText>
              </LinearGradient>
            </ImageBackground>
          )}
        />

        {EFOIL_ADDON.images.length > 1 && (
          <View className="absolute bottom-3 left-0 right-0 flex-row justify-center">
            {EFOIL_ADDON.images.map((_, i) => (
              <View
                key={i}
                className="mx-0.5 rounded-full"
                style={{
                  width: i === activeIndex ? 16 : 5,
                  height: 5,
                  backgroundColor: i === activeIndex ? 'white' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </View>
        )}
      </View>

      {/* Description + includes */}
      <View className="px-4 pt-3">
        <View className="mb-3 flex-row items-center">
          <View
            className="mr-2 rounded-full px-3 py-1"
            style={{ backgroundColor: colors.highlight + '20' }}
          >
            <ThemedText className="text-xs font-semibold" style={{ color: colors.highlight }}>
              Optional Add-on
            </ThemedText>
          </View>
          <ThemedText className="font-bold" style={{ color: colors.highlight }}>
            ${EFOIL_ADDON.priceUsd}
          </ThemedText>
          <ThemedText className="ml-1 opacity-50">/ person</ThemedText>
        </View>

        <ThemedText className="leading-relaxed opacity-60">
          {EFOIL_ADDON.description}
        </ThemedText>

        <View className="mt-3 gap-2">
          {EFOIL_ADDON.includes.map((item, i) => (
            <View key={i} className="flex-row items-center">
              <Icon name="Check" size={14} color="#22C55E" />
              <ThemedText className="ml-2 text-sm opacity-60">{item}</ThemedText>
            </View>
          ))}
        </View>

        <ThemedText className="mt-3 text-sm italic opacity-40">
          Add it when you book, or anytime before your trip. Anyone in your group can opt in.
        </ThemedText>
      </View>
    </View>
  );
}

// ──────────────────────────────────────────────
// Media content videos
// ──────────────────────────────────────────────

const MEDIA_VIDEOS = [
  {
    source: require('@/assets/img/imagesmaldivesa/videos/foiling-maldives.mp4'),
    label: 'E-Foil in the Maldives',
  },
  {
    source: require('@/assets/img/imagesmaldivesa/videos/gliding.mp4'),
    label: 'Gliding above the water',
  },
  {
    source: require('@/assets/img/imagesmaldivesa/videos/boat-trip.mov'),
    label: 'On the boat',
  },
];

// ──────────────────────────────────────────────
// Professional Media Content section
// ──────────────────────────────────────────────

function MediaContentSection() {
  const colors = useThemeColors();

  return (
    <View className="mt-8 px-4">
      <View className="overflow-hidden rounded-2xl bg-secondary" style={shadowPresets.card}>
        {/* Header */}
        <View className="p-5 pb-3">
          <View className="mb-2 flex-row items-center">
            <Icon name="Camera" size={22} color={colors.highlight} />
            <ThemedText className="ml-2 text-lg font-bold">{MEDIA_PACKAGE.title}</ThemedText>
          </View>
          <ThemedText className="leading-relaxed opacity-60">
            {MEDIA_PACKAGE.description}
          </ThemedText>
        </View>

        {/* Video Previews */}
        <View className="gap-3 px-5 pb-4">
          {MEDIA_VIDEOS.map((video, i) => (
            <View key={i}>
              <VideoPreview
                source={video.source}
                height={180}
                rounded={12}
              />
              <ThemedText className="mt-1.5 text-xs opacity-40">{video.label}</ThemedText>
            </View>
          ))}
        </View>

        {/* Equipment grid */}
        <View className="flex-row flex-wrap px-5 pb-2">
          {MEDIA_PACKAGE.equipment.map((item) => (
            <View key={item.label} className="mb-3 w-1/2 flex-row items-center">
              <View
                className="mr-2 h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: colors.highlight + '15' }}
              >
                <Icon name={item.icon as any} size={16} color={colors.highlight} />
              </View>
              <ThemedText className="text-sm">{item.label}</ThemedText>
            </View>
          ))}
        </View>

        {/* Note */}
        <View
          className="mx-5 mb-5 rounded-xl p-3"
          style={{ backgroundColor: colors.highlight + '10' }}
        >
          <View className="flex-row items-start">
            <Icon name="Info" size={16} color={colors.highlight} />
            <ThemedText className="ml-2 flex-1 text-sm" style={{ color: colors.highlight }}>
              {MEDIA_PACKAGE.note}
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}
