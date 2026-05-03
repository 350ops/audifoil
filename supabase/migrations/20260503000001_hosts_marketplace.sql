-- maldivian.tours marketplace schema
-- Adds curated captain/host + boat tables on top of the existing activities/trips schema.
-- Hulhumalé Phase 2 captains list their boats, set availability, and link them to one or
-- more activity types. Bookings still go through the existing trips + bookings tables;
-- a trip now optionally references a specific boat (and therefore its host).

-- ============================================
-- 1. TABLES
-- ============================================

-- A host = a captain / boat owner who is onboarded onto the platform.
-- One auth user (profiles.id) can be at most one host.
create table if not exists public.hosts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade unique,
  slug text unique not null,            -- e.g. 'ahmed-hulhumale'
  display_name text not null,           -- "Captain Ahmed"
  bio text,                             -- short captain story
  phone_e164 text,                      -- +9607xxxxxxx, used for WhatsApp pickup coordination
  whatsapp_e164 text,
  languages text[] default '{}',        -- ['Dhivehi', 'English']
  avatar_url text,
  years_at_sea integer,
  home_port text default 'Hulhumalé Phase 2',
  -- KYC / verification
  status text not null default 'pending',  -- pending, verified, suspended
  national_id_uploaded_at timestamp with time zone,
  boat_reg_uploaded_at timestamp with time zone,
  verified_at timestamp with time zone,
  -- Aggregated review stats (denormalised, refreshed on review insert)
  rating_avg numeric(3,2),
  rating_count integer not null default 0,
  -- Payouts (out-of-band for now, no Stripe Connect)
  payout_bank_name text,
  payout_account_name text,
  payout_account_last4 text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists hosts_status_idx on public.hosts(status);

-- A boat belongs to one host. A host can have multiple boats.
create table if not exists public.boats (
  id uuid default gen_random_uuid() primary key,
  host_id uuid references public.hosts on delete cascade not null,
  slug text unique not null,            -- 'dhoni-blue-2'
  name text not null,                   -- 'Blue Dhoni'
  type text not null default 'dhoni',   -- dhoni, speedboat, fishing
  capacity integer not null default 8,
  length_ft numeric(5,1),
  has_shade boolean default true,
  has_toilet boolean default false,
  has_snorkel_gear boolean default true,
  has_fishing_gear boolean default true,
  description text,
  photos text[] default '{}',           -- public storage URLs
  registration_number text,             -- official boat reg, kept private
  insurance_expires_on date,
  is_active boolean not null default false, -- captain can pause listing
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists boats_host_id_idx on public.boats(host_id);
create index if not exists boats_active_idx on public.boats(is_active);

-- Which experience types each boat can run, with a captain-set per-person price.
-- (activities are the existing catalog: snorkeling, sandbank, fishing, etc.)
create table if not exists public.boat_experiences (
  id uuid default gen_random_uuid() primary key,
  boat_id uuid references public.boats on delete cascade not null,
  activity_id uuid references public.activities on delete cascade not null,
  price_per_person_usd numeric(10,2) not null,
  min_guests integer not null default 1,
  max_guests integer,                   -- if null, fall back to boat.capacity
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(boat_id, activity_id)
);

create index if not exists boat_experiences_activity_idx on public.boat_experiences(activity_id);

-- Day-by-day availability for a boat. A boat is "available" on a date by default;
-- the captain marks dates as blocked when they're using the boat themselves.
create table if not exists public.boat_availability (
  id uuid default gen_random_uuid() primary key,
  boat_id uuid references public.boats on delete cascade not null,
  date date not null,
  is_blocked boolean not null default true,  -- rows here = explicitly blocked
  reason text,                               -- 'fishing', 'maintenance', etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(boat_id, date)
);

create index if not exists boat_availability_date_idx on public.boat_availability(date);

-- Optional: tie a scheduled trip to a specific boat. Existing trips.activity_id stays.
alter table public.trips
  add column if not exists boat_id uuid references public.boats on delete set null;

create index if not exists trips_boat_id_idx on public.trips(boat_id);

-- Reviews left by a guest after a completed booking, attached to the host/boat.
create table if not exists public.host_reviews (
  id uuid default gen_random_uuid() primary key,
  booking_id uuid references public.bookings on delete cascade unique,
  host_id uuid references public.hosts on delete cascade not null,
  boat_id uuid references public.boats on delete set null,
  reviewer_user_id uuid references public.profiles on delete set null,
  rating integer not null check (rating between 1 and 5),
  body text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists host_reviews_host_id_idx on public.host_reviews(host_id);

-- ============================================
-- 2. RLS
-- ============================================

alter table public.hosts enable row level security;
alter table public.boats enable row level security;
alter table public.boat_experiences enable row level security;
alter table public.boat_availability enable row level security;
alter table public.host_reviews enable row level security;

-- Hosts: verified hosts are publicly visible; the host themselves can read/update their own row.
create policy "Verified hosts are public" on public.hosts
  for select using (status = 'verified' or auth.uid() = user_id);

create policy "Hosts can update themselves" on public.hosts
  for update using (auth.uid() = user_id);

create policy "Authenticated users can apply as host" on public.hosts
  for insert with check (auth.uid() = user_id);

-- Boats: active boats of verified hosts are public.
create policy "Active boats of verified hosts are public" on public.boats
  for select using (
    is_active = true
    and exists (select 1 from public.hosts h where h.id = boats.host_id and h.status = 'verified')
    or exists (select 1 from public.hosts h where h.id = boats.host_id and h.user_id = auth.uid())
  );

create policy "Hosts manage own boats" on public.boats
  for all using (
    exists (select 1 from public.hosts h where h.id = boats.host_id and h.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.hosts h where h.id = boats.host_id and h.user_id = auth.uid())
  );

-- Boat experiences: public read, host-only write
create policy "Boat experiences are public" on public.boat_experiences
  for select using (true);

create policy "Hosts manage own boat experiences" on public.boat_experiences
  for all using (
    exists (
      select 1 from public.boats b
      join public.hosts h on h.id = b.host_id
      where b.id = boat_experiences.boat_id and h.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.boats b
      join public.hosts h on h.id = b.host_id
      where b.id = boat_experiences.boat_id and h.user_id = auth.uid()
    )
  );

-- Availability: public can read so the booking UI can show free days
create policy "Boat availability is public" on public.boat_availability
  for select using (true);

create policy "Hosts manage own availability" on public.boat_availability
  for all using (
    exists (
      select 1 from public.boats b
      join public.hosts h on h.id = b.host_id
      where b.id = boat_availability.boat_id and h.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.boats b
      join public.hosts h on h.id = b.host_id
      where b.id = boat_availability.boat_id and h.user_id = auth.uid()
    )
  );

-- Reviews: public read, only the booking's guest can write
create policy "Reviews are public" on public.host_reviews
  for select using (true);

create policy "Guest can review own booking" on public.host_reviews
  for insert with check (
    exists (
      select 1 from public.bookings b
      where b.id = host_reviews.booking_id
      and b.user_id = auth.uid()
      and b.status = 'completed'
    )
  );

-- ============================================
-- 3. KEEP HOST RATING AGGREGATE FRESH
-- ============================================

create or replace function public.refresh_host_rating()
returns trigger language plpgsql security definer as $$
begin
  update public.hosts h
  set rating_avg = sub.avg_rating,
      rating_count = sub.cnt
  from (
    select host_id, avg(rating)::numeric(3,2) as avg_rating, count(*) as cnt
    from public.host_reviews
    where host_id = coalesce(new.host_id, old.host_id)
    group by host_id
  ) sub
  where h.id = sub.host_id;
  return null;
end;
$$;

drop trigger if exists host_reviews_refresh_rating on public.host_reviews;
create trigger host_reviews_refresh_rating
after insert or update or delete on public.host_reviews
for each row execute function public.refresh_host_rating();
