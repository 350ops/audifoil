'use client';

import { create } from 'zustand';
import {
  Activity,
  ActivityBooking,
  ActivitySlot,
  ACTIVITIES,
  generateActivitySlots,
} from '@/data/activities';
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
import { DemoUser } from '@/data/types';

const ACTIVITY_BOOKINGS_KEY = 'mws_activity_bookings';

function generateConfirmationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'MLD-';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

interface AppState {
  demoUser: DemoUser | null;
  setDemoUser: (user: DemoUser | null) => void;

  // Activities
  activities: Activity[];
  selectedActivity: Activity | null;
  setSelectedActivity: (activity: Activity | null) => void;
  activitySlots: ActivitySlot[];
  generateActivitySlots: (activity: Activity) => void;
  selectedActivitySlot: ActivitySlot | null;
  setSelectedActivitySlot: (slot: ActivitySlot | null) => void;
  guestCount: number;
  setGuestCount: (count: number) => void;

  // Bookings
  activityBookings: ActivityBooking[];
  loadActivityBookings: () => void;
  addActivityBooking: (
    activity: Activity,
    slot: ActivitySlot,
    guests: number,
    userInfo: { name: string; email: string; whatsapp: string; airlineCode?: string }
  ) => ActivityBooking;
  updateActivityBooking: (bookingId: string, updates: Partial<ActivityBooking>) => void;
  latestActivityBooking: ActivityBooking | null;
  setLatestActivityBooking: (booking: ActivityBooking | null) => void;
  resetActivitySelection: () => void;

  // Database trips
  dbActivity: DbActivity | null;
  setDbActivity: (activity: DbActivity | null) => void;
  dbTrips: FormattedTrip[];
  setDbTrips: (trips: FormattedTrip[]) => void;
  datesWithTrips: string[];
  setDatesWithTrips: (dates: string[]) => void;
  tripsLoading: boolean;
  setTripsLoading: (loading: boolean) => void;
  fetchDbActivity: (slug: string) => Promise<DbActivity | null>;
  fetchTripsForDate: (date: string) => Promise<FormattedTrip[]>;
  fetchDatesWithTrips: (startDate: string, endDate: string) => Promise<string[]>;
  createDbBooking: (tripId: string, guests: number, totalPrice: number, userInfo: { name: string; email?: string; whatsapp?: string; airlineCode?: string }) => Promise<DbBooking | null>;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set, get) => ({
  demoUser: { id: 'demo-user', name: 'Guest', email: 'hello@maldiveswatersports.com', whatsapp: '+960 7772241' },
  setDemoUser: (user) => set({ demoUser: user }),

  activities: ACTIVITIES,
  selectedActivity: null,
  setSelectedActivity: (activity) => {
    set({ selectedActivity: activity, selectedActivitySlot: null, guestCount: 1 });
    if (activity) get().generateActivitySlots(activity);
  },

  activitySlots: [],
  generateActivitySlots: (activity) => {
    const slots = generateActivitySlots(activity, 3);
    set({ activitySlots: slots });
  },

  selectedActivitySlot: null,
  setSelectedActivitySlot: (slot) => set({ selectedActivitySlot: slot }),

  guestCount: 1,
  setGuestCount: (count) => set({ guestCount: count }),

  activityBookings: [],
  loadActivityBookings: () => {
    try {
      const stored = localStorage.getItem(ACTIVITY_BOOKINGS_KEY);
      if (stored) set({ activityBookings: JSON.parse(stored) });
    } catch (error) {
      console.error('Failed to load activity bookings:', error);
    }
  },

  addActivityBooking: (activity, slot, guests, userInfo) => {
    const booking: ActivityBooking = {
      id: `booking-${Date.now()}`,
      confirmationCode: generateConfirmationCode(),
      activity, slot, guests,
      totalPrice: slot.price * guests,
      userName: userInfo.name,
      userEmail: userInfo.email,
      userWhatsapp: userInfo.whatsapp,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    const updatedBookings = [...get().activityBookings, booking];
    try { localStorage.setItem(ACTIVITY_BOOKINGS_KEY, JSON.stringify(updatedBookings)); } catch {}
    set({ activityBookings: updatedBookings, latestActivityBooking: booking });
    return booking;
  },

  updateActivityBooking: (bookingId, updates) => {
    const updatedBookings = get().activityBookings.map((b) => b.id === bookingId ? { ...b, ...updates } : b);
    try { localStorage.setItem(ACTIVITY_BOOKINGS_KEY, JSON.stringify(updatedBookings)); } catch {}
    const updatedLatest = get().latestActivityBooking?.id === bookingId ? { ...get().latestActivityBooking!, ...updates } : get().latestActivityBooking;
    set({ activityBookings: updatedBookings, latestActivityBooking: updatedLatest });
  },

  latestActivityBooking: null,
  setLatestActivityBooking: (booking) => set({ latestActivityBooking: booking }),

  resetActivitySelection: () => set({
    selectedActivity: null, selectedActivitySlot: null, activitySlots: [], guestCount: 1,
    latestActivityBooking: null, dbActivity: null, dbTrips: [], datesWithTrips: [],
  }),

  // Database trips
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
    const { dbActivity } = get();
    if (!dbActivity) return [];
    set({ tripsLoading: true, selectedActivitySlot: null });
    const dbTrips = await getOrCreateTripsForDate(dbActivity.id, dbActivity.slug, date, dbActivity.duration_min, dbActivity.max_guests, dbActivity.is_sunset ?? false);
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
      trip_id: tripId, guest_count: guests, total_price: totalPrice,
      user_name: userInfo.name, user_email: userInfo.email,
      user_whatsapp: userInfo.whatsapp, airline_code: userInfo.airlineCode,
      status: 'confirmed',
    };
    return await createDbBooking(booking);
  },

  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
