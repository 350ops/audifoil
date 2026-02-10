// Dynamic Group Pricing Utilities
// Pricing model: $300 solo, $150/person for 2, $100/person for 3, $80/person for 4+

// Price tiers
export const PRICE_TIERS = {
  SOLO: 300, // 1 person
  TWO: 150, // 2 people (each)
  THREE: 100, // 3 people (each)
  BASE: 1, // 4+ people (each) — TESTING: set to $1, change back to $80 for production
} as const;

// Minimum guests for base price
export const MIN_GUESTS_FOR_BASE_PRICE = 4;

// Booking types
export type BookingType = 'confirmed' | 'hold' | 'waitlist';

// Trip status with group awareness
export type TripBookingStatus = 'open' | 'tentative' | 'confirmed' | 'full' | 'cancelled';

/**
 * Calculate price per person based on total group size
 */
export function calculatePricePerPerson(totalGuests: number): number {
  if (totalGuests >= 4) return PRICE_TIERS.BASE;
  if (totalGuests === 3) return PRICE_TIERS.THREE;
  if (totalGuests === 2) return PRICE_TIERS.TWO;
  return PRICE_TIERS.SOLO;
}

/**
 * Calculate price per person when adding new guests to existing group
 */
export function calculatePriceWithNewGuests(currentGuests: number, newGuests: number): number {
  const total = currentGuests + newGuests;
  return calculatePricePerPerson(total);
}

/**
 * Calculate total price for a booking
 */
export function calculateTotalPrice(totalGuests: number, guestCount: number): number {
  const pricePerPerson = calculatePricePerPerson(totalGuests);
  return pricePerPerson * guestCount;
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
  const currentPrice = calculatePricePerPerson(totalAfterBooking);
  const isAtBasePrice = totalAfterBooking >= MIN_GUESTS_FOR_BASE_PRICE;

  // Calculate next tier
  let nextTierPrice = PRICE_TIERS.BASE;
  let guestsNeededForNextTier = 0;

  if (totalAfterBooking < 4) {
    guestsNeededForNextTier = 4 - totalAfterBooking;
    nextTierPrice = PRICE_TIERS.BASE;
  }

  // Calculate potential savings if more people join
  const savingsIfMoreJoin = isAtBasePrice ? 0 : (currentPrice - PRICE_TIERS.BASE) * newGuests;

  // Build price tiers for display
  const priceTiers = [
    {
      guestCount: 1,
      pricePerPerson: PRICE_TIERS.SOLO,
      isCurrentTier: totalAfterBooking === 1,
      label: '1 person',
    },
    {
      guestCount: 2,
      pricePerPerson: PRICE_TIERS.TWO,
      isCurrentTier: totalAfterBooking === 2,
      label: '2 people',
    },
    {
      guestCount: 3,
      pricePerPerson: PRICE_TIERS.THREE,
      isCurrentTier: totalAfterBooking === 3,
      label: '3 people',
    },
    {
      guestCount: 4,
      pricePerPerson: PRICE_TIERS.BASE,
      isCurrentTier: totalAfterBooking >= 4,
      label: '4+ people',
    },
  ];

  return {
    currentPrice,
    nextTierPrice,
    guestsNeededForNextTier,
    isAtBasePrice,
    totalGuests: totalAfterBooking,
    savingsIfMoreJoin,
    priceTiers,
  };
}

/**
 * Get a human-readable price message
 */
export function getPriceMessage(
  currentGuests: number,
  newGuests: number = 1
): { message: string; subMessage?: string } {
  const tierInfo = getPriceTierInfo(currentGuests, newGuests);

  if (tierInfo.isAtBasePrice) {
    return {
      message: `$${tierInfo.currentPrice}/person`,
      subMessage: 'Full group rate!',
    };
  }

  const guestsNeeded = tierInfo.guestsNeededForNextTier;
  return {
    message: `$${tierInfo.currentPrice}/person`,
    subMessage: `${guestsNeeded} more ${guestsNeeded === 1 ? 'person' : 'people'} → $${tierInfo.nextTierPrice}/person`,
  };
}

/**
 * Format price for display
 */
export function formatPrice(amount: number): string {
  return `$${amount.toFixed(0)}`;
}

/**
 * Get booking status message based on group size
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
  const totalAfterBooking = currentGuests + newGuests;
  const spotsRemaining = maxCapacity - currentGuests;
  const pricePerPerson = calculatePricePerPerson(totalAfterBooking);

  // Trip is full
  if (spotsRemaining < newGuests) {
    return {
      status: 'full',
      canBookNow: false,
      requiresHold: false,
      message: 'This trip is full',
      options: [],
    };
  }

  // Will have 4+ people after booking - confirmed booking
  if (totalAfterBooking >= 4) {
    return {
      status: 'confirmed',
      canBookNow: true,
      requiresHold: false,
      message: 'Full group! Book at the best rate.',
      options: [
        {
          type: 'confirmed',
          label: `Book now at $${pricePerPerson}/person`,
          description: 'Instant confirmation',
          pricePerPerson,
        },
      ],
    };
  }

  // Under 4 people - tentative booking with options
  const higherPrice = pricePerPerson;
  const basePrice = PRICE_TIERS.BASE;

  return {
    status: 'tentative',
    canBookNow: true,
    requiresHold: true,
    message: `Currently ${currentGuests} ${currentGuests === 1 ? 'person' : 'people'} on this trip`,
    options: [
      {
        type: 'hold',
        label: 'Hold my spot ($0 now)',
        description: 'Get notified as group fills. Price drops if more join.',
        pricePerPerson: 0,
      },
      {
        type: 'confirmed',
        label: `Book now at $${higherPrice}/person`,
        description: `Refund the difference if price drops to $${basePrice}`,
        pricePerPerson: higherPrice,
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
      startTime: `${startTime}:00`, // HH:mm:ss format for DB
      endTime: `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}:00`,
    };
  });
}

// ============================================
// SINGLE-TICKET PRICING MODEL
// ============================================
// Users pay only for their own ticket at the base rate ($80)
// They can invite friends who pay separately via shareable payment links

/**
 * Single ticket price - everyone pays the base rate
 * The minimum group size is handled by inviting friends
 */
export const SINGLE_TICKET_PRICE = PRICE_TIERS.BASE; // $80

/**
 * Calculate the price for a single ticket booking
 * Users always pay the base rate for their own ticket
 */
export function getSingleTicketPrice(): number {
  return SINGLE_TICKET_PRICE;
}

/**
 * Calculate total for booking (single user)
 * Each person pays for themselves
 */
export function calculateSingleTicketTotal(ticketCount: number): number {
  return SINGLE_TICKET_PRICE * ticketCount;
}

/**
 * Get invite info for sharing with friends
 */
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
  const guestsNeededForTrip = Math.max(0, MIN_GUESTS_FOR_BASE_PRICE - currentGuests);
  
  const shareMessage = guestsNeededForTrip > 0
    ? `Hey! Join me on ${activityTitle} on ${tripDate} at ${tripTime}. We need ${guestsNeededForTrip} more to fill the group. Only $${SINGLE_TICKET_PRICE}/person!`
    : `Hey! Join me on ${activityTitle} on ${tripDate} at ${tripTime}. Only $${SINGLE_TICKET_PRICE}/person!`;

  return {
    pricePerPerson: SINGLE_TICKET_PRICE,
    guestsNeededForTrip,
    currentGuests,
    spotsRemaining,
    shareMessage,
  };
}

/**
 * Payment type for tracking
 */
export type PaymentType = 'direct' | 'payment_link' | 'hold';

/**
 * Single ticket booking info
 */
export interface SingleTicketBookingInfo {
  ticketPrice: number;
  paymentType: PaymentType;
  canInviteFriends: boolean;
  friendsNeeded: number;
  shareUrl?: string;
}
