import { Link } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import AnimatedView from '@/components/AnimatedView';
import Avatar from '@/components/Avatar';
import Header, { HeaderIcon } from '@/components/Header';
import Icon from '@/components/Icon';
import ListLink from '@/components/ListLink';
import ThemedScroller from '@/components/ThemeScroller';
import ThemedText from '@/components/ThemedText';
import ThemeToggle from '@/components/ThemeToggle';

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-background">
      <Header
        leftComponent={<ThemeToggle />}
        rightComponents={[<HeaderIcon icon="ChartBar" href="/screens/analytics" />]}
      />
      <View className="flex-1 bg-background">
        <ThemedScroller>
          <AnimatedView className="pt-4" animation="scaleIn">
            <View className="mb-4 flex-row items-center justify-center rounded-3xl bg-secondary p-10">
              <View className="w-1/2 flex-col items-center">
                <Avatar src={require('@/assets/img/user.jpg')} size="xxl" />
                <View className="flex-1 items-center justify-center">
                  <ThemedText className="text-2xl font-bold">Miguel</ThemedText>
                  <View className="flex flex-row items-center">
                    <ThemedText className="ml-2 text-sm opacity-60">Madrid, Spain</ThemedText>
                  </View>
                </View>
              </View>
            </View>
            <SubscribeCard />
            <View className="gap-1 rounded-3xl bg-secondary">
              <ListLink
                className="border-b border-border px-4 py-2"
                showChevron
                title="Account settings"
                icon="Settings"
                href="/screens/settings"
              />
              <ListLink
                className="border-b border-border px-4 py-2"
                showChevron
                title="Billing"
                icon="CreditCard"
                href="/screens/billing"
              />
              <ListLink
                className="border-b border-border px-4"
                showChevron
                title="Edit profile"
                icon="UserRoundPen"
                href="/screens/edit-profile"
              />
              <ListLink
                className="border-b border-border px-4"
                showChevron
                title="Get help"
                icon="HelpCircle"
                href="/screens/help"
              />
              <ListLink
                className="px-4"
                showChevron
                title="Logout"
                icon="LogOut"
                href="/screens/welcome"
              />
            </View>
          </AnimatedView>
        </ThemedScroller>
      </View>
    </View>
  );
}

const SubscribeCard = () => {
  return (
    <Link asChild href="/screens/subscription">
      <Pressable className="mb-4 flex flex-row rounded-3xl bg-highlight p-6">
        <View className="flex-1 pr-6">
          <Text className="font-outfit-bold text-2xl text-white">audiFoil Maldives</Text>
          <Text className="text-base text-white">Unlock exclusive e-foil experiences.</Text>
        </View>
        <Icon
          name="Sparkles"
          size={30}
          color="white"
          className="h-20 w-20 rounded-full border border-border bg-black/5"
        />
      </Pressable>
    </Link>
  );
};
