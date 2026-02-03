// AirlineBadges - Row of anonymized airline code badges
// Shows which airlines have crew members joining the trip

import React from 'react';
import { View } from 'react-native';
import ThemedText from './ThemedText';
import useThemeColors from '@/contexts/ThemeColors';

interface AirlineBadgesProps {
  badges: string[];     // Airline codes like ['QR', 'EK', 'TK']
  maxShow?: number;     // Max badges to show before "+N more"
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;  // Show "X crew joining" label
  className?: string;
}

// Airline code to brand color mapping
const AIRLINE_COLORS: Record<string, string> = {
  'EK': '#D71921', // Emirates - Red
  'QR': '#5C0632', // Qatar - Burgundy
  'EY': '#B8860B', // Etihad - Gold
  'TK': '#C41E3A', // Turkish - Red
  'SQ': '#F5A623', // Singapore - Gold
  'FZ': '#FF6600', // Flydubai - Orange
  'UL': '#003366', // SriLankan - Blue
  'BA': '#003082', // British Airways - Blue
  'LH': '#05164D', // Lufthansa - Dark Blue
  'KL': '#00A1E4', // KLM - Light Blue
};

// Get airline name from code
const AIRLINE_NAMES: Record<string, string> = {
  'EK': 'Emirates',
  'QR': 'Qatar',
  'EY': 'Etihad',
  'TK': 'Turkish',
  'SQ': 'Singapore',
  'FZ': 'Flydubai',
  'UL': 'SriLankan',
  'BA': 'British',
  'LH': 'Lufthansa',
  'KL': 'KLM',
};

export default function AirlineBadges({
  badges,
  maxShow = 3,
  size = 'md',
  showLabel = false,
  className = '',
}: AirlineBadgesProps) {
  const colors = useThemeColors();

  if (!badges || badges.length === 0) {
    return null;
  }

  const visibleBadges = badges.slice(0, maxShow);
  const remainingCount = badges.length - maxShow;

  // Size variants
  const sizeStyles = {
    sm: {
      badge: 'px-1.5 py-0.5',
      text: 'text-[10px]',
      gap: 'gap-1',
    },
    md: {
      badge: 'px-2 py-1',
      text: 'text-xs',
      gap: 'gap-1.5',
    },
    lg: {
      badge: 'px-3 py-1.5',
      text: 'text-sm',
      gap: 'gap-2',
    },
  };

  const { badge: badgeStyle, text: textStyle, gap: gapStyle } = sizeStyles[size];

  // Get display name for tooltip/label
  const getAirlineNames = () => {
    const names = visibleBadges.map(code => AIRLINE_NAMES[code] || code);
    if (remainingCount > 0) {
      return `${names.join(' + ')} + ${remainingCount} more`;
    }
    return names.join(' + ');
  };

  return (
    <View className={className}>
      {showLabel && badges.length > 0 && (
        <ThemedText className="text-xs opacity-60 mb-1">
          {badges.length} crew{badges.length !== 1 ? ' members' : ''} joining
        </ThemedText>
      )}
      <View className={`flex-row flex-wrap items-center ${gapStyle}`}>
        {visibleBadges.map((code, index) => (
          <View
            key={`${code}-${index}`}
            className={`rounded-md ${badgeStyle}`}
            style={{
              backgroundColor: AIRLINE_COLORS[code] || colors.secondary,
            }}
          >
            <ThemedText
              className={`${textStyle} font-bold text-white`}
              style={{ color: '#FFFFFF' }}
            >
              {code}
            </ThemedText>
          </View>
        ))}

        {remainingCount > 0 && (
          <View
            className={`rounded-md ${badgeStyle} bg-secondary`}
          >
            <ThemedText className={`${textStyle} font-medium opacity-70`}>
              +{remainingCount}
            </ThemedText>
          </View>
        )}
      </View>

      {showLabel && badges.length > 0 && (
        <ThemedText className="text-xs opacity-50 mt-1">
          {getAirlineNames()} crew
        </ThemedText>
      )}
    </View>
  );
}

// Compact inline version for cards
export function AirlineBadgesInline({
  badges,
  className = '',
}: {
  badges: string[];
  className?: string;
}) {
  if (!badges || badges.length === 0) {
    return null;
  }

  const displayText = badges.length <= 2
    ? badges.map(code => AIRLINE_NAMES[code] || code).join(' + ')
    : `${AIRLINE_NAMES[badges[0]] || badges[0]} + ${badges.length - 1} more`;

  return (
    <ThemedText className={`text-xs opacity-60 ${className}`}>
      {displayText} crew
    </ThemedText>
  );
}
