// Activities Data for Premium Maldives Experiences Marketplace
// Per-seat group pricing model - emphasizes $X/seat, not total boat price

export type ActivityCategory = 'EFOIL' | 'BOAT' | 'SNORKEL' | 'FISHING' | 'PRIVATE';

export type SlotStatus = 'filling' | 'confirmed' | 'almost_full' | 'full';

export interface MediaItem {
  type: 'image' | 'video';
  uri: string;
  localSource?: ImageSourcePropType;
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

  // GROUP-FILL PRICING (critical for business model)
  seatPriceFromUsd: number;     // Per-seat share price - PRIMARY display (e.g., $80)
  boatTotalUsd?: number;        // Total boat price - shown in small print (e.g., $350)
  capacity: number;             // Max seats per trip (e.g., 5)
  minToRun: number;             // Minimum profitable seats (e.g., 4)

  // E-Foil upsell
  canAddEfoil?: boolean;        // Can add E-Foil as addon
  efoilAddonPrice?: number;     // E-Foil addon price ($50 for 15min)

  rating: number;
  reviewCount: number;
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

  // GROUP-FILL STATUS
  seatsFilled: number;          // Current bookings (e.g., 3)
  capacity: number;             // Max capacity (e.g., 5)
  minToRun: number;             // Minimum to confirm (e.g., 4)
  status: SlotStatus;           // 'filling', 'confirmed', 'almost_full', 'full'
  airlineBadges: string[];      // Anonymized airline codes ['QR', 'EK', 'TK']

  // Pricing
  seatPrice: number;            // Price per seat
  boatTotal?: number;           // Total boat price (optional display)

  isPrivate: boolean;
  isSunset: boolean;
  isPopular: boolean;
}

export interface ActivityBooking {
  id: string;
  confirmationCode: string;
  activity: Activity;
  slot: ActivitySlot;
  seats: number;                // Number of seats booked
  seatPrice: number;            // Price per seat
  totalPrice: number;           // seats * seatPrice + addons
  hasEfoilAddon?: boolean;      // E-Foil addon included
  efoilAddonPrice?: number;     // E-Foil addon price
  userName: string;
  userEmail: string;
  userWhatsapp: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

// Local images for activities
import { ImageSourcePropType } from 'react-native';

// Local asset imports
export const LOCAL_IMAGES = {
  lagoonBoat: require('@/assets/img/File 1.jpg'),
  swimmingFish: require('@/assets/img/File 2.jpg'),
  seaTurtle: require('@/assets/img/File 3.jpg'),
  privateIsland: require('@/assets/img/File 4.jpg'),
  dolphin: require('@/assets/img/dolphin.jpg'),
  fishing: require('@/assets/img/fishing.jpg'),
  efoil: require('@/assets/img/audi.jpg'),
};

// High-quality images for activities
export const MEDIA = {
  efoil: {
    hero: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
    action1: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=800&q=80',
    action2: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800&q=80',
    lagoon: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
  },
  boat: {
    sunset: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=1200&q=80',
    cruise: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&q=80',
    yacht: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80',
    deck: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800&q=80',
  },
  snorkel: {
    reef: 'https://images.unsplash.com/photo-1544551763-92ab472cad5d?w=1200&q=80',
    underwater: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&q=80',
    fish: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&q=80',
    turtle: 'https://images.unsplash.com/photo-1591025207163-942350e47db2?w=800&q=80',
  },
  fishing: {
    sunset: 'https://images.unsplash.com/photo-1545816250-e12bedba42ba?w=1200&q=80',
    boat: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    catch: 'https://images.unsplash.com/photo-1544551763-8dd44758c2dd?w=800&q=80',
  },
  sandbank: {
    aerial: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&q=80',
    picnic: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&q=80',
    beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  },
  dolphin: {
    pod: 'https://images.unsplash.com/photo-1607153333879-c174d265f1d2?w=1200&q=80',
    jumping: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=800&q=80',
    sunset: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
  },
  maldives: {
    overwater: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80',
    lagoon: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80',
    paradise: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&q=80',
  },
};

// Airline codes for group-fill badges
export const AIRLINE_CODES = {
  'Emirates': 'EK',
  'Qatar': 'QR',
  'Etihad': 'EY',
  'Turkish': 'TK',
  'Singapore': 'SQ',
  'Flydubai': 'FZ',
  'SriLankan': 'UL',
  'British': 'BA',
  'Lufthansa': 'LH',
  'KLM': 'KL',
};

export const AIRLINE_NAMES = Object.keys(AIRLINE_CODES);

// Activities catalog with per-seat pricing
export const ACTIVITIES: Activity[] = [
  {
    id: 'safari-boat-cruise',
    title: 'Safari Boat Lagoon Cruise',
    subtitle: 'Share a 5-hour adventure with fellow travelers',
    category: 'BOAT',
    durationMin: 300,

    // GROUP-FILL PRICING
    seatPriceFromUsd: 80,        // Show this prominently
    boatTotalUsd: 350,           // Small print: "Boat total $350, split across guests"
    capacity: 5,
    minToRun: 4,

    canAddEfoil: true,
    efoilAddonPrice: 50,

    rating: 4.9,
    reviewCount: 127,
    skillLevel: 'all',
    isPrivate: false,
    media: [
      { type: 'image', uri: '', localSource: LOCAL_IMAGES.lagoonBoat },
      { type: 'image', uri: MEDIA.boat.cruise },
      { type: 'image', uri: MEDIA.boat.yacht },
      { type: 'image', uri: MEDIA.maldives.lagoon },
    ],
    tags: ['5 hours', 'From $80/seat', 'Beginner friendly'],
    highlights: [
      'Traditional Maldivian dhoni boat experience',
      'Snorkel stops at pristine reefs',
      'Lunch and refreshments included',
      'Join other crews and travelers',
    ],
    whatYoullDo: [
      'Board a beautifully restored traditional dhoni boat',
      'Cruise through crystal-clear lagoons and sandbars',
      'Stop at hidden reefs for world-class snorkeling',
      'Enjoy a fresh seafood lunch prepared onboard',
    ],
    included: [
      '5-hour lagoon safari',
      'Snorkel equipment',
      'Lunch & refreshments',
      'Soft drinks & water',
      'Professional crew',
      'Towels provided',
    ],
    safety: [
      'Life jackets available',
      'Experienced captain',
      'First aid on board',
      'Weather-dependent departure',
    ],
    meetingPoint: 'Malé Harbor, Sunset Pier',
    socialProof: [
      { label: 'Booked by 3 crews today', type: 'crew' },
      { label: 'Most popular experience', type: 'popular' },
    ],
    bookingsThisWeek: 24,
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 'snorkel-lagoon',
    title: 'Snorkeling Reef Lagoon',
    subtitle: 'Discover vibrant coral gardens with other guests',
    category: 'SNORKEL',
    durationMin: 300,

    // GROUP-FILL PRICING
    seatPriceFromUsd: 60,
    boatTotalUsd: 280,
    capacity: 5,
    minToRun: 4,

    canAddEfoil: true,
    efoilAddonPrice: 50,

    rating: 4.8,
    reviewCount: 156,
    skillLevel: 'beginner',
    isPrivate: false,
    media: [
      { type: 'image', uri: '', localSource: LOCAL_IMAGES.swimmingFish },
      { type: 'image', uri: '', localSource: LOCAL_IMAGES.seaTurtle },
      { type: 'image', uri: MEDIA.snorkel.fish },
      { type: 'image', uri: MEDIA.snorkel.reef },
    ],
    tags: ['5 hours', 'From $60/seat', 'Beginner friendly'],
    highlights: [
      'Multiple reef stops with diverse marine life',
      'Sea turtle and ray encounters',
      'Professional guide and photos included',
      'Share the experience with fellow travelers',
    ],
    whatYoullDo: [
      'Explore pristine house reefs teeming with life',
      'Spot colorful tropical fish, turtles, and rays',
      'Learn about marine conservation from your guide',
      'Capture memories with underwater photos',
    ],
    included: [
      '5-hour reef exploration',
      'Premium snorkel gear',
      'Fins & reef shoes',
      'Underwater photos',
      'Fresh coconut water',
      'Light snacks',
    ],
    safety: [
      'Shallow reef areas (max 5m)',
      'Guide stays with group',
      'Reef-safe sunscreen only',
      'Float vests available',
    ],
    meetingPoint: 'Beach Club, Main Jetty',
    socialProof: [
      { label: 'Turtle sightings daily', type: 'popular' },
      { label: 'Qatar crew loved it', type: 'crew' },
    ],
    bookingsThisWeek: 31,
    isTrending: true,
  },
  {
    id: 'sunset-fishing',
    title: 'Sunset Fishing Experience',
    subtitle: 'Traditional line fishing as the sun sets',
    category: 'FISHING',
    durationMin: 300,

    // GROUP-FILL PRICING
    seatPriceFromUsd: 70,
    boatTotalUsd: 300,
    capacity: 5,
    minToRun: 4,

    canAddEfoil: false,

    rating: 4.7,
    reviewCount: 73,
    skillLevel: 'all',
    isPrivate: false,
    media: [
      { type: 'image', uri: '', localSource: LOCAL_IMAGES.fishing },
      { type: 'image', uri: MEDIA.fishing.boat },
      { type: 'image', uri: MEDIA.fishing.catch },
      { type: 'image', uri: MEDIA.boat.deck },
    ],
    tags: ['5 hours', 'From $70/seat', 'Sunset'],
    highlights: [
      'Traditional Maldivian hand-line fishing',
      'Watch the spectacular Indian Ocean sunset',
      'BBQ your catch option available',
      'Join other crews for a social experience',
    ],
    whatYoullDo: [
      'Learn traditional Maldivian line fishing techniques',
      'Fish the outer reef as the sun sets',
      'Enjoy the camaraderie with fellow travelers',
      'Optional: have the chef BBQ your catch',
    ],
    included: [
      '5-hour fishing adventure',
      'Fishing equipment',
      'Bait & tackle',
      'Drinks & snacks',
      'Expert fisherman guide',
      'BBQ your catch (optional)',
    ],
    safety: [
      'Life jackets provided',
      'First aid on board',
      'Catch & release encouraged',
      'Experienced crew',
    ],
    meetingPoint: 'Fisherman\'s Wharf, East Pier',
    socialProof: [
      { label: 'Biggest catch: 12kg tuna', type: 'popular' },
      { label: 'Flydubai crew regular', type: 'crew' },
    ],
    bookingsThisWeek: 18,
    isSunset: true,
  },
  {
    id: 'efoil-session',
    title: 'Audi E-Foil Session',
    subtitle: 'Fly above the crystal lagoon',
    category: 'EFOIL',
    durationMin: 45,

    // PRIVATE EXPERIENCE - No per-seat model
    seatPriceFromUsd: 150,       // This is standalone price
    capacity: 1,
    minToRun: 1,

    rating: 4.9,
    reviewCount: 89,
    skillLevel: 'beginner',
    isPrivate: true,
    media: [
      { type: 'image', uri: '', localSource: LOCAL_IMAGES.efoil },
      { type: 'image', uri: MEDIA.efoil.action1 },
      { type: 'image', uri: MEDIA.efoil.lagoon },
      { type: 'image', uri: MEDIA.efoil.action2 },
    ],
    tags: ['45 min', 'Private', 'Beginner friendly'],
    highlights: [
      'Premium Audi e-foil board',
      'Personal instructor throughout',
      'GoPro footage included',
      'Perfect for beginners',
    ],
    whatYoullDo: [
      'Learn the basics of hydrofoil technology with your instructor',
      'Master balance and control as you rise above the water',
      'Experience the thrill of gliding silently over the lagoon',
      'Receive your personalized GoPro footage',
    ],
    included: [
      '45-minute private session',
      'Professional instructor',
      'All safety equipment',
      'Wetsuit & life jacket',
      'GoPro footage',
      'Refreshments',
    ],
    safety: [
      'Life jacket required at all times',
      'Instructor stays within 10m',
      'Calm lagoon conditions only',
      'Beginner-friendly equipment',
    ],
    meetingPoint: 'Malé Lagoon Dock, North Pier',
    socialProof: [
      { label: 'Most requested experience', type: 'popular' },
      { label: 'Perfect for beginners', type: 'recent' },
    ],
    bookingsThisWeek: 42,
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 'sandbank-picnic',
    title: 'Private Sandbank Picnic',
    subtitle: 'Your own island for the day',
    category: 'PRIVATE',
    durationMin: 180,

    // PRIVATE EXPERIENCE - Fixed price
    seatPriceFromUsd: 450,
    capacity: 4,
    minToRun: 2,

    canAddEfoil: true,
    efoilAddonPrice: 75,

    rating: 5.0,
    reviewCount: 42,
    skillLevel: 'all',
    isPrivate: true,
    media: [
      { type: 'image', uri: '', localSource: LOCAL_IMAGES.privateIsland },
      { type: 'image', uri: '', localSource: LOCAL_IMAGES.lagoonBoat },
      { type: 'image', uri: MEDIA.sandbank.beach },
      { type: 'image', uri: MEDIA.maldives.lagoon },
    ],
    tags: ['3 hours', 'Private', 'Gourmet lunch'],
    highlights: [
      'Exclusive sandbank all to yourself',
      'Gourmet champagne picnic',
      'Butler service included',
      'Perfect for special occasions',
    ],
    whatYoullDo: [
      'Arrive by speedboat to your private sandbank',
      'Enjoy a luxury picnic setup with ocean views',
      'Swim, snorkel, or simply relax in paradise',
      'Toast with champagne as the waves lap at your feet',
    ],
    included: [
      '3-hour private sandbank',
      'Speedboat transfers',
      'Gourmet picnic basket',
      'Champagne & wines',
      'Beach setup (umbrella, loungers)',
      'Snorkel gear',
      'Butler service',
    ],
    safety: [
      'Shallow surrounding waters',
      'Radio contact with base',
      'Sun protection provided',
      'Emergency rescue on standby',
    ],
    meetingPoint: 'VIP Lounge, Marina',
    socialProof: [
      { label: 'Perfect 5.0 rating', type: 'popular' },
      { label: 'Honeymoon favorite', type: 'recent' },
    ],
    bookingsThisWeek: 8,
    isFeatured: true,
  },
  {
    id: 'dolphin-cruise',
    title: 'Dolphin Discovery Cruise',
    subtitle: 'Meet spinner dolphins at dawn',
    category: 'BOAT',
    durationMin: 90,

    // GROUP-FILL PRICING
    seatPriceFromUsd: 40,
    boatTotalUsd: 280,
    capacity: 8,
    minToRun: 5,

    canAddEfoil: false,

    rating: 4.8,
    reviewCount: 98,
    skillLevel: 'all',
    isPrivate: false,
    media: [
      { type: 'image', uri: '', localSource: LOCAL_IMAGES.dolphin },
      { type: 'image', uri: MEDIA.dolphin.jumping },
      { type: 'image', uri: MEDIA.dolphin.sunset },
      { type: 'image', uri: MEDIA.boat.cruise },
    ],
    tags: ['90 min', 'From $40/seat', '95% sighting rate'],
    highlights: [
      '95% dolphin sighting guarantee',
      'Pods of spinner dolphins',
      'Marine biologist guide',
      'Join travelers from around the world',
    ],
    whatYoullDo: [
      'Cruise to dolphin feeding grounds at sunrise',
      'Watch pods of spinner dolphins leap and play',
      'Learn about dolphin behavior from our marine expert',
      'Enjoy a sunrise breakfast on the water',
    ],
    included: [
      '90-minute dolphin cruise',
      'Marine biologist guide',
      'Breakfast pastries',
      'Coffee & juices',
      'Binoculars provided',
      'Photo opportunities',
    ],
    safety: [
      'Respectful distance maintained',
      'No swimming with dolphins',
      'Eco-friendly practices',
      'Calm morning waters',
    ],
    meetingPoint: 'Sunrise Pier, Main Harbor',
    socialProof: [
      { label: '95% sighting rate', type: 'popular' },
      { label: 'Turkish crew loved it', type: 'crew' },
    ],
    bookingsThisWeek: 22,
    isTrending: true,
  },
];

// Helper functions
export function getActivityById(id: string): Activity | undefined {
  return ACTIVITIES.find(a => a.id === id);
}

export function getActivitiesByCategory(category: ActivityCategory): Activity[] {
  return ACTIVITIES.filter(a => a.category === category);
}

export function getFeaturedActivities(): Activity[] {
  return ACTIVITIES.filter(a => a.isFeatured);
}

export function getTrendingActivities(): Activity[] {
  const trending = ACTIVITIES.filter(a => a.isTrending);
  // Custom order: boat cruise, snorkeling, dolphins, efoil
  const order = ['safari-boat-cruise', 'snorkel-lagoon', 'dolphin-cruise', 'efoil-session'];
  return trending.sort((a, b) => {
    const aIndex = order.indexOf(a.id);
    const bIndex = order.indexOf(b.id);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

export function getSunsetActivities(): Activity[] {
  return ACTIVITIES.filter(a => a.isSunset);
}

export function getWaterSportsActivities(): Activity[] {
  return ACTIVITIES.filter(a => a.category === 'EFOIL' || a.category === 'SNORKEL');
}

export function getPrivateExperiences(): Activity[] {
  return ACTIVITIES.filter(a => a.isPrivate);
}

export function getBoatExperiences(): Activity[] {
  return ACTIVITIES.filter(a => a.category === 'BOAT' || a.category === 'FISHING');
}

export function getGroupExperiences(): Activity[] {
  return ACTIVITIES.filter(a => !a.isPrivate && a.capacity > 1);
}

// Calculate slot status based on seats filled
function calculateSlotStatus(seatsFilled: number, capacity: number, minToRun: number): SlotStatus {
  if (seatsFilled >= capacity) return 'full';
  if (seatsFilled >= minToRun) return 'confirmed';
  if (seatsFilled >= minToRun - 1) return 'almost_full';
  return 'filling';
}

// Generate airline badges for demo
function generateAirlineBadges(count: number): string[] {
  const allCodes = Object.values(AIRLINE_CODES);
  const shuffled = [...allCodes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, 3));
}

// Generate time slots for an activity with group-fill data
export function generateActivitySlots(activity: Activity, daysAhead: number = 3): ActivitySlot[] {
  const slots: ActivitySlot[] = [];
  const now = new Date();

  for (let d = 0; d < daysAhead; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    const dateLabel = d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    // Generate slots based on activity type
    let startHours: number[];
    if (activity.isSunset) {
      startHours = [15, 16, 17];
    } else if (activity.id === 'dolphin-cruise') {
      startHours = [6, 7, 8];
    } else if (activity.id === 'efoil-session') {
      startHours = [9, 10, 11, 14, 15, 16, 17];
    } else {
      startHours = [9, 10, 14, 15, 16];
    }

    startHours.forEach((hour) => {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endMinutes = hour * 60 + activity.durationMin;
      const endHour = Math.floor(endMinutes / 60) % 24;
      const endMin = endMinutes % 60;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;

      const isSunsetSlot = hour >= 16;
      const isPopular = isSunsetSlot || hour === 10;

      // Simulate group-fill data for demo
      const isPrivateActivity = activity.isPrivate || activity.capacity === 1;
      let seatsFilled: number;

      if (isPrivateActivity) {
        // Private activities: 0 or 1 (available or booked)
        seatsFilled = Math.random() > 0.3 ? 0 : 1;
      } else {
        // Group activities: random fill between 0 and capacity
        // Make some slots look more appealing (almost full)
        const rand = Math.random();
        if (rand > 0.7) {
          // Almost confirmed - 3-4 seats for capacity 5
          seatsFilled = activity.minToRun - 1 + Math.floor(Math.random() * 2);
        } else if (rand > 0.4) {
          // Partially filled - 1-3 seats
          seatsFilled = 1 + Math.floor(Math.random() * (activity.minToRun - 1));
        } else if (rand > 0.2) {
          // Just started - 0-1 seats
          seatsFilled = Math.floor(Math.random() * 2);
        } else {
          // Already confirmed - 4-5 seats
          seatsFilled = activity.minToRun + Math.floor(Math.random() * 2);
        }
        seatsFilled = Math.min(seatsFilled, activity.capacity - 1); // Leave at least 1 spot
      }

      const status = calculateSlotStatus(seatsFilled, activity.capacity, activity.minToRun);
      const airlineBadges = seatsFilled > 0 ? generateAirlineBadges(Math.min(seatsFilled, 3)) : [];

      slots.push({
        id: `${activity.id}-${dateStr}-${hour}`,
        activityId: activity.id,
        startTime,
        endTime,
        date: dateStr,
        dateLabel,
        seatsFilled,
        capacity: activity.capacity,
        minToRun: activity.minToRun,
        status,
        airlineBadges,
        seatPrice: activity.seatPriceFromUsd,
        boatTotal: activity.boatTotalUsd,
        isPrivate: activity.isPrivate,
        isSunset: isSunsetSlot,
        isPopular,
      });
    });
  }

  return slots;
}

// Category display names and icons
export const CATEGORY_INFO: Record<ActivityCategory, { name: string; icon: string }> = {
  EFOIL: { name: 'E-Foil', icon: 'Waves' },
  BOAT: { name: 'Boat Tours', icon: 'Ship' },
  SNORKEL: { name: 'Snorkeling', icon: 'Fish' },
  FISHING: { name: 'Fishing', icon: 'Anchor' },
  PRIVATE: { name: 'Private', icon: 'Crown' },
};

// Promo codes
export const PROMO_CODES: Record<string, { discount: number; label: string }> = {
  CREW25: { discount: 0.25, label: 'Crew Discount (25%)' },
  PARADISE10: { discount: 0.10, label: 'Paradise Welcome (10%)' },
  SUNSET15: { discount: 0.15, label: 'Sunset Special (15%)' },
  FOILTRIBE20: { discount: 0.20, label: 'foilTribe Member (20%)' },
};

export function applyPromoCode(code: string, price: number): { finalPrice: number; discount: number; label: string } | null {
  const promo = PROMO_CODES[code.toUpperCase()];
  if (!promo) return null;

  const discount = price * promo.discount;
  return {
    finalPrice: price - discount,
    discount,
    label: promo.label,
  };
}

// Format price display
export function formatSeatPrice(price: number): string {
  return `$${price}`;
}

export function formatFromSeatPrice(price: number): string {
  return `From $${price} / seat`;
}

// Get status message for group-fill
export function getStatusMessage(slot: ActivitySlot): string {
  const spotsLeft = slot.capacity - slot.seatsFilled;

  switch (slot.status) {
    case 'confirmed':
      return `Confirmed • ${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`;
    case 'almost_full':
      return `Almost there • ${slot.seatsFilled}/${slot.capacity} seats filled`;
    case 'full':
      return 'Fully booked';
    case 'filling':
    default:
      if (slot.seatsFilled === 0) {
        return `Be the first to join • ${slot.capacity} seats available`;
      }
      return `${slot.seatsFilled}/${slot.capacity} seats filled • ${spotsLeft} left`;
  }
}

// Get fill percentage for progress bar
export function getFillPercentage(slot: ActivitySlot): number {
  return (slot.seatsFilled / slot.capacity) * 100;
}
