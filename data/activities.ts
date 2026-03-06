// Activities Data for Maldives Water Sports - Web version

export type ActivityCategory = 'BOAT' | 'SNORKEL' | 'FISHING' | 'PRIVATE' | 'WATERSPORT';

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

export const MALDIVES_ADVENTURE_ID = 'south-ari-atoll';

export const KAYAK_ADDON = {
  id: 'kayak-addon',
  title: 'Kayak Rental',
  description: 'Explore the turquoise lagoon at your own pace. Paddle through calm, shallow waters and discover underwater marine life including baby reef sharks and colorful fish.',
  priceUsd: 25,
  durationLabel: 'Per hour',
  includes: [
    'Single or tandem kayak',
    'Life jacket provided',
    'Lagoon access',
    'Flexible time slots',
  ],
  images: [LOCAL_IMAGES.lagoonBoat, LOCAL_IMAGES.island, LOCAL_IMAGES.sandbank],
};

export const JET_SKI_ADDON = {
  id: 'jet-ski-addon',
  title: 'Jet Ski Rental',
  description: 'Unleash your inner thrill-seeker with our premier Jet Ski service! Experience the true exhilaration of gliding across the crystal-clear Indian Ocean at high speed.',
  priceUsd: 75,
  durationLabel: '15 or 60 min sessions',
  includes: [
    'Comprehensive safety briefing',
    'Clear boundary instructions',
    'Access to lagoon and surrounding reefs',
    'Professional instructor on standby',
  ],
  images: [LOCAL_IMAGES.boat, LOCAL_IMAGES.boat2, LOCAL_IMAGES.boat3],
};

export const MEDIA_PACKAGE = {
  id: 'media-package',
  title: 'Professional Media Content',
  description: 'Take home cinematic-quality content of your adventure. Our crew captures your trip using professional-grade equipment so you can relive every moment.',
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
    title: 'Dolphin Watching',
    subtitle: 'Spinner dolphins in their natural habitat',
    description: 'Experience the exhilaration of observing spinner dolphins in their natural habitat. Our captains know the exact spots where dolphins gather, giving you the best chance for an unforgettable encounter.',
    images: [LOCAL_IMAGES.dolphins, LOCAL_IMAGES.crewOnABoat],
    icon: 'Fish',
  },
  {
    id: 'snorkeling',
    title: 'Snorkeling with Stingrays',
    subtitle: 'Crystal-clear lagoon encounters',
    description: 'A safe and memorable encounter in crystal-clear lagoons. Explore vibrant coral gardens teeming with tropical fish, sea turtles, reef sharks, and stingrays. All snorkeling gear provided.',
    images: [LOCAL_IMAGES.snorkel, LOCAL_IMAGES.turtle, LOCAL_IMAGES.reef, LOCAL_IMAGES.snorkel2, LOCAL_IMAGES.mantas, LOCAL_IMAGES.turtle2, LOCAL_IMAGES.snorkel4],
    icon: 'Waves',
  },
  {
    id: 'sandbank',
    title: 'Sandbank Experience',
    subtitle: 'Powder-soft white sands',
    description: 'Visit a secluded sandbank featuring powder-soft white sands and shallow warm waters. The perfect spot for photos, swimming, and relaxation in paradise.',
    images: [LOCAL_IMAGES.sandbank, LOCAL_IMAGES.sandbank2, LOCAL_IMAGES.sandbank3, LOCAL_IMAGES.sandbank5, LOCAL_IMAGES.island],
    icon: 'Sun',
  },
  {
    id: 'island-visit',
    title: 'Local Island Visit',
    subtitle: 'Authentic Maldivian culture',
    description: 'Visit Himmafushi island, known for surf breaks and a relaxed atmosphere. Enjoy a Maldivian-style lunch and experience the local culture and community.',
    images: [LOCAL_IMAGES.island, LOCAL_IMAGES.boat, LOCAL_IMAGES.boat3],
    icon: 'MapPin',
  },
];

export function formatDurationHours(durationMin: number): string {
  const hours = durationMin / 60;
  return hours >= 1 ? `${hours} hour${hours !== 1 ? 's' : ''}` : `${durationMin} min`;
}

export const ACTIVITIES: Activity[] = [
  {
    id: MALDIVES_ADVENTURE_ID,
    title: 'South Ari Atoll Full-Day Adventure',
    subtitle: 'Dolphins, Sandbanks & Snorkeling Bliss',
    category: 'BOAT',
    durationMin: 480,
    priceFromUsd: 80,
    rating: 4.4,
    reviewCount: 1400,
    maxGuests: 12,
    minGuests: 1,
    skillLevel: 'all',
    isPrivate: false,
    media: [
      { type: 'image', uri: '', src: LOCAL_IMAGES.boat },
      { type: 'image', uri: '', src: LOCAL_IMAGES.dolphins },
      { type: 'image', uri: '', src: LOCAL_IMAGES.snorkel },
      { type: 'image', uri: '', src: LOCAL_IMAGES.sandbank },
      { type: 'image', uri: '', src: LOCAL_IMAGES.crewOnABoat },
      { type: 'image', uri: '', src: LOCAL_IMAGES.turtle },
      { type: 'image', uri: '', src: LOCAL_IMAGES.island },
    ],
    tags: ['Full Day', 'Dolphins', 'Snorkel', 'Sandbank', 'Island Visit', 'Lunch'],
    highlights: [
      'Watch wild spinner dolphins in their natural habitat',
      'Snorkel with stingrays in crystal-clear lagoons',
      'Visit Himmafushi island with Maldivian-style lunch',
      'Relax on a secluded sandbank with powder-soft white sands',
      'The must-do Maldives tour — four experiences in one day',
    ],
    whatYoullDo: [
      'Cruise to the dolphin channel for an exhilarating dolphin watching experience',
      'Snorkel with stingrays in safe, crystal-clear lagoons',
      'Visit Himmafushi island — known for surf breaks and relaxed local atmosphere',
      'Enjoy a Maldivian-style lunch on the island',
      'Relax on a secluded sandbank with powder-soft white sands and warm shallow waters',
    ],
    included: [
      'Full-day boat adventure',
      'Dolphin watching excursion',
      'Snorkeling with stingrays + all gear',
      'Local island visit (Himmafushi)',
      'Maldivian-style lunch',
      'Sandbank experience',
      'Complimentary water & soft drinks',
      'Experienced captain & crew',
    ],
    safety: ['Life jackets for all', 'Experienced crew', 'Weather-dependent departure'],
    meetingPoint: 'Hulhumalé — pickup available',
    socialProof: [
      { label: '4.4 rating from 1,400+ customers', type: 'popular' },
      { label: 'The must-do Maldives tour', type: 'popular' },
    ],
    bookingsThisWeek: 48,
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 'sunset-fishing',
    title: 'Maldivian Sunset Fishing Adventure',
    subtitle: 'Cast, Catch, and Cruise',
    category: 'FISHING',
    durationMin: 180,
    priceFromUsd: 60,
    rating: 4.6,
    reviewCount: 230,
    maxGuests: 10,
    minGuests: 2,
    skillLevel: 'all',
    isPrivate: false,
    media: [
      { type: 'image', uri: '', src: LOCAL_IMAGES.fishing },
      { type: 'image', uri: '', src: LOCAL_IMAGES.boat },
      { type: 'image', uri: '', src: LOCAL_IMAGES.boat3 },
      { type: 'image', uri: '', src: LOCAL_IMAGES.boat2 },
    ],
    tags: ['3 hours', 'Evening', 'Fishing', 'Sunset'],
    highlights: [
      'Traditional Maldivian hand-line fishing technique',
      'Trolling fishing for larger game fish',
      'Beautiful Maldivian sunset from the sea',
      'All fishing equipment provided',
    ],
    whatYoullDo: [
      'Board the boat and cruise to known fishing hot spots',
      'Try trolling fishing — a high-speed chase after larger game fish',
      'Experience traditional bottom line (hand-line) fishing favored by local fishermen',
      'Watch the stunning Maldivian sunset from the open sea',
      'Enjoy a peaceful evening cruise back',
    ],
    included: [
      'All fishing equipment',
      'Experienced fishing guides',
      'Complimentary drinking water & soft drinks',
      'Sandwich meal',
      'Boat transfer to fishing spots',
    ],
    safety: ['Life jackets provided', 'Experienced crew on board', 'Weather-dependent departure'],
    meetingPoint: 'Hulhumalé — pickup available',
    socialProof: [
      { label: 'Perfect ending to your day in paradise', type: 'popular' },
      { label: 'Beginner-friendly experience', type: 'recent' },
    ],
    bookingsThisWeek: 22,
    isTrending: true,
    isSunset: true,
  },
  {
    id: 'sunset-cruise',
    title: 'Maldivian Sunset Cruise',
    subtitle: 'Dolphin Search & Resort Sightseeing',
    category: 'BOAT',
    durationMin: 180,
    priceFromUsd: 50,
    rating: 4.7,
    reviewCount: 340,
    maxGuests: 12,
    minGuests: 2,
    skillLevel: 'all',
    isPrivate: false,
    media: [
      { type: 'image', uri: '', src: LOCAL_IMAGES.boat },
      { type: 'image', uri: '', src: LOCAL_IMAGES.dolphins },
      { type: 'image', uri: '', src: LOCAL_IMAGES.boat3 },
      { type: 'image', uri: '', src: LOCAL_IMAGES.island },
    ],
    tags: ['3 hours', 'Dolphins', 'Sunset', 'Romantic', 'Family-friendly'],
    highlights: [
      'Exhilarating dolphin search cruise',
      'Sightseeing of nearby island resorts from the water',
      'Fiery, breathtaking sunset colors',
      'The ultimate photo opportunity',
    ],
    whatYoullDo: [
      'Board in the late afternoon and cruise to dolphin gathering areas',
      'Search for pods of spinner dolphins in their natural habitat',
      'Enjoy leisurely sightseeing of nearby island resorts from the water',
      'Watch the stunning sunset paint the sky with fiery, breathtaking colors',
    ],
    included: [
      'Sunset cruise experience',
      'Dolphin search excursion',
      'Resort sightseeing',
      'Complimentary water & soft drinks',
      'Sandwiches',
    ],
    safety: ['Life jackets provided', 'Experienced captain', 'Weather-dependent departure'],
    meetingPoint: 'Hulhumalé — pickup available',
    socialProof: [
      { label: 'Most romantic excursion available', type: 'popular' },
      { label: 'Family-friendly adventure', type: 'recent' },
    ],
    bookingsThisWeek: 35,
    isFeatured: true,
    isTrending: true,
    isSunset: true,
  },
  {
    id: 'malahini-kuda-bandos',
    title: 'Malahini Kuda Bandos Day Visit',
    subtitle: 'Luxury Resort Day Pass',
    category: 'PRIVATE',
    durationMin: 480,
    priceFromUsd: 120,
    rating: 4.8,
    reviewCount: 185,
    maxGuests: 6,
    minGuests: 1,
    skillLevel: 'all',
    isPrivate: false,
    media: [
      { type: 'image', uri: '', src: LOCAL_IMAGES.island },
      { type: 'image', uri: '', src: LOCAL_IMAGES.sandbank },
      { type: 'image', uri: '', src: LOCAL_IMAGES.snorkel },
      { type: 'image', uri: '', src: LOCAL_IMAGES.reef },
    ],
    tags: ['Full Day', 'Resort', 'Buffet Lunch', 'Snorkeling', 'Beach'],
    highlights: [
      'Access to luxury island resort on Bandos Island',
      'Buffet lunch at Maaga restaurant — international & local cuisine',
      'White sand beaches & turquoise lagoon',
      'All transportation included',
    ],
    whatYoullDo: [
      'Enjoy a scenic boat ride from Malé to Bandos Island',
      'Relax on pristine white sand beaches with turquoise waters',
      'Savor a buffet lunch at Maaga, the resort\'s main restaurant, featuring international and local cuisine',
      'Spend the afternoon snorkeling in the lagoon, sunbathing, or swimming',
    ],
    included: [
      'Day pass to Malahini Kuda Bandos resort',
      'All transportation (scenic boat ride from Malé)',
      'Buffet lunch at Maaga restaurant',
      'Access to island beaches & lagoon',
      'Snorkeling in the lagoon',
    ],
    safety: ['Resort staff on site', 'Shallow lagoon waters', 'Sun protection recommended'],
    meetingPoint: 'Malé — boat transfer included',
    socialProof: [
      { label: 'Luxury experience without the price tag', type: 'popular' },
      { label: 'Perfect for a relaxing day', type: 'recent' },
    ],
    bookingsThisWeek: 18,
    isFeatured: true,
  },
  {
    id: 'maafushi-island',
    title: 'Maafushi Island Adventure Tour',
    subtitle: 'Sharks, Sandbanks & Local Charm',
    category: 'BOAT',
    durationMin: 480,
    priceFromUsd: 75,
    rating: 4.7,
    reviewCount: 420,
    maxGuests: 12,
    minGuests: 2,
    skillLevel: 'all',
    isPrivate: false,
    media: [
      { type: 'image', uri: '', src: LOCAL_IMAGES.snorkel },
      { type: 'image', uri: '', src: LOCAL_IMAGES.sandbank },
      { type: 'image', uri: '', src: LOCAL_IMAGES.dolphins },
      { type: 'image', uri: '', src: LOCAL_IMAGES.island },
      { type: 'image', uri: '', src: LOCAL_IMAGES.reef },
    ],
    tags: ['Full Day', 'Sharks', 'Sandbank', 'Dolphins', 'Island Tour'],
    highlights: [
      'Swim alongside gentle nurse sharks in their natural environment',
      '2+ hours on a pristine white sand sandbank',
      'Spinner dolphin cruise',
      '2-hour exploration of Maafushi Island with local shopping',
    ],
    whatYoullDo: [
      'Snorkel with gentle nurse sharks in a safe, exhilarating encounter',
      'Spend 2+ hours on a pristine sandbank surrounded by turquoise lagoon',
      'Cruise in search of spinner dolphins',
      'Explore Maafushi Island for 2 hours — shop for souvenirs and experience authentic Maldivian community',
    ],
    included: [
      'Full-day boat adventure',
      'Nurse shark snorkeling',
      'Sandbank visit (2+ hours)',
      'Dolphin cruise',
      'Maafushi Island exploration (2 hours)',
      'All snorkeling equipment',
      'Experienced guides',
    ],
    safety: ['Safe shark encounters supervised by guides', 'Life jackets provided', 'Weather-dependent departure'],
    meetingPoint: 'Hulhumalé — pickup available',
    socialProof: [
      { label: 'The best of Maldives in one trip', type: 'popular' },
      { label: 'Perfect blend of adventure & relaxation', type: 'recent' },
    ],
    bookingsThisWeek: 32,
    isTrending: true,
  },
  {
    id: 'kayak-rental',
    title: 'Kayak Rental',
    subtitle: 'Explore the Lagoon at Your Own Pace',
    category: 'WATERSPORT',
    durationMin: 60,
    priceFromUsd: 25,
    rating: 4.5,
    reviewCount: 95,
    maxGuests: 2,
    minGuests: 1,
    skillLevel: 'beginner',
    isPrivate: false,
    media: [
      { type: 'image', uri: '', src: LOCAL_IMAGES.lagoonBoat },
      { type: 'image', uri: '', src: LOCAL_IMAGES.island },
      { type: 'image', uri: '', src: LOCAL_IMAGES.sandbank },
    ],
    tags: ['1 hour', 'Beginner friendly', 'Flexible', 'Self-guided'],
    highlights: [
      'Paddle through calm, shallow waters',
      'Discover baby reef sharks and colorful fish',
      'Set your own pace and itinerary',
      'Great photography opportunities from the water',
    ],
    whatYoullDo: [
      'Collect your kayak and set out at your own pace',
      'Paddle through calm, shallow lagoon waters',
      'Discover underwater marine life including baby reef sharks and colorful fish',
      'Enjoy breathtaking scenery and photo opportunities from the water',
    ],
    included: [
      'Single or tandem kayak',
      'Life jacket',
      'Lagoon access',
      'Flexible time slots',
    ],
    safety: ['Calm lagoon waters', 'Life jacket provided', 'Stay within designated area'],
    meetingPoint: 'Hulhumalé lagoon center',
    socialProof: [
      { label: 'Relaxing and scenic', type: 'popular' },
      { label: 'Perfect for families', type: 'recent' },
    ],
    bookingsThisWeek: 15,
  },
  {
    id: 'jet-ski-rental',
    title: 'Jet Ski Rental',
    subtitle: 'High-Adrenaline Adventure',
    category: 'WATERSPORT',
    durationMin: 60,
    priceFromUsd: 75,
    rating: 4.8,
    reviewCount: 210,
    maxGuests: 2,
    minGuests: 1,
    skillLevel: 'beginner',
    isPrivate: false,
    media: [
      { type: 'image', uri: '', src: LOCAL_IMAGES.boat },
      { type: 'image', uri: '', src: LOCAL_IMAGES.boat2 },
      { type: 'image', uri: '', src: LOCAL_IMAGES.boat3 },
    ],
    tags: ['15 or 60 min', 'High-speed', 'Adrenaline', 'No experience needed'],
    highlights: [
      'Glide across the crystal-clear Indian Ocean at high speed',
      'Comprehensive safety briefing from instructors',
      '15-minute and 60-minute options available',
      'Fastest and most exciting way to explore the waters',
    ],
    whatYoullDo: [
      'Receive a comprehensive safety briefing from professional instructors',
      'Get clear boundary instructions before departure',
      'Ride across the crystal-clear Indian Ocean at exhilarating speeds',
      'Explore the lagoon and surrounding reefs from the water',
    ],
    included: [
      'Jet ski rental (15 or 60 min)',
      'Safety briefing & instruction',
      'Life jacket',
      'Instructor on standby',
    ],
    safety: ['Professional safety briefing', 'Clear boundaries set before ride', 'Instructor on standby'],
    meetingPoint: 'Hulhumalé water sports center',
    socialProof: [
      { label: 'Ride of your life', type: 'popular' },
      { label: 'Top-rated thrill activity', type: 'recent' },
    ],
    bookingsThisWeek: 28,
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
  const trending = ACTIVITIES.filter((a) => a.isTrending);
  const order = ['south-ari-atoll', 'sunset-cruise', 'maafushi-island', 'sunset-fishing', 'jet-ski-rental'];
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
    const startHours = activity.isSunset ? [16, 17, 18] : [9, 10, 11, 14, 15, 16, 17];

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

      const bookedBy: { label: string; airlineCode?: string }[] = [];
      if (bookedCount > 0) {
        bookedBy.push({ label: `${bookedCount} guest${bookedCount > 1 ? 's' : ''} booked` });
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
  WELCOME10: { discount: 0.1, label: 'Welcome Discount (10%)' },
  PARADISE10: { discount: 0.1, label: 'Paradise Welcome (10%)' },
  SUNSET15: { discount: 0.15, label: 'Sunset Special (15%)' },
};

export function applyPromoCode(code: string, price: number): { finalPrice: number; discount: number; label: string } | null {
  const promo = PROMO_CODES[code.toUpperCase()];
  if (!promo) return null;
  const discount = price * promo.discount;
  return { finalPrice: price - discount, discount, label: promo.label };
}
