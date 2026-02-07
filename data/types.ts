// Core data types for foiltribe Maldives adventure booking app

export type FlightStatus = 'On time' | 'Landed' | 'Delayed';

export interface Flight {
  id: string;
  timeLocal: string; // "07:50" - arrival time in Maldives time
  airline: string;
  airlineCode: string;
  flightNo: string;
  originCity: string;
  originCode: string;
  status: FlightStatus;
}

export interface Slot {
  id: string;
  flightId: string;
  startLocal: string; // "08:30"
  endLocal: string;   // "09:15"
  available: boolean;
  bookedCount: number; // 0..2+ for demo
  peers: PeerBadge[]; // anonymized airline badges
  isPopular?: boolean;
}

export interface PeerBadge {
  id: string;
  airline: string;
  airlineCode: string;
}

export interface Booking {
  id: string;
  flightId: string;
  flightNo: string;
  airline: string;
  airlineCode: string;
  originCity: string;
  originCode: string;
  arrivalTime: string;
  dateISO: string;
  slotStart: string;
  slotEnd: string;
  name: string;
  email: string;
  whatsapp: string;
  paymentStatus: 'MOCK_PAID';
  confirmationCode: string;
  createdAt: string;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  whatsapp?: string;
  avatar?: string;
}

// Airline brand colors for badges
export const AIRLINE_COLORS: Record<string, string> = {
  FZ: '#E31837', // Flydubai red
  EY: '#BD8B40', // Etihad gold
  '8D': '#1E3A5F', // FitsAir navy
  '6E': '#0033A0', // IndiGo blue
  EK: '#D71920', // Emirates red
  TK: '#C8102E', // Turkish red
  WK: '#E30613', // Edelweiss red
  QR: '#5C0632', // Qatar Airways burgundy
  G9: '#ED1C24', // Air Arabia red
  UL: '#003366', // SriLankan navy
  SQ: '#F7B500', // Singapore Airlines gold
  BA: '#0055A4', // British Airways blue
  LH: '#05164D', // Lufthansa navy
};

// Get airline color with fallback
export const getAirlineColor = (airlineCode: string): string => {
  return AIRLINE_COLORS[airlineCode] || '#0077B6';
};
