import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Activity,
  ActivitySlot,
  ActivityBooking,
  ActivityCategory,
  ACTIVITIES,
  generateActivitySlots,
  getActivityById,
} from '@/data/activities';
import { Flight, Slot, Booking, DemoUser } from '@/data/types';
import { loadBookings, saveBookings, createBooking, addBooking } from '@/data/bookings';
import { generateSlotsForFlight } from '@/data/slots';

const ACTIVITY_BOOKINGS_KEY = 'audifoil_activity_bookings';

interface AppState {
  // Demo user
  demoUser: DemoUser | null;
  setDemoUser: (user: DemoUser | null) => void;

  // ==========================================
  // ACTIVITIES MARKETPLACE (PRIMARY)
  // ==========================================

  // All activities
  activities: Activity[];

  // Selected activity for detail view
  selectedActivity: Activity | null;
  setSelectedActivity: (activity: Activity | null) => void;

  // Generated slots for selected activity
  activitySlots: ActivitySlot[];
  generateActivitySlots: (activity: Activity) => void;

  // Selected slot for booking
  selectedActivitySlot: ActivitySlot | null;
  setSelectedActivitySlot: (slot: ActivitySlot | null) => void;

  // Number of guests
  guestCount: number;
  setGuestCount: (count: number) => void;

  // Activity bookings
  activityBookings: ActivityBooking[];
  loadActivityBookings: () => Promise<void>;
  addActivityBooking: (
    activity: Activity,
    slot: ActivitySlot,
    guests: number,
    userInfo: { name: string; email: string; whatsapp: string }
  ) => Promise<ActivityBooking>;

  // Latest activity booking (for success screen)
  latestActivityBooking: ActivityBooking | null;
  setLatestActivityBooking: (booking: ActivityBooking | null) => void;

  // Category filter
  categoryFilter: ActivityCategory | 'ALL';
  setCategoryFilter: (category: ActivityCategory | 'ALL') => void;

  // Search query
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Reset activity selection
  resetActivitySelection: () => void;

  // ==========================================
  // CREW SHORTCUT (SECONDARY - Legacy flights)
  // ==========================================

  // Selected flight
  selectedFlight: Flight | null;
  setSelectedFlight: (flight: Flight | null) => void;

  // Selected slot
  selectedSlot: Slot | null;
  setSelectedSlot: (slot: Slot | null) => void;

  // Generated slots for selected flight
  currentSlots: Slot[];
  generateSlots: (flight: Flight) => void;

  // Flight bookings (legacy)
  bookings: Booking[];
  loadBookingsFromStorage: () => Promise<void>;
  addNewBooking: (flight: Flight, slot: Slot, userInfo: { name: string; email: string; whatsapp: string }) => Promise<Booking>;

  // Latest booking (for success screen)
  latestBooking: Booking | null;
  setLatestBooking: (booking: Booking | null) => void;

  // Reset selection
  resetSelection: () => void;

  // ==========================================
  // LOADING STATES
  // ==========================================

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// Generate confirmation code
function generateConfirmationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'MLD-';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export const useStore = create<AppState>((set, get) => ({
  // Demo user
  demoUser: {
    id: 'demo-user',
    name: 'Miguel',
    email: 'hello@audifoil.com',
    whatsapp: '+34 612 345 678',
  },
  setDemoUser: (user) => set({ demoUser: user }),

  // ==========================================
  // ACTIVITIES MARKETPLACE
  // ==========================================

  activities: ACTIVITIES,

  selectedActivity: null,
  setSelectedActivity: (activity) => {
    set({ selectedActivity: activity, selectedActivitySlot: null, guestCount: 1 });
    if (activity) {
      get().generateActivitySlots(activity);
    }
  },

  activitySlots: [],
  generateActivitySlots: (activity) => {
    const slots = generateActivitySlots(activity, 3); // 3 days ahead
    set({ activitySlots: slots });
  },

  selectedActivitySlot: null,
  setSelectedActivitySlot: (slot) => set({ selectedActivitySlot: slot }),

  guestCount: 1,
  setGuestCount: (count) => set({ guestCount: count }),

  activityBookings: [],
  loadActivityBookings: async () => {
    try {
      const stored = await AsyncStorage.getItem(ACTIVITY_BOOKINGS_KEY);
      if (stored) {
        set({ activityBookings: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Failed to load activity bookings:', error);
    }
  },

  addActivityBooking: async (activity, slot, guests, userInfo) => {
    const booking: ActivityBooking = {
      id: `booking-${Date.now()}`,
      confirmationCode: generateConfirmationCode(),
      activity,
      slot,
      guests,
      totalPrice: slot.price * guests,
      userName: userInfo.name,
      userEmail: userInfo.email,
      userWhatsapp: userInfo.whatsapp,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    const currentBookings = get().activityBookings;
    const updatedBookings = [...currentBookings, booking];

    try {
      await AsyncStorage.setItem(ACTIVITY_BOOKINGS_KEY, JSON.stringify(updatedBookings));
    } catch (error) {
      console.error('Failed to save activity booking:', error);
    }

    set({
      activityBookings: updatedBookings,
      latestActivityBooking: booking,
    });

    return booking;
  },

  latestActivityBooking: null,
  setLatestActivityBooking: (booking) => set({ latestActivityBooking: booking }),

  categoryFilter: 'ALL',
  setCategoryFilter: (category) => set({ categoryFilter: category }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  resetActivitySelection: () => set({
    selectedActivity: null,
    selectedActivitySlot: null,
    activitySlots: [],
    guestCount: 1,
    latestActivityBooking: null,
  }),

  // ==========================================
  // CREW SHORTCUT (Legacy)
  // ==========================================

  selectedFlight: null,
  setSelectedFlight: (flight) => {
    set({ selectedFlight: flight, selectedSlot: null });
    if (flight) {
      get().generateSlots(flight);
    }
  },

  selectedSlot: null,
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),

  currentSlots: [],
  generateSlots: (flight) => {
    const slots = generateSlotsForFlight(flight);
    set({ currentSlots: slots });
  },

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

  latestBooking: null,
  setLatestBooking: (booking) => set({ latestBooking: booking }),

  resetSelection: () => set({
    selectedFlight: null,
    selectedSlot: null,
    currentSlots: [],
    latestBooking: null,
  }),

  // ==========================================
  // LOADING
  // ==========================================

  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
