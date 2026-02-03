import React, { useState, useCallback, useMemo } from 'react';
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
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import GroupFillBar from '@/components/GroupFillBar';
import AirlineBadges from '@/components/AirlineBadges';
import { ActivitySlot, generateActivitySlots, getStatusMessage } from '@/data/activities';

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
      <View className="flex-1 bg-background items-center justify-center">
        <ThemedText>No activity selected</ThemedText>
        <Button title="Browse Activities" onPress={() => router.back()} className="mt-4" />
      </View>
    );
  }

  const { media, title, subtitle, rating, reviewCount, durationMin, seatPriceFromUsd, boatTotalUsd, capacity, minToRun, canAddEfoil, efoilAddonPrice, tags, highlights, whatYoullDo, included, safety, socialProof, meetingPoint, bookingsThisWeek, skillLevel, isPrivate } = selectedActivity;

  // Generate preview slots for "Next Available Trips" section
  const previewSlots = useMemo(() => {
    return generateActivitySlots(selectedActivity, 2).slice(0, 3);
  }, [selectedActivity]);

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
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
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
                resizeMode="cover"
              >
                <LinearGradient
                  colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.5)']}
                  locations={[0, 0.3, 1]}
                  style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                >
                  {/* E-foil tagline overlay */}
                  {selectedActivity?.id === 'efoil-session' && (
                    <View className="items-center">
                      <ThemedText
                        className="text-white text-4xl font-bold tracking-widest"
                        style={{ textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}
                      >
                        SEEK THE
                      </ThemedText>
                      <ThemedText
                        className="text-white text-4xl font-bold tracking-widest"
                        style={{ textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}
                      >
                        CHALLENGE
                      </ThemedText>
                    </View>
                  )}
                </LinearGradient>
              </ImageBackground>
            )}
          />

          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            className="absolute top-0 left-4 w-10 h-10 rounded-full bg-black/30 items-center justify-center"
            style={{ top: insets.top + 8 }}
          >
            <Icon name="ChevronLeft" size={24} color="white" />
          </Pressable>

          {/* Share & Favorite */}
          <View className="absolute top-0 right-4 flex-row gap-2" style={{ top: insets.top + 8 }}>
            <Pressable className="w-10 h-10 rounded-full bg-black/30 items-center justify-center">
              <Icon name="Share" size={20} color="white" />
            </Pressable>
            <Pressable className="w-10 h-10 rounded-full bg-black/30 items-center justify-center">
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
        <View className="px-4 -mt-6">
          {/* Title Card */}
          <AnimatedView animation="scaleIn" delay={100}>
            <View className="bg-secondary rounded-2xl p-5" style={shadowPresets.large}>
              {/* Badges */}
              <View className="flex-row items-center mb-3">
                {selectedActivity.isTrending && (
                  <View className="bg-red-500/15 px-3 py-1 rounded-full flex-row items-center mr-2">
                    <Icon name="TrendingUp" size={12} color="#EF4444" />
                    <ThemedText className="text-xs font-semibold ml-1" style={{ color: '#EF4444' }}>
                      Trending
                    </ThemedText>
                  </View>
                )}
                {isPrivate && (
                  <View className="bg-highlight/15 px-3 py-1 rounded-full">
                    <ThemedText className="text-xs font-semibold" style={{ color: colors.highlight }}>
                      Private Experience
                    </ThemedText>
                  </View>
                )}
              </View>

              {/* Title & Subtitle */}
              <ThemedText className="text-2xl font-bold">{title}</ThemedText>
              <ThemedText className="opacity-60 mt-1">{subtitle}</ThemedText>

              {/* Rating & Stats */}
              <View className="flex-row items-center mt-4">
                <View className="flex-row items-center mr-4">
                  <Icon name="Star" size={16} color="#FFD700" fill="#FFD700" />
                  <ThemedText className="font-bold ml-1">{rating}</ThemedText>
                  <ThemedText className="opacity-50 ml-1">({reviewCount} reviews)</ThemedText>
                </View>
                <ThemedText className="opacity-30">·</ThemedText>
                <ThemedText className="opacity-50 ml-2">{bookingsThisWeek} booked this week</ThemedText>
              </View>

              {/* Quick Info */}
              <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-border">
                <InfoBadge icon="Clock" label={`${durationMin} min`} />
                <InfoBadge icon="Users" label={isPrivate ? 'Private' : `${capacity} seats`} />
                <InfoBadge icon="Target" label={skillLevel} />
                <InfoBadge icon="MapPin" label="Malé" />
              </View>

              {/* Per-Seat Pricing Info (for group experiences) */}
              {!isPrivate && boatTotalUsd && (
                <View className="mt-4 pt-4 border-t border-border">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-baseline">
                      <ThemedText className="text-sm opacity-50">From</ThemedText>
                      <ThemedText className="text-2xl font-bold ml-2" style={{ color: colors.highlight }}>
                        ${seatPriceFromUsd}
                      </ThemedText>
                      <ThemedText className="opacity-50 ml-1">/ seat</ThemedText>
                    </View>
                    <View className="bg-green-500/15 px-3 py-1 rounded-full">
                      <ThemedText className="text-xs font-medium" style={{ color: '#22C55E' }}>
                        Share the trip
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText className="text-xs opacity-40 mt-2">
                    Boat total ${boatTotalUsd} · Split across {minToRun}-{capacity} guests
                  </ThemedText>
                </View>
              )}
            </View>
          </AnimatedView>

          {/* Next Available Trips (Group Fill Preview) */}
          {!isPrivate && previewSlots.length > 0 && (
            <AnimatedView animation="fadeIn" delay={150} className="mt-6">
              <View className="flex-row items-center justify-between mb-3">
                <ThemedText className="text-xl font-bold">Next Available Trips</ThemedText>
                <Pressable onPress={handleSelectTime} className="flex-row items-center">
                  <ThemedText className="text-sm font-medium" style={{ color: colors.highlight }}>
                    See all times
                  </ThemedText>
                  <Icon name="ChevronRight" size={16} color={colors.highlight} />
                </Pressable>
              </View>

              {previewSlots.map((slot, i) => (
                <Pressable
                  key={slot.id}
                  onPress={handleSelectTime}
                  className={`bg-secondary rounded-xl p-4 ${i < previewSlots.length - 1 ? 'mb-3' : ''}`}
                  style={shadowPresets.card}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                      <ThemedText className="font-bold text-lg">{slot.startTime}</ThemedText>
                      <ThemedText className="opacity-50 ml-2">{slot.dateLabel}</ThemedText>
                    </View>
                    <ThemedText className="font-bold" style={{ color: colors.highlight }}>
                      ${slot.seatPrice}/seat
                    </ThemedText>
                  </View>

                  <GroupFillBar
                    seatsFilled={slot.seatsFilled}
                    capacity={slot.capacity}
                    minToRun={slot.minToRun}
                    status={slot.status}
                    size="sm"
                  />

                  {slot.airlineBadges.length > 0 && (
                    <View className="flex-row items-center mt-2">
                      <AirlineBadges badges={slot.airlineBadges} size="sm" />
                      <ThemedText className="text-xs opacity-50 ml-2">crew joining</ThemedText>
                    </View>
                  )}
                </Pressable>
              ))}
            </AnimatedView>
          )}

          {/* Highlights */}
          <AnimatedView animation="fadeIn" delay={200} className="mt-6">
            <ThemedText className="text-xl font-bold mb-3">Highlights</ThemedText>
            <View className="bg-secondary rounded-2xl p-4" style={shadowPresets.card}>
              {highlights.map((highlight, i) => (
                <View key={i} className={`flex-row items-start ${i < highlights.length - 1 ? 'mb-3' : ''}`}>
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: colors.highlight + '15' }}
                  >
                    <Icon name="Check" size={16} color={colors.highlight} />
                  </View>
                  <ThemedText className="flex-1 mt-1">{highlight}</ThemedText>
                </View>
              ))}
            </View>
          </AnimatedView>

          {/* What You'll Do */}
          <AnimatedView animation="fadeIn" delay={300} className="mt-6">
            <ThemedText className="text-xl font-bold mb-3">What You'll Do</ThemedText>
            <View className="bg-secondary rounded-2xl p-4" style={shadowPresets.card}>
              {whatYoullDo.map((item, i) => (
                <View key={i} className={`flex-row ${i < whatYoullDo.length - 1 ? 'mb-4 pb-4 border-b border-border' : ''}`}>
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: colors.highlight }}
                  >
                    <ThemedText className="text-white font-bold text-sm">{i + 1}</ThemedText>
                  </View>
                  <ThemedText className="flex-1 mt-1">{item}</ThemedText>
                </View>
              ))}
            </View>
          </AnimatedView>

          {/* What's Included */}
          <AnimatedView animation="fadeIn" delay={400} className="mt-6">
            <ThemedText className="text-xl font-bold mb-3">What's Included</ThemedText>
            <View className="bg-secondary rounded-2xl p-4" style={shadowPresets.card}>
              <View className="flex-row flex-wrap">
                {included.map((item, i) => (
                  <View key={i} className="w-1/2 flex-row items-center mb-3">
                    <Icon name="Check" size={14} color="#22C55E" />
                    <ThemedText className="ml-2 text-sm">{item}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          </AnimatedView>

          {/* Social Proof */}
          <AnimatedView animation="fadeIn" delay={500} className="mt-6">
            <ThemedText className="text-xl font-bold mb-3">Popular With</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
              {socialProof.map((proof, i) => (
                <View
                  key={i}
                  className="bg-secondary rounded-xl px-4 py-3 mr-3 flex-row items-center"
                  style={shadowPresets.small}
                >
                  <Icon
                    name={proof.type === 'crew' ? 'Plane' : proof.type === 'popular' ? 'TrendingUp' : 'Clock'}
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
            <ThemedText className="text-xl font-bold mb-3">Meeting Point</ThemedText>
            <View className="bg-secondary rounded-2xl p-4 flex-row items-center" style={shadowPresets.card}>
              <View
                className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                style={{ backgroundColor: colors.highlight + '15' }}
              >
                <Icon name="MapPin" size={24} color={colors.highlight} />
              </View>
              <View className="flex-1">
                <ThemedText className="font-semibold">{meetingPoint}</ThemedText>
                <ThemedText className="text-sm opacity-50">Arrive 15 minutes early</ThemedText>
              </View>
            </View>
          </AnimatedView>

          {/* Safety */}
          <AnimatedView animation="fadeIn" delay={700} className="mt-6">
            <ThemedText className="text-xl font-bold mb-3">Safety</ThemedText>
            <View className="bg-secondary rounded-2xl p-4" style={shadowPresets.card}>
              {safety.map((item, i) => (
                <View key={i} className={`flex-row items-start ${i < safety.length - 1 ? 'mb-2' : ''}`}>
                  <Icon name="Shield" size={14} color={colors.placeholder} className="mt-1" />
                  <ThemedText className="ml-2 opacity-70 flex-1">{item}</ThemedText>
                </View>
              ))}
            </View>
          </AnimatedView>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-background border-t border-border px-4 pt-4"
        style={[shadowPresets.large, { paddingBottom: insets.bottom + 16 }]}
      >
        <View className="flex-row items-center justify-between mb-4">
          <View>
            {!isPrivate && <ThemedText className="text-sm opacity-50">From</ThemedText>}
            <View className="flex-row items-baseline">
              <ThemedText className="text-3xl font-bold" style={{ color: colors.highlight }}>
                ${seatPriceFromUsd}
              </ThemedText>
              <ThemedText className="opacity-50 ml-1">
                {isPrivate ? '' : '/ seat'}
              </ThemedText>
            </View>
          </View>
          <View className="items-end">
            <View className="flex-row items-center">
              <Icon name="Clock" size={16} color={colors.placeholder} />
              <ThemedText className="opacity-50 ml-1">{durationMin} min</ThemedText>
            </View>
            {canAddEfoil && (
              <ThemedText className="text-xs opacity-50 mt-1">
                + E-Foil add-on ${efoilAddonPrice}
              </ThemedText>
            )}
          </View>
        </View>

        <Button
          title={isPrivate ? 'Select Time' : 'Join a Trip'}
          onPress={handleSelectTime}
          iconEnd="ArrowRight"
          size="large"
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
        className="w-10 h-10 rounded-xl items-center justify-center mb-1"
        style={{ backgroundColor: colors.highlight + '10' }}
      >
        <Icon name={icon as any} size={18} color={colors.highlight} />
      </View>
      <ThemedText className="text-xs opacity-60 capitalize">{label}</ThemedText>
    </View>
  );
}
