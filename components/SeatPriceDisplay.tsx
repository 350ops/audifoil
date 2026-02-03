// SeatPriceDisplay - Consistent per-seat price display
// Shows "From $X / seat" prominently with optional total in small print

import React from 'react';
import { View, Pressable } from 'react-native';
import ThemedText from './ThemedText';
import Icon from './Icon';
import useThemeColors from '@/contexts/ThemeColors';

interface SeatPriceDisplayProps {
  seatPrice: number;
  boatTotal?: number;
  isPrivate?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showFrom?: boolean;
  showTotalInfo?: boolean;
  onInfoPress?: () => void;
  className?: string;
}

export default function SeatPriceDisplay({
  seatPrice,
  boatTotal,
  isPrivate = false,
  size = 'md',
  showFrom = true,
  showTotalInfo = false,
  onInfoPress,
  className = '',
}: SeatPriceDisplayProps) {
  const colors = useThemeColors();

  // Size variants for the price display
  const sizeStyles = {
    sm: {
      from: 'text-xs',
      price: 'text-base font-bold',
      seat: 'text-xs',
    },
    md: {
      from: 'text-sm',
      price: 'text-xl font-bold',
      seat: 'text-sm',
    },
    lg: {
      from: 'text-base',
      price: 'text-2xl font-bold',
      seat: 'text-base',
    },
    xl: {
      from: 'text-lg',
      price: 'text-3xl font-bold',
      seat: 'text-lg',
    },
  };

  const { from: fromStyle, price: priceStyle, seat: seatStyle } = sizeStyles[size];

  return (
    <View className={className}>
      <View className="flex-row items-baseline flex-wrap">
        {showFrom && !isPrivate && (
          <ThemedText className={`${fromStyle} opacity-60 mr-1`}>
            From
          </ThemedText>
        )}
        <ThemedText className={priceStyle} style={{ color: colors.text }}>
          ${seatPrice}
        </ThemedText>
        <ThemedText className={`${seatStyle} opacity-70 ml-1`}>
          {isPrivate ? '' : '/ seat'}
        </ThemedText>
      </View>

      {/* Optional boat total info */}
      {showTotalInfo && boatTotal && !isPrivate && (
        <Pressable
          onPress={onInfoPress}
          className="flex-row items-center mt-1"
        >
          <ThemedText className="text-xs opacity-50">
            Boat total ${boatTotal} • split across guests
          </ThemedText>
          {onInfoPress && (
            <Icon
              name="Info"
              size={12}
              color={colors.text}
              className="ml-1 opacity-50"
            />
          )}
        </Pressable>
      )}
    </View>
  );
}

// Compact version for cards
export function SeatPriceCompact({
  seatPrice,
  isPrivate = false,
  className = '',
}: {
  seatPrice: number;
  isPrivate?: boolean;
  className?: string;
}) {
  return (
    <ThemedText className={`font-semibold ${className}`}>
      {isPrivate ? `$${seatPrice}` : `From $${seatPrice}/seat`}
    </ThemedText>
  );
}

// Badge version for card overlays
export function SeatPriceBadge({
  seatPrice,
  isPrivate = false,
  className = '',
}: {
  seatPrice: number;
  isPrivate?: boolean;
  className?: string;
}) {
  const colors = useThemeColors();

  return (
    <View
      className={`px-2 py-1 rounded-lg ${className}`}
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
    >
      <ThemedText className="text-sm font-bold text-white">
        {isPrivate ? `$${seatPrice}` : `$${seatPrice}/seat`}
      </ThemedText>
    </View>
  );
}
