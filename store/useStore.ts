import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import {
  Activity,
  ActivityBooking,
  ActivityCategory,
  ActivitySlot,
  ACTIVITIES,
  generateActivitySlots,
} from '@/data/activities';
import { loadBookings, createBooking, addBooking } from '@/data/bookings';
import { CrewLayover, getCrewExperienceConstraint } from '@/data/flightsMle';
import { generateSlotsForFlight } from '@/data/slots';
import {
  BookingInsert,
  createBooking as createDbBooking,
  DbActivity,
  DbBooking,
  fetchActivityBySlug,
  fetchDatesWithTrips,
  FormattedTrip,
  formatTripsForUI,
  getOrCreateTripsForDate,
} from '@/data/tripsDb';
import { Booking, DemoUser, Flight, Slot } from '@/data/types';

const ACTIVITY_BOOKINGS_KEY = 'foilTribe Adventures_activity_bookings';

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

  // Generated slots for selected activity (legacy mock data)
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
    userInfo: { name: string; email: string; whatsapp: string; airlineCode?: string }
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
  // DATABASE TRIPS (NEW)
  // ==========================================

  // Database activity (loaded from Supabase)
  dbActivity: DbActivity | null;
  setDbActivity: (activity: DbActivity | null) => void;

  // Database trips for selected date
  dbTrips: FormattedTrip[];
  setDbTrips: (trips: FormattedTrip[]) => void;

  // Dates that have trips available
  datesWithTrips: string[];
  setDatesWithTrips: (dates: string[]) => void;

  // Loading states
  tripsLoading: boolean;
  setTripsLoading: (loading: boolean) => void;

  // Fetch activity from database by slug
  fetchDbActivity: (slug: string) => Promise<DbActivity | null>;

  // Fetch trips for a specific date
  fetchTripsForDate: (date: string) => Promise<FormattedTrip[]>;

  // Fetch dates with available trips
  fetchDatesWithTrips: (startDate: string, endDate: string) => Promise<string[]>;

  // Create a booking in the database
  createDbBooking: (
    tripId: string,
    guests: number,
    totalPrice: number,
    userInfo: { name: string; email?: string; whatsapp?: string; airlineCode?: string }
  ) => Promise<DbBooking | null>;

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
  addNewBooking: (
    flight: Flight,
    slot: Slot,
    userInfo: { name: string; email: string; whatsapp: string }
  ) => Promise<Booking>;

  // Latest booking (for success screen)
  latestBooking: Booking | null;
  setLatestBooking: (booking: Booking | null) => void;

  // Reset selection
  resetSelection: () => void;

  // Crew layover (arrival + departure + date) — used for "Crew" → experiences
  selectedCrewLayover: CrewLayover | null;
  setSelectedCrewLayover: (layover: CrewLayover | null) => void;

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
    email: 'hello@foiltribe.com',
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
    const layover = get().selectedCrewLayover;
    if (layover) {
      const { dateStr, dateLabel, earliestStartTimeLocal, latestEndTimeLocal } =
        getCrewExperienceConstraint(layover);
      const slots = generateActivitySlots(activity, 1, {
        forDate: dateStr,
        dateLabel,
        earliestStartTime: earliestStartTimeLocal,
        latestEndTime: latestEndTimeLocal,
      });
      set({ activitySlots: slots });
    } else {
      const slots = generateActivitySlots(activity, 3);
      set({ activitySlots: slots });
    }
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

  resetActivitySelection: () =>
    set({
      selectedActivity: null,
      selectedActivitySlot: null,
      activitySlots: [],
      guestCount: 1,
      latestActivityBooking: null,
      dbActivity: null,
      dbTrips: [],
      datesWithTrips: [],
    }),

  // ==========================================
  // DATABASE TRIPS
  // ==========================================

  dbActivity: null,
  setDbActivity: (activity) => set({ dbActivity: activity }),

  dbTrips: [],
  setDbTrips: (trips) => set({ dbTrips: trips }),

  datesWithTrips: [],
  setDatesWithTrips: (dates) => set({ datesWithTrips: dates }),

  tripsLoading: false,
  setTripsLoading: (loading) => set({ tripsLoading: loading }),

  fetchDbActivity: async (slug) => {
    const activity = await fetchActivityBySlug(slug);
    set({ dbActivity: activity });
    return activity;
  },

  fetchTripsForDate: async (date) => {
    const { dbActivity, selectedActivity } = get();
    if (!dbActivity) return [];

    set({ tripsLoading: true, selectedActivitySlot: null });

    const dbTrips = await getOrCreateTripsForDate(
      dbActivity.id,
      dbActivity.slug,
      date,
      dbActivity.duration_min,
      dbActivity.max_guests,
      dbActivity.is_sunset ?? false
    );

    const formatted = await formatTripsForUI(dbTrips, dbActivity);
    set({ dbTrips: formatted, tripsLoading: false });
    return formatted;
  },

  fetchDatesWithTrips: async (startDate, endDate) => {
    const { dbActivity } = get();
    if (!dbActivity) return [];

    const dates = await fetchDatesWithTrips(dbActivity.id, startDate, endDate);
    set({ datesWithTrips: dates });
    return dates;
  },

  createDbBooking: async (tripId, guests, totalPrice, userInfo) => {
    const booking: BookingInsert = {
      trip_id: tripId,
      guest_count: guests,
      total_price: totalPrice,
      user_name: userInfo.name,
      user_email: userInfo.email,
      user_whatsapp: userInfo.whatsapp,
      airline_code: userInfo.airlineCode,
      status: 'confirmed',
    };

    const result = await createDbBooking(booking);
    return result;
  },

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

  resetSelection: () =>
    set({
      selectedFlight: null,
      selectedSlot: null,
      currentSlots: [],
      latestBooking: null,
    }),

  selectedCrewLayover: null,
  setSelectedCrewLayover: (layover) => set({ selectedCrewLayover: layover }),

  // ==========================================
  // LOADING
  // ==========================================

  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
