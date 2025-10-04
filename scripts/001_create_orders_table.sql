-- Mail-in key copy orders table
-- Note: This script is kept for reference. Use scripts/000_setup_database.sql for new installations.
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid primary key default gen_random_uuid(),
  
  -- Customer details
  email text not null,
  phone text,
  
  -- Key details
  key_type text not null, -- 'standard', 'restricted', 'car', 'specialty'
  key_subtype text, -- specific key model/brand
  quantity integer not null default 1,
  photo_urls text[] not null, -- array of uploaded photo URLs
  
  -- Ownership verification (for restricted keys)
  requires_verification boolean default false,
  verification_status text default 'pending', -- 'pending', 'approved', 'rejected'
  verification_photo_url text, -- ID or proof of ownership
  
  -- Delivery details
  delivery_method text not null, -- 'standard', 'express'
  delivery_address jsonb not null, -- {street, suburb, state, postcode}
  
  -- Pricing (all in cents, AUD)
  subtotal_cents integer not null,
  gst_cents integer not null,
  delivery_cents integer not null,
  total_cents integer not null,
  
  -- Payment
  stripe_payment_intent_id text,
  payment_status text default 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  
  -- Order status
  status text default 'received', -- 'received', 'verified', 'cutting', 'shipped', 'delivered', 'cancelled'
  
  -- Tracking
  tracking_token uuid unique default gen_random_uuid(),
  tracking_number text, -- Australia Post tracking
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS (even though no auth, good practice for admin access later)
alter table public.orders enable row level security;

-- Allow public insert (guest checkout)
create policy "orders_insert_public"
  on public.orders for insert
  to anon
  with check (true);

-- Allow public select only with tracking token
create policy "orders_select_with_token"
  on public.orders for select
  to anon
  using (tracking_token = (current_setting('request.jwt.claims', true)::json->>'tracking_token')::uuid);

-- Indexes for performance
create index if not exists orders_email_idx on public.orders(email);
create index if not exists orders_tracking_token_idx on public.orders(tracking_token);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

-- Updated timestamp trigger
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_updated_at
  before update on public.orders
  for each row
  execute function public.update_updated_at();
