// GroupFillBar - Visual progress bar for group fill status
// Shows seats filled / capacity with color-coded status

import React from 'react';
import { View } from 'react-native';
import ThemedText from './ThemedText';
import useThemeColors from '@/contexts/ThemeColors';
import { SlotStatus } from '@/data/activities';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withDelay,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface GroupFillBarProps {
  seatsFilled: number;
  capacity: number;
  minToRun: number;
  status: SlotStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function GroupFillBar({
  seatsFilled,
  capacity,
  minToRun,
  status,
  showLabel = true,
  size = 'md',
  className = '',
}: GroupFillBarProps) {
  const colors = useThemeColors();
  const fillPercentage = (seatsFilled / capacity) * 100;
  const minPercentage = (minToRun / capacity) * 100;

  // Animated fill width
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    animatedWidth.value = withDelay(100, withSpring(fillPercentage, {
      damping: 15,
      stiffness: 100,
    }));
  }, [fillPercentage]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));

  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'confirmed':
        return '#22C55E'; // Green
      case 'almost_full':
        return '#F59E0B'; // Amber
      case 'full':
        return '#6B7280'; // Gray
      case 'filling':
      default:
        return colors.highlight; // Brand blue
    }
  };

  // Get status label
  const getStatusLabel = () => {
    const spotsLeft = capacity - seatsFilled;
    switch (status) {
      case 'confirmed':
        return `Confirmed`;
      case 'almost_full':
        return `Almost there`;
      case 'full':
        return 'Full';
      case 'filling':
      default:
        if (seatsFilled === 0) return 'Be the first';
        return `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`;
    }
  };

  // Size variants
  const sizeStyles = {
    sm: { height: 4, marginTop: 4 },
    md: { height: 6, marginTop: 6 },
    lg: { height: 8, marginTop: 8 },
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <View className={className}>
      {showLabel && (
        <View className="flex-row justify-between items-center mb-1">
          <ThemedText className={`${textSizes[size]} opacity-70`}>
            {seatsFilled}/{capacity} seats filled
          </ThemedText>
          <ThemedText
            className={`${textSizes[size]} font-medium`}
            style={{ color: getStatusColor() }}
          >
            {getStatusLabel()}
          </ThemedText>
        </View>
      )}

      {/* Progress bar container */}
      <View
        className="w-full rounded-full overflow-hidden bg-border"
        style={{ height: sizeStyles[size].height }}
      >
        {/* Min to run marker (dashed line at minToRun position) */}
        {status === 'filling' && (
          <View
            className="absolute h-full border-r-2 border-dashed opacity-40"
            style={{
              left: `${minPercentage}%`,
              borderColor: colors.text,
            }}
          />
        )}

        {/* Filled portion */}
        <Animated.View
          className="h-full rounded-full"
          style={[
            animatedStyle,
            { backgroundColor: getStatusColor() },
          ]}
        />
      </View>

      {/* Minimum marker label */}
      {status === 'filling' && seatsFilled < minToRun && showLabel && (
        <ThemedText className="text-xs opacity-50 mt-1">
          Confirms at {minToRun} seats
        </ThemedText>
      )}
    </View>
  );
}
