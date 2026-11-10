-- ============================================================================
-- BOOKME CAMEROUN - SCHEMA POSTGRESQL & SUPABASE COMPLET (Cahier des Charges)
-- À exécuter dans : Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================================

create extension if not exists "pgcrypto";

-- 1. Table de synchronisation temps réel globale (stockage JSONB + Realtime instantané)
create table if not exists public.bookme_state (
  id text primary key default 'main',
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

-- 2. Tables relationnelles métier (Section 13 du Cahier des Charges)
create table if not exists public.categories (
  id text primary key,
  name text not null,
  slug text not null,
  icon text default 'sparkles',
  description text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.users (
  id text primary key,
  name text not null,
  email text unique not null,
  phone text not null,
  password text not null,
  role text not null check (role in ('client', 'provider', 'admin')),
  provider_id text,
  city text default 'Douala',
  neighborhood text default 'Akwa',
  status text default 'active' check (status in ('active', 'suspended')),
  avatar text,
  created_at timestamptz default now()
);

create table if not exists public.providers (
  id text primary key,
  user_id text references public.users(id) on delete set null,
  business_name text not null,
  category_id text references public.categories(id) on delete set null,
  city text default 'Douala',
  neighborhood text not null,
  address text not null,
  phone text not null,
  description text,
  cover_image text,
  rating numeric(3,2) default 5.0,
  review_count integer default 0,
  verification_status text default 'pending' check (verification_status in ('pending', 'verified', 'rejected', 'suspended')),
  verification_doc text,
  subscription_plan text default 'basic' check (subscription_plan in ('basic', 'pro', 'business')),
  confirmation_mode text default 'auto' check (confirmation_mode in ('auto', 'manual')),
  accept_online_payment boolean default false,
  cancellation_policy text,
  opening_hours jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.services (
  id text primary key,
  provider_id text references public.providers(id) on delete cascade,
  name text not null,
  description text,
  price integer not null default 0,
  is_quote boolean default false,
  duration integer not null default 30,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.bookings (
  id text primary key,
  client_id text references public.users(id) on delete cascade,
  provider_id text references public.providers(id) on delete cascade,
  service_id text references public.services(id) on delete set null,
  service_name_snapshot text not null,
  price_snapshot integer not null default 0,
  is_quote_snapshot boolean default false,
  duration_snapshot integer not null default 30,
  date text not null,
  time text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled', 'rejected', 'noshow')),
  payment_method text not null default 'onsite' check (payment_method in ('orange_money', 'mtn_momo', 'onsite')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'refunded')),
  payment_phone text,
  payment_ref text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.reviews (
  id text primary key,
  booking_id text references public.bookings(id) on delete cascade,
  provider_id text references public.providers(id) on delete cascade,
  client_id text references public.users(id) on delete cascade,
  client_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  status text default 'published' check (status in ('published', 'hidden')),
  created_at timestamptz default now()
);

-- 3. Politiques Row Level Security (RLS) ouvertes pour le client Web BookMe (Anon Key)
alter table public.bookme_state enable row level security;
alter table public.categories enable row level security;
alter table public.users enable row level security;
alter table public.providers enable row level security;
alter table public.services enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "Acces public lecture/ecriture bookme_state" on public.bookme_state;
create policy "Acces public lecture/ecriture bookme_state"
  on public.bookme_state for all
  using (true)
  with check (true);

drop policy if exists "Acces public categories" on public.categories;
create policy "Acces public categories" on public.categories for all using (true) with check (true);

drop policy if exists "Acces public users" on public.users;
create policy "Acces public users" on public.users for all using (true) with check (true);

drop policy if exists "Acces public providers" on public.providers;
create policy "Acces public providers" on public.providers for all using (true) with check (true);

drop policy if exists "Acces public services" on public.services;
create policy "Acces public services" on public.services for all using (true) with check (true);

drop policy if exists "Acces public bookings" on public.bookings;
create policy "Acces public bookings" on public.bookings for all using (true) with check (true);

drop policy if exists "Acces public reviews" on public.reviews;
create policy "Acces public reviews" on public.reviews for all using (true) with check (true);

-- 4. Activation du Realtime Supabase
do $$
begin
  alter publication supabase_realtime add table public.bookme_state;
exception when others then
  null;
end $$;
