// Data module exports
export * from './types';
export * from './flights';
export * from './flightsMle';
export * from './slots';
export * from './bookings';
export * from './airlineLogos';
// Re-export tripsDb with explicit names to avoid conflict with bookings.createBooking
export {
  // Types
  type DbActivity,
  type DbTrip,
  type DbBooking,
  type TripInsert,
  type BookingInsert,
  type BookingType,
  type TripBookingStatus,
  type TripWithActivity,
  type BookingWithDetails,
  type FormattedTrip,
  // Activity functions
  fetchActivities,
  fetchActivityBySlug,
  fetchActivityById,
  // Trip functions
  fetchTripsForDate,
  fetchTripsForDateRange,
  fetchDatesWithTrips,
  createTrip,
  getOrCreateTripsForDate,
  // Booking functions (renamed to avoid conflict)
  fetchBookingsForTrip,
  fetchUserBookings,
  createBooking as createDbBooking,
  fetchBookingByCode,
  // Formatting helpers
  formatDateLabel,
  formatTime,
  formatTripsForUI,
  // Utility functions
  getNextNDays,
  isDateInPast,
} from './tripsDb';
export * from './pricing';

// Price constants
export const SLOT_PRICE = 150;
export const CREW_DISCOUNT_PERCENT = 25;
export const CREW_PROMO_CODE = 'CREW25';

// Calculate price with optional promo code
export const calculatePrice = (promoCode?: string): { price: number; discount: number; originalPrice: number } => {
  const originalPrice = SLOT_PRICE;
  
  if (promoCode?.toUpperCase() === CREW_PROMO_CODE) {
    const discount = originalPrice * (CREW_DISCOUNT_PERCENT / 100);
    return {
      price: originalPrice - discount,
      discount,
      originalPrice,
    };
  }
  
  return {
    price: originalPrice,
    discount: 0,
    originalPrice,
  };
};
