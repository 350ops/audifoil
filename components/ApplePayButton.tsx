// ApplePayButton - Mock Apple Pay button with iOS styling
// For demo purposes - simulates Apple Pay without actual payment processing

import React from 'react';
import { Pressable, View, Platform } from 'react-native';
import ThemedText from './ThemedText';
import Icon from './Icon';
import * as Haptics from 'expo-haptics';

interface ApplePayButtonProps {
  onPress: () => void;
  amount: number;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export default function ApplePayButton({
  onPress,
  amount,
  disabled = false,
  loading = false,
  className = '',
}: ApplePayButtonProps) {
  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      className={`
        w-full py-4 rounded-xl items-center justify-center flex-row
        ${disabled ? 'opacity-50' : ''}
        ${className}
      `}
      style={{
        backgroundColor: '#000000',
      }}
    >
      {loading ? (
        <ThemedText className="text-white font-semibold text-lg">
          Processing...
        </ThemedText>
      ) : (
        <View className="flex-row items-center">
          {/* Apple logo (using SF Symbol style) */}
          <ThemedText className="text-white text-xl mr-1" style={{ fontFamily: Platform.OS === 'ios' ? 'System' : undefined }}>

          </ThemedText>
          <ThemedText className="text-white font-semibold text-lg">
            Pay ${amount.toFixed(2)}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
}

// Alternative: Card payment button
export function CardPayButton({
  onPress,
  amount,
  disabled = false,
  loading = false,
  className = '',
}: ApplePayButtonProps) {
  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      className={`
        w-full py-4 rounded-xl items-center justify-center flex-row
        bg-highlight
        ${disabled ? 'opacity-50' : ''}
        ${className}
      `}
    >
      {loading ? (
        <ThemedText className="text-white font-semibold text-lg">
          Processing...
        </ThemedText>
      ) : (
        <View className="flex-row items-center">
          <Icon name="CreditCard" size={20} color="#FFFFFF" />
          <ThemedText className="text-white font-semibold text-lg ml-2">
            Pay ${amount.toFixed(2)}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
}
