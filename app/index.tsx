import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

import Icon from '@/components/Icon';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import useThemeColors from '@/contexts/ThemeColors';

// Keep native splash visible until we're ready
SplashScreen.preventAutoHideAsync();

// Configure a smooth fade transition
SplashScreen.setOptions({
  duration: 600,
  fade: true,
});

export default function Index() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const colors = useThemeColors();
  const { session, isLoading, signInAsDemo, demoModeAvailable } = useAuth();
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // If already signed in, go straight to the app
  useEffect(() => {
    if (isLoading) return;

    if (session) {
      // User is already signed in — hide splash and go to home
      SplashScreen.hide();
      router.replace('/(drawer)/(tabs)/');
    } else {
      // No session — show the hero screen
      setIsReady(true);
      SplashScreen.hide();
    }
  }, [session, isLoading]);

  // Light status bar for this screen
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle('light');
      return () => {
        setStatusBarStyle(theme === 'dark' ? 'light' : 'dark');
      };
    }, [theme])
  );

  const handleExplore = () => {
    router.replace('/(drawer)/(tabs)');
  };

  const handleDemoSignIn = async () => {
    setIsDemoLoading(true);
    const { error } = await signInAsDemo();
    setIsDemoLoading(false);

    if (error) {
      Alert.alert('Error', error.message || 'Failed to start demo');
    } else {
      router.replace('/screens/demo-onboarding');
    }
  };

  // While loading auth state, show nothing (native splash is still visible)
  if (!isReady) {
    return null;
  }

  return (
    <View className="flex-1">
      <ImageBackground
        source={require('@/assets/img/imagesmaldivesa/dolphins.png')}
        className="flex-1"
        resizeMode="cover"
      >
        <View className="flex-1 bg-black/45">
          {/* Logo */}
          <View style={{ paddingTop: insets.top + 16 }} className="px-6">
            <Text className="text-lg font-semibold tracking-wider text-white/80">foiltribe</Text>
          </View>

          {/* Hero Content */}
          <View className="flex-1 justify-end px-6 pb-8">
            <Text className="text-4xl font-bold leading-tight text-white">
              Your Maldives{'\n'}Adventure{'\n'}Starts Here
            </Text>
            <Text className="mt-3 text-base leading-relaxed text-white/70">
              Dolphins, reefs, a private sandbank, and the most incredible water sport you've never
              tried — all in one day on the Indian Ocean.
            </Text>
            <View className="mt-4 flex-row items-center">
              <View className="rounded-full bg-white/20 px-4 py-2">
                <Text className="text-sm font-semibold text-white">From $80 / person</Text>
              </View>
            </View>
          </View>

          {/* CTA */}
          <View style={{ paddingBottom: insets.bottom + 24 }} className="px-6">
            <Pressable
              onPress={handleExplore}
              className="flex w-full flex-row items-center justify-center rounded-full py-4"
              style={{ backgroundColor: colors.highlight }}
            >
              <Icon name="Compass" size={20} color="white" />
              <Text className="ml-2 text-lg font-semibold text-white">Explore the Experience</Text>
            </Pressable>

            {demoModeAvailable && (
              <Pressable onPress={handleDemoSignIn} disabled={isDemoLoading} className="mt-4 py-3">
                {isDemoLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-center text-sm text-white/50">Try Demo Mode</Text>
                )}
              </Pressable>
            )}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
