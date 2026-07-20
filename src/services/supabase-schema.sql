-- Supabase Schema Migration for Apartment 1507
-- Run this in the Supabase SQL Editor to set up all required tables.
-- This replaces the previous localStorage-based data storage.

-- 1. Landlord account
CREATE TABLE IF NOT EXISTS landlord (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Peter Bardenhagen',
  email TEXT NOT NULL DEFAULT 'peter@bardenhagen.xyz',
  phone TEXT NOT NULL DEFAULT '',
  username TEXT UNIQUE NOT NULL DEFAULT 'peter',
  password_hash TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default landlord (password: 2595, SHA-256: 7bb0fa6bb55a988fea9d13aed66eeb2cfaf375ef9e0526ccf8fb37515d40b89c)
INSERT INTO landlord (username, password_hash)
VALUES ('peter', '7bb0fa6bb55a988fea9d13aed66eeb2cfaf375ef9e0526ccf8fb37515d40b89c')
ON CONFLICT (username) DO NOTHING;

-- 2. Tenants
CREATE TABLE IF NOT EXISTS tenants (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  room TEXT NOT NULL DEFAULT '',
  rent NUMERIC(10,2) NOT NULL DEFAULT 0,
  bond NUMERIC(10,2) NOT NULL DEFAULT 0,
  lease_start DATE,
  lease_end DATE,
  contact TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  username TEXT UNIQUE,
  password_hash TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Tenant guests
CREATE TABLE IF NOT EXISTS tenant_guests (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  nights INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Registration requests (from the Register page)
CREATE TABLE IF NOT EXISTS registrations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name TEXT NOT NULL,
  email TEXT NOT NULL,
  username TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Messages
CREATE TABLE IF NOT EXISTS messages (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  from_role TEXT NOT NULL,
  from_id BIGINT,
  from_name TEXT NOT NULL,
  to_role TEXT NOT NULL,
  to_id BIGINT,
  to_label TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  attachments JSONB NOT NULL DEFAULT '[]',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Repair requests
CREATE TABLE IF NOT EXISTS repair_requests (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  submitted_by TEXT NOT NULL DEFAULT '',
  room TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Enquiries
CREATE TABLE IF NOT EXISTS enquiries (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  flatmate_name TEXT NOT NULL,
  enquiry_type TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Financials / transactions
CREATE TABLE IF NOT EXISTS transactions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tenants_username ON tenants(username);
CREATE INDEX IF NOT EXISTS idx_tenant_guests_tenant_id ON tenant_guests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_repair_requests_status ON repair_requests(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- Without this, every table above is reachable by anyone holding the anon
-- key — which is public, it ships in the browser bundle. The app only
-- actually talks to Supabase for one thing today (Register.vue inserting
-- into `registrations`), so that's the only table given a real policy;
-- everything else is locked to "no anon/authenticated access at all" until
-- there's an actual access model (Supabase Auth, or server-side RPCs) for
-- reading/writing tenant data, messages, etc. from the browser. Locking a
-- table down never breaks anything that wasn't already relying on it.
-- ---------------------------------------------------------------------------

ALTER TABLE landlord ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- The one table the browser actually writes to right now: allow anyone to
-- submit a registration, but not read, edit or delete other people's.
DROP POLICY IF EXISTS "anyone can submit a registration" ON registrations;
CREATE POLICY "anyone can submit a registration"
  ON registrations FOR INSERT
  WITH CHECK (true);

-- Everything else stays fully locked (no policies = no access via the anon
-- key) until it's actually wired up with a real access model.
