// Activities Data for Maldives Luxury Experiences - Web version

export type ActivityCategory = 'EFOIL' | 'BOAT' | 'SNORKEL' | 'FISHING' | 'PRIVATE';

export interface MediaItem {
  type: 'image' | 'video';
  uri: string;
  src?: string; // local /img/ path for web
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
  maldives: {
    overwater: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80',
    lagoon: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80',
    paradise: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&q=80',
  },
};

export const MALDIVES_ADVENTURE_ID = 'maldives-adventure';

export const EFOIL_ADDON = {
  id: 'efoil-addon',
  title: 'Audi E-Foil Experience',
  description: 'Fly above the water on an electric hydrofoil surfboard. No experience needed — professional instruction included.',
  priceUsd: 150,
  durationLabel: '30 min session',
  includes: [
    'Private instruction',
    'All safety equipment',
    'Drone footage of your ride',
    '360° camera on board — footage is yours',
  ],
  images: [LOCAL_IMAGES.efoilNew, LOCAL_IMAGES.efoilMedium, LOCAL_IMAGES.efoil],
};

export const MEDIA_PACKAGE = {
  id: 'media-package',
  title: 'Professional Media Content',
  description: 'Take home cinematic-quality content of your adventure. Our crew captures your trip using professional-grade equipment so you can relive every moment — and make your friends jealous.',
  equipment: [
    { icon: 'Video', label: 'GoPro cameras' },
    { icon: 'Navigation', label: 'Drone aerial footage' },
    { icon: 'Fish', label: 'Underwater cameras' },
    { icon: 'RotateCw', label: '360° cameras' },
  ],
  note: 'Available upon request — let us know when you book or anytime before the trip.',
};

export interface ExperienceHighlight {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  icon: string;
}

export const EXPERIENCE_HIGHLIGHTS: ExperienceHighlight[] = [
  {
    id: 'dolphins',
    title: 'Swim with Dolphins',
    subtitle: '95% sighting rate',
    description: 'Cruise to the dolphin channel and swim alongside pods of wild spinner dolphins. Our captain knows the exact spots where dolphins gather every morning.',
    images: [LOCAL_IMAGES.dolphins, LOCAL_IMAGES.crewOnABoat],
    icon: 'Fish',
  },
  {
    id: 'snorkeling',
    title: 'Reef Snorkeling',
    subtitle: 'Two pristine reef stops',
    description: 'Explore vibrant coral gardens teeming with tropical fish, sea turtles, reef sharks, and manta rays. All snorkeling gear provided.',
    images: [LOCAL_IMAGES.snorkel, LOCAL_IMAGES.turtle, LOCAL_IMAGES.reef, LOCAL_IMAGES.snorkel2, LOCAL_IMAGES.mantas, LOCAL_IMAGES.turtle2, LOCAL_IMAGES.snorkel4],
    icon: 'Waves',
  },
  {
    id: 'sandbank',
    title: 'Private Sandbank',
    subtitle: 'Your own island for an hour',
    description: "Step onto a strip of white sand in the middle of the Indian Ocean. Picnic lunch, drinks, swimming, and the best photos you'll ever take.",
    images: [LOCAL_IMAGES.sandbank, LOCAL_IMAGES.sandbank2, LOCAL_IMAGES.sandbank3, LOCAL_IMAGES.sandbank5, LOCAL_IMAGES.island],
    icon: 'Sun',
  },
  {
    id: 'cruise',
    title: 'Sunset Cruise',
    subtitle: 'Golden hour on the Indian Ocean',
    description: 'End the day cruising back as the sun sets. Music, drinks, and the kind of views that make you forget everything else.',
    images: [LOCAL_IMAGES.boat, LOCAL_IMAGES.boat3, LOCAL_IMAGES.boat2],
    icon: 'Sunset',
  },
];

export function formatDurationHours(durationMin: number): string {
  const hours = durationMin / 60;
  return hours >= 1 ? `${hours} hour${hours !== 1 ? 's' : ''}` : `${durationMin} min`;
}

export const ACTIVITIES: Activity[] = [
  {
    id: MALDIVES_ADVENTURE_ID,
    title: 'Maldives Adventure',
    subtitle: 'Your best day in the Maldives — from $80/person',
    category: 'BOAT',
    durationMin: 300,
    priceFromUsd: 80,
    rating: 4.9,
    reviewCount: 312,
    maxGuests: 6,
    minGuests: 1,
    skillLevel: 'all',
    isPrivate: false,
    media: [
      { type: 'image', uri: '', src: LOCAL_IMAGES.boat },
      { type: 'image', uri: '', src: LOCAL_IMAGES.dolphins },
      { type: 'image', uri: '', src: LOCAL_IMAGES.snorkel },
      { type: 'image', uri: '', src: LOCAL_IMAGES.sandbank },
      { type: 'image', uri: '', src: LOCAL_IMAGES.efoilNew },
      { type: 'image', uri: '', src: LOCAL_IMAGES.crewOnABoat },
      { type: 'image', uri: '', src: LOCAL_IMAGES.turtle },
      { type: 'image', uri: '', src: LOCAL_IMAGES.island },
    ],
    tags: ['5 hours', 'Dolphins', 'Snorkel', 'Sandbank', 'E-Foil', 'Sunset'],
    highlights: [
      'Swim with wild spinner dolphins (95% sighting rate)',
      'Snorkel two pristine reefs — sea turtles, reef sharks, tropical fish',
      'Private sandbank stop with picnic lunch',
      'Audi e-foil session for every guest (worth $150+ at resorts)',
      'Professional media content available upon request (drone, GoPro, underwater, 360°)',
      'Golden-hour sunset cruise back',
    ],
    whatYoullDo: [
      'Cruise to the dolphin channel and swim alongside pods of wild spinner dolphins',
      'Snorkel two vibrant reefs teeming with tropical fish, reef sharks, and sea turtles',
      'Stop at a picture-perfect private sandbank for photos, swimming, and a picnic lunch',
      'Fly the Audi e-foil — an electric surfboard that lifts you above the water. No experience needed.',
      'End the day with a golden-hour sunset cruise back across the Indian Ocean',
    ],
    included: [
      '5-hour boat adventure (3h option available)',
      'Dolphin swimming excursion',
      '2 snorkel reef stops + all gear',
      'Private sandbank stop + picnic lunch',
      'Audi e-foil session for every guest',
      'Professional drone & 360-cam footage',
      'Hotel pickup & drop-off (Malé / Hulhumalé)',
      'Drinks, snacks & refreshments all day',
      'Professional captain & crew',
      'Professional media content available upon request',
    ],
    safety: ['Life jackets for all', 'Experienced crew', 'Weather-dependent departure'],
    meetingPoint: 'Malé Harbor — hotel pickup available',
    socialProof: [
      { label: 'Cabin crew favorite — 95% rebook', type: 'crew' },
      { label: 'Best value adventure in the Maldives', type: 'popular' },
    ],
    bookingsThisWeek: 48,
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 'efoil-session',
    title: 'Audi E-Foil Experience',
    subtitle: '2 hours in an idyllic turquoise lagoon',
    category: 'EFOIL',
    durationMin: 120,
    priceFromUsd: 280,
    rating: 4.9,
    reviewCount: 127,
    maxGuests: 1,
    minGuests: 1,
    skillLevel: 'beginner',
    isPrivate: true,
    media: [
      { type: 'image', uri: '', src: LOCAL_IMAGES.efoilNew },
      { type: 'image', uri: '', src: LOCAL_IMAGES.efoilMedium },
      { type: 'image', uri: '', src: LOCAL_IMAGES.efoil },
      { type: 'image', uri: '', src: LOCAL_IMAGES.boat2 },
    ],
    tags: ['2 hours', 'Private', 'Instructor', 'Drone & 360'],
    highlights: [
      'Private instructor for the full session',
      'Boat transfer to idyllic turquoise lagoon',
      'Drone footage of your ride',
      '360° camera attached to the board — keep all footage',
    ],
    whatYoullDo: [
      'Boat transfer to a secluded turquoise lagoon',
      'Learn to fly on the Audi e-foil with your private instructor',
      'Get professional drone footage and 360° camera footage from the board',
      'Take home all your footage as part of the experience',
    ],
    included: [
      '2-hour private session',
      'Boat transfer to lagoon',
      'Private instructor',
      'Drone aerial footage',
      'GoPro 360 camera on board — all footage included',
      'All safety equipment & wetsuit',
    ],
    safety: ['Life jacket required at all times', 'Instructor stays with you', 'Calm lagoon only'],
    meetingPoint: 'Malé Lagoon Dock — boat to lagoon',
    socialProof: [
      { label: 'Booked by 3 crews today', type: 'crew' },
      { label: 'Unique in the Maldives', type: 'popular' },
    ],
    bookingsThisWeek: 24,
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 'snorkel-lagoon',
    title: 'Lagoon Reef Snorkeling',
    subtitle: 'Discover vibrant coral gardens',
    category: 'SNORKEL',
    durationMin: 300,
    priceFromUsd: 120,
    rating: 4.7,
    reviewCount: 156,
    maxGuests: 6,
    minGuests: 1,
    skillLevel: 'beginner',
    isPrivate: false,
    media: [
      { type: 'image', uri: '', src: LOCAL_IMAGES.snorkel },
      { type: 'image', uri: '', src: LOCAL_IMAGES.turtle },
      { type: 'image', uri: '', src: LOCAL_IMAGES.reef },
      { type: 'image', uri: '', src: LOCAL_IMAGES.snorkel2 },
      { type: 'image', uri: '', src: LOCAL_IMAGES.turtle2 },
      { type: 'image', uri: '', src: LOCAL_IMAGES.snorkel4 },
      { type: 'image', uri: '', src: LOCAL_IMAGES.mantas },
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
    safety: ['Shallow reef (max 5m)', 'Guide stays with group', 'Reef-safe sunscreen only'],
    meetingPoint: 'Beach Club, Main Jetty',
    socialProof: [
      { label: 'Turtle sightings daily', type: 'popular' },
      { label: 'Qatar Airways crew loved it', type: 'crew' },
    ],
    bookingsThisWeek: 31,
    isTrending: true,
  },
  {
    id: 'dolphin-cruise',
    title: 'Dolphin Discovery Cruise',
    subtitle: 'Meet spinner dolphins at dawn',
    category: 'BOAT',
    durationMin: 300,
    priceFromUsd: 180,
    rating: 4.8,
    reviewCount: 98,
    maxGuests: 6,
    minGuests: 2,
    skillLevel: 'all',
    isPrivate: false,
    media: [
      { type: 'image', uri: '', src: LOCAL_IMAGES.dolphins },
      { type: 'image', uri: '', src: LOCAL_IMAGES.boat },
      { type: 'image', uri: '', src: LOCAL_IMAGES.crewOnABoat },
      { type: 'image', uri: '', src: LOCAL_IMAGES.island },
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
    safety: ['Respectful distance maintained', 'No swimming with dolphins', 'Eco-friendly practices'],
    meetingPoint: 'Sunrise Pier, Main Harbor',
    socialProof: [
      { label: '95% dolphin sighting rate', type: 'popular' },
      { label: 'Turkish Airlines crew loved it', type: 'crew' },
    ],
    bookingsThisWeek: 22,
    isTrending: true,
  },
  {
    id: 'sandbank-picnic',
    title: 'Private Sandbank Picnic',
    subtitle: 'Your own island for the day',
    category: 'PRIVATE',
    durationMin: 300,
    priceFromUsd: 450,
    rating: 5.0,
    reviewCount: 42,
    maxGuests: 4,
    minGuests: 2,
    skillLevel: 'all',
    isPrivate: true,
    media: [
      { type: 'image', uri: '', src: LOCAL_IMAGES.sandbank },
      { type: 'image', uri: '', src: LOCAL_IMAGES.sandbank2 },
      { type: 'image', uri: '', src: LOCAL_IMAGES.sandbank3 },
      { type: 'image', uri: '', src: LOCAL_IMAGES.sandbank5 },
      { type: 'image', uri: '', src: LOCAL_IMAGES.island },
      { type: 'image', uri: '', src: LOCAL_IMAGES.boat },
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
    safety: ['Shallow surrounding waters', 'Radio contact with base', 'Sun protection provided'],
    meetingPoint: 'VIP Lounge, Marina',
    socialProof: [
      { label: 'Perfect 5.0 rating', type: 'popular' },
      { label: 'Honeymoon favorite', type: 'recent' },
    ],
    bookingsThisWeek: 8,
    isFeatured: true,
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
  const trending = ACTIVITIES.filter((a) => a.isTrending);
  const order = ['dolphin-cruise', 'snorkel-lagoon', 'efoil-session'];
  return trending.sort((a, b) => {
    const aIndex = order.indexOf(a.id);
    const bIndex = order.indexOf(b.id);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
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
    const startHours = activity.isSunset ? [16, 17, 18] : activity.id === 'dolphin-cruise' ? [6, 7, 8] : [9, 10, 11, 14, 15, 16, 17];

    startHours.forEach((hour) => {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endMinutes = hour * 60 + activity.durationMin;
      const endHour = Math.floor(endMinutes / 60);
      const endMin = endMinutes % 60;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;

      const isSunsetSlot = hour >= 17;
      const isPopular = isSunsetSlot || hour === 10;
      const maxSpots = activity.isPrivate ? 1 : activity.maxGuests;
      const bookedCount = Math.floor(Math.random() * (maxSpots + 1));
      const spotsRemaining = Math.max(0, maxSpots - bookedCount);

      const crews = ['Emirates', 'Qatar', 'Etihad', 'Turkish', 'Flydubai', 'SriLankan'];
      const bookedBy: { label: string; airlineCode?: string }[] = [];
      if (bookedCount > 0) {
        const randomCrews = crews.sort(() => Math.random() - 0.5).slice(0, Math.min(bookedCount, 2));
        randomCrews.forEach((crew) => {
          bookedBy.push({ label: `${crew} crew`, airlineCode: crew.substring(0, 2).toUpperCase() });
        });
        if (bookedCount > 2) bookedBy.push({ label: `+${bookedCount - 2} more` });
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
  CREW25: { discount: 0.25, label: 'Crew Discount (25%)' },
  PARADISE10: { discount: 0.1, label: 'Paradise Welcome (10%)' },
  SUNSET15: { discount: 0.15, label: 'Sunset Special (15%)' },
};

export function applyPromoCode(code: string, price: number): { finalPrice: number; discount: number; label: string } | null {
  const promo = PROMO_CODES[code.toUpperCase()];
  if (!promo) return null;
  const discount = price * promo.discount;
  return { finalPrice: price - discount, discount, label: promo.label };
}
