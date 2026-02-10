// Core data types for foiltribe Maldives adventure booking app

export type FlightStatus = 'On time' | 'Landed' | 'Delayed';

export interface Flight {
  id: string;
  timeLocal: string;
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
  startLocal: string;
  endLocal: string;
  available: boolean;
  bookedCount: number;
  peers: PeerBadge[];
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
  FZ: '#E31837',
  EY: '#BD8B40',
  '8D': '#1E3A5F',
  '6E': '#0033A0',
  EK: '#D71920',
  TK: '#C8102E',
  WK: '#E30613',
  QR: '#5C0632',
  G9: '#ED1C24',
  UL: '#003366',
  SQ: '#F7B500',
  BA: '#0055A4',
  LH: '#05164D',
};

export const getAirlineColor = (airlineCode: string): string => {
  return AIRLINE_COLORS[airlineCode] || '#0077B6';
};
