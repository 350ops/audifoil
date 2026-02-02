// Activities Data for Maldives Luxury Experiences App

export type ActivityCategory = 'EFOIL' | 'BOAT' | 'SNORKEL' | 'FISHING' | 'PRIVATE';

export interface MediaItem {
  type: 'image' | 'video';
  uri: string;
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
}

// High-quality placeholder images (using Unsplash for demo)
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

// Activities catalog
export const ACTIVITIES: Activity[] = [
  {
    id: 'efoil-session',
    title: 'Audi E-Foil Experience',
    subtitle: 'Fly above the crystal lagoon',
    category: 'EFOIL',
    durationMin: 45,
    priceFromUsd: 150,
    rating: 4.9,
    reviewCount: 127,
    maxGuests: 1,
    minGuests: 1,
    skillLevel: 'beginner',
    isPrivate: true,
    media: [
      { type: 'image', uri: MEDIA.efoil.hero },
      { type: 'image', uri: MEDIA.efoil.action1 },
      { type: 'image', uri: MEDIA.efoil.lagoon },
      { type: 'image', uri: MEDIA.efoil.action2 },
    ],
    tags: ['45 min', 'Private', 'Beginner friendly', 'Instructor included'],
    highlights: ['Premium Audi e-foil board', 'Personal instructor', 'GoPro footage included'],
    whatYoullDo: [
      'Learn the basics of hydrofoil technology with your personal instructor',
      'Master balance and control as you rise above the water',
      'Experience the thrill of gliding silently over the lagoon',
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
    ],
    meetingPoint: 'Malé Lagoon Dock, North Pier',
    socialProof: [
      { label: 'Booked by 3 crews today', type: 'crew' },
      { label: 'Popular at sunset', type: 'popular' },
    ],
    bookingsThisWeek: 24,
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 'safari-boat-sunset',
    title: 'Safari Boat Sunset Cruise',
    subtitle: 'Golden hour on a traditional dhoni',
    category: 'BOAT',
    durationMin: 120,
    priceFromUsd: 300,
    rating: 4.8,
    reviewCount: 89,
    maxGuests: 8,
    minGuests: 2,
    skillLevel: 'all',
    isPrivate: false,
    media: [
      { type: 'image', uri: MEDIA.boat.sunset },
      { type: 'image', uri: MEDIA.boat.cruise },
      { type: 'image', uri: MEDIA.boat.yacht },
      { type: 'image', uri: MEDIA.boat.deck },
    ],
    tags: ['2 hours', '2-8 guests', 'Sunset', 'Drinks included'],
    highlights: ['Traditional Maldivian dhoni boat', 'Champagne & canapés', 'Stunning sunset views'],
    whatYoullDo: [
      'Board a beautifully restored traditional dhoni boat',
      'Cruise through the atolls as the sun sets',
      'Enjoy premium drinks and local delicacies',
    ],
    included: [
      '2-hour sunset cruise',
      'Welcome champagne',
      'Canapés & snacks',
      'Soft drinks & water',
      'Professional crew',
      'Bluetooth speaker',
    ],
    safety: [
      'Life jackets available',
      'Experienced captain',
      'Weather-dependent departure',
    ],
    meetingPoint: 'Malé Harbor, Sunset Pier',
    socialProof: [
      { label: 'Emirates crew favorite', type: 'crew' },
      { label: 'Best at golden hour', type: 'popular' },
    ],
    bookingsThisWeek: 18,
    isFeatured: true,
    isSunset: true,
  },
  {
    id: 'snorkel-lagoon',
    title: 'Lagoon Reef Snorkeling',
    subtitle: 'Discover vibrant coral gardens',
    category: 'SNORKEL',
    durationMin: 90,
    priceFromUsd: 120,
    rating: 4.7,
    reviewCount: 156,
    maxGuests: 6,
    minGuests: 1,
    skillLevel: 'beginner',
    isPrivate: false,
    media: [
      { type: 'image', uri: MEDIA.snorkel.reef },
      { type: 'image', uri: MEDIA.snorkel.underwater },
      { type: 'image', uri: MEDIA.snorkel.fish },
      { type: 'image', uri: MEDIA.snorkel.turtle },
    ],
    tags: ['90 min', '1-6 guests', 'Beginner friendly', 'Equipment provided'],
    highlights: ['House reef teeming with life', 'Sea turtles & rays', 'Professional guide'],
    whatYoullDo: [
      'Explore the pristine house reef with your guide',
      'Spot colorful tropical fish, turtles, and rays',
      'Learn about marine conservation efforts',
    ],
    included: [
      '90-minute guided snorkel',
      'Premium snorkel gear',
      'Fins & reef shoes',
      'Underwater photos',
      'Fresh coconut water',
      'Marine life briefing',
    ],
    safety: [
      'Shallow reef (max 5m)',
      'Guide stays with group',
      'Reef-safe sunscreen only',
    ],
    meetingPoint: 'Beach Club, Main Jetty',
    socialProof: [
      { label: 'Turtle sightings daily', type: 'popular' },
      { label: 'Qatar Airways crew loved it', type: 'crew' },
    ],
    bookingsThisWeek: 31,
    isTrending: true,
  },
  {
    id: 'sunset-fishing',
    title: 'Sunset Line Fishing',
    subtitle: 'Traditional Maldivian fishing experience',
    category: 'FISHING',
    durationMin: 150,
    priceFromUsd: 200,
    rating: 4.6,
    reviewCount: 73,
    maxGuests: 6,
    minGuests: 2,
    skillLevel: 'all',
    isPrivate: false,
    media: [
      { type: 'image', uri: MEDIA.fishing.sunset },
      { type: 'image', uri: MEDIA.fishing.boat },
      { type: 'image', uri: MEDIA.fishing.catch },
      { type: 'image', uri: MEDIA.boat.deck },
    ],
    tags: ['2.5 hours', '2-6 guests', 'Sunset', 'BBQ option'],
    highlights: ['Traditional hand-line fishing', 'Spectacular sunset views', 'Cook your catch option'],
    whatYoullDo: [
      'Learn traditional Maldivian line fishing techniques',
      'Fish the outer reef as the sun sets',
      'Optional: have the chef cook your catch',
    ],
    included: [
      '2.5-hour fishing trip',
      'Fishing equipment',
      'Bait & tackle',
      'Drinks & snacks',
      'Experienced fisherman guide',
      'BBQ your catch (optional)',
    ],
    safety: [
      'Life jackets provided',
      'First aid on board',
      'Catch & release encouraged',
    ],
    meetingPoint: 'Fisherman\'s Wharf, East Pier',
    socialProof: [
      { label: 'Biggest catch: 12kg tuna', type: 'popular' },
      { label: 'Flydubai crew regular', type: 'crew' },
    ],
    bookingsThisWeek: 12,
    isSunset: true,
  },
  {
    id: 'sandbank-picnic',
    title: 'Private Sandbank Picnic',
    subtitle: 'Your own island for the day',
    category: 'PRIVATE',
    durationMin: 180,
    priceFromUsd: 450,
    rating: 5.0,
    reviewCount: 42,
    maxGuests: 4,
    minGuests: 2,
    skillLevel: 'all',
    isPrivate: true,
    media: [
      { type: 'image', uri: MEDIA.sandbank.aerial },
      { type: 'image', uri: MEDIA.sandbank.picnic },
      { type: 'image', uri: MEDIA.sandbank.beach },
      { type: 'image', uri: MEDIA.maldives.lagoon },
    ],
    tags: ['3 hours', '2-4 guests', 'Private', 'Gourmet lunch'],
    highlights: ['Exclusive sandbank access', 'Gourmet picnic setup', 'Champagne & lobster'],
    whatYoullDo: [
      'Arrive by speedboat to your private sandbank',
      'Enjoy a luxury picnic setup with ocean views',
      'Swim, snorkel, or simply relax in paradise',
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
    priceFromUsd: 180,
    rating: 4.8,
    reviewCount: 98,
    maxGuests: 12,
    minGuests: 2,
    skillLevel: 'all',
    isPrivate: false,
    media: [
      { type: 'image', uri: MEDIA.dolphin.pod },
      { type: 'image', uri: MEDIA.dolphin.jumping },
      { type: 'image', uri: MEDIA.dolphin.sunset },
      { type: 'image', uri: MEDIA.boat.cruise },
    ],
    tags: ['90 min', '2-12 guests', 'Morning', '95% sighting rate'],
    highlights: ['Spinner dolphin pods', '95% sighting guarantee', 'Marine biologist guide'],
    whatYoullDo: [
      'Cruise to dolphin feeding grounds at sunrise',
      'Watch pods of spinner dolphins leap and play',
      'Learn about dolphin behavior from our marine expert',
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
    ],
    meetingPoint: 'Sunrise Pier, Main Harbor',
    socialProof: [
      { label: '95% dolphin sighting rate', type: 'popular' },
      { label: 'Turkish Airlines crew loved it', type: 'crew' },
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
  return ACTIVITIES.filter(a => a.isTrending);
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

// Generate time slots for an activity
export function generateActivitySlots(activity: Activity, daysAhead: number = 2): ActivitySlot[] {
  const slots: ActivitySlot[] = [];
  const now = new Date();

  for (let d = 0; d < daysAhead; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    const dateLabel = d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    // Generate slots based on activity type
    const startHours = activity.isSunset
      ? [16, 17, 18]
      : activity.id === 'dolphin-cruise'
        ? [6, 7, 8]
        : [9, 10, 11, 14, 15, 16, 17];

    startHours.forEach((hour, idx) => {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endMinutes = hour * 60 + activity.durationMin;
      const endHour = Math.floor(endMinutes / 60);
      const endMin = endMinutes % 60;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;

      const isSunsetSlot = hour >= 17;
      const isPopular = isSunsetSlot || hour === 10;

      // Simulate booking data
      const maxSpots = activity.isPrivate ? 1 : activity.maxGuests;
      const bookedCount = Math.floor(Math.random() * (maxSpots + 1));
      const spotsRemaining = Math.max(0, maxSpots - bookedCount);

      // Generate mock booked-by data
      const crews = ['Emirates', 'Qatar', 'Etihad', 'Turkish', 'Flydubai', 'SriLankan'];
      const bookedBy: { label: string; airlineCode?: string }[] = [];
      if (bookedCount > 0) {
        const randomCrews = crews.sort(() => Math.random() - 0.5).slice(0, Math.min(bookedCount, 2));
        randomCrews.forEach(crew => {
          bookedBy.push({ label: `${crew} crew`, airlineCode: crew.substring(0, 2).toUpperCase() });
        });
        if (bookedCount > 2) {
          bookedBy.push({ label: `+${bookedCount - 2} more` });
        }
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
