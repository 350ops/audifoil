import { Slot, PeerBadge, Flight } from './types';
import { mockArrivalsToday } from './flights';

// Airlines that can appear as peer badges (deterministic pool)
const PEER_AIRLINES = [
  { airline: 'Emirates', airlineCode: 'EK' },
  { airline: 'Qatar Airways', airlineCode: 'QR' },
  { airline: 'Turkish Airlines', airlineCode: 'TK' },
  { airline: 'Etihad Airways', airlineCode: 'EY' },
  { airline: 'Singapore Airlines', airlineCode: 'SQ' },
  { airline: 'British Airways', airlineCode: 'BA' },
  { airline: 'Lufthansa', airlineCode: 'LH' },
];

// Parse time string to minutes since midnight
const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Format minutes to time string
const formatMinutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Generate deterministic peers based on slot index
const generatePeers = (slotIndex: number, flightIndex: number): PeerBadge[] => {
  const seed = slotIndex * 7 + flightIndex * 13;
  const peers: PeerBadge[] = [];
  
  // Popular slots (indices 1 and 3) get 2+ peers
  const isPopularSlot = slotIndex === 1 || slotIndex === 3;
  const peerCount = isPopularSlot ? 2 + (seed % 2) : seed % 3;
  
  for (let i = 0; i < peerCount; i++) {
    const peerIndex = (seed + i * 3) % PEER_AIRLINES.length;
    peers.push({
      id: `peer-${slotIndex}-${i}`,
      ...PEER_AIRLINES[peerIndex],
    });
  }
  
  return peers;
};

// Generate slots for a specific flight
export const generateSlotsForFlight = (flight: Flight): Slot[] => {
  const flightIndex = mockArrivalsToday.findIndex(f => f.id === flight.id);
  const arrivalMinutes = parseTimeToMinutes(flight.timeLocal);
  
  // First slot starts 60 minutes after arrival
  const firstSlotStart = arrivalMinutes + 60;
  
  // Generate slots every 60 minutes for 8 hours or until 18:00
  const maxSlotStart = parseTimeToMinutes('18:00');
  const slots: Slot[] = [];
  
  let slotIndex = 0;
  let currentStart = firstSlotStart;
  
  while (currentStart < maxSlotStart && slotIndex < 8) {
    const endMinutes = currentStart + 45; // 45-minute sessions
    
    // Skip if session would end after 18:45
    if (endMinutes > parseTimeToMinutes('18:45')) break;
    
    const peers = generatePeers(slotIndex, flightIndex);
    const bookedCount = peers.length;
    
    // Deterministic availability (some slots unavailable)
    const availabilitySeed = slotIndex * 11 + flightIndex * 17;
    const available = availabilitySeed % 5 !== 0; // ~80% available
    
    slots.push({
      id: `slot-${flight.id}-${slotIndex}`,
      flightId: flight.id,
      startLocal: formatMinutesToTime(currentStart),
      endLocal: formatMinutesToTime(endMinutes),
      available,
      bookedCount,
      peers,
      isPopular: bookedCount >= 2,
    });
    
    currentStart += 60; // Next slot 60 minutes later
    slotIndex++;
  }
  
  return slots;
};

// Get available slots count for a flight
export const getAvailableSlotsCount = (flight: Flight): number => {
  return generateSlotsForFlight(flight).filter(s => s.available).length;
};

// Get popular slots for today (for home screen showcase)
export const getPopularSlotsToday = (): { flight: Flight; slot: Slot }[] => {
  const popularSlots: { flight: Flight; slot: Slot }[] = [];
  
  // Get popular slots from first 3 flights
  for (let i = 0; i < 3 && i < mockArrivalsToday.length; i++) {
    const flight = mockArrivalsToday[i];
    const slots = generateSlotsForFlight(flight);
    const popularSlot = slots.find(s => s.isPopular && s.available);
    
    if (popularSlot) {
      popularSlots.push({ flight, slot: popularSlot });
    }
  }
  
  return popularSlots.slice(0, 3);
};
