import React, { useState, useCallback, useRef } from 'react';
import { View, ScrollView, Pressable, ImageBackground, Dimensions, FlatList } from 'react-native';
import Header from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { useStore } from '@/store/useStore';
import { MALDIVES_ADVENTURE_ID, EFOIL_ADDON, formatDurationHours } from '@/data/activities';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');
const HERO_HEIGHT = height * 0.45;

export default function ActivityDetailScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { selectedActivity, generateActivitySlots } = useStore();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleSelectTime = useCallback(() => {
    if (!selectedActivity) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    generateActivitySlots(selectedActivity);
    router.push('/screens/select-time');
  }, [selectedActivity, generateActivitySlots]);

  if (!selectedActivity) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ThemedText>No experience selected</ThemedText>
        <Button title="Go Back" onPress={() => router.back()} className="mt-4" />
      </View>
    );
  }

  const {
    media,
    title,
    subtitle,
    rating,
    reviewCount,
    durationMin,
    priceFromUsd,
    tags,
    highlights,
    whatYoullDo,
    included,
    safety,
    socialProof,
    meetingPoint,
    bookingsThisWeek,
    skillLevel,
    maxGuests,
    isPrivate,
  } = selectedActivity;

  const handleImageScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index !== activeImageIndex) {
      setActiveImageIndex(index);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}>
        {/* Hero Image Gallery */}
        <View style={{ height: HERO_HEIGHT }}>
          <FlatList
            data={media}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleImageScroll}
            keyExtractor={(_, i) => `image-${i}`}
            renderItem={({ item }) => (
              <ImageBackground
                source={item.localSource ? item.localSource : { uri: item.uri }}
                style={{ width, height: HERO_HEIGHT }}
                resizeMode="cover">
                <LinearGradient
                  colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.5)']}
                  locations={[0, 0.3, 1]}
                  style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  {/* Reserved for future overlay content */}
                </LinearGradient>
              </ImageBackground>
            )}
          />

          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            className="absolute left-4 top-0 h-10 w-10 items-center justify-center rounded-full bg-black/30"
            style={{ top: insets.top + 8 }}>
            <Icon name="ChevronLeft" size={24} color="white" />
          </Pressable>

          {/* Share & Favorite */}
          <View className="absolute right-4 top-0 flex-row gap-2" style={{ top: insets.top + 8 }}>
            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-black/30">
              <Icon name="Share" size={20} color="white" />
            </Pressable>
            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-black/30">
              <Icon name="Heart" size={20} color="white" />
            </Pressable>
          </View>

          {/* Image Pagination */}
          <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
            {media.map((_, i) => (
              <View
                key={i}
                className="mx-1 rounded-full"
                style={{
                  width: i === activeImageIndex ? 20 : 6,
                  height: 6,
                  backgroundColor: i === activeImageIndex ? 'white' : 'rgba(255,255,255,0.5)',
                }}
              />
            ))}
          </View>
        </View>

        {/* Content */}
        <View className="-mt-6 px-4">
          {/* Title Card */}
          <AnimatedView animation="scaleIn" delay={100}>
            <View className="rounded-2xl bg-secondary p-5" style={shadowPresets.large}>
              {/* Badges */}
              <View className="mb-3 flex-row items-center">
                {isPrivate && (
                  <View className="bg-highlight/15 rounded-full px-3 py-1">
                    <ThemedText
                      className="text-xs font-semibold"
                      style={{ color: colors.highlight }}>
                      Private Experience
                    </ThemedText>
                  </View>
                )}
              </View>

              {/* Title & Subtitle */}
              <ThemedText className="text-2xl font-bold" style={{ color: colors.text }}>
                {title}
              </ThemedText>
              <ThemedText className="mt-1" style={{ color: colors.textMuted }}>
                {subtitle}
              </ThemedText>

              {/* Rating & Stats */}
              <View className="mt-4 flex-row items-center">
                <View className="mr-4 flex-row items-center">
                  <Icon name="Star" size={16} color="#FFD700" fill="#FFD700" />
                  <ThemedText className="ml-1 font-bold" style={{ color: colors.text }}>
                    {rating}
                  </ThemedText>
                  <ThemedText className="ml-1" style={{ color: colors.textMuted }}>
                    ({reviewCount} reviews)
                  </ThemedText>
                </View>
                <ThemedText style={{ color: colors.textMuted }}>·</ThemedText>
                <ThemedText className="ml-2" style={{ color: colors.textMuted }}>
                  {bookingsThisWeek} booked this week
                </ThemedText>
              </View>

              {/* Quick Info */}
              <View className="mt-4 flex-row items-center justify-between border-t border-border pt-4">
                <InfoBadge icon="Clock" label={formatDurationHours(durationMin)} />
                <InfoBadge icon="Users" label={`${maxGuests} max`} />
                <InfoBadge icon="Target" label={skillLevel} />
                <InfoBadge icon="MapPin" label="Malé" />
              </View>
            </View>
          </AnimatedView>

          {/* Highlights */}
          <AnimatedView animation="fadeIn" delay={200} className="mt-6">
            <ThemedText
              className="mb-3"
              style={{ fontSize: 22, fontWeight: '700', color: '#000000', letterSpacing: -0.5 }}>
              Highlights
            </ThemedText>
            <View className="rounded-2xl bg-secondary p-4" style={shadowPresets.card}>
              {highlights.map((highlight, i) => (
                <View
                  key={i}
                  className={`flex-row items-start ${i < highlights.length - 1 ? 'mb-3' : ''}`}>
                  <View
                    className="mr-3 h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: colors.highlight + '15' }}>
                    <Icon name="Check" size={16} color={colors.highlight} />
                  </View>
                  <ThemedText className="mt-1 flex-1">{highlight}</ThemedText>
                </View>
              ))}
            </View>
          </AnimatedView>

          {/* What You'll Do */}
          <AnimatedView animation="fadeIn" delay={300} className="mt-6">
            <ThemedText
              className="mb-3"
              style={{ fontSize: 22, fontWeight: '700', color: '#000000', letterSpacing: -0.5 }}>
              What You'll Do
            </ThemedText>
            <View className="rounded-2xl bg-secondary p-4" style={shadowPresets.card}>
              {whatYoullDo.map((item, i) => (
                <View
                  key={i}
                  className={`flex-row ${i < whatYoullDo.length - 1 ? 'mb-4 border-b border-border pb-4' : ''}`}>
                  <View
                    className="mr-3 h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: colors.highlight }}>
                    <ThemedText className="text-sm font-bold text-white">{i + 1}</ThemedText>
                  </View>
                  <ThemedText className="mt-1 flex-1">{item}</ThemedText>
                </View>
              ))}
            </View>
          </AnimatedView>

          {/* What's Included */}
          <AnimatedView animation="fadeIn" delay={400} className="mt-6">
            <ThemedText
              className="mb-3"
              style={{ fontSize: 22, fontWeight: '700', color: '#000000', letterSpacing: -0.5 }}>
              What's Included
            </ThemedText>
            <View className="rounded-2xl bg-secondary p-4" style={shadowPresets.card}>
              <View className="flex-row flex-wrap">
                {included.map((item, i) => (
                  <View key={i} className="mb-3 w-1/2 flex-row items-center">
                    <Icon name="Check" size={14} color="#22C55E" />
                    <ThemedText className="ml-2 text-sm">{item}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          </AnimatedView>

          {/* Social Proof */}
          <AnimatedView animation="fadeIn" delay={500} className="mt-6">
            <ThemedText
              className="mb-3"
              style={{ fontSize: 22, fontWeight: '700', color: '#000000', letterSpacing: -0.5 }}>
              Popular With
            </ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
              {socialProof.map((proof, i) => (
                <View
                  key={i}
                  className="mr-3 flex-row items-center rounded-xl bg-secondary px-4 py-3"
                  style={shadowPresets.small}>
                  <Icon
                    name={
                      proof.type === 'crew'
                        ? 'Plane'
                        : proof.type === 'popular'
                          ? 'TrendingUp'
                          : 'Clock'
                    }
                    size={16}
                    color={colors.highlight}
                  />
                  <ThemedText className="ml-2 font-medium">{proof.label}</ThemedText>
                </View>
              ))}
            </ScrollView>
          </AnimatedView>

          {/* Meeting Point */}
          <AnimatedView animation="fadeIn" delay={600} className="mt-6">
            <ThemedText
              className="mb-3"
              style={{ fontSize: 22, fontWeight: '700', color: '#000000', letterSpacing: -0.5 }}>
              Meeting Point
            </ThemedText>
            <View
              className="flex-row items-center rounded-2xl bg-secondary p-4"
              style={shadowPresets.card}>
              <View
                className="mr-4 h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: colors.highlight + '15' }}>
                <Icon name="MapPin" size={24} color={colors.highlight} />
              </View>
              <View className="flex-1">
                <ThemedText className="font-semibold">{meetingPoint}</ThemedText>
                <ThemedText className="text-sm opacity-50">Arrive 15 minutes early</ThemedText>
              </View>
            </View>
          </AnimatedView>

          {/* E-Foil Add-on — only for Maldives Adventure */}
          {selectedActivity.id === MALDIVES_ADVENTURE_ID && (
            <AnimatedView animation="fadeIn" delay={650} className="mt-6">
              <ThemedText
                className="mb-3"
                style={{ fontSize: 22, fontWeight: '700', color: '#000000', letterSpacing: -0.5 }}>
                Optional Add-on
              </ThemedText>
              <View className="overflow-hidden rounded-2xl bg-secondary" style={shadowPresets.card}>
                {/* E-Foil hero image */}
                <ImageBackground
                  source={EFOIL_ADDON.images[0]}
                  style={{ height: 140, width: '100%' }}
                  resizeMode="cover"
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    locations={[0.3, 1]}
                    style={{ flex: 1, justifyContent: 'flex-end', padding: 16 }}
                  >
                    <View className="flex-row items-center justify-between">
                      <View>
                        <ThemedText className="text-lg font-bold text-white">
                          {EFOIL_ADDON.title}
                        </ThemedText>
                        <ThemedText className="text-sm text-white/70">
                          {EFOIL_ADDON.durationLabel}
                        </ThemedText>
                      </View>
                      <View className="rounded-full bg-white/25 px-3 py-1">
                        <ThemedText className="font-bold text-white">
                          ${EFOIL_ADDON.priceUsd}
                        </ThemedText>
                      </View>
                    </View>
                  </LinearGradient>
                </ImageBackground>

                {/* Description + includes */}
                <View className="p-4">
                  <ThemedText className="mb-3" style={{ color: colors.textMuted }}>
                    {EFOIL_ADDON.description}
                  </ThemedText>
                  {EFOIL_ADDON.includes.map((item, i) => (
                    <View key={i} className="mb-2 flex-row items-center">
                      <Icon name="Check" size={14} color="#22C55E" />
                      <ThemedText className="ml-2 text-sm">{item}</ThemedText>
                    </View>
                  ))}
                  <ThemedText className="mt-2 text-sm italic opacity-40">
                    Anyone in your group can add this at checkout or anytime before the trip.
                  </ThemedText>
                </View>
              </View>
            </AnimatedView>
          )}

          {/* Safety */}
          <AnimatedView animation="fadeIn" delay={700} className="mt-6">
            <ThemedText
              className="mb-3"
              style={{ fontSize: 22, fontWeight: '700', color: '#000000', letterSpacing: -0.5 }}>
              Safety
            </ThemedText>
            <View className="rounded-2xl bg-secondary p-4" style={shadowPresets.card}>
              {safety.map((item, i) => (
                <View
                  key={i}
                  className={`flex-row items-start ${i < safety.length - 1 ? 'mb-2' : ''}`}>
                  <Icon name="Shield" size={14} color={colors.textMuted} className="mt-1" />
                  <ThemedText className="ml-2 flex-1" style={{ color: colors.textMuted }}>
                    {item}
                  </ThemedText>
                </View>
              ))}
            </View>
          </AnimatedView>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        className="absolute bottom-0 left-0 right-0 border-t border-border bg-background px-4 pt-4"
        style={[shadowPresets.large, { paddingBottom: insets.bottom + 16 }]}>
        <View className="mb-4 flex-row items-center justify-between">
          <View>
            <ThemedText className="text-sm" style={{ color: colors.textMuted }}>
              From
            </ThemedText>
            <View className="flex-row items-baseline">
              <ThemedText className="text-3xl font-bold" style={{ color: colors.text }}>
                ${priceFromUsd}
              </ThemedText>
              <ThemedText className="ml-1" style={{ color: colors.textMuted }}>
                / person
              </ThemedText>
            </View>
          </View>
          <View className="flex-row items-center">
            <Icon name="Clock" size={16} color={colors.textMuted} />
            <ThemedText className="ml-1" style={{ color: colors.textMuted }}>
              {formatDurationHours(durationMin)}
            </ThemedText>
          </View>
        </View>

        <Button
          title="Select Date"
          onPress={handleSelectTime}
          iconEnd="ArrowRight"
          size="large"
          variant="cta"
          rounded="full"
        />
      </View>
    </View>
  );
}

function InfoBadge({ icon, label }: { icon: string; label: string }) {
  const colors = useThemeColors();
  return (
    <View className="items-center">
      <View
        className="mb-1 h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: colors.highlight + '10' }}>
        <Icon name={icon as any} size={18} color={colors.highlight} />
      </View>
      <ThemedText className="text-xs capitalize opacity-60">{label}</ThemedText>
    </View>
  );
}
