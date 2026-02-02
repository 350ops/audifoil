import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import useThemeColors from '@/contexts/ThemeColors';

interface SkeletonCardProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export default function SkeletonCard({ 
  width, 
  height = 80, 
  borderRadius = 16,
  style,
}: SkeletonCardProps) {
  const colors = useThemeColors();
  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    shimmerValue.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmerValue.value,
      [0, 0.5, 1],
      [0.3, 0.6, 0.3]
    );
    return { opacity };
  });

  return (
    <Animated.View
      style={[
        {
          width: width ?? '100%',
          height,
          borderRadius,
          backgroundColor: colors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

// Skeleton for flight card
export function FlightCardSkeleton() {
  return (
    <View className="bg-secondary rounded-2xl p-4 mb-3">
      <View className="flex-row items-center mb-3">
        <SkeletonCard width={40} height={40} borderRadius={20} />
        <View className="ml-3 flex-1">
          <SkeletonCard width={80} height={18} borderRadius={4} />
          <SkeletonCard width={120} height={14} borderRadius={4} style={{ marginTop: 6 }} />
        </View>
        <SkeletonCard width={60} height={24} borderRadius={12} />
      </View>
      <View className="flex-row items-center justify-between">
        <SkeletonCard width={50} height={28} borderRadius={4} />
        <SkeletonCard width={100} height={20} borderRadius={4} />
        <SkeletonCard width={50} height={28} borderRadius={4} />
      </View>
    </View>
  );
}

// Skeleton for slot card
export function SlotCardSkeleton() {
  return (
    <View className="bg-secondary rounded-xl p-4 mb-3">
      <View className="flex-row items-center justify-between mb-2">
        <SkeletonCard width={60} height={24} borderRadius={4} />
        <SkeletonCard width={40} height={20} borderRadius={10} />
      </View>
      <SkeletonCard width={100} height={14} borderRadius={4} style={{ marginBottom: 12 }} />
      <View className="flex-row gap-2">
        <SkeletonCard width={50} height={22} borderRadius={11} />
        <SkeletonCard width={50} height={22} borderRadius={11} />
      </View>
    </View>
  );
}

// Skeleton for home stats
export function StatsCardSkeleton() {
  return (
    <View className="bg-secondary rounded-2xl p-4 flex-row">
      <View className="flex-1 items-center">
        <SkeletonCard width={24} height={24} borderRadius={12} />
        <SkeletonCard width={40} height={28} borderRadius={4} style={{ marginTop: 8 }} />
        <SkeletonCard width={60} height={12} borderRadius={4} style={{ marginTop: 4 }} />
      </View>
      <View className="flex-1 items-center">
        <SkeletonCard width={24} height={24} borderRadius={12} />
        <SkeletonCard width={40} height={28} borderRadius={4} style={{ marginTop: 8 }} />
        <SkeletonCard width={60} height={12} borderRadius={4} style={{ marginTop: 4 }} />
      </View>
      <View className="flex-1 items-center">
        <SkeletonCard width={24} height={24} borderRadius={12} />
        <SkeletonCard width={40} height={28} borderRadius={4} style={{ marginTop: 8 }} />
        <SkeletonCard width={60} height={12} borderRadius={4} style={{ marginTop: 4 }} />
      </View>
    </View>
  );
}
