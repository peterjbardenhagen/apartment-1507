-- Apartment 1507 · Supabase schema
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query)
-- against project aaubrlnsnidxqezoxsar.
--
-- Identity model: every landlord/tenant login is a real Supabase Auth user
-- (auth.users), with a matching row in `profiles` holding the app-specific
-- fields. Tenants without a real email get a synthetic
-- "<username>@login.apartment1507.internal" address so Supabase Auth (which
-- requires an email) still works uniformly — the UI only ever shows the
-- username, never that address.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- profiles
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('landlord', 'tenant')),
  name text not null,
  username text unique not null,
  room text,
  rent numeric,
  bond numeric,
  rent_cycle text check (rent_cycle in ('weekly', 'fortnightly', 'monthly')) default 'weekly',
  advance_paid_until date,
  bills_included boolean default false,
  bills_included_amount numeric,
  lease_start date,
  lease_end date,
  contact text,
  email text,
  phone text,
  status text default 'active',
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles readable by any signed-in user"
  on profiles for select
  using (auth.role() = 'authenticated');

create policy "landlord manages all profiles"
  on profiles for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'landlord'))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'landlord'));

create policy "tenants update their own profile"
  on profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ----------------------------------------------------------------messages
create table if not exists messages (
  id bigint generated always as identity primary key,
  from_id uuid not null references profiles(id) on delete cascade,
  from_name text not null,
  to_type text not null check (to_type in ('landlord', 'tenant', 'all')),
  to_id uuid references profiles(id) on delete cascade,
  to_name text not null,
  subject text default '',
  body text not null,
  attachments jsonb not null default '[]',
  created_at timestamptz not null default now(),
  read_by uuid[] not null default '{}'
);

alter table messages enable row level security;

create policy "participants can read their messages"
  on messages for select
  using (from_id = auth.uid() or to_id = auth.uid() or to_type = 'all');

create policy "signed-in users can send messages"
  on messages for insert
  with check (from_id = auth.uid());

create policy "recipients can mark messages read"
  on messages for update
  using (to_id = auth.uid() or to_type = 'all' or from_id = auth.uid())
  with check (true);

create policy "senders can delete their own messages"
  on messages for delete
  using (from_id = auth.uid());

-- ---------------------------------------------------------------event_log
create table if not exists event_log (
  id bigint generated always as identity primary key,
  type text not null check (type in ('login', 'warning', 'error')),
  message text not null,
  actor text,
  created_at timestamptz not null default now()
);

alter table event_log enable row level security;

create policy "landlord reads the event log"
  on event_log for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'landlord'));

create policy "anyone can write an event"
  on event_log for insert
  with check (true);

create policy "landlord clears the event log"
  on event_log for delete
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'landlord'));

-- -------------------------------------------------------------app_settings
create table if not exists app_settings (
  id int primary key default 1,
  timezone text not null default 'Australia/Brisbane',
  date_format text not null default 'dd/mm/yyyy',
  time_format text not null default '12h',
  check (id = 1)
);

insert into app_settings (id) values (1) on conflict (id) do nothing;

alter table app_settings enable row level security;

create policy "settings readable by any signed-in user"
  on app_settings for select
  using (auth.role() = 'authenticated');

create policy "landlord updates settings"
  on app_settings for update
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'landlord'));

-- ---------------------------------------------------------- initial seed
-- Create the actual auth users for Peter (landlord), Kevin, Kaitlin and
-- Jacob from the Supabase dashboard (Authentication > Users > Add user),
-- or via the app's Admin > Tenants "Add Tenant" flow once it's wired to
-- Supabase Auth. Then insert/keep the matching `profiles` row in sync —
-- the app does this automatically on signup once the client-side migration
-- lands.
