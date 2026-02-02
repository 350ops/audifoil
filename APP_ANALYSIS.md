# foilTribe Adventures App - Complete Analysis for Claude Code

## Overview

**foilTribe Adventures** is a premium e-foil (electric hydrofoil) booking app for the Maldives. It allows airline crew and travelers landing at Malé International Airport (MLE) to book 45-minute Audi e-foil sessions in the lagoon.

**Primary Use Case**: After landing in Malé, users select their flight from the arrivals list, pick an available time slot (starting 1 hour after arrival), and complete a mock Apple Pay checkout.

---

## Tech Stack

### Core Framework
- **Expo SDK 54** (`expo: ~54.0.32`)
- **React Native 0.81.5** with New Architecture enabled
- **React 19.1.0**
- **TypeScript 5.9.2**

### Navigation
- **Expo Router 6.0.22** - File-based routing
- **React Navigation 7.x** - Bottom tabs, drawer navigation
- Native tabs attempted with `expo-router/unstable-native-tabs`

### Styling
- **NativeWind 4.2.1** - TailwindCSS for React Native
- **TailwindCSS 3.3.2**
- CSS variables for theming (light/dark mode)

### State Management
- **Zustand 5.0.11** - Global state for demo user, flights, slots, bookings
- **React Context API** - Auth, theme, language, notifications

### Backend (Mock)
- **Supabase** - Configured but using mock data for demo
- **AsyncStorage** - Local persistence for bookings

### UI Libraries
- **Lucide React Native** - Icon system
- **React Native Reanimated 4.1** - Animations
- **Expo Linear Gradient** - Gradient backgrounds
- **React Native Actions Sheet** - Bottom sheets
- **Lottie React Native** - Lottie animations

### Additional Features
- **RevenueCat** - Payment/subscription infrastructure (mock)
- **Expo Notifications** - Push notifications
- **Expo Apple Authentication** - Sign in with Apple (bypassed for demo)

---

## Project Structure

```
/app
├── _layout.tsx              # Root layout with providers
├── index.tsx                # Entry redirect to welcome
├── [...404].tsx             # 404 fallback
├── locales/                 # i18n (en.json, es.json)
│   ├── en.json
│   └── es.json
├── (drawer)/                # Drawer navigation group
│   ├── _layout.tsx          # Drawer layout
│   └── (tabs)/              # Tab navigation group
│       ├── _layout.tsx      # NativeTabs layout (3 tabs)
│       ├── index.tsx        # Home screen
│       ├── arrivals.tsx     # MLE flight arrivals list
│       └── profile.tsx      # User profile
└── screens/                 # Stack screens
    ├── welcome.tsx          # Onboarding/login
    ├── flight-detail.tsx    # Slot selection for a flight
    ├── checkout.tsx         # Booking form + Apple Pay
    ├── success.tsx          # Booking confirmation
    ├── my-bookings.tsx      # User's bookings list
    ├── how-it-works.tsx     # Feature explanation
    ├── settings.tsx         # App settings
    ├── subscription.tsx     # Premium subscription
    ├── booking.tsx          # (Legacy) old booking screen
    ├── confirmation.tsx     # (Legacy) old confirmation
    └── components/          # Component demos
        └── *.tsx            # Individual component examples

/components
├── forms/                   # Form components
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── DatePicker.tsx
│   ├── Switch.tsx
│   └── Selectable.tsx
├── layout/                  # Layout helpers
│   ├── Section.tsx
│   ├── Divider.tsx
│   ├── List.tsx
│   └── ListItem.tsx
├── AirlineLogo.tsx          # Airline logo with fallback
├── AnimatedView.tsx         # Animated wrapper
├── Avatar.tsx               # User avatar
├── Button.tsx               # Primary button
├── Card.tsx                 # Content card
├── CardScroller.tsx         # Horizontal card scroller
├── Chip.tsx                 # Filter chips
├── Expandable.tsx           # Accordion/FAQ
├── Header.tsx               # Screen header
├── Icon.tsx                 # Lucide icon wrapper
├── ImageCarousel.tsx        # Image slider
├── ListLink.tsx             # Settings list item
├── MultiStep.tsx            # Wizard/onboarding
├── ProgressBar.tsx          # Progress indicator
├── Review.tsx               # Star rating review
├── SkeletonCard.tsx         # Loading skeletons
├── ThemedText.tsx           # Theme-aware text
├── ThemedScroller.tsx       # Scrollable container
└── ThemeToggle.tsx          # Dark/light toggle

/data                        # Mock data module
├── types.ts                 # TypeScript interfaces
├── flights.ts               # MLE arrivals (10 flights)
├── slots.ts                 # Slot generation logic
├── bookings.ts              # Booking CRUD + AsyncStorage
├── airlineLogos.ts          # Airline code → logo mapping
└── index.ts                 # Barrel exports

/store
├── useStore.ts              # Zustand global store
└── index.ts                 # Export

/contexts                    # React Context providers
├── AuthContext.tsx          # User auth state
├── ThemeContext.tsx         # Light/dark theme
├── ThemeColors.tsx          # useThemeColors() hook
├── LanguageContext.tsx      # i18n
├── EfoilContext.tsx         # (Legacy) old e-foil state
├── NotesContext.tsx         # (Legacy) notes app state
├── DrawerContext.tsx        # Drawer open state
└── RevenueCatContext.tsx    # Payment subscriptions

/utils
├── color-theme.ts           # NativeWind CSS variables
├── useShadow.ts             # Shadow presets
├── date.ts                  # Date utilities
└── BackHandlerManager.tsx   # Android back handler

/hooks
├── useTranslation.ts        # i18n hook
├── useThemedNavigation.tsx  # Navigation theming
├── useCollapsibleHeader.ts  # Collapsible header
└── useNotifications.ts      # Push notifications
```

---

## Theme System

### Colors (Tailwind CSS Variables)
```typescript
// Light Mode
background: '#F8FAFB'    // Off-white paradise
secondary: '#ffffff'     // Card backgrounds
text: '#1A1A1A'          // Carbon black
highlight: '#0077B6'     // Deep ocean blue
border: 'rgba(0,0,0,0.08)'
primary: '#1A1A1A'       // Black
invert: '#ffffff'        // White

// Dark Mode
background: '#0A1218'    // Deep ocean night
secondary: '#1E2A32'     // Ocean dark card
text: '#ffffff'          // White
highlight: '#00A6F4'     // Bright ocean blue
border: 'rgba(255,255,255,0.1)'
primary: '#ffffff'       // White
invert: '#0A0A0A'        // Deep black
```

### Usage Rules
- **ALWAYS** use `ThemedText` for text (not raw `Text`)
- **ALWAYS** use theme colors (`bg-background`, `bg-secondary`, etc.)
- **NEVER** hardcode colors like `#ffffff` or `rgb()`
- Use `useThemeColors()` hook for JS color values (icons, charts)
- Use `opacity-60` for subdued/secondary text

---

## Navigation Structure

### Bottom Tabs (NativeTabs)
1. **Home** (`index.tsx`) - Welcome, quick stats, CTA banners
2. **Arrivals** (`arrivals.tsx`) - Flight list with search/filter
3. **Profile** (`profile.tsx`) - User settings, subscription

### Drawer Menu
- My Bookings
- How it Works
- Settings
- Help

### Main User Flow
```
Welcome → Home → Arrivals → Flight Detail → Checkout → Success → My Bookings
```

---

## Mock Data

### Flights (10 MLE Arrivals)
```typescript
07:15 Flydubai FZ1025 from Dubai (DXB)
07:25 Etihad EY372 from Abu Dhabi (AUH)
07:30 FitsAir 8D921 from Colombo (CMB)
07:30 IndiGo 6E1131 from Mumbai (BOM)
07:35 Emirates EK656 from Dubai (DXB)
07:45 Turkish Airlines TK740 from Istanbul (IST)
07:50 Edelweiss WK66 from Zurich (ZRH)
07:50 Qatar Airways QR676 from Doha (DOH)
08:10 Air Arabia G993 from Sharjah (SHJ)
08:15 SriLankan UL101 from Colombo (CMB)
```

### Slot Generation
- 45-minute sessions
- Start 60 minutes after flight arrival
- 60-minute intervals between slots
- 6-8 slots per flight
- Deterministic peer badges (shows other airlines booked)

### Airline Logos
Real logos available for: Emirates, Etihad, Flydubai, IndiGo, Qatar Airways, Turkish Airlines, SriLankan, Air Arabia. Others fallback to colored circles with airline code.

---

## Key Screens

### Home (`index.tsx`)
- Hero section with e-foil image
- Quick stats (Today's Arrivals, Available Slots)
- "Ready to Fly?" CTA banner
- "How it Works" 4-step guide
- Upcoming arrivals preview

### Arrivals (`arrivals.tsx`)
- Search input (airline, flight number)
- Status filter chips (All, On time, Landed, Delayed)
- Flight cards with:
  - Airline logo
  - Flight number + airline name
  - Origin city and code
  - Arrival time
  - Status badge
  - Available slots count
- Skeleton loaders during load

### Flight Detail (`flight-detail.tsx`)
- Flight summary card at top
- Session info (45 min, $150/session)
- 2-column grid of time slots
- Each slot shows:
  - Time range
  - Availability status
  - Peer badges (other airlines)
  - "+N more" indicator
- Sticky "Continue to Checkout" button

### Checkout (`checkout.tsx`)
- Booking summary card
- Contact form (Name, Email, WhatsApp)
- Promo code input (CREW25 for 25% off)
- Price breakdown
- Official Apple Pay button image
- Mock payment flow:
  - Face ID animation
  - Processing spinner
  - Success checkmark

### Success (`success.tsx`)
- Animated checkmark
- Confirmation code
- Booking details card
- Next Steps list
- Share booking button
- "Book Another" / "View Bookings" CTAs

### Profile (`profile.tsx`)
- User avatar and name
- Subscription upsell card
- Settings links (Account, Billing, Edit Profile, Help, Logout)

---

## Known Issues & Improvement Areas

### UI/UX Issues
1. **Legacy screens**: `booking.tsx`, `confirmation.tsx` use old `EfoilContext` - should migrate to Zustand
2. **Inconsistent spacing**: Some screens use different padding conventions
3. **Missing skeleton loaders**: Some screens lack loading states
4. **Drawer not accessible**: Removed from tab bar when switching to NativeTabs
5. **Overlap issues**: Some screens have header/content overlap on certain devices

### Code Quality
1. **Unused imports**: Several files have unused imports
2. **Mixed quote styles**: Some files use single quotes, others double quotes
3. **Inconsistent formatting**: ESLint/Prettier not fully enforced
4. **Dead code**: `NotesContext`, `NoteItem`, note-related screens are from original boilerplate

### Native Components Opportunities (Expo SDK 54)
1. **Native Tabs**: Currently using `NativeTabs` from `expo-router/unstable-native-tabs`
2. **Native Stack headers**: Could use more native header configurations
3. **SF Symbols**: Using SF Symbols for iOS icons in tabs
4. **Haptic feedback**: Limited use of `expo-haptics`
5. **Native modals**: Could use native modal presentations

---

## Recommendations for Claude Code

### Priority 1: Clean Up
1. Remove all legacy "Noty" references (notes app code)
2. Delete unused screens: `note-detail.tsx`, `note-edit.tsx`, `NotesContext`
3. Migrate `booking.tsx` and `confirmation.tsx` to use Zustand store
4. Fix all ESLint/Prettier warnings
5. Remove unused imports and dead code

### Priority 2: UI Polish
1. Add consistent skeleton loaders to all data-loading screens
2. Standardize spacing and padding (`px-global`, `py-4`, etc.)
3. Add haptic feedback to buttons and selections
4. Improve animations (entrance, transitions)
5. Add pull-to-refresh where appropriate

### Priority 3: Native Components
1. Use native Stack headers with `expo-router`
2. Implement native modals for dialogs
3. Add keyboard avoiding views to forms
4. Use native date/time pickers where applicable
5. Implement proper safe area handling

### Priority 4: UX Improvements
1. Add confirmation dialogs for destructive actions
2. Improve form validation with inline errors
3. Add loading states to all async operations
4. Implement proper error handling with user feedback
5. Add empty states with helpful CTAs

### Priority 5: Code Architecture
1. Create a `/features` folder for feature-specific code
2. Consolidate duplicate components
3. Create a design system documentation
4. Add TypeScript strict mode
5. Implement proper error boundaries

---

## Commands

```bash
# Start development server
npx expo start -c

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Lint and format
npm run lint
npm run format

# Create native builds
npx expo prebuild
```

---

## Important Files for Analysis

1. **Entry Points**:
   - `app/_layout.tsx` - Root providers
   - `app/(drawer)/(tabs)/_layout.tsx` - Tab configuration
   
2. **Core Screens**:
   - `app/(drawer)/(tabs)/index.tsx` - Home
   - `app/(drawer)/(tabs)/arrivals.tsx` - Arrivals
   - `app/screens/flight-detail.tsx` - Slot selection
   - `app/screens/checkout.tsx` - Payment
   - `app/screens/success.tsx` - Confirmation

3. **State & Data**:
   - `store/useStore.ts` - Zustand store
   - `data/types.ts` - Type definitions
   - `data/flights.ts` - Mock flight data
   - `data/slots.ts` - Slot generation

4. **Styling**:
   - `tailwind.config.js` - Tailwind config
   - `utils/color-theme.ts` - Theme colors
   - `global.css` - Global styles

5. **Components**:
   - `components/AirlineLogo.tsx` - Logo rendering
   - `components/Header.tsx` - Screen headers
   - `components/Card.tsx` - Content cards
   - `components/Button.tsx` - Primary button

---

## Contact

- **App Name**: foilTribe Adventures
- **Support Email**: maldives@foilTribe Adventures.com
- **GitHub**: https://github.com/350ops/foilTribe Adventures
