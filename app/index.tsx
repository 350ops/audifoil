import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (session) {
      // User is logged in, go to home
      router.replace('/(drawer)/(tabs)/');
    } else {
      // User is not logged in, show welcome
      router.replace('/screens/welcome');
    }
  }, [session, isLoading]);

  // Show loading spinner while checking auth
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" />
    </View>
  );
}
