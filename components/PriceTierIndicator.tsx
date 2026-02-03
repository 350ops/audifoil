// PriceTierIndicator - Visual component showing how price changes based on group size
import { View } from 'react-native';
import ThemedText from './ThemedText';
import Icon from './Icon';
import useThemeColors from '@/contexts/ThemeColors';
import { PRICE_TIERS, getPriceTierInfo, PriceTierInfo } from '@/data/pricing';

interface PriceTierIndicatorProps {
  currentGuests: number;
  newGuests?: number;
  showTitle?: boolean;
  compact?: boolean;
}

// Bar width calculation based on price (max width for $300, min for $80)
function getBarWidth(price: number): number {
  const maxPrice = PRICE_TIERS.SOLO; // 300
  const minPrice = PRICE_TIERS.BASE; // 80
  const minWidth = 30; // percentage
  const maxWidth = 100;

  // Linear interpolation
  const ratio = (price - minPrice) / (maxPrice - minPrice);
  return minWidth + ratio * (maxWidth - minWidth);
}

export default function PriceTierIndicator({
  currentGuests,
  newGuests = 1,
  showTitle = true,
  compact = false,
}: PriceTierIndicatorProps) {
  const colors = useThemeColors();
  const tierInfo = getPriceTierInfo(currentGuests, newGuests);
  const totalGuests = currentGuests + newGuests;

  if (compact) {
    return (
      <View className="gap-1">
        {tierInfo.priceTiers.map((tier, index) => (
          <View key={tier.guestCount} className="flex-row items-center gap-2">
            <ThemedText
              className="text-xs w-16"
              style={{ color: tier.isCurrentTier ? colors.text : colors.textMuted }}
            >
              {tier.label}
            </ThemedText>
            <View
              className="h-2 rounded-full"
              style={{
                width: `${getBarWidth(tier.pricePerPerson)}%`,
                backgroundColor: tier.isCurrentTier ? colors.highlight : colors.border,
                maxWidth: 100,
              }}
            />
            <ThemedText
              className="text-xs font-semibold w-10"
              style={{ color: tier.isCurrentTier ? colors.highlight : colors.textMuted }}
            >
              ${tier.pricePerPerson}
            </ThemedText>
            {tier.isCurrentTier && (
              <Icon name="ChevronLeft" size={12} color={colors.highlight} />
            )}
          </View>
        ))}
      </View>
    );
  }

  return (
    <View className="p-4 rounded-2xl" style={{ backgroundColor: colors.secondary }}>
      {showTitle && (
        <ThemedText className="text-base font-semibold mb-3">Price per person</ThemedText>
      )}

      <View className="gap-2">
        {tierInfo.priceTiers.map((tier) => (
          <View key={tier.guestCount} className="flex-row items-center gap-3">
            {/* Label */}
            <View className="w-20">
              <ThemedText
                className="text-sm"
                style={{ color: tier.isCurrentTier ? colors.text : colors.textMuted }}
              >
                {tier.label}
              </ThemedText>
            </View>

            {/* Bar */}
            <View className="flex-1 h-4 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
              <View
                className="h-full rounded-full"
                style={{
                  width: `${getBarWidth(tier.pricePerPerson)}%`,
                  backgroundColor: tier.isCurrentTier ? colors.highlight : colors.placeholder,
                }}
              />
            </View>

            {/* Price */}
            <View className="w-14 items-end flex-row justify-end gap-1">
              <ThemedText
                className="text-sm font-bold"
                style={{ color: tier.isCurrentTier ? colors.highlight : colors.textMuted }}
              >
                ${tier.pricePerPerson}
              </ThemedText>
              {tier.isCurrentTier && <Icon name="ChevronLeft" size={14} color={colors.highlight} />}
            </View>
          </View>
        ))}
      </View>

      {/* Current position indicator */}
      <View
        className="mt-3 pt-3 flex-row items-center justify-center gap-2"
        style={{ borderTopWidth: 1, borderColor: colors.border }}
      >
        <Icon name="Info" size={14} color={colors.textMuted} />
        <ThemedText className="text-sm" style={{ color: colors.textMuted }}>
          {totalGuests === 1
            ? "You're booking solo"
            : `You'd be person #${totalGuests}`}
        </ThemedText>
      </View>
    </View>
  );
}

// Inline price drop indicator (for use in lists)
export function PriceDropIndicator({
  currentGuests,
  newGuests = 1,
}: {
  currentGuests: number;
  newGuests?: number;
}) {
  const colors = useThemeColors();
  const tierInfo = getPriceTierInfo(currentGuests, newGuests);

  if (tierInfo.isAtBasePrice) {
    return (
      <View className="flex-row items-center gap-1">
        <Icon name="Check" size={14} color={colors.highlight} />
        <ThemedText className="text-sm" style={{ color: colors.highlight }}>
          Best rate!
        </ThemedText>
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-1">
      <Icon name="TrendingDown" size={14} color={colors.highlight} />
      <ThemedText className="text-sm" style={{ color: colors.highlight }}>
        {tierInfo.guestsNeededForNextTier} more{' '}
        {tierInfo.guestsNeededForNextTier === 1 ? 'person' : 'people'} → $
        {tierInfo.nextTierPrice}/person
      </ThemedText>
    </View>
  );
}

// Small badge showing current price tier
export function PriceTierBadge({
  currentGuests,
  newGuests = 1,
}: {
  currentGuests: number;
  newGuests?: number;
}) {
  const colors = useThemeColors();
  const tierInfo = getPriceTierInfo(currentGuests, newGuests);

  return (
    <View
      className="px-3 py-1.5 rounded-full flex-row items-center gap-1"
      style={{
        backgroundColor: tierInfo.isAtBasePrice ? colors.highlight : colors.secondary,
        borderWidth: tierInfo.isAtBasePrice ? 0 : 1,
        borderColor: colors.border,
      }}
    >
      <ThemedText
        className="text-sm font-bold"
        style={{ color: tierInfo.isAtBasePrice ? 'white' : colors.text }}
      >
        ${tierInfo.currentPrice}/person
      </ThemedText>
      {!tierInfo.isAtBasePrice && tierInfo.savingsIfMoreJoin > 0 && (
        <ThemedText
          className="text-xs"
          style={{ color: colors.textMuted }}
        >
          (save ${tierInfo.savingsIfMoreJoin} if more join)
        </ThemedText>
      )}
    </View>
  );
}
