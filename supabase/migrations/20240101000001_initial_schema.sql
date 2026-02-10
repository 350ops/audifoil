-- Noty Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
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
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notes table
create table if not exists public.notes (
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
create table if not exists public.user_preferences (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade unique not null,
  theme text default 'system',
  language text default 'en',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notification preferences table
create table if not exists public.notification_preferences (
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
create table if not exists public.notifications (
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
create table if not exists public.user_subscriptions (
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

-- ============================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ============================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.notes enable row level security;
alter table public.user_preferences enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.notifications enable row level security;
alter table public.user_subscriptions enable row level security;

-- ============================================
-- 3. CREATE RLS POLICIES
-- ============================================

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

-- ============================================
-- 4. CREATE AUTO-PROFILE TRIGGER
-- ============================================

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if exists (for idempotency)
drop trigger if exists on_auth_user_created on auth.users;

-- Trigger on auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- ============================================

create index if not exists idx_notes_user_id on public.notes(user_id);
create index if not exists idx_notes_category_id on public.notes(category_id);
create index if not exists idx_notes_created_at on public.notes(created_at desc);
create index if not exists idx_notes_pinned on public.notes(pinned) where pinned = true;
create index if not exists idx_categories_user_id on public.categories(user_id);
create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_notifications_read on public.notifications(read) where read = false;
