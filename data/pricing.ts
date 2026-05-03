// eFoil Maldives — Flat Pricing Model
// $150 per person per 60-minute session

// Price tiers (flat rate for eFoil lessons)
export const PRICE_TIERS = {
  SOLO: 150,
  TWO: 150,
  THREE: 150,
  BASE: 150,
} as const;

export const MIN_GUESTS_FOR_BASE_PRICE = 1;

export type BookingType = 'confirmed' | 'hold' | 'waitlist';
export type TripBookingStatus = 'open' | 'tentative' | 'confirmed' | 'full' | 'cancelled';

/**
 * Calculate price per person — flat rate for eFoil lessons
 */
export function calculatePricePerPerson(_totalGuests: number): number {
  return PRICE_TIERS.BASE;
}

/**
 * Calculate price per person when adding new guests to existing group
 */
export function calculatePriceWithNewGuests(_currentGuests: number, _newGuests: number): number {
  return PRICE_TIERS.BASE;
}

/**
 * Calculate total price for a booking
 */
export function calculateTotalPrice(_totalGuests: number, guestCount: number): number {
  return PRICE_TIERS.BASE * guestCount;
}

/**
 * Get pricing tier information for display
 */
export interface PriceTierInfo {
  currentPrice: number;
  nextTierPrice: number;
  guestsNeededForNextTier: number;
  isAtBasePrice: boolean;
  totalGuests: number;
  savingsIfMoreJoin: number;
  priceTiers: {
    guestCount: number;
    pricePerPerson: number;
    isCurrentTier: boolean;
    label: string;
  }[];
}

export function getPriceTierInfo(currentGuests: number, newGuests: number = 1): PriceTierInfo {
  const totalAfterBooking = currentGuests + newGuests;

  return {
    currentPrice: PRICE_TIERS.BASE,
    nextTierPrice: PRICE_TIERS.BASE,
    guestsNeededForNextTier: 0,
    isAtBasePrice: true,
    totalGuests: totalAfterBooking,
    savingsIfMoreJoin: 0,
    priceTiers: [
      {
        guestCount: 1,
        pricePerPerson: PRICE_TIERS.BASE,
        isCurrentTier: totalAfterBooking === 1,
        label: '1 rider',
      },
      {
        guestCount: 2,
        pricePerPerson: PRICE_TIERS.BASE,
        isCurrentTier: totalAfterBooking >= 2,
        label: '2 riders',
      },
    ],
  };
}

/**
 * Get a human-readable price message
 */
export function getPriceMessage(
  _currentGuests: number,
  _newGuests: number = 1
): { message: string; subMessage?: string } {
  return {
    message: `$${PRICE_TIERS.BASE}/person`,
    subMessage: '60-minute eFoil lesson',
  };
}

/**
 * Format price for display
 */
export function formatPrice(amount: number): string {
  return `$${amount.toFixed(0)}`;
}

/**
 * Get booking status message
 */
export interface BookingStatusInfo {
  status: TripBookingStatus;
  canBookNow: boolean;
  requiresHold: boolean;
  message: string;
  options: {
    type: BookingType;
    label: string;
    description: string;
    pricePerPerson: number;
  }[];
}

export function getBookingStatusInfo(
  currentGuests: number,
  newGuests: number,
  maxCapacity: number
): BookingStatusInfo {
  const spotsRemaining = maxCapacity - currentGuests;

  if (spotsRemaining < newGuests) {
    return {
      status: 'full',
      canBookNow: false,
      requiresHold: false,
      message: 'This session is full',
      options: [],
    };
  }

  return {
    status: 'confirmed',
    canBookNow: true,
    requiresHold: false,
    message: 'Book your eFoil lesson instantly.',
    options: [
      {
        type: 'confirmed',
        label: `Book now — $${PRICE_TIERS.BASE}/person`,
        description: 'Instant confirmation',
        pricePerPerson: PRICE_TIERS.BASE,
      },
    ],
  };
}

/**
 * Time slot generation constants
 */
export const REGULAR_START_TIMES = ['09:00', '09:30', '10:00', '10:30', '11:00'];
export const SUNSET_START_TIMES = ['15:00', '15:30', '16:00', '16:30', '17:00'];

/**
 * Generate time slots for a given duration and type
 */
export function generateTimeSlots(
  durationMin: number,
  isSunset: boolean
): { startTime: string; endTime: string }[] {
  const startTimes = isSunset ? SUNSET_START_TIMES : REGULAR_START_TIMES;

  return startTimes.map((startTime) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + durationMin;

    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;

    return {
      startTime: `${startTime}:00`,
      endTime: `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}:00`,
    };
  });
}

export const SINGLE_TICKET_PRICE = PRICE_TIERS.BASE;

export function getSingleTicketPrice(): number {
  return SINGLE_TICKET_PRICE;
}

export function calculateSingleTicketTotal(ticketCount: number): number {
  return SINGLE_TICKET_PRICE * ticketCount;
}

export interface FriendInviteInfo {
  pricePerPerson: number;
  guestsNeededForTrip: number;
  currentGuests: number;
  spotsRemaining: number;
  shareMessage: string;
}

export function getFriendInviteInfo(
  currentGuests: number,
  maxCapacity: number,
  activityTitle: string,
  tripDate: string,
  tripTime: string
): FriendInviteInfo {
  const spotsRemaining = Math.max(0, maxCapacity - currentGuests);

  const shareMessage = `Hey! Join me for ${activityTitle} on ${tripDate} at ${tripTime}. Only $${SINGLE_TICKET_PRICE}/person — fly above the water in paradise!`;

  return {
    pricePerPerson: SINGLE_TICKET_PRICE,
    guestsNeededForTrip: 0,
    currentGuests,
    spotsRemaining,
    shareMessage,
  };
}

export type PaymentType = 'direct' | 'payment_link' | 'hold';

export interface SingleTicketBookingInfo {
  ticketPrice: number;
  paymentType: PaymentType;
  canInviteFriends: boolean;
  friendsNeeded: number;
  shareUrl?: string;
}
