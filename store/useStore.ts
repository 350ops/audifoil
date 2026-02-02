import { create } from 'zustand';
import { Flight, Slot, Booking, DemoUser } from '@/data/types';
import { loadBookings, saveBookings, createBooking, addBooking } from '@/data/bookings';
import { generateSlotsForFlight } from '@/data/slots';

interface AppState {
  // Demo user
  demoUser: DemoUser | null;
  setDemoUser: (user: DemoUser | null) => void;
  
  // Selected flight
  selectedFlight: Flight | null;
  setSelectedFlight: (flight: Flight | null) => void;
  
  // Selected slot
  selectedSlot: Slot | null;
  setSelectedSlot: (slot: Slot | null) => void;
  
  // Generated slots for selected flight
  currentSlots: Slot[];
  generateSlots: (flight: Flight) => void;
  
  // Bookings
  bookings: Booking[];
  loadBookingsFromStorage: () => Promise<void>;
  addNewBooking: (flight: Flight, slot: Slot, userInfo: { name: string; email: string; whatsapp: string }) => Promise<Booking>;
  
  // Latest booking (for success screen)
  latestBooking: Booking | null;
  setLatestBooking: (booking: Booking | null) => void;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Reset selection
  resetSelection: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Demo user
  demoUser: {
    id: 'demo-user',
    name: 'Miguel',
    email: 'maldives@audifoil.com',
    whatsapp: '+34 612 345 678',
  },
  setDemoUser: (user) => set({ demoUser: user }),
  
  // Selected flight
  selectedFlight: null,
  setSelectedFlight: (flight) => {
    set({ selectedFlight: flight, selectedSlot: null });
    if (flight) {
      get().generateSlots(flight);
    }
  },
  
  // Selected slot
  selectedSlot: null,
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  
  // Current slots
  currentSlots: [],
  generateSlots: (flight) => {
    const slots = generateSlotsForFlight(flight);
    set({ currentSlots: slots });
  },
  
  // Bookings
  bookings: [],
  loadBookingsFromStorage: async () => {
    const bookings = await loadBookings();
    set({ bookings });
  },
  addNewBooking: async (flight, slot, userInfo) => {
    const booking = createBooking(flight, slot, userInfo);
    await addBooking(booking);
    const bookings = await loadBookings();
    set({ bookings, latestBooking: booking });
    return booking;
  },
  
  // Latest booking
  latestBooking: null,
  setLatestBooking: (booking) => set({ latestBooking: booking }),
  
  // Loading
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  // Reset
  resetSelection: () => set({ 
    selectedFlight: null, 
    selectedSlot: null, 
    currentSlots: [],
    latestBooking: null,
  }),
}));
