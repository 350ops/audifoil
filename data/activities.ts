// eFoil Maldives — Activity Data for eFoil Lessons

export type ActivityCategory = 'EFOIL';

export interface MediaItem {
  type: 'image' | 'video';
  uri: string;
  src?: string;
  poster?: string;
}

export interface SocialProof {
  label: string;
  type?: 'crew' | 'popular' | 'recent';
}

export interface Activity {
  id: string;
  title: string;
  subtitle: string;
  category: ActivityCategory;
  durationMin: number;
  priceFromUsd: number;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  minGuests: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'all';
  isPrivate: boolean;
  media: MediaItem[];
  tags: string[];
  highlights: string[];
  whatYoullDo: string[];
  included: string[];
  safety: string[];
  meetingPoint: string;
  socialProof: SocialProof[];
  bookingsThisWeek: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isSunset?: boolean;
}

export interface ActivitySlot {
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
}

export interface ActivityBooking {
  id: string;
  confirmationCode: string;
  activity: Activity;
  slot: ActivitySlot;
  guests: number;
  totalPrice: number;
  userName: string;
  userEmail: string;
  userWhatsapp: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  supabaseBookingId?: string;
  paymentLinkUrl?: string;
  paidCount?: number;
}

// Web image paths (referenced from /public/img/)
export const LOCAL_IMAGES = {
  lagoonBoat: '/img/File 1.jpg',
  swimmingFish: '/img/File 2.jpg',
  seaTurtle: '/img/File 3.jpg',
  privateIsland: '/img/File 4.jpg',
  dolphin: '/img/dolphin.jpg',
  fishing: '/img/fishing.jpg',
  efoil: '/img/audi.jpg',
  boat: '/img/imagesmaldivesa/boat.png',
  boat2: '/img/imagesmaldivesa/boat2.png',
  boat3: '/img/imagesmaldivesa/boat3.png',
  crewOnABoat: '/img/imagesmaldivesa/crewonaboat.jpeg',
  dolphins: '/img/imagesmaldivesa/dolphins.png',
  efoilMedium: '/img/imagesmaldivesa/efoil Medium.png',
  efoilNew: '/img/imagesmaldivesa/efoil.png',
  island: '/img/imagesmaldivesa/island.png',
  mantas: '/img/imagesmaldivesa/mantas.jpg',
  reef: '/img/imagesmaldivesa/reef3.jpeg',
  sandbank: '/img/imagesmaldivesa/sandbank.png',
  sandbank2: '/img/imagesmaldivesa/sandbank2.png',
  sandbank3: '/img/imagesmaldivesa/sanbank3.jpeg',
  sandbank5: '/img/imagesmaldivesa/sandbank5.jpeg',
  snorkel: '/img/imagesmaldivesa/snorkel.png',
  snorkel2: '/img/imagesmaldivesa/snorkel2.png',
  snorkel4: '/img/imagesmaldivesa/snorkel4.png',
  turtle: '/img/imagesmaldivesa/turtle.png',
  turtle2: '/img/imagesmaldivesa/turtle2.png',
};

export const DEFAULT_EFOIL_ID = 'efoil-hulhumale';

// Partner types for B2B page
export interface PartnerType {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const PARTNER_TYPES: PartnerType[] = [
  {
    id: 'yachts',
    title: 'Yachts',
    description: 'Offer eFoil sessions to your charter guests as a premium add-on experience. No storage hassle — we handle everything.',
    icon: 'Ship',
  },
  {
    id: 'resorts',
    title: 'Resorts',
    description: 'Elevate your water sports menu with the most exciting activity on the ocean. Stand out from every other resort in the atoll.',
    icon: 'Building',
  },
  {
    id: 'guesthouses',
    title: 'Guesthouses',
    description: 'Give your guests access to a premium experience they can\'t find elsewhere. Boost reviews and repeat bookings.',
    icon: 'Home',
  },
  {
    id: 'safari-boats',
    title: 'Day Trip & Safari Boats',
    description: 'Add eFoil stops to your itineraries. Your guests get an unforgettable highlight — you earn from every session.',
    icon: 'Anchor',
  },
  {
    id: 'watersport-centers',
    title: 'Watersport Centers',
    description: 'Expand your fleet with zero capital. eFoil is the fastest-growing water sport — and we bring it to your dock.',
    icon: 'Waves',
  },
];

// Partner benefits
export interface PartnerBenefit {
  title: string;
  description: string;
  icon: string;
}

export const PARTNER_BENEFITS: PartnerBenefit[] = [
  {
    title: 'Zero Investment',
    description: 'We provide all eFoil equipment, boards, batteries, and chargers. You invest nothing upfront.',
    icon: 'CircleDollarSign',
  },
  {
    title: 'New Revenue Stream',
    description: 'Earn a revenue share from every booking made through your location. Passive income from day one.',
    icon: 'TrendingUp',
  },
  {
    title: 'Premium Guest Experience',
    description: 'Offer the most exciting water sport in the world. eFoiling is the ultimate wow-factor for your guests.',
    icon: 'Sparkles',
  },
  {
    title: 'Full Support',
    description: 'We handle training, equipment maintenance, booking platform, and marketing. You just welcome the guests.',
    icon: 'Headphones',
  },
];

export function formatDurationHours(durationMin: number): string {
  const hours = durationMin / 60;
  return hours >= 1 ? `${hours} hour${hours !== 1 ? 's' : ''}` : `${durationMin} min`;
}

export const ACTIVITIES: Activity[] = [
  {
    id: 'efoil-hulhumale',
    title: 'eFoil Lesson — Hulhumale',
    subtitle: 'Learn to fly above the Indian Ocean',
    category: 'EFOIL',
    durationMin: 60,
    priceFromUsd: 150,
    rating: 4.9,
    reviewCount: 120,
    maxGuests: 2,
    minGuests: 1,
    skillLevel: 'beginner',
    isPrivate: false,
    media: [
      { type: 'image', uri: '', src: LOCAL_IMAGES.efoilNew },
      { type: 'image', uri: '', src: LOCAL_IMAGES.efoilMedium },
      { type: 'image', uri: '', src: LOCAL_IMAGES.efoil },
      { type: 'image', uri: '', src: LOCAL_IMAGES.sandbank },
      { type: 'image', uri: '', src: LOCAL_IMAGES.lagoonBoat },
    ],
    tags: ['60 min', 'Beginner friendly', 'Hulhumale', 'All equipment included'],
    highlights: [
      'Fly above the water on your very first session — no experience needed',
      'One-on-one instruction from a certified eFoil instructor',
      'Ride in the calm, turquoise lagoon just minutes from Male airport',
      'All equipment provided — board, wing, helmet, life jacket',
      'Perfect for tourists, expats, and locals looking for something extraordinary',
    ],
    whatYoullDo: [
      'Meet your instructor at Hulhumale Beach for a quick safety briefing and land demo',
      'Get comfortable on the board in shallow water — learn balance and throttle control',
      'Start gliding across the surface, gradually increasing speed',
      'Rise above the water and experience the sensation of flying over the lagoon',
      'Build confidence with turns, speed control, and cruising at your own pace',
    ],
    included: [
      'eFoil board & all equipment',
      'Certified instructor (1-on-1 or 1-on-2)',
      'Safety gear — helmet & life jacket',
      '60-minute session',
      'Land briefing & water coaching',
      'Photos of your ride (on request)',
    ],
    safety: [
      'Certified instructor always in the water with you',
      'Helmet and life jacket mandatory',
      'Calm lagoon conditions — no waves or currents',
      'Wireless kill-switch on all boards',
    ],
    meetingPoint: 'Hulhumale Beach — 10 min from Velana International Airport',
    socialProof: [
      { label: '4.9 rating from 120+ riders', type: 'popular' },
      { label: 'Most guests fly on their first session', type: 'popular' },
    ],
    bookingsThisWeek: 18,
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 'efoil-maafushi',
    title: 'eFoil Lesson — Maafushi',
    subtitle: 'Fly over crystal-clear island waters',
    category: 'EFOIL',
    durationMin: 60,
    priceFromUsd: 150,
    rating: 4.8,
    reviewCount: 85,
    maxGuests: 2,
    minGuests: 1,
    skillLevel: 'beginner',
    isPrivate: false,
    media: [
      { type: 'image', uri: '', src: LOCAL_IMAGES.efoilNew },
      { type: 'image', uri: '', src: LOCAL_IMAGES.efoil },
      { type: 'image', uri: '', src: LOCAL_IMAGES.efoilMedium },
      { type: 'image', uri: '', src: LOCAL_IMAGES.island },
      { type: 'image', uri: '', src: LOCAL_IMAGES.sandbank2 },
    ],
    tags: ['60 min', 'Beginner friendly', 'Maafushi', 'All equipment included'],
    highlights: [
      'Fly above the water surrounded by the stunning Maafushi lagoon',
      'Professional instruction tailored to your pace — beginners welcome',
      'Ride in calm, shallow waters with incredible visibility',
      'Combine with a Maafushi island day trip for the ultimate experience',
      'The most Instagrammable water sport in the Maldives',
    ],
    whatYoullDo: [
      'Meet your instructor at Maafushi Beach for a safety briefing and board introduction',
      'Practice balance and throttle control in waist-deep water',
      'Start riding across the lagoon surface, building speed gradually',
      'Lift off and fly above the crystal-clear water with reef views below',
      'Cruise, turn, and explore the lagoon from a perspective like no other',
    ],
    included: [
      'eFoil board & all equipment',
      'Certified instructor (1-on-1 or 1-on-2)',
      'Safety gear — helmet & life jacket',
      '60-minute session',
      'Land briefing & water coaching',
      'Photos of your ride (on request)',
    ],
    safety: [
      'Certified instructor always in the water with you',
      'Helmet and life jacket mandatory',
      'Calm lagoon conditions — protected from open ocean',
      'Wireless kill-switch on all boards',
    ],
    meetingPoint: 'Maafushi Beach — Bikini Beach side',
    socialProof: [
      { label: '4.8 rating from 85+ riders', type: 'popular' },
      { label: 'Perfect lagoon conditions year-round', type: 'popular' },
    ],
    bookingsThisWeek: 12,
    isFeatured: true,
    isTrending: true,
  },
];

// Helper functions
export function getActivityById(id: string): Activity | undefined {
  return ACTIVITIES.find((a) => a.id === id);
}

export function getFeaturedActivities(): Activity[] {
  return ACTIVITIES.filter((a) => a.isFeatured);
}

export function getTrendingActivities(): Activity[] {
  return ACTIVITIES.filter((a) => a.isTrending);
}

export function generateActivitySlots(activity: Activity, daysAhead: number = 2): ActivitySlot[] {
  const slots: ActivitySlot[] = [];
  const now = new Date();

  const dateRanges = Array.from({ length: daysAhead }, (_, d) => {
    const date = new Date(now);
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    const dateLabel = d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    return { dateStr, dateLabel };
  });

  for (const { dateStr, dateLabel } of dateRanges) {
    const startHours = [9, 10, 11, 14, 15, 16, 17];

    startHours.forEach((hour) => {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endMinutes = hour * 60 + activity.durationMin;
      const endHour = Math.floor(endMinutes / 60);
      const endMin = endMinutes % 60;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;

      const isSunsetSlot = hour >= 17;
      const isPopular = isSunsetSlot || hour === 10;
      const maxSpots = activity.maxGuests;
      const bookedCount = Math.floor(Math.random() * (maxSpots + 1));
      const spotsRemaining = Math.max(0, maxSpots - bookedCount);

      const bookedBy: { label: string; airlineCode?: string }[] = [];
      if (bookedCount > 0) {
        bookedBy.push({ label: `${bookedCount} rider${bookedCount > 1 ? 's' : ''} booked` });
      }

      slots.push({
        id: `${activity.id}-${dateStr}-${hour}`,
        activityId: activity.id,
        startTime,
        endTime,
        date: dateStr,
        dateLabel,
        spotsRemaining,
        maxSpots,
        isPrivate: activity.isPrivate,
        isSunset: isSunsetSlot,
        isPopular,
        price: activity.priceFromUsd,
        bookedBy,
      });
    });
  }

  return slots;
}

export const PROMO_CODES: Record<string, { discount: number; label: string }> = {
  EFOIL10: { discount: 0.1, label: 'eFoil Welcome (10%)' },
  FLYOVER15: { discount: 0.15, label: 'Fly Over Paradise (15%)' },
  PARTNER20: { discount: 0.2, label: 'Partner Referral (20%)' },
};

export function applyPromoCode(code: string, price: number): { finalPrice: number; discount: number; label: string } | null {
  const promo = PROMO_CODES[code.toUpperCase()];
  if (!promo) return null;
  const discount = price * promo.discount;
  return { finalPrice: price - discount, discount, label: promo.label };
}
