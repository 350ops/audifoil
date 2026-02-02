// Airline logo mappings
// Maps airline codes to their logo images

import { ImageSourcePropType } from 'react-native';

// Logo imports
const AIRLINE_LOGOS: Record<string, ImageSourcePropType> = {
  EK: require('@/assets/Logos/Emirates(airline).png'),
  EY: require('@/assets/Logos/EtihadAirways(EY).png'),
  FZ: require('@/assets/Logos/Flydubai.png'),
  '6E': require('@/assets/Logos/IndiGo.png'),
  QR: require('@/assets/Logos/QatarAirways.png'),
  UL: require('@/assets/Logos/SriLankanAirlines.png'),
  TK: require('@/assets/Logos/TurkishAirlines.png'),
  G9: require('@/assets/Logos/AirArabia.png'),
};

// Get logo for airline code, returns undefined if not available
export const getAirlineLogo = (airlineCode: string): ImageSourcePropType | undefined => {
  return AIRLINE_LOGOS[airlineCode];
};

// Check if logo is available for airline
export const hasAirlineLogo = (airlineCode: string): boolean => {
  return airlineCode in AIRLINE_LOGOS;
};
