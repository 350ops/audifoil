import React from 'react';
import { Image, View, ViewStyle } from 'react-native';

import ThemedText from '@/components/ThemedText';
import { getAirlineLogo, hasAirlineLogo } from '@/data/airlineLogos';
import { getAirlineColor } from '@/data/types';

interface AirlineLogoProps {
  airlineCode: string;
  size?: number;
  style?: ViewStyle;
}

export default function AirlineLogo({ airlineCode, size = 40, style }: AirlineLogoProps) {
  const logo = getAirlineLogo(airlineCode);
  const hasLogo = hasAirlineLogo(airlineCode);
  const airlineColor = getAirlineColor(airlineCode);

  if (hasLogo && logo) {
    return (
      <View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            overflow: 'hidden',
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
          },
          style,
        ]}>
        <Image
          source={logo}
          style={{ width: size * 0.75, height: size * 0.75 }}
          resizeMode="contain"
        />
      </View>
    );
  }

  // Fallback to colored circle with airline code
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: airlineColor,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}>
      <ThemedText style={{ color: 'white', fontWeight: 'bold', fontSize: size * 0.3 }}>
        {airlineCode}
      </ThemedText>
    </View>
  );
}
