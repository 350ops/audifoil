import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import Header from '@/components/Header';
import useThemeColors from '@/contexts/ThemeColors';
import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import ThemedText from '@/components/ThemedText';

export default function SubscriptionScreen() {
  const colors = useThemeColors();

  return (
    <View className="flex-1 bg-background">
      <Header showBackButton title="Subscription" />
      
      <View className="flex-1 items-center justify-center px-10">
        <Icon name="Crown" size={48} color={colors.highlight} />
        <ThemedText className="mt-6 text-2xl font-bold text-center">
          Premium Coming Soon
        </ThemedText>
        <ThemedText className="mt-3 text-center opacity-60">
          Premium features are not yet available. All current features are free to use.
        </ThemedText>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          rounded="full"
          className="mt-8"
        />
      </View>
    </View>
  );
}
