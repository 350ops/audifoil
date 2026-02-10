-- Trips & Bookings Schema for Audifoil
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Activities table (catalog of available experiences)
create table if not exists public.activities (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null, -- e.g., 'maldives-adventure', 'efoil-session'
  title text not null,
  subtitle text,
  category text not null, -- EFOIL, BOAT, SNORKEL, FISHING, PRIVATE
  duration_min integer not null,
  price_usd numeric(10,2) not null,
  max_guests integer not null default 6,
  min_guests integer not null default 1,
  is_private boolean default false,
  skill_level text default 'all', -- beginner, intermediate, advanced, all
  media jsonb default '[]'::jsonb, -- array of {type, uri, localSource}
  tags text[] default '{}',
  highlights text[] default '{}',
  what_youll_do text[] default '{}',
  included text[] default '{}',
  safety text[] default '{}',
  meeting_point text,
  is_featured boolean default false,
  is_trending boolean default false,
  is_sunset boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trips table (scheduled departures for an activity on a specific date/time)
create table if not exists public.trips (
  id uuid default gen_random_uuid() primary key,
  activity_id uuid references public.activities on delete cascade not null,
  trip_date date not null,
  start_time time not null,
  end_time time not null,
  max_capacity integer not null default 6,
  booked_count integer not null default 0,
  status text not null default 'scheduled', -- scheduled, full, cancelled, completed
  notes text, -- optional notes for this specific trip
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure no duplicate trips for same activity/date/time
  unique(activity_id, trip_date, start_time)
);

-- Bookings table (user reservations on a trip)
create table if not exists public.bookings (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references public.trips on delete cascade not null,
  user_id uuid references public.profiles on delete set null, -- nullable for guest bookings
  confirmation_code text unique not null,
  guest_count integer not null default 1,
  total_price numeric(10,2) not null,
  status text not null default 'confirmed', -- confirmed, pending, completed, cancelled
  user_name text not null,
  user_email text,
  user_whatsapp text,
  airline_code text, -- e.g., 'EK' for Emirates crew
  promo_code text,
  discount_amount numeric(10,2) default 0,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ============================================

alter table public.activities enable row level security;
alter table public.trips enable row level security;
alter table public.bookings enable row level security;

-- ============================================
-- 3. CREATE RLS POLICIES
-- ============================================

-- Activities: anyone can read (public catalog)
create policy "Activities are viewable by everyone" on public.activities
  for select using (true);

-- Trips: anyone can read (public schedule)
create policy "Trips are viewable by everyone" on public.trips
  for select using (true);

-- Trips: authenticated users can create trips (on-demand creation)
create policy "Authenticated users can create trips" on public.trips
  for insert with check (auth.role() = 'authenticated' or auth.role() = 'anon');

-- Trips: allow updates to booked_count (for triggers and booking flow)
create policy "Allow trip updates" on public.trips
  for update using (true);

-- Bookings: users can view their own bookings
create policy "Users can view own bookings" on public.bookings
  for select using (auth.uid() = user_id or user_id is null);

-- Bookings: anyone can create bookings (guest checkout supported)
create policy "Anyone can create bookings" on public.bookings
  for insert with check (true);

-- Bookings: users can update their own bookings
create policy "Users can update own bookings" on public.bookings
  for update using (auth.uid() = user_id);

-- ============================================
-- 4. CREATE FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update booked_count on trips when bookings change
create or replace function public.update_trip_booked_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.trips
    set booked_count = booked_count + NEW.guest_count,
        status = case
          when booked_count + NEW.guest_count >= max_capacity then 'full'
          else status
        end,
        updated_at = now()
    where id = NEW.trip_id;
    return NEW;
  elsif TG_OP = 'UPDATE' then
    -- Adjust for changed guest count
    update public.trips
    set booked_count = booked_count - OLD.guest_count + NEW.guest_count,
        status = case
          when booked_count - OLD.guest_count + NEW.guest_count >= max_capacity then 'full'
          when booked_count - OLD.guest_count + NEW.guest_count < max_capacity then 'scheduled'
          else status
        end,
        updated_at = now()
    where id = NEW.trip_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update public.trips
    set booked_count = greatest(0, booked_count - OLD.guest_count),
        status = case
          when booked_count - OLD.guest_count < max_capacity then 'scheduled'
          else status
        end,
        updated_at = now()
    where id = OLD.trip_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if exists (for idempotency)
drop trigger if exists on_booking_change on public.bookings;

-- Trigger on bookings table
create trigger on_booking_change
  after insert or update or delete on public.bookings
  for each row execute procedure public.update_trip_booked_count();

-- Function to generate confirmation code
create or replace function public.generate_confirmation_code()
returns trigger as $$
begin
  if NEW.confirmation_code is null or NEW.confirmation_code = '' then
    NEW.confirmation_code := 'AF' || upper(substring(md5(random()::text) from 1 for 6));
  end if;
  return NEW;
end;
$$ language plpgsql;

-- Drop existing trigger if exists
drop trigger if exists set_confirmation_code on public.bookings;

-- Trigger to auto-generate confirmation code
create trigger set_confirmation_code
  before insert on public.bookings
  for each row execute procedure public.generate_confirmation_code();

-- ============================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- ============================================

create index if not exists idx_trips_activity_id on public.trips(activity_id);
create index if not exists idx_trips_date on public.trips(trip_date);
create index if not exists idx_trips_activity_date on public.trips(activity_id, trip_date);
create index if not exists idx_trips_status on public.trips(status) where status = 'scheduled';
create index if not exists idx_bookings_trip_id on public.bookings(trip_id);
create index if not exists idx_bookings_user_id on public.bookings(user_id);
create index if not exists idx_bookings_confirmation on public.bookings(confirmation_code);
create index if not exists idx_activities_slug on public.activities(slug);
create index if not exists idx_activities_category on public.activities(category);

-- ============================================
-- 6. SEED ACTIVITIES DATA
-- ============================================

-- Insert the main activities (matching the app's static data)
insert into public.activities (slug, title, subtitle, category, duration_min, price_usd, max_guests, min_guests, is_private, skill_level, tags, highlights, what_youll_do, included, safety, meeting_point, is_featured, is_trending, is_sunset)
values
  (
    'maldives-adventure',
    'Maldives Adventure',
    'The ultimate day on the water',
    'BOAT',
    300,
    80,
    6,
    1,
    false,
    'all',
    array['5 hours', 'Dolphins', 'Snorkel', 'Sandbank', 'Sunset'],
    array['Swim with dolphins in the wild', 'Reef sharks & tropical fish while snorkelling', 'Pristine sandbank stop', 'Picnic lunch onboard', 'Golden-hour sunsets', 'All gear & hotel pickup included'],
    array['Cruise to dolphin territory and swim alongside spinner dolphins', 'Snorkel vibrant reefs with reef sharks and tropical fish', 'Stop at a picture-perfect sandbank for photos and swimming', 'Enjoy a picnic lunch on board with ocean views', 'End the day with golden-hour sunsets over the Indian Ocean'],
    array['5-hour cruise (3h option available)', 'Snorkelling gear & instruction', 'Picnic lunch & refreshments', 'Hotel pickup & drop-off', 'Professional captain & crew', 'All safety equipment'],
    array['Life jackets for all', 'Experienced crew', 'Weather-dependent departure'],
    'Malé Harbor — hotel pickup available',
    true,
    true,
    false
  ),
  (
    'efoil-session',
    'Audi E-Foil Experience',
    '2 hours in an idyllic turquoise lagoon',
    'EFOIL',
    120,
    280,
    1,
    1,
    true,
    'beginner',
    array['2 hours', 'Private', 'Instructor', 'Drone & 360'],
    array['Private instructor for the full session', 'Boat transfer to idyllic turquoise lagoon', 'Drone footage of your ride', '360° camera attached to the board — keep all footage'],
    array['Boat transfer to a secluded turquoise lagoon', 'Learn to fly on the Audi e-foil with your private instructor', 'Get professional drone footage and 360° camera footage from the board', 'Take home all your footage as part of the experience'],
    array['2-hour private session', 'Boat transfer to lagoon', 'Private instructor', 'Drone aerial footage', 'GoPro 360 camera on board — all footage included', 'All safety equipment & wetsuit'],
    array['Life jacket required at all times', 'Instructor stays with you', 'Calm lagoon only'],
    'Malé Lagoon Dock — boat to lagoon',
    true,
    true,
    false
  ),
  (
    'sunset-cruise',
    'Sunset Dhoni Cruise',
    'Traditional boat, champagne, stunning views',
    'BOAT',
    120,
    300,
    6,
    2,
    false,
    'all',
    array['2 hours', '2-8 guests', 'Sunset', 'Drinks included'],
    array['Traditional Maldivian dhoni boat', 'Champagne & canapés', 'Stunning sunset views'],
    array['Board a beautifully restored traditional dhoni boat', 'Cruise through the atolls as the sun sets', 'Enjoy champagne and canapés prepared by our crew'],
    array['2-hour cruise', 'Champagne & canapés', 'Soft drinks & water', 'Professional crew', 'Bluetooth speaker'],
    array['Life jackets available', 'Experienced captain', 'Weather-dependent departure'],
    'Malé Harbor, Sunset Pier',
    false,
    false,
    true
  ),
  (
    'snorkel-lagoon',
    'Lagoon Snorkeling',
    'Turtles, rays, and tropical fish',
    'SNORKEL',
    90,
    75,
    6,
    1,
    false,
    'beginner',
    array['1.5 hours', 'All levels', 'Equipment included', 'Guide'],
    array['Crystal clear lagoon waters', 'Sea turtle encounters', 'Colorful reef fish'],
    array['Meet at the beach club for a briefing', 'Snorkel the protected lagoon with your guide', 'Spot turtles, rays, and tropical fish'],
    array['Snorkel equipment', 'Flotation devices', 'Professional guide', 'Fresh coconut water', 'Marine life briefing'],
    array['Shallow reef (max 5m)', 'Guide stays with group', 'Reef-safe sunscreen only'],
    'Beach Club, Main Jetty',
    true,
    false,
    false
  ),
  (
    'sunset-fishing',
    'Sunset Fishing Trip',
    'Traditional line fishing at golden hour',
    'FISHING',
    150,
    120,
    6,
    2,
    false,
    'all',
    array['2.5 hours', '2-6 guests', 'Sunset', 'BBQ option'],
    array['Traditional hand-line fishing', 'Spectacular sunset views', 'Cook your catch option'],
    array['Learn traditional Maldivian line fishing techniques', 'Fish the outer reef as the sun sets', 'Option to BBQ your catch at the beach club'],
    array['All fishing equipment', 'Bait & tackle', 'Refreshments', 'Experienced fisherman guide', 'BBQ your catch (optional)'],
    array['Life jackets provided', 'First aid on board', 'Catch & release encouraged'],
    'Fisherman''s Wharf, East Pier',
    false,
    false,
    true
  ),
  (
    'private-sandbank',
    'Private Sandbank Escape',
    'Your own island paradise',
    'PRIVATE',
    300,
    450,
    4,
    2,
    true,
    'all',
    array['5 hours', 'Private', 'Lunch included', 'Champagne'],
    array['Exclusive private sandbank', 'Gourmet picnic lunch', 'Champagne & cocktails'],
    array['Speedboat transfer to a secluded sandbank', 'Enjoy complete privacy on your own stretch of paradise', 'Gourmet picnic prepared by our chef'],
    array['Private speedboat transfer', 'Gourmet picnic lunch', 'Champagne & drinks', 'Beach setup (umbrella, chairs)', 'Snorkel gear', 'Butler service'],
    array['Shallow surrounding waters', 'Radio contact with base', 'Sun protection provided'],
    'VIP Lounge, Marina',
    false,
    false,
    false
  ),
  (
    'dolphin-cruise',
    'Dolphin Watching Cruise',
    'Wild dolphin encounters at sunrise',
    'BOAT',
    180,
    180,
    6,
    2,
    false,
    'all',
    array['3 hours', 'Early morning', 'High success rate', 'Breakfast'],
    array['95% dolphin sighting success rate', 'Spinner dolphins in natural habitat', 'Light breakfast onboard'],
    array['Early departure to catch dolphins at their most active', 'Cruise through dolphin-rich waters', 'Watch pods of spinner dolphins play and feed'],
    array['3-hour cruise', 'Light breakfast', 'Coffee & juice', 'Professional guide', 'Photo tips'],
    array['Early start (6am departure)', 'Life jackets available', 'Sun protection recommended'],
    'Marina, Pier 3',
    true,
    true,
    false
  )
on conflict (slug) do update set
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  category = EXCLUDED.category,
  duration_min = EXCLUDED.duration_min,
  price_usd = EXCLUDED.price_usd,
  max_guests = EXCLUDED.max_guests,
  min_guests = EXCLUDED.min_guests,
  is_private = EXCLUDED.is_private,
  skill_level = EXCLUDED.skill_level,
  tags = EXCLUDED.tags,
  highlights = EXCLUDED.highlights,
  what_youll_do = EXCLUDED.what_youll_do,
  included = EXCLUDED.included,
  safety = EXCLUDED.safety,
  meeting_point = EXCLUDED.meeting_point,
  is_featured = EXCLUDED.is_featured,
  is_trending = EXCLUDED.is_trending,
  is_sunset = EXCLUDED.is_sunset,
  updated_at = now();
