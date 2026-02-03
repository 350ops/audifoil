-- Dynamic Group Pricing Schema Updates
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ============================================
-- 1. ADD PRICING COLUMNS TO TRIPS TABLE
-- ============================================

-- Add pricing-related columns to trips table
alter table public.trips 
add column if not exists min_guests_for_base_price integer not null default 4,
add column if not exists base_price_per_person numeric(10,2) not null default 80.00,
add column if not exists booking_status text not null default 'open';

-- Add comment for clarity
comment on column public.trips.min_guests_for_base_price is 'Minimum guests needed for base price ($80)';
comment on column public.trips.base_price_per_person is 'Base price per person when group is full (4+ people)';
comment on column public.trips.booking_status is 'open, tentative, confirmed, cancelled';

-- ============================================
-- 2. ADD PRICING COLUMNS TO BOOKINGS TABLE
-- ============================================

-- Add pricing and booking type columns to bookings table
alter table public.bookings
add column if not exists price_at_booking numeric(10,2),
add column if not exists final_price numeric(10,2),
add column if not exists booking_type text not null default 'confirmed';

-- Add comments
comment on column public.bookings.price_at_booking is 'Price per person at time of booking';
comment on column public.bookings.final_price is 'Actual price charged (may be lower if more joined)';
comment on column public.bookings.booking_type is 'confirmed, hold, waitlist';

-- ============================================
-- 3. CREATE PRICING HELPER FUNCTIONS
-- ============================================

-- Function to calculate price per person based on total guests
create or replace function public.calculate_price_per_person(total_guests integer)
returns numeric as $$
begin
  if total_guests >= 4 then
    return 80.00;
  elsif total_guests = 3 then
    return 100.00;
  elsif total_guests = 2 then
    return 150.00;
  else
    return 300.00;
  end if;
end;
$$ language plpgsql immutable;

-- Function to update booking status based on guest count
create or replace function public.update_trip_booking_status()
returns trigger as $$
declare
  current_count integer;
  trip_max integer;
begin
  -- Get current booked count and max capacity
  select booked_count, max_capacity into current_count, trip_max
  from public.trips where id = NEW.trip_id;
  
  -- Update trip booking status
  update public.trips
  set booking_status = case
    when current_count >= 4 then 'confirmed'
    when current_count >= trip_max then 'confirmed'
    when current_count > 0 then 'tentative'
    else 'open'
  end,
  updated_at = now()
  where id = NEW.trip_id;
  
  return NEW;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if exists (for idempotency)
drop trigger if exists on_booking_status_update on public.bookings;

-- Trigger to update trip booking status after booking changes
create trigger on_booking_status_update
  after insert or update or delete on public.bookings
  for each row execute procedure public.update_trip_booking_status();

-- ============================================
-- 4. UPDATE EXISTING DATA
-- ============================================

-- Set price_at_booking for existing bookings based on their total_price and guest_count
update public.bookings
set price_at_booking = case 
  when guest_count > 0 then total_price / guest_count
  else total_price
end,
final_price = total_price
where price_at_booking is null;

-- Update trip booking status based on current booked_count
update public.trips
set booking_status = case
  when booked_count >= 4 then 'confirmed'
  when booked_count >= max_capacity then 'confirmed'
  when booked_count > 0 then 'tentative'
  else 'open'
end;

-- ============================================
-- 5. ADD INDEXES FOR PERFORMANCE
-- ============================================

create index if not exists idx_trips_booking_status on public.trips(booking_status);
create index if not exists idx_bookings_type on public.bookings(booking_type);
