# Refactoring Plan: Premium Maldives Experiences Marketplace

## Overview

Transform the app from a general activities marketplace into a **premium, media-first, group-fill pricing** Maldives experiences platform for airline crew and travelers.

---

## Key Changes Summary

### 1. Data Model Changes (`/data/activities.ts`)
- [x] Add `seatPriceFromUsd` (per-seat share price) - PRIMARY display
- [x] Rename `priceFromUsd` to `boatTotalUsd` (show in small print)
- [x] Add `capacity` (max seats, e.g., 5)
- [x] Add `minToRun` (minimum profitable seats, e.g., 4)
- [x] Update `ActivitySlot` to include:
  - `seatsFilled` (current bookings)
  - `capacity` (max)
  - `status`: 'filling' | 'confirmed' | 'almost_full' | 'full'
  - `airlineBadges`: string[] (anonymized airline codes)
- [x] Add E-Foil as upsell option with `canAddEfoil` flag

### 2. Navigation Updates
- [x] Tab labels: Explore → Activities → Bookings → Crew
- [x] Drawer menu: Explore, Activities, Bookings, How it works, Safety & FAQs, Settings, Crew Shortcut
- [x] Crew tab remains but styled as secondary (smaller icon/opacity)

### 3. Explore Screen (`/(tabs)/index.tsx`)
- [x] Hero carousel with media-first design
- [x] Update cards to show "From $X / seat" prominently
- [x] Add social proof: "3/5 seats filled", "Booked by 3 crews today"
- [x] Sections: Trending now, Sunset experiences, Water sports, Private charters
- [x] "Join the Crew" banner links to group-fill concept

### 4. Activities Screen (`/(tabs)/activities.tsx`)
- [x] Filter chips: All, Boat, Snorkel, Fishing, E-Foil
- [x] Sort options: Popular, Price, Duration
- [x] Premium grid layout with per-seat pricing
- [x] Social proof on each card

### 5. Activity Detail Screen (`/screens/activity-detail.tsx`)
- [x] Top: Media gallery (already exists)
- [x] Per-seat pricing prominent
- [x] Boat total in small expandable info
- [x] **Next available trips section** with group-fill status:
  - "3/5 seats filled" progress bar
  - Airline badges
  - "Starts at 14:30"
- [x] Sticky CTA: "Select time" / "Join this trip"

### 6. Select Time Screen (`/screens/select-time.tsx`)
- [x] Show seats filled bar + count for each slot
- [x] "X people joining" label
- [x] Airline badges (anonymized)
- [x] Status indicators: filling, confirmed, almost full
- [x] If <4 seats: "Almost there — we'll confirm once 4 seats are filled"
- [x] Fallback options when close to departure and <4:
  - "Upgrade to private" (shows private total)
  - Alternate time options

### 7. Checkout Screen (`/screens/activity-checkout.tsx`)
- [x] Show booking summary:
  - Activity name
  - Chosen time slot
  - Seats (1 by default)
  - Price per seat + total
- [x] E-Foil upsell: "Add Audi E-Foil (+$50)" with description
- [x] Mock Apple Pay button
- [x] Bottom sheet modal with FaceID animation
- [x] "Processing…" then success check

### 8. Crew Screen (`/(tabs)/crew.tsx`)
- [x] Keep similar to MLE Arrivals concept
- [x] Selecting flight → recommended experiences
- [x] Sessions start 1 hour after landing
- [x] Social proof on flight cards
- [x] Style as secondary shortcut (not dominant)

### 9. Component Updates

#### New Components Needed:
- [x] `GroupFillBar` - Visual progress of seats filled
- [x] `AirlineBadges` - Row of airline logos/codes
- [x] `SeatPriceDisplay` - "From $X / seat" with small total
- [x] `ApplePayButton` - Mock Apple Pay styling
- [x] `FaceIDModal` - Payment confirmation animation

#### Existing Components to Update:
- [x] `Card` - Add per-seat price display option
- [x] Activity slot cards - Add group-fill UI

### 10. UI/UX Polish
- [x] Consistent spacing and shadows
- [x] Text contrast on images (gradient overlays)
- [x] Skeleton loading (400-700ms simulated delay)
- [x] FlatList with memoized renderItem
- [x] Remove any "notes" terminology

---

## Mock Data Updates

### Activities (6 MVP)
1. **Safari Boat Cruise** - $80/seat, $350 boat total, 5 capacity
2. **Snorkeling Reef Lagoon** - $60/seat, 5h or 90m versions
3. **Sunset Fishing** - $70/seat, $300 total, 5 capacity
4. **Audi E-Foil Session** - $150 standalone, $50 add-on
5. **Private Sandbank Picnic** - $450 private (no per-seat)
6. **Dolphin Discovery Cruise** - $40/seat, larger capacity

### Trip Slots
- Each activity generates 4-6 daily slots
- Each slot has:
  - Random seats filled (0-4 for demo)
  - Random airline badges (Qatar, Emirates, Turkish, Singapore, Etihad)
  - Status based on fill level

---

## Implementation Order

1. ✅ Update data types and mock data
2. ✅ Create new components (GroupFillBar, AirlineBadges, etc.)
3. ✅ Update Explore screen
4. ✅ Update Activities screen
5. ✅ Update Activity Detail screen
6. ✅ Update Select Time screen
7. ✅ Update Checkout screen (with Apple Pay mock)
8. ✅ Update Crew screen (make secondary)
9. ✅ Update navigation labels
10. ✅ Final polish and testing

---

## Files to Modify

### Data Layer
- `/data/activities.ts` - Complete rewrite with new model
- `/store/useStore.ts` - Update slot generation, add seat selection

### Screens
- `/app/(drawer)/(tabs)/index.tsx` - Explore (major update)
- `/app/(drawer)/(tabs)/activities.tsx` - Activities catalog
- `/app/(drawer)/(tabs)/bookings.tsx` - Minor updates
- `/app/(drawer)/(tabs)/crew.tsx` - Restyle as secondary
- `/app/screens/activity-detail.tsx` - Group-fill UI
- `/app/screens/select-time.tsx` - Slot selection with fill status
- `/app/screens/activity-checkout.tsx` - Apple Pay mock

### Components
- New: `GroupFillBar.tsx`, `AirlineBadges.tsx`, `SeatPriceDisplay.tsx`
- New: `ApplePayButton.tsx`, `PaymentModal.tsx`

### Navigation
- `/app/(drawer)/(tabs)/_layout.tsx` - Tab labels
- `/components/CustomDrawerContent.tsx` - Drawer menu

---

## Copy Guidelines

- "From $80 / seat"
- "3/5 seats filled — Qatar + Emirates crew"
- "Almost there — confirms at 4 seats"
- "Upgrade to private boat (optional)"
- "Share a trip", "pay per seat", "join other crews"
- Premium tone, no discount language
