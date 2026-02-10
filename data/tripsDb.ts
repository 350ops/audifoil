// Trips Database Layer - Supabase queries for trips and bookings (Web version)

import { supabase } from '@/lib/supabase-browser';
import { Tables, TablesInsert } from '@/lib/database.types';
import {
  calculatePricePerPerson,
  getPriceTierInfo,
  REGULAR_START_TIMES,
  SUNSET_START_TIMES,
  BookingType,
  TripBookingStatus,
} from './pricing';

export type DbActivity = Tables<'activities'>;
export type DbTrip = Tables<'trips'>;
export type DbBooking = Tables<'bookings'>;
export type TripInsert = TablesInsert<'trips'>;
export type BookingInsert = TablesInsert<'bookings'>;

export type { BookingType, TripBookingStatus };

export interface TripWithActivity extends DbTrip {
  activity: DbActivity | null;
}

export interface BookingWithDetails extends DbBooking {
  trip: TripWithActivity | null;
}

export interface FormattedTrip {
  id: string;
  activityId: string;
  startTime: string;
  endTime: string;
  date: string;
  dateLabel: string;
  spotsRemaining: number;
  maxSpots: number;
  isPrivate: boolean;
  isSunset: boolean;
  isPopular: boolean;
  price: number;
  bookedBy: { label: string; airlineCode?: string }[];
  bookedCount: number;
  pricePerPerson: number;
  nextTierPrice: number;
  guestsNeededForNextTier: number;
  isAtBasePrice: boolean;
  bookingStatus: TripBookingStatus;
}

// ACTIVITIES
export async function fetchActivities(): Promise<DbActivity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('title');
  if (error) { console.error('Error fetching activities:', error); return []; }
  return data ?? [];
}

export async function fetchActivityBySlug(slug: string): Promise<DbActivity | null> {
  const { data, error } = await supabase.from('activities').select('*').eq('slug', slug).single();
  if (error) return null;
  return data;
}

export async function fetchActivityById(id: string): Promise<DbActivity | null> {
  const { data, error } = await supabase.from('activities').select('*').eq('id', id).single();
  if (error) { console.error('Error fetching activity:', error); return null; }
  return data;
}

// TRIPS
export async function fetchTripsForDate(activityId: string, date: string): Promise<DbTrip[]> {
  const { data, error } = await supabase
    .from('trips').select('*').eq('activity_id', activityId).eq('trip_date', date).eq('status', 'scheduled').order('start_time');
  if (error) { console.error('Error fetching trips:', error); return []; }
  return data ?? [];
}

export async function fetchTripsForDateRange(activityId: string, startDate: string, endDate: string): Promise<DbTrip[]> {
  const { data, error } = await supabase
    .from('trips').select('*').eq('activity_id', activityId).gte('trip_date', startDate).lte('trip_date', endDate).in('status', ['scheduled', 'full']).order('trip_date').order('start_time');
  if (error) { console.error('Error fetching trips:', error); return []; }
  return data ?? [];
}

export async function fetchDatesWithTrips(activityId: string, startDate: string, endDate: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('trips').select('trip_date').eq('activity_id', activityId).gte('trip_date', startDate).lte('trip_date', endDate).eq('status', 'scheduled') as any;
  if (error) { console.error('Error fetching trip dates:', error); return []; }
  return [...new Set((data as any[])?.map((t: any) => t.trip_date) ?? [])];
}

export async function createTrip(trip: TripInsert): Promise<DbTrip | null> {
  const { data, error } = await supabase.from('trips').insert(trip).select().single();
  if (error) { console.error('Error creating trip:', error); return null; }
  return data;
}

export async function getOrCreateTripsForDate(activityId: string, activitySlug: string, date: string, durationMin: number, maxGuests: number, isSunset: boolean = false): Promise<DbTrip[]> {
  const existingTrips = await fetchTripsForDate(activityId, date);
  if (existingTrips.length > 0) return existingTrips;

  const startTimes = isSunset ? SUNSET_START_TIMES : REGULAR_START_TIMES;
  const newTrips: TripInsert[] = startTimes.map((startTimeHHMM) => {
    const [hours, minutes] = startTimeHHMM.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + durationMin;
    const endHour = Math.floor(endMinutes / 60);
    const endMin = endMinutes % 60;
    return {
      activity_id: activityId,
      trip_date: date,
      start_time: `${startTimeHHMM}:00`,
      end_time: `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}:00`,
      max_capacity: maxGuests,
      booked_count: 0,
      status: 'scheduled',
      booking_status: 'open',
    };
  });

  const { data, error } = await supabase.from('trips').insert(newTrips).select();
  if (error) { console.error('Error creating trips:', error); return []; }
  return data ?? [];
}

// BOOKINGS
export async function fetchBookingsForTrip(tripId: string): Promise<DbBooking[]> {
  const { data, error } = await supabase
    .from('bookings').select('*').eq('trip_id', tripId).in('status', ['confirmed', 'pending']);
  if (error) { console.error('Error fetching bookings:', error); return []; }
  return data ?? [];
}

export async function fetchUserBookings(userId: string): Promise<BookingWithDetails[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`*, trip:trips(*, activity:activities(*))`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) { console.error('Error fetching user bookings:', error); return []; }
  return (data as BookingWithDetails[]) ?? [];
}

export async function createBooking(booking: BookingInsert): Promise<DbBooking | null> {
  const { data, error } = await supabase.from('bookings').insert(booking).select().single();
  if (error) { console.error('Error creating booking:', error); return null; }
  return data;
}

// FORMATTING
export function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatTime(time: string): string {
  return time.substring(0, 5);
}

export async function formatTripsForUI(trips: DbTrip[], activity: DbActivity, bookingsMap?: Map<string, DbBooking[]>): Promise<FormattedTrip[]> {
  const formattedTrips: FormattedTrip[] = [];
  for (const trip of trips) {
    const bookings = bookingsMap?.get(trip.id) ?? (await fetchBookingsForTrip(trip.id));
    const bookedBy = bookings.filter((b) => b.airline_code).map((b) => ({ label: `${b.airline_code} crew`, airlineCode: b.airline_code ?? undefined }));
    const startHour = parseInt(trip.start_time.substring(0, 2), 10);
    const isSunset = startHour >= 17;
    const isPopular = isSunset || startHour === 10;
    const bookedCount = trip.booked_count;
    const tierInfo = getPriceTierInfo(bookedCount, 1);
    formattedTrips.push({
      id: trip.id,
      activityId: trip.activity_id,
      startTime: formatTime(trip.start_time),
      endTime: formatTime(trip.end_time),
      date: trip.trip_date,
      dateLabel: formatDateLabel(trip.trip_date),
      spotsRemaining: Math.max(0, trip.max_capacity - trip.booked_count),
      maxSpots: trip.max_capacity,
      isPrivate: activity.is_private ?? false,
      isSunset, isPopular,
      price: tierInfo.currentPrice,
      bookedBy, bookedCount,
      pricePerPerson: tierInfo.currentPrice,
      nextTierPrice: tierInfo.nextTierPrice,
      guestsNeededForNextTier: tierInfo.guestsNeededForNextTier,
      isAtBasePrice: tierInfo.isAtBasePrice,
      bookingStatus: (trip.booking_status as TripBookingStatus) ?? 'open',
    });
  }
  return formattedTrips;
}

export function getNextNDays(n: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const date = new Date(today); date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}
