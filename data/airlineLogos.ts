// Airline logo mapping for the Crew tab logo grid
import { ImageSourcePropType } from 'react-native';

export interface FeaturedAirline {
  code: string;
  name: string;
  logo: ImageSourcePropType;
}

// Airlines with logos — shown as tappable tiles in the grid
export const FEATURED_AIRLINES: FeaturedAirline[] = [
  { code: 'QR', name: 'Qatar Airways', logo: require('@/Logos/QatarAirways.png') },
  { code: 'EK', name: 'Emirates', logo: require('@/Logos/Emirates(airline).png') },
  { code: 'EY', name: 'Etihad', logo: require('@/Logos/EtihadAirways(EY).png') },
  { code: 'TK', name: 'Turkish Airlines', logo: require('@/Logos/TurkishAirlines.png') },
  { code: 'SQ', name: 'Singapore Airlines', logo: require('@/Logos/SingaporeAirlines.png') },
  { code: 'FZ', name: 'Flydubai', logo: require('@/Logos/Flydubai.png') },
  { code: 'BA', name: 'British Airways', logo: require('@/Logos/BritishAirways.png') },
  { code: 'AZ', name: 'ITA Airways', logo: require('@/Logos/ItAliAirlines.png') },
  { code: 'DE', name: 'Condor', logo: require('@/Logos/CondorFlugdienstGmbH.png') },
  { code: 'NO', name: 'Neos', logo: require('@/Logos/Neos(airline).png') },
  { code: 'J2', name: 'Azerbaijan Airlines', logo: require('@/Logos/AzerbaijanAirlines.png') },
];

// Codes of featured airlines for quick lookup
export const FEATURED_CODES = new Set(FEATURED_AIRLINES.map((a) => a.code));
