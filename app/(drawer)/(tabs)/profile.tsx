import React, { useEffect, useCallback } from 'react';
import { View, Pressable, ScrollView, RefreshControl, Alert } from 'react-native';
import Header from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import Avatar from '@/components/Avatar';
import ListLink from '@/components/ListLink';
import { Button } from '@/components/Button';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { useStore } from '@/store/useStore';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { demoUser, bookings, loadBookingsFromStorage } = useStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadBookingsFromStorage();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadBookingsFromStorage().then(() => setRefreshing(false));
  }, [loadBookingsFromStorage]);

  const handleSignOut = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace('/screens/welcome');
          },
        },
      ]
    );
  };

  const handleUpgrade = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/screens/subscription');
  };

  // Calculate stats
  const totalSessions = bookings.length;
  const totalMinutes = totalSessions * 45;

  return (
    <View className="flex-1 bg-background">
      <Header
        title="Profile"
        rightComponents={[
          <Icon key="settings" name="Settings" size={22} onPress={() => router.push('/screens/settings')} />,
        ]}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Profile Header */}
        <AnimatedView animation="fadeIn" delay={100}>
          <View className="items-center pt-6 pb-8 px-6">
            <Avatar
              name={demoUser?.name || 'Guest'}
              size="xxl"
              bgColor={colors.highlight}
            />
            <ThemedText className="text-2xl font-bold mt-4">
              {demoUser?.name || 'Guest User'}
            </ThemedText>
            <ThemedText className="opacity-50 mt-1">
              {demoUser?.email || 'guest@audifoil.com'}
            </ThemedText>

            {/* Stats Row */}
            <View className="flex-row mt-6 gap-6">
              <StatItem value={totalSessions.toString()} label="Sessions" />
              <View className="w-px bg-border" />
              <StatItem value={`${totalMinutes}m`} label="Flight Time" />
              <View className="w-px bg-border" />
              <StatItem value="Malé" label="Location" />
            </View>
          </View>
        </AnimatedView>

        {/* Premium Card */}
        <AnimatedView animation="scaleIn" delay={200} className="px-4 mb-6">
          <Pressable onPress={handleUpgrade}>
            <LinearGradient
              colors={[colors.highlight, '#0077B6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-2xl p-5 overflow-hidden"
              style={shadowPresets.large}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-4">
                  <View className="flex-row items-center mb-2">
                    <Icon name="Crown" size={20} color="white" />
                    <ThemedText className="text-white font-bold text-lg ml-2">
                      audiFoil Pro
                    </ThemedText>
                  </View>
                  <ThemedText className="text-white/80 text-sm">
                    Unlimited bookings, priority slots, and exclusive discounts
                  </ThemedText>
                </View>
                <View
                  className="bg-white/20 rounded-full px-4 py-2"
                >
                  <ThemedText className="text-white font-semibold">
                    Upgrade
                  </ThemedText>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        </AnimatedView>

        {/* Quick Actions */}
        <AnimatedView animation="fadeIn" delay={300} className="px-4 mb-6">
          <View
            className="bg-secondary rounded-2xl overflow-hidden"
            style={shadowPresets.card}
          >
            <ListLink
              icon="Calendar"
              title="My Bookings"
              description={`${totalSessions} session${totalSessions !== 1 ? 's' : ''} booked`}
              href="/screens/my-bookings"
              showChevron
              hasBorder
            />
            <ListLink
              icon="HelpCircle"
              title="How It Works"
              description="Learn about e-foiling"
              href="/screens/how-it-works"
              showChevron
              hasBorder
            />
            <ListLink
              icon="Bell"
              title="Notifications"
              description="Manage your alerts"
              href="/screens/notification-settings"
              showChevron
            />
          </View>
        </AnimatedView>

        {/* Account Section */}
        <AnimatedView animation="fadeIn" delay={400} className="px-4 mb-6">
          <ThemedText className="text-lg font-semibold mb-3 px-1">Account</ThemedText>
          <View
            className="bg-secondary rounded-2xl overflow-hidden"
            style={shadowPresets.card}
          >
            <ListLink
              icon="User"
              title="Edit Profile"
              href="/screens/edit-profile"
              showChevron
              hasBorder
            />
            <ListLink
              icon="CreditCard"
              title="Payment Methods"
              href="/screens/payment-methods"
              showChevron
              hasBorder
            />
            <ListLink
              icon="Shield"
              title="Privacy & Security"
              href="/screens/privacy"
              showChevron
            />
          </View>
        </AnimatedView>

        {/* Support Section */}
        <AnimatedView animation="fadeIn" delay={500} className="px-4 mb-6">
          <ThemedText className="text-lg font-semibold mb-3 px-1">Support</ThemedText>
          <View
            className="bg-secondary rounded-2xl overflow-hidden"
            style={shadowPresets.card}
          >
            <ListLink
              icon="MessageCircle"
              title="Contact Us"
              description="Get help via WhatsApp"
              href="/screens/help"
              showChevron
              hasBorder
            />
            <ListLink
              icon="FileText"
              title="Terms & Conditions"
              href="/screens/terms"
              showChevron
              hasBorder
            />
            <ListLink
              icon="Info"
              title="About audiFoil"
              href="/screens/about"
              showChevron
            />
          </View>
        </AnimatedView>

        {/* Sign Out */}
        <AnimatedView animation="fadeIn" delay={600} className="px-4 mb-8">
          <Button
            title="Sign Out"
            variant="outline"
            iconStart="LogOut"
            onPress={handleSignOut}
          />
        </AnimatedView>

        {/* App Version */}
        <View className="items-center pb-4">
          <ThemedText className="text-sm opacity-30">audiFoil v1.0.0</ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}

// Stat Item Component
function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <View className="items-center">
      <ThemedText className="text-xl font-bold">{value}</ThemedText>
      <ThemedText className="text-sm opacity-50">{label}</ThemedText>
    </View>
  );
}
