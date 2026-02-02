import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

// Types
export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  airlineCode: string;
  origin: string;
  originCity: string;
  arrivalTime: string; // HH:MM format
  status: 'On Time' | 'Delayed' | 'Landed';
  gate?: string;
  aircraft?: string;
}

export interface TimeSlot {
  id: string;
  startTime: string; // HH:MM format
  endTime: string;
  available: boolean;
  bookedBy: CrewBadge[];
  price: number;
  isPopular?: boolean;
}

export interface CrewBadge {
  id: string;
  airlineCode: string;
  count: number;
}

export interface Booking {
  id: string;
  flight: Flight;
  slot: TimeSlot;
  status: 'confirmed' | 'pending' | 'completed';
  createdAt: string;
  confirmationCode: string;
}

// Mock MLE Arrivals Data (based on typical Maldives arrivals)
const MOCK_FLIGHTS: Flight[] = [
  {
    id: '1',
    flightNumber: 'EK652',
    airline: 'Emirates',
    airlineCode: 'EK',
    origin: 'DXB',
    originCity: 'Dubai',
    arrivalTime: '10:45',
    status: 'On Time',
    gate: 'A3',
    aircraft: 'A380',
  },
  {
    id: '2',
    flightNumber: 'SQ452',
    airline: 'Singapore Airlines',
    airlineCode: 'SQ',
    origin: 'SIN',
    originCity: 'Singapore',
    arrivalTime: '11:30',
    status: 'On Time',
    gate: 'B2',
    aircraft: 'B787',
  },
  {
    id: '3',
    flightNumber: 'QR674',
    airline: 'Qatar Airways',
    airlineCode: 'QR',
    origin: 'DOH',
    originCity: 'Doha',
    arrivalTime: '12:15',
    status: 'Delayed',
    gate: 'A1',
    aircraft: 'A350',
  },
  {
    id: '4',
    flightNumber: 'EY284',
    airline: 'Etihad Airways',
    airlineCode: 'EY',
    origin: 'AUH',
    originCity: 'Abu Dhabi',
    arrivalTime: '13:00',
    status: 'On Time',
    gate: 'B4',
    aircraft: 'B787',
  },
  {
    id: '5',
    flightNumber: 'TK730',
    airline: 'Turkish Airlines',
    airlineCode: 'TK',
    origin: 'IST',
    originCity: 'Istanbul',
    arrivalTime: '14:20',
    status: 'On Time',
    gate: 'A2',
    aircraft: 'A330',
  },
  {
    id: '6',
    flightNumber: 'BA2043',
    airline: 'British Airways',
    airlineCode: 'BA',
    origin: 'LHR',
    originCity: 'London',
    arrivalTime: '15:45',
    status: 'On Time',
    gate: 'C1',
    aircraft: 'B777',
  },
  {
    id: '7',
    flightNumber: 'LH774',
    airline: 'Lufthansa',
    airlineCode: 'LH',
    origin: 'FRA',
    originCity: 'Frankfurt',
    arrivalTime: '16:30',
    status: 'On Time',
    gate: 'B3',
    aircraft: 'A340',
  },
  {
    id: '8',
    flightNumber: 'CX719',
    airline: 'Cathay Pacific',
    airlineCode: 'CX',
    origin: 'HKG',
    originCity: 'Hong Kong',
    arrivalTime: '17:15',
    status: 'On Time',
    gate: 'A4',
    aircraft: 'A350',
  },
];

// Generate slots based on flight arrival time
const generateSlotsForFlight = (flight: Flight): TimeSlot[] => {
  const [hours, minutes] = flight.arrivalTime.split(':').map(Number);
  const arrivalMinutes = hours * 60 + minutes;
  
  // First slot starts 1 hour after arrival
  const firstSlotStart = arrivalMinutes + 60;
  
  const slots: TimeSlot[] = [];
  
  for (let i = 0; i < 6; i++) {
    const slotStartMinutes = firstSlotStart + (i * 60); // 45 min session + 15 min buffer
    const slotEndMinutes = slotStartMinutes + 45;
    
    const startHours = Math.floor(slotStartMinutes / 60);
    const startMins = slotStartMinutes % 60;
    const endHours = Math.floor(slotEndMinutes / 60);
    const endMins = slotEndMinutes % 60;
    
    // Skip slots after 19:00 (sunset)
    if (startHours >= 19) continue;
    
    // Mock crew bookings
    const bookedCrews: CrewBadge[] = [];
    if (Math.random() > 0.5) {
      bookedCrews.push({
        id: `crew-${i}-1`,
        airlineCode: ['EK', 'SQ', 'QR', 'EY', 'TK'][Math.floor(Math.random() * 5)],
        count: Math.floor(Math.random() * 3) + 1,
      });
    }
    if (Math.random() > 0.7) {
      bookedCrews.push({
        id: `crew-${i}-2`,
        airlineCode: ['BA', 'LH', 'CX', 'AF'][Math.floor(Math.random() * 4)],
        count: Math.floor(Math.random() * 2) + 1,
      });
    }
    
    slots.push({
      id: `slot-${flight.id}-${i}`,
      startTime: `${startHours.toString().padStart(2, '0')}:${startMins.toString().padStart(2, '0')}`,
      endTime: `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`,
      available: Math.random() > 0.2, // 80% availability
      bookedBy: bookedCrews,
      price: 249,
      isPopular: bookedCrews.length >= 2,
    });
  }
  
  return slots;
};

// Generate confirmation code
const generateConfirmationCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'FLY-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

interface EfoilContextType {
  flights: Flight[];
  selectedFlight: Flight | null;
  setSelectedFlight: (flight: Flight | null) => void;
  getSlotsForFlight: (flightId: string) => TimeSlot[];
  selectedSlot: TimeSlot | null;
  setSelectedSlot: (slot: TimeSlot | null) => void;
  bookings: Booking[];
  createBooking: () => Booking | null;
  isLoading: boolean;
  todayHighlights: {
    totalFlights: number;
    availableSlots: number;
    crewsBooked: number;
  };
}

const EfoilContext = createContext<EfoilContextType | undefined>(undefined);

export function EfoilProvider({ children }: { children: ReactNode }) {
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading] = useState(false);
  
  // Memoized slots cache
  const slotsCache = useMemo(() => {
    const cache: Record<string, TimeSlot[]> = {};
    MOCK_FLIGHTS.forEach(flight => {
      cache[flight.id] = generateSlotsForFlight(flight);
    });
    return cache;
  }, []);
  
  const getSlotsForFlight = (flightId: string): TimeSlot[] => {
    return slotsCache[flightId] || [];
  };
  
  const createBooking = (): Booking | null => {
    if (!selectedFlight || !selectedSlot) return null;
    
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      flight: selectedFlight,
      slot: selectedSlot,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      confirmationCode: generateConfirmationCode(),
    };
    
    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  };
  
  const todayHighlights = useMemo(() => {
    let totalSlots = 0;
    let availableSlots = 0;
    let crewsBooked = 0;
    
    Object.values(slotsCache).forEach(slots => {
      totalSlots += slots.length;
      availableSlots += slots.filter(s => s.available).length;
      slots.forEach(slot => {
        crewsBooked += slot.bookedBy.reduce((sum, crew) => sum + crew.count, 0);
      });
    });
    
    return {
      totalFlights: MOCK_FLIGHTS.length,
      availableSlots,
      crewsBooked,
    };
  }, [slotsCache]);
  
  return (
    <EfoilContext.Provider
      value={{
        flights: MOCK_FLIGHTS,
        selectedFlight,
        setSelectedFlight,
        getSlotsForFlight,
        selectedSlot,
        setSelectedSlot,
        bookings,
        createBooking,
        isLoading,
        todayHighlights,
      }}
    >
      {children}
    </EfoilContext.Provider>
  );
}

export function useEfoil() {
  const context = useContext(EfoilContext);
  if (context === undefined) {
    throw new Error('useEfoil must be used within an EfoilProvider');
  }
  return context;
}

// Airline logo colors for badges
export const AIRLINE_COLORS: Record<string, string> = {
  EK: '#D71920', // Emirates red
  SQ: '#F7B500', // Singapore Airlines gold
  QR: '#5C0632', // Qatar Airways burgundy
  EY: '#BD8B40', // Etihad gold
  TK: '#C8102E', // Turkish red
  BA: '#0055A4', // British Airways blue
  LH: '#05164D', // Lufthansa navy
  CX: '#006564', // Cathay Pacific teal
  AF: '#002157', // Air France navy
};
