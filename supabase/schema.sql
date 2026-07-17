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

-- security-definer helper: policies that need to check "is this caller the
-- landlord" must not query `profiles` directly from a policy *on* `profiles`
-- itself — that's self-referential and Postgres rejects it with "infinite
-- recursion detected in policy for relation profiles". Routing the check
-- through a security-definer function sidesteps RLS for this one lookup.
create or replace function is_landlord(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from profiles where id = uid and role = 'landlord');
$$;

-- Resolves a login username to its Supabase Auth email so the client can
-- call signInWithPassword — needed because the login form takes a username,
-- not an email, and the caller isn't authenticated yet (so normal RLS-gated
-- reads of `profiles` aren't available). Only ever returns an email, never
-- a password hash or anything else.
create or replace function get_login_email(p_username text)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select au.email
  from profiles p
  join auth.users au on au.id = p.id
  where lower(p.username) = lower(p_username)
  limit 1;
$$;

revoke all on function get_login_email(text) from public;
grant execute on function get_login_email(text) to anon, authenticated;

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
  using (is_landlord(auth.uid()))
  with check (is_landlord(auth.uid()));

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
  using (is_landlord(auth.uid()));

create policy "anyone can write an event"
  on event_log for insert
  with check (true);

create policy "landlord clears the event log"
  on event_log for delete
  using (is_landlord(auth.uid()));

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
  using (is_landlord(auth.uid()));

-- ---------------------------------------------------------- initial seed
-- The landlord (Peter) and any tenants can be created two ways:
--  1. Supabase dashboard > Authentication > Users > Add user, then insert
--     a matching `profiles` row by hand (fine for the first landlord user).
--  2. Admin > Tenants > Add Tenant in the app, which calls the
--     /api/create-tenant serverless function (see api/create-tenant.ts) —
--     this is the normal path once that's wired up, since creating a new
--     Supabase Auth user requires the service-role key, which only that
--     server-side function has access to (never the browser).
