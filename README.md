# Noty - React Native Boilerplate

A production-ready React Native boilerplate with authentication, payments, notifications, and cloud sync built-in.

## Tech Stack

- **Framework**: React Native + Expo
- **Styling**: NativeWind (TailwindCSS)
- **Navigation**: Expo Router (file-based)
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Payments**: RevenueCat
- **Language**: TypeScript

## Features

- Multi-method authentication (Email, Apple, Google)
- Subscription payments with RevenueCat
- Push notifications
- Cloud data sync
- Dark/light theming
- i18n (English, Spanish)
- 40+ reusable components

---

## Getting Started

### Prerequisites

- Node.js v20+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Supabase account (free tier works)
- RevenueCat account (free tier works)

---

## 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/ExpoStartup/noty.git
cd noty

# Use Node.js v20
nvm use 20

# Install dependencies
npm install --legacy-peer-deps

# Copy environment file
cp .env.example .env.local
```

---

## 2. Supabase Setup

### 2.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL** and **anon/public key** from Settings → API

### 2.2 Setup Options

You have two options to set up the database:

#### Option A: AI-Assisted Setup (Recommended)

Let Claude or Cursor handle the database setup automatically using Supabase MCP.

**For Claude Code:**
```bash
claude mcp add supabase --transport http "https://mcp.supabase.com/project/YOUR_PROJECT_ID"
```

**For Cursor:**
Add to your `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/project/YOUR_PROJECT_ID"
    }
  }
}
```

Then simply ask the AI to "set up the Noty database schema" and it will create all tables, RLS policies, triggers, and storage buckets for you.

See [Supabase MCP Documentation](https://supabase.com/docs/guides/getting-started/mcp) for more details.

#### Option B: Manual Setup

Follow sections 2.3 - 2.7 below to run the SQL manually.

---

### 2.3 Update Environment Variables

Edit `.env.local`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2.4 Create Database Tables (Manual Setup)

Run the following SQL in Supabase SQL Editor (Dashboard → SQL Editor → New Query):

```sql
-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  first_name text,
  last_name text,
  avatar_url text,
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Categories table
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notes table
create table public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  category_id uuid references public.categories on delete set null,
  title text,
  description text not null,
  color text,
  image_url text,
  pinned boolean default false,
  deleted_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User preferences table
create table public.user_preferences (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade unique not null,
  theme text default 'system',
  language text default 'en',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notification preferences table
create table public.notification_preferences (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade unique not null,
  note_reminders boolean default true,
  daily_summary boolean default false,
  pinned_notes_notifications boolean default true,
  smart_suggestions boolean default true,
  sync_notifications boolean default true,
  app_updates boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notifications table
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  title text not null,
  message text,
  notification_type text,
  icon_type text,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User subscriptions table (RevenueCat sync)
create table public.user_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  revenuecat_customer_id text,
  revenuecat_entitlement_id text,
  plan_type text,
  status text,
  price numeric,
  currency text,
  starts_at timestamp with time zone,
  expires_at timestamp with time zone,
  auto_renew boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 2.5 Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.notes enable row level security;
alter table public.user_preferences enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.notifications enable row level security;
alter table public.user_subscriptions enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Categories: users can CRUD their own categories
create policy "Users can view own categories" on public.categories
  for select using (auth.uid() = user_id);
create policy "Users can insert own categories" on public.categories
  for insert with check (auth.uid() = user_id);
create policy "Users can update own categories" on public.categories
  for update using (auth.uid() = user_id);
create policy "Users can delete own categories" on public.categories
  for delete using (auth.uid() = user_id);

-- Notes: users can CRUD their own notes
create policy "Users can view own notes" on public.notes
  for select using (auth.uid() = user_id);
create policy "Users can insert own notes" on public.notes
  for insert with check (auth.uid() = user_id);
create policy "Users can update own notes" on public.notes
  for update using (auth.uid() = user_id);
create policy "Users can delete own notes" on public.notes
  for delete using (auth.uid() = user_id);

-- User preferences: users can CRUD their own preferences
create policy "Users can view own preferences" on public.user_preferences
  for select using (auth.uid() = user_id);
create policy "Users can insert own preferences" on public.user_preferences
  for insert with check (auth.uid() = user_id);
create policy "Users can update own preferences" on public.user_preferences
  for update using (auth.uid() = user_id);

-- Notification preferences: users can CRUD their own notification preferences
create policy "Users can view own notification preferences" on public.notification_preferences
  for select using (auth.uid() = user_id);
create policy "Users can insert own notification preferences" on public.notification_preferences
  for insert with check (auth.uid() = user_id);
create policy "Users can update own notification preferences" on public.notification_preferences
  for update using (auth.uid() = user_id);

-- Notifications: users can view/update their own notifications
create policy "Users can view own notifications" on public.notifications
  for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications
  for update using (auth.uid() = user_id);

-- Subscriptions: users can view their own subscriptions
create policy "Users can view own subscriptions" on public.user_subscriptions
  for select using (auth.uid() = user_id);
```

### 2.6 Create Auto-Profile Trigger

This automatically creates a profile when a user signs up:

```sql
-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 2.7 Create Storage Bucket

1. Go to Storage in Supabase Dashboard
2. Create a new bucket called `avatars`
3. Make it **public** (for avatar URLs to work)
4. Add policy to allow authenticated users to upload:

```sql
-- Allow users to upload their own avatars
create policy "Users can upload avatars" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and
    auth.role() = 'authenticated'
  );

-- Allow public read access to avatars
create policy "Public avatar access" on storage.objects
  for select using (bucket_id = 'avatars');

-- Allow users to update/delete their own avatars
create policy "Users can update own avatars" on storage.objects
  for update using (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own avatars" on storage.objects
  for delete using (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 2.8 Enable Authentication Providers

Go to Authentication → Providers in Supabase Dashboard:

**Email (enabled by default)**
- Optionally disable "Confirm email" for faster testing

**Apple Sign-In**
1. Enable Apple provider
2. Add your Apple Services ID and Secret Key
3. See [Supabase Apple Auth Guide](https://supabase.com/docs/guides/auth/social-login/auth-apple)

**Google Sign-In**
1. Enable Google provider
2. Add your Google Client ID and Secret
3. See [Supabase Google Auth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)

---

## 3. RevenueCat Setup

### 3.1 Create RevenueCat Account

1. Go to [revenuecat.com](https://www.revenuecat.com) and create an account
2. Create a new project

### 3.2 Configure App Store / Play Store

**For iOS:**
1. Add your app in RevenueCat (App Store Connect)
2. Create products in App Store Connect:
   - `monthly` - $4.99/month subscription
   - `yearly` - $29.99/year subscription
   - `lifetime` - $79.99 one-time purchase
3. Add these products to RevenueCat

**For Android:**
1. Add your app in RevenueCat (Google Play Console)
2. Create matching products in Google Play Console
3. Add these products to RevenueCat

### 3.3 Create Entitlement

1. In RevenueCat, go to Entitlements
2. Create an entitlement called `Noty Pro`
3. Attach all your products to this entitlement

### 3.4 Create Offering

1. Go to Offerings
2. Create a "default" offering
3. Add packages: Monthly, Yearly, Lifetime

### 3.5 Update API Key

Edit `app/contexts/RevenueCatContext.tsx`:

```typescript
const REVENUECAT_API_KEY = 'your_revenuecat_public_api_key';
```

> **Note**: The app works in Expo Go with mock purchases for testing. Real purchases require a development build.

---

## 4. App Configuration

### 4.1 Update app.json

Edit `app.json` with your app details:

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp"
    },
    "android": {
      "package": "com.yourcompany.yourapp"
    }
  }
}
```

### 4.2 Update App Icons

Replace these files with your own:
- `assets/icon.png` (1024x1024)
- `assets/adaptive-icon.png` (1024x1024)
- `assets/splash.png` (1284x2778)
- `assets/favicon.png` (48x48)

---

## 5. Run the App

```bash
# Start Expo dev server
npx expo start -c

# Press 'i' for iOS Simulator
# Press 'a' for Android Emulator
# Scan QR code with Expo Go app for physical device
```

### Testing in Expo Go

The app works in Expo Go with these limitations:
- RevenueCat uses mock purchases (no real charges)
- Push notifications show as alerts instead of native notifications
- Apple Sign-In requires a development build

### Development Build (Recommended for Production Testing)

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure your project
eas build:configure

# Create development build
eas build --profile development --platform ios
# or
eas build --profile development --platform android
```

---

## 6. Project Structure

```
├── app/
│   ├── (drawer)/           # Drawer navigation
│   │   └── (tabs)/         # Tab navigation
│   ├── contexts/           # React contexts (Auth, Notes, RevenueCat, etc.)
│   ├── hooks/              # Custom hooks
│   ├── locales/            # i18n translation files
│   └── screens/            # Screen components
├── components/             # Reusable UI components
├── lib/                    # Supabase client & types
├── utils/                  # Utility functions
└── assets/                 # Images, fonts, etc.
```

---

## 7. Customization

### Theming

Edit `tailwind.config.js` to customize colors:

```javascript
theme: {
  extend: {
    colors: {
      highlight: '#6366f1', // Primary brand color
      // ... other colors
    }
  }
}
```

### Adding Languages

1. Create new translation file in `app/locales/` (e.g., `fr.json`)
2. Add language option in `app/contexts/LanguageContext.tsx`

---

## 8. Deployment

### Build for App Stores

```bash
# Production build for iOS
eas build --platform ios --profile production

# Production build for Android
eas build --platform android --profile production

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## Demo Flow for Investors

**audiFoil** is a premium e-foil booking app for the Maldives. Here's the investor demo flow:

### Quick Demo (2 minutes)

1. **Launch & Browse Arrivals**
   - Open app → tap "Check Arrivals" 
   - View MLE (Malé) flight arrivals with real airline data
   - Search/filter by airline or origin city

2. **Select Flight & Book Slot**
   - Tap any flight (e.g., Emirates EK656)
   - See available 45-min e-foil sessions with crew badges
   - Note "Popular" slots showing other airline crews booked
   - Select a time slot → Continue to Checkout

3. **Complete Mock Payment**
   - Enter contact details (pre-filled for demo)
   - Apply promo code `CREW25` for 25% crew discount
   - Tap "Pay with Apple Pay" → Face ID animation → Success!
   - View confirmation with booking code

### Key Features to Highlight

- **Social Proof**: Slots show which airline crews are booked (anonymized)
- **Crew Discount**: `CREW25` promo code gives 25% off
- **Deterministic Demo**: Same flights and slots every time
- **No Backend Required**: All mock data, works offline
- **Premium Polish**: Smooth animations, skeleton loaders, Apple Pay UX

### Mock Data Details

- 10 international flights from DXB, AUH, CMB, BOM, IST, ZRH, DOH, SHJ
- Sessions start 1 hour after flight arrival
- 45-minute sessions, $150 each ($112.50 with crew discount)
- Airline badge colors match real airline branding

---

## Support

For questions or issues, contact [maldives@audifoil.com](mailto:maldives@audifoil.com)

## License

This template is licensed for use in your own projects. See LICENSE file for details.
