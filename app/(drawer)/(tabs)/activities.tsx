import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Pressable,
  ImageBackground,
  Dimensions,
  TextInput,
} from 'react-native';
import Header from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { Chip } from '@/components/Chip';
import { CardScroller } from '@/components/CardScroller';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { useStore } from '@/store/useStore';
import {
  Activity,
  ActivityCategory,
  ACTIVITIES,
  CATEGORY_INFO,
} from '@/data/activities';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

type SortOption = 'popular' | 'price_low' | 'price_high' | 'duration';

export default function ActivitiesScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { setSelectedActivity, categoryFilter, setCategoryFilter, searchQuery, setSearchQuery } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const handleActivityPress = useCallback((activity: Activity) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedActivity(activity);
    router.push('/screens/activity-detail');
  }, [setSelectedActivity]);

  const handleCategoryPress = useCallback((category: ActivityCategory | 'ALL') => {
    Haptics.selectionAsync();
    setCategoryFilter(category);
  }, [setCategoryFilter]);

  // Filter and sort activities
  const filteredActivities = useMemo(() => {
    let result = [...ACTIVITIES];

    // Filter by category
    if (categoryFilter !== 'ALL') {
      result = result.filter(a => a.category === categoryFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.subtitle.toLowerCase().includes(query) ||
        a.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => b.bookingsThisWeek - a.bookingsThisWeek);
        break;
      case 'price_low':
        result.sort((a, b) => a.seatPriceFromUsd - b.seatPriceFromUsd);
        break;
      case 'price_high':
        result.sort((a, b) => b.seatPriceFromUsd - a.seatPriceFromUsd);
        break;
      case 'duration':
        result.sort((a, b) => a.durationMin - b.durationMin);
        break;
    }

    return result;
  }, [categoryFilter, searchQuery, sortBy]);

  const categories: (ActivityCategory | 'ALL')[] = ['ALL', 'EFOIL', 'BOAT', 'SNORKEL', 'FISHING', 'PRIVATE'];

  const renderActivityCard = useCallback(({ item, index }: { item: Activity; index: number }) => (
    <AnimatedView animation="scaleIn" delay={index * 50}>
      <ActivityListCard activity={item} onPress={() => handleActivityPress(item)} />
    </AnimatedView>
  ), [handleActivityPress]);

  const keyExtractor = useCallback((item: Activity) => item.id, []);

  return (
    <View className="flex-1 bg-background">
      <Header
        title="Activities"
        rightComponents={[
          <Icon key="search" name="SlidersHorizontal" size={22} onPress={() => {}} />,
        ]}
      />

      {/* Search Bar */}
      <View className="px-4 pt-2 pb-3">
        <View
          className="bg-secondary rounded-xl px-4 py-3 flex-row items-center"
          style={shadowPresets.small}
        >
          <Icon name="Search" size={20} color={colors.placeholder} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search activities..."
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
      </View>

      {/* Category Filters */}
      <CardScroller space={8} className="pb-3">
        {categories.map(cat => (
          <Chip
            key={cat}
            label={cat === 'ALL' ? 'All' : CATEGORY_INFO[cat].name}
            icon={cat === 'ALL' ? 'Grid3X3' : CATEGORY_INFO[cat].icon}
            isSelected={categoryFilter === cat}
            onPress={() => handleCategoryPress(cat)}
          />
        ))}
      </CardScroller>

      {/* Sort Options */}
      <View className="px-4 pb-3 flex-row items-center justify-between">
        <ThemedText className="opacity-50">
          {filteredActivities.length} experience{filteredActivities.length !== 1 ? 's' : ''}
        </ThemedText>
        <View className="flex-row items-center">
          <ThemedText className="opacity-50 mr-2">Sort:</ThemedText>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              const options: SortOption[] = ['popular', 'price_low', 'price_high', 'duration'];
              const currentIndex = options.indexOf(sortBy);
              setSortBy(options[(currentIndex + 1) % options.length]);
            }}
            className="flex-row items-center"
          >
            <ThemedText className="font-medium" style={{ color: colors.highlight }}>
              {sortBy === 'popular' ? 'Popular' :
               sortBy === 'price_low' ? 'Price ↑' :
               sortBy === 'price_high' ? 'Price ↓' : 'Duration'}
            </ThemedText>
            <Icon name="ChevronDown" size={16} color={colors.highlight} />
          </Pressable>
        </View>
      </View>

      {/* Activities List */}
      <FlatList
        data={filteredActivities}
        renderItem={renderActivityCard}
        keyExtractor={keyExtractor}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 100,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-16">
            <Icon name="Search" size={48} color={colors.placeholder} />
            <ThemedText className="text-xl font-bold mt-4">No activities found</ThemedText>
            <ThemedText className="opacity-50 text-center mt-2 px-8">
              Try adjusting your filters or search query
            </ThemedText>
            <Pressable
              onPress={() => {
                setCategoryFilter('ALL');
                setSearchQuery('');
              }}
              className="mt-4 px-6 py-3 rounded-xl"
              style={{ backgroundColor: colors.highlight }}
            >
              <ThemedText className="text-white font-semibold">Clear Filters</ThemedText>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

// Activity List Card Component
function ActivityListCard({ activity, onPress }: { activity: Activity; onPress: () => void }) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      className="mb-4 rounded-2xl overflow-hidden"
      style={({ pressed }) => [
        shadowPresets.card,
        { transform: [{ scale: pressed ? 0.98 : 1 }] }
      ]}
    >
      <ImageBackground
        source={activity.media[0].localSource ? activity.media[0].localSource : { uri: activity.media[0].uri }}
        style={{ height: 180 }}
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
                <ThemedText className="text-white text-xs font-semibold ml-1">Trending</ThemedText>
              </View>
            )}
            {activity.isPrivate && (
              <View className="bg-white/25 px-2 py-1 rounded-full">
                <ThemedText className="text-white text-xs font-semibold">Private</ThemedText>
              </View>
            )}
            <View className="bg-white/20 px-2 py-1 rounded-full ml-auto">
              <ThemedText className="text-white text-xs font-medium">
                {CATEGORY_INFO[activity.category].name}
              </ThemedText>
            </View>
          </View>

          {/* Title */}
          <ThemedText className="text-white font-bold text-xl">{activity.title}</ThemedText>
          <ThemedText className="text-white/70 text-sm">{activity.subtitle}</ThemedText>
        </LinearGradient>
      </ImageBackground>

      {/* Card Footer */}
      <View className="bg-secondary p-4">
        <View className="flex-row items-center justify-between">
          {/* Rating & Duration */}
          <View className="flex-row items-center">
            <View className="flex-row items-center mr-4">
              <Icon name="Star" size={14} color="#FFD700" fill="#FFD700" />
              <ThemedText className="font-semibold ml-1">{activity.rating}</ThemedText>
              <ThemedText className="opacity-50 ml-1">({activity.reviewCount})</ThemedText>
            </View>
            <View className="flex-row items-center">
              <Icon name="Clock" size={14} color={colors.placeholder} />
              <ThemedText className="opacity-60 ml-1">{activity.durationMin} min</ThemedText>
            </View>
          </View>

          {/* Price - Per seat for group experiences */}
          <View className="items-end">
            {!activity.isPrivate && (
              <ThemedText className="text-xs opacity-50">From</ThemedText>
            )}
            <ThemedText className="font-bold text-lg" style={{ color: colors.highlight }}>
              ${activity.seatPriceFromUsd}{!activity.isPrivate && '/seat'}
            </ThemedText>
          </View>
        </View>

        {/* Tags */}
        <View className="flex-row flex-wrap gap-2 mt-3">
          {activity.tags.slice(0, 3).map((tag, i) => (
            <View key={i} className="bg-background px-2 py-1 rounded-lg">
              <ThemedText className="text-xs opacity-60">{tag}</ThemedText>
            </View>
          ))}
        </View>

        {/* Social Proof & Group Info */}
        <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-border">
          <View className="flex-row items-center">
            <Icon name="Users" size={14} color={colors.placeholder} />
            <ThemedText className="text-sm opacity-50 ml-2">
              {activity.socialProof[0]?.label || `Up to ${activity.capacity} guests`}
            </ThemedText>
          </View>
          {!activity.isPrivate && activity.capacity > 1 && (
            <View className="flex-row items-center bg-green-500/15 px-2 py-1 rounded-full">
              <ThemedText className="text-xs font-medium" style={{ color: '#22C55E' }}>
                Join others
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
