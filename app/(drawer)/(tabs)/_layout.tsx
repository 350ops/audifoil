import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { Platform, PlatformColor } from 'react-native';

export default function Layout() {
  return (
    <NativeTabs
      // iOS-specific styling for liquid glass effect
      tintColor={Platform.OS === 'ios' ? PlatformColor('label') : '#00A6F4'}
    >
      {/* Explore Tab - Main home feed */}
      <NativeTabs.Trigger name="index">
        <Icon
          sf={{ default: 'sparkles', selected: 'sparkles' }}
          drawable="ic_explore"
        />
        <Label>Explore</Label>
      </NativeTabs.Trigger>

      {/* Activities Tab - Catalog with filters */}
      <NativeTabs.Trigger name="activities">
        <Icon
          sf={{ default: 'water.waves', selected: 'water.waves' }}
          drawable="ic_activities"
        />
        <Label>Activities</Label>
      </NativeTabs.Trigger>

      {/* Bookings Tab - My bookings */}
      <NativeTabs.Trigger name="bookings">
        <Icon
          sf={{ default: 'calendar', selected: 'calendar' }}
          drawable="ic_calendar"
        />
        <Label>Bookings</Label>
      </NativeTabs.Trigger>

      {/* Crew Tab - Flight arrivals shortcut */}
      <NativeTabs.Trigger name="crew">
        <Icon
          sf={{ default: 'airplane', selected: 'airplane' }}
          drawable="ic_flight"
        />
        <Label>Crew</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
