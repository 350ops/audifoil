import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { Platform, PlatformColor } from 'react-native';

export default function Layout() {
  return (
    <NativeTabs
      // iOS-specific styling for liquid glass effect
      tintColor={Platform.OS === 'ios' ? PlatformColor('label') : '#00A6F4'}
    >
      {/* Home Tab */}
      <NativeTabs.Trigger name="index">
        <Icon 
          sf={{ default: 'house', selected: 'house.fill' }} 
          drawable="ic_home" 
        />
        <Label>Home</Label>
      </NativeTabs.Trigger>

      {/* Arrivals Tab */}
      <NativeTabs.Trigger name="arrivals">
        <Icon 
          sf={{ default: 'airplane.arrival', selected: 'airplane.arrival' }} 
          drawable="ic_flight_land" 
        />
        <Label>Arrivals</Label>
      </NativeTabs.Trigger>

      {/* Profile Tab */}
      <NativeTabs.Trigger name="profile">
        <Icon 
          sf={{ default: 'person', selected: 'person.fill' }} 
          drawable="ic_person" 
        />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
