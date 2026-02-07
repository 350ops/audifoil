import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking, Flight, Slot } from './types';

const BOOKINGS_STORAGE_KEY = '@foiltribe_bookings';

// Generate confirmation code
export const generateConfirmationCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'AFE-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Create a new booking
export const createBooking = (
  flight: Flight,
  slot: Slot,
  userInfo: { name: string; email: string; whatsapp: string }
): Booking => {
  return {
    id: `booking-${Date.now()}`,
    flightId: flight.id,
    flightNo: flight.flightNo,
    airline: flight.airline,
    airlineCode: flight.airlineCode,
    originCity: flight.originCity,
    originCode: flight.originCode,
    arrivalTime: flight.timeLocal,
    dateISO: new Date().toISOString().split('T')[0],
    slotStart: slot.startLocal,
    slotEnd: slot.endLocal,
    name: userInfo.name,
    email: userInfo.email,
    whatsapp: userInfo.whatsapp,
    paymentStatus: 'MOCK_PAID',
    confirmationCode: generateConfirmationCode(),
    createdAt: new Date().toISOString(),
  };
};

// Load bookings from AsyncStorage
export const loadBookings = async (): Promise<Booking[]> => {
  try {
    const stored = await AsyncStorage.getItem(BOOKINGS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load bookings:', error);
    return [];
  }
};

// Save bookings to AsyncStorage
export const saveBookings = async (bookings: Booking[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  } catch (error) {
    console.error('Failed to save bookings:', error);
  }
};

// Add a booking and persist
export const addBooking = async (booking: Booking): Promise<void> => {
  const bookings = await loadBookings();
  bookings.push(booking);
  await saveBookings(bookings);
};

// Clear all bookings (for demo reset)
export const clearBookings = async (): Promise<void> => {
  await AsyncStorage.removeItem(BOOKINGS_STORAGE_KEY);
};
