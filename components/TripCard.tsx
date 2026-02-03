// TripCard - Enhanced trip slot card with group status and dynamic pricing
import { View, Pressable } from 'react-native';
import ThemedText from './ThemedText';
import Icon from './Icon';
import useThemeColors from '@/contexts/ThemeColors';
import { FormattedTrip } from '@/data/tripsDb';
import { PRICE_TIERS } from '@/data/pricing';

interface TripCardProps {
  trip: FormattedTrip;
  isSelected?: boolean;
  onPress?: () => void;
}

// Group size visual indicator (people icons)
function GroupIndicator({
  bookedCount,
  maxSpots,
}: {
  bookedCount: number;
  maxSpots: number;
}) {
  const colors = useThemeColors();
  const filledSpots = Math.min(bookedCount, maxSpots);
  const emptySpots = Math.max(0, maxSpots - bookedCount);

  return (
    <View className="flex-row items-center gap-0.5">
      {/* Filled spots (booked) */}
      {Array.from({ length: Math.min(filledSpots, 4) }).map((_, i) => (
        <Icon key={`filled-${i}`} name="User" size={14} color={colors.highlight} fill={colors.highlight} />
      ))}
      {filledSpots > 4 && (
        <ThemedText className="text-xs ml-0.5" style={{ color: colors.highlight }}>
          +{filledSpots - 4}
        </ThemedText>
      )}
      {/* Empty spots (available) */}
      {Array.from({ length: Math.min(emptySpots, 4 - Math.min(filledSpots, 4)) }).map((_, i) => (
        <Icon key={`empty-${i}`} name="User" size={14} color={colors.placeholder} />
      ))}
    </View>
  );
}

// Price tier badge
function PriceBadge({ price, isAtBasePrice }: { price: number; isAtBasePrice: boolean }) {
  const colors = useThemeColors();

  return (
    <View
      className="px-2 py-1 rounded-full"
      style={{
        backgroundColor: isAtBasePrice ? colors.highlight : colors.secondary,
        borderWidth: isAtBasePrice ? 0 : 1,
        borderColor: colors.border,
      }}
    >
      <ThemedText
        className="text-sm font-bold"
        style={{ color: isAtBasePrice ? 'white' : colors.text }}
      >
        ${price}
      </ThemedText>
    </View>
  );
}

export default function TripCard({ trip, isSelected, onPress }: TripCardProps) {
  const colors = useThemeColors();

  const {
    startTime,
    endTime,
    bookedCount,
    maxSpots,
    spotsRemaining,
    pricePerPerson,
    nextTierPrice,
    guestsNeededForNextTier,
    isAtBasePrice,
    isSunset,
    bookedBy,
  } = trip;

  // Generate status message
  const getStatusMessage = () => {
    if (spotsRemaining === 0) return 'Full';
    if (bookedCount === 0) return 'Be the first to join!';
    if (bookedCount === 1) return '1 person joined';
    return `${bookedCount} people joined`;
  };

  // Generate price hint message
  const getPriceHint = () => {
    if (isAtBasePrice) return 'Best rate!';
    if (guestsNeededForNextTier === 1) return `1 more → $${nextTierPrice}/person`;
    if (guestsNeededForNextTier > 0) return `${guestsNeededForNextTier} more → $${nextTierPrice}/person`;
    return '';
  };

  const isFull = spotsRemaining === 0;

  return (
    <Pressable
      onPress={onPress}
      disabled={isFull}
      className={`rounded-2xl overflow-hidden mb-3 ${isFull ? 'opacity-50' : ''}`}
      style={{
        backgroundColor: colors.secondary,
        borderWidth: isSelected ? 2 : 1,
        borderColor: isSelected ? colors.highlight : colors.border,
      }}
    >
      <View className="p-4">
        {/* Top Row: Time & Price */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <Icon name="Clock" size={16} color={colors.icon} />
            <ThemedText className="text-base font-semibold">
              {startTime} → {endTime}
            </ThemedText>
            {isSunset && (
              <View className="bg-orange-500/20 px-2 py-0.5 rounded-full">
                <ThemedText className="text-xs text-orange-500">Sunset</ThemedText>
              </View>
            )}
          </View>
          <PriceBadge price={pricePerPerson} isAtBasePrice={isAtBasePrice} />
        </View>

        {/* Middle Row: Group Indicator & Status */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-3">
            <GroupIndicator bookedCount={bookedCount} maxSpots={maxSpots} />
            <ThemedText className="text-sm" style={{ color: colors.textMuted }}>
              {getStatusMessage()}
            </ThemedText>
          </View>
        </View>

        {/* Price Hint */}
        {!isFull && !isAtBasePrice && (
          <View className="flex-row items-center gap-1 mb-2">
            <Icon name="TrendingDown" size={14} color={colors.highlight} />
            <ThemedText className="text-sm" style={{ color: colors.highlight }}>
              {getPriceHint()}
            </ThemedText>
          </View>
        )}

        {/* Booked By (crews) */}
        {bookedBy.length > 0 && (
          <View className="flex-row items-center gap-2 pt-2 border-t" style={{ borderColor: colors.border }}>
            <Icon name="Users" size={14} color={colors.placeholder} />
            <ThemedText className="text-xs" style={{ color: colors.textMuted }}>
              {bookedBy.map((b) => b.label).join(' · ')}
            </ThemedText>
          </View>
        )}

        {/* Full Status */}
        {isFull && (
          <View className="flex-row items-center gap-2 mt-2">
            <Icon name="AlertCircle" size={14} color={colors.placeholder} />
            <ThemedText className="text-sm" style={{ color: colors.placeholder }}>
              No spots remaining
            </ThemedText>
          </View>
        )}
      </View>

      {/* Selection Indicator */}
      {isSelected && (
        <View
          className="absolute top-3 right-3 w-6 h-6 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.highlight }}
        >
          <Icon name="Check" size={14} color="white" />
        </View>
      )}
    </Pressable>
  );
}

// Compact version for smaller displays
export function TripCardCompact({ trip, isSelected, onPress }: TripCardProps) {
  const colors = useThemeColors();

  const { startTime, endTime, bookedCount, pricePerPerson, isAtBasePrice, spotsRemaining } = trip;

  const isFull = spotsRemaining === 0;

  return (
    <Pressable
      onPress={onPress}
      disabled={isFull}
      className={`rounded-xl overflow-hidden ${isFull ? 'opacity-50' : ''}`}
      style={{
        backgroundColor: isSelected ? colors.highlight : colors.secondary,
        borderWidth: 1,
        borderColor: isSelected ? colors.highlight : colors.border,
        minWidth: 100,
      }}
    >
      <View className="p-3 items-center">
        <ThemedText
          className="text-sm font-semibold"
          style={{ color: isSelected ? 'white' : colors.text }}
        >
          {startTime}
        </ThemedText>
        <View className="flex-row items-center gap-1 mt-1">
          <ThemedText
            className="text-lg font-bold"
            style={{ color: isSelected ? 'white' : isAtBasePrice ? colors.highlight : colors.text }}
          >
            ${pricePerPerson}
          </ThemedText>
        </View>
        {bookedCount > 0 && (
          <ThemedText
            className="text-xs mt-1"
            style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : colors.textMuted }}
          >
            {bookedCount}/{trip.maxSpots}
          </ThemedText>
        )}
      </View>
    </Pressable>
  );
}
