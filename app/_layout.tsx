import '../global.css';
import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotesProvider } from '@/contexts/NotesContext';
import { RevenueCatProvider } from '@/contexts/RevenueCatContext';
import { EfoilProvider } from '@/contexts/EfoilContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform } from 'react-native';
import useThemeColors from '@/contexts/ThemeColors';

function RootLayoutNav() {
  const colors = useThemeColors();
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(drawer)" />
      <Stack.Screen name="screens/welcome" options={{ animation: 'none' }} />
      <Stack.Screen name="screens/login" options={{ animation: 'none' }} />
      <Stack.Screen name="screens/signup" options={{ animation: 'none' }} />
      <Stack.Screen name="screens/onboarding" />
      <Stack.Screen name="screens/flight-detail" />
      <Stack.Screen name="screens/booking" options={{ presentation: 'modal' }} />
      <Stack.Screen name="screens/checkout" />
      <Stack.Screen name="screens/success" options={{ gestureEnabled: false }} />
      <Stack.Screen name="screens/confirmation" options={{ presentation: 'modal', gestureEnabled: false }} />
      {/* Activity Marketplace Flow */}
      <Stack.Screen name="screens/activity-detail" />
      <Stack.Screen name="screens/select-time" />
      <Stack.Screen name="screens/activity-checkout" />
      <Stack.Screen name="screens/activity-success" options={{ gestureEnabled: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView className={`bg-background ${Platform.OS === 'ios' ? 'pb-0 ' : ''}`} style={{ flex: 1 }}>
      <AuthProvider>
        <RevenueCatProvider>
          <NotesProvider>
            <EfoilProvider>
              <LanguageProvider>
                <ThemeProvider>
                  <RootLayoutNav />
                </ThemeProvider>
              </LanguageProvider>
            </EfoilProvider>
          </NotesProvider>
        </RevenueCatProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
