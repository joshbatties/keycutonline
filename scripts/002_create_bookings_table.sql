-- On-site locksmith bookings table
-- Note: This script is kept for reference. Use scripts/000_setup_database.sql for new installations.
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid primary key default gen_random_uuid(),
  
  -- Customer details
  email text not null,
  phone text not null, -- required for locksmith contact
  
  -- Service location
  service_address jsonb not null, -- {street, suburb, state, postcode, unit}
  access_instructions text, -- gate codes, parking, etc.
  
  -- Scheduling
  preferred_date date not null,
  preferred_time_slot text not null, -- '9am-12pm', '12pm-3pm', '3pm-6pm'
  
  -- Service details
  service_type text not null, -- 'lockout', 'rekey', 'install', 'repair', 'other'
  service_description text not null,
  urgency text default 'standard', -- 'standard', 'urgent' (2hr response)
  
  -- Pricing (all in cents, AUD)
  callout_fee_cents integer not null,
  estimated_total_cents integer, -- may be null until locksmith assesses
  gst_cents integer not null,
  total_cents integer not null,
  
  -- Payment
  stripe_payment_intent_id text,
  payment_status text default 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  
  -- Booking status
  status text default 'pending', -- 'pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'
  
  -- Locksmith assignment
  assigned_locksmith_id uuid, -- future: reference to locksmiths table
  assigned_locksmith_name text,
  assigned_locksmith_phone text,
  estimated_arrival timestamptz,
  
  -- Tracking
  tracking_token uuid unique default gen_random_uuid(),
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.bookings enable row level security;

-- Allow public insert (guest checkout)
create policy "bookings_insert_public"
  on public.bookings for insert
  to anon
  with check (true);

-- Allow public select only with tracking token
create policy "bookings_select_with_token"
  on public.bookings for select
  to anon
  using (tracking_token = (current_setting('request.jwt.claims', true)::json->>'tracking_token')::uuid);

-- Indexes for performance
create index if not exists bookings_email_idx on public.bookings(email);
create index if not exists bookings_tracking_token_idx on public.bookings(tracking_token);
create index if not exists bookings_status_idx on public.bookings(status);
create index if not exists bookings_preferred_date_idx on public.bookings(preferred_date);
create index if not exists bookings_created_at_idx on public.bookings(created_at desc);

-- Updated timestamp trigger
create trigger bookings_updated_at
  before update on public.bookings
  for each row
  execute function public.update_updated_at();
