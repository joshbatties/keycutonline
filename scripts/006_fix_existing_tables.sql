-- Fix existing orders and bookings tables to ensure proper structure

-- Ensure orders table has all required columns and constraints
DO $$
BEGIN
  -- Add missing columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'key_subtype') THEN
    ALTER TABLE orders ADD COLUMN key_subtype TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'requires_verification') THEN
    ALTER TABLE orders ADD COLUMN requires_verification BOOLEAN DEFAULT FALSE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'verification_status') THEN
    ALTER TABLE orders ADD COLUMN verification_status TEXT DEFAULT 'pending';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'verification_photo_url') THEN
    ALTER TABLE orders ADD COLUMN verification_photo_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'delivery_cents') THEN
    ALTER TABLE orders ADD COLUMN delivery_cents INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'tracking_number') THEN
    ALTER TABLE orders ADD COLUMN tracking_number TEXT;
  END IF;

  -- Ensure proper defaults for existing columns
  ALTER TABLE orders ALTER COLUMN quantity SET DEFAULT 1;
  ALTER TABLE orders ALTER COLUMN requires_verification SET DEFAULT FALSE;
  ALTER TABLE orders ALTER COLUMN verification_status SET DEFAULT 'pending';
  ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'received';
  ALTER TABLE orders ALTER COLUMN payment_status SET DEFAULT 'pending';
  ALTER TABLE orders ALTER COLUMN delivery_cents SET DEFAULT 0;

  -- Create indexes if they don't exist
  CREATE INDEX IF NOT EXISTS orders_email_idx ON orders(email);
  CREATE INDEX IF NOT EXISTS orders_tracking_token_idx ON orders(tracking_token);
  CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
  CREATE INDEX IF NOT EXISTS orders_payment_status_idx ON orders(payment_status);
  CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);

EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Some orders table fixes may have failed: %', SQLERRM;
END $$;

-- Ensure bookings table has all required columns and constraints
DO $$
BEGIN
  -- Add missing columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'service_description') THEN
    ALTER TABLE bookings ADD COLUMN service_description TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'assigned_locksmith_id') THEN
    ALTER TABLE bookings ADD COLUMN assigned_locksmith_id UUID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'assigned_locksmith_name') THEN
    ALTER TABLE bookings ADD COLUMN assigned_locksmith_name TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'assigned_locksmith_phone') THEN
    ALTER TABLE bookings ADD COLUMN assigned_locksmith_phone TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'estimated_arrival') THEN
    ALTER TABLE bookings ADD COLUMN estimated_arrival TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Ensure proper defaults for existing columns
  ALTER TABLE bookings ALTER COLUMN urgency SET DEFAULT 'standard';
  ALTER TABLE bookings ALTER COLUMN status SET DEFAULT 'pending';
  ALTER TABLE bookings ALTER COLUMN payment_status SET DEFAULT 'pending';

  -- Create indexes if they don't exist
  CREATE INDEX IF NOT EXISTS bookings_email_idx ON bookings(email);
  CREATE INDEX IF NOT EXISTS bookings_tracking_token_idx ON bookings(tracking_token);
  CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings(status);
  CREATE INDEX IF NOT EXISTS bookings_payment_status_idx ON bookings(payment_status);
  CREATE INDEX IF NOT EXISTS bookings_preferred_date_idx ON bookings(preferred_date);
  CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON bookings(created_at DESC);

EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Some bookings table fixes may have failed: %', SQLERRM;
END $$;

-- Ensure update triggers exist for both tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers if they don't exist
DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS bookings_updated_at ON bookings;
CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
