// PaymentModal - Mock Apple Pay/FaceID payment flow
// Shows FaceID animation, processing state, and success confirmation

import React, { useEffect, useState, useRef } from 'react';
import { View, Modal, Pressable, ActivityIndicator } from 'react-native';
import ThemedText from './ThemedText';
import Icon from './Icon';
import useThemeColors from '@/contexts/ThemeColors';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';

type PaymentState = 'idle' | 'authenticating' | 'processing' | 'success' | 'error';

interface PaymentModalProps {
  visible: boolean;
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
  merchantName?: string;
}

export default function PaymentModal({
  visible,
  amount,
  onClose,
  onSuccess,
  merchantName = 'foilTribe Adventures',
}: PaymentModalProps) {
  const colors = useThemeColors();
  const [state, setState] = useState<PaymentState>('idle');

  // Animation values
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const checkScale = useSharedValue(0);

  // Reset and start animation when modal becomes visible
  useEffect(() => {
    if (visible) {
      setState('idle');
      scale.value = 0.8;
      opacity.value = 0;
      checkScale.value = 0;

      // Animate in
      scale.value = withSpring(1, { damping: 15 });
      opacity.value = withTiming(1, { duration: 200 });

      // Auto-start authentication after a brief delay
      setTimeout(() => {
        startAuthentication();
      }, 500);
    }
  }, [visible]);

  const startAuthentication = () => {
    setState('authenticating');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Simulate FaceID scan (1.5s)
    setTimeout(() => {
      setState('processing');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Simulate payment processing (1s)
      setTimeout(() => {
        setState('success');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Animate checkmark
        checkScale.value = withSpring(1, { damping: 10, stiffness: 100 });

        // Auto-close after success
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }, 1000);
    }, 1500);
  };

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const renderContent = () => {
    switch (state) {
      case 'idle':
        return (
          <View className="items-center">
            <Icon name="Smartphone" size={48} color={colors.text} />
            <ThemedText className="text-lg font-semibold mt-4">
              Preparing payment...
            </ThemedText>
          </View>
        );

      case 'authenticating':
        return (
          <View className="items-center">
            {/* FaceID icon animation */}
            <View className="w-20 h-20 rounded-2xl bg-secondary items-center justify-center mb-4">
              <Icon name="ScanFace" size={48} color={colors.highlight} />
            </View>
            <ThemedText className="text-lg font-semibold">
              Confirm with Face ID
            </ThemedText>
            <ThemedText className="text-sm opacity-60 mt-2 text-center">
              Double-click side button to pay
            </ThemedText>

            {/* Animated scan lines */}
            <View className="mt-6 flex-row items-center">
              <ActivityIndicator color={colors.highlight} />
              <ThemedText className="text-sm opacity-60 ml-2">
                Scanning...
              </ThemedText>
            </View>
          </View>
        );

      case 'processing':
        return (
          <View className="items-center">
            <ActivityIndicator size="large" color={colors.highlight} />
            <ThemedText className="text-lg font-semibold mt-4">
              Processing payment...
            </ThemedText>
            <ThemedText className="text-sm opacity-60 mt-2">
              Please wait
            </ThemedText>
          </View>
        );

      case 'success':
        return (
          <View className="items-center">
            <Animated.View
              style={checkStyle}
              className="w-20 h-20 rounded-full bg-green-500 items-center justify-center mb-4"
            >
              <Icon name="Check" size={40} color="#FFFFFF" strokeWidth={3} />
            </Animated.View>
            <ThemedText className="text-xl font-bold">
              Payment Successful
            </ThemedText>
            <ThemedText className="text-2xl font-bold mt-2" style={{ color: colors.highlight }}>
              ${amount.toFixed(2)}
            </ThemedText>
            <ThemedText className="text-sm opacity-60 mt-2">
              Paid to {merchantName}
            </ThemedText>
          </View>
        );

      case 'error':
        return (
          <View className="items-center">
            <View className="w-20 h-20 rounded-full bg-red-500 items-center justify-center mb-4">
              <Icon name="X" size={40} color="#FFFFFF" strokeWidth={3} />
            </View>
            <ThemedText className="text-lg font-semibold">
              Payment Failed
            </ThemedText>
            <ThemedText className="text-sm opacity-60 mt-2 text-center">
              Please try again or use a different payment method
            </ThemedText>
            <Pressable
              onPress={startAuthentication}
              className="mt-4 px-6 py-3 bg-highlight rounded-xl"
            >
              <ThemedText className="text-white font-semibold">
                Try Again
              </ThemedText>
            </Pressable>
          </View>
        );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={state === 'error' ? onClose : undefined}
        className="flex-1 bg-black/60 items-center justify-center px-6"
      >
        <Animated.View
          style={containerStyle}
          className="w-full max-w-sm bg-background rounded-3xl p-8"
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-black items-center justify-center mr-3">
                <ThemedText className="text-white text-lg"></ThemedText>
              </View>
              <View>
                <ThemedText className="font-semibold">Apple Pay</ThemedText>
                <ThemedText className="text-xs opacity-60">{merchantName}</ThemedText>
              </View>
            </View>
            {state !== 'success' && state !== 'processing' && (
              <Pressable onPress={onClose} className="p-2">
                <Icon name="X" size={20} color={colors.text} />
              </Pressable>
            )}
          </View>

          {/* Amount */}
          {state !== 'success' && (
            <View className="items-center mb-8">
              <ThemedText className="text-3xl font-bold">
                ${amount.toFixed(2)}
              </ThemedText>
            </View>
          )}

          {/* Content based on state */}
          {renderContent()}

          {/* Footer disclaimer */}
          {state !== 'success' && (
            <ThemedText className="text-xs opacity-40 text-center mt-6">
              This is a demo. No actual payment will be processed.
            </ThemedText>
          )}
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
