import { Flight } from './types';

// Exact flights from the MLE arrivals screenshot
export const mockArrivalsToday: Flight[] = [
  {
    id: 'fz1025',
    timeLocal: '07:15',
    airline: 'Flydubai',
    airlineCode: 'FZ',
    flightNo: 'FZ1025',
    originCity: 'Dubai',
    originCode: 'DXB',
    status: 'Landed',
  },
  {
    id: 'ey372',
    timeLocal: '07:25',
    airline: 'Etihad Airways',
    airlineCode: 'EY',
    flightNo: 'EY372',
    originCity: 'Abu Dhabi',
    originCode: 'AUH',
    status: 'Landed',
  },
  {
    id: '8d921',
    timeLocal: '07:30',
    airline: 'FitsAir',
    airlineCode: '8D',
    flightNo: '8D921',
    originCity: 'Colombo',
    originCode: 'CMB',
    status: 'Landed',
  },
  {
    id: '6e1131',
    timeLocal: '07:30',
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNo: '6E1131',
    originCity: 'Mumbai',
    originCode: 'BOM',
    status: 'Landed',
  },
  {
    id: 'ek656',
    timeLocal: '07:35',
    airline: 'Emirates',
    airlineCode: 'EK',
    flightNo: 'EK656',
    originCity: 'Dubai',
    originCode: 'DXB',
    status: 'On time',
  },
  {
    id: 'tk740',
    timeLocal: '07:45',
    airline: 'Turkish Airlines',
    airlineCode: 'TK',
    flightNo: 'TK740',
    originCity: 'Istanbul',
    originCode: 'IST',
    status: 'On time',
  },
  {
    id: 'wk66',
    timeLocal: '07:50',
    airline: 'Edelweiss',
    airlineCode: 'WK',
    flightNo: 'WK66',
    originCity: 'Zurich',
    originCode: 'ZRH',
    status: 'On time',
  },
  {
    id: 'qr676',
    timeLocal: '07:50',
    airline: 'Qatar Airways',
    airlineCode: 'QR',
    flightNo: 'QR676',
    originCity: 'Doha',
    originCode: 'DOH',
    status: 'On time',
  },
  {
    id: 'g993',
    timeLocal: '08:10',
    airline: 'Air Arabia',
    airlineCode: 'G9',
    flightNo: 'G993',
    originCity: 'Sharjah',
    originCode: 'SHJ',
    status: 'On time',
  },
  {
    id: 'ul101',
    timeLocal: '08:15',
    airline: 'SriLankan Airlines',
    airlineCode: 'UL',
    flightNo: 'UL101',
    originCity: 'Colombo',
    originCode: 'CMB',
    status: 'On time',
  },
];

// Get flight by ID
export const getFlightById = (id: string): Flight | undefined => {
  return mockArrivalsToday.find(f => f.id === id);
};

// Filter flights by search query
export const filterFlights = (query: string): Flight[] => {
  if (!query.trim()) return mockArrivalsToday;
  
  const lowerQuery = query.toLowerCase();
  return mockArrivalsToday.filter(flight => 
    flight.airline.toLowerCase().includes(lowerQuery) ||
    flight.flightNo.toLowerCase().includes(lowerQuery) ||
    flight.originCity.toLowerCase().includes(lowerQuery) ||
    flight.originCode.toLowerCase().includes(lowerQuery)
  );
};

// Get unique airlines for filter
export const getUniqueAirlines = (): string[] => {
  return [...new Set(mockArrivalsToday.map(f => f.airline))];
};

// Get unique origins for filter
export const getUniqueOrigins = (): { city: string; code: string }[] => {
  const seen = new Set<string>();
  return mockArrivalsToday
    .filter(f => {
      if (seen.has(f.originCode)) return false;
      seen.add(f.originCode);
      return true;
    })
    .map(f => ({ city: f.originCity, code: f.originCode }));
};

// Mock crew bookings per flight
export const crewBookingsPerFlight: Record<string, number> = {
  'ey372': 3,      // Etihad - 3 people joining
  'ek656': 5,      // Emirates - 5 people joining  
  'qr676': 2,      // Qatar Airways - 2 people joining
  'tk740': 4,      // Turkish Airlines - 4 people joining
  'ul101': 2,      // SriLankan - 2 people joining
  'fz1025': 1,     // Flydubai - 1 person joining
};

// Get crew bookings count for a flight
export const getCrewBookingsCount = (flightId: string): number => {
  return crewBookingsPerFlight[flightId] || 0;
};
