-- Split payment system: group bookings with individual payment tracking

-- One record per group booking
create table if not exists trip_bookings (
  id uuid primary key default gen_random_uuid(),
  confirmation_code text not null,
  activity_id text not null,
  slot_date text not null,
  slot_time text not null,
  total_guests int not null default 1,
  price_per_person numeric not null default 80,
  booker_name text not null,
  booker_email text,
  booker_whatsapp text,
  payment_link_url text,
  payment_link_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- One record per guest payment in the group
create table if not exists trip_payments (
  id uuid primary key default gen_random_uuid(),
  trip_booking_id uuid not null references trip_bookings(id) on delete cascade,
  guest_name text,
  guest_email text,
  amount numeric not null,
  stripe_payment_intent_id text,
  status text not null default 'pending',
  is_booker boolean not null default false,
  paid_at timestamptz,
  created_at timestamptz default now()
);

-- Index for fast lookups
create index if not exists idx_trip_payments_booking on trip_payments(trip_booking_id);
create index if not exists idx_trip_payments_stripe_pi on trip_payments(stripe_payment_intent_id);
create index if not exists idx_trip_bookings_code on trip_bookings(confirmation_code);

-- Enable RLS
alter table trip_bookings enable row level security;
alter table trip_payments enable row level security;

-- Allow anonymous reads/inserts (edge functions use service role, but anon can read)
create policy "Anyone can read trip_bookings" on trip_bookings for select using (true);
create policy "Anyone can insert trip_bookings" on trip_bookings for insert with check (true);
create policy "Anyone can update trip_bookings" on trip_bookings for update using (true);

create policy "Anyone can read trip_payments" on trip_payments for select using (true);
create policy "Anyone can insert trip_payments" on trip_payments for insert with check (true);
create policy "Anyone can update trip_payments" on trip_payments for update using (true);
