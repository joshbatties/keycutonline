-- Create saved_addresses table for storing customer delivery addresses
DROP TABLE IF EXISTS saved_addresses CASCADE;

CREATE TABLE saved_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  label TEXT NOT NULL, -- e.g., "Home", "Work", "Mum's House"
  address JSONB NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one default address per email
  CONSTRAINT unique_default_per_email EXCLUDE (email WITH =) WHERE (is_default = true)
);

-- Create indexes for performance
CREATE INDEX idx_saved_addresses_email ON saved_addresses(email);
CREATE INDEX idx_saved_addresses_default ON saved_addresses(email, is_default);

-- Enable RLS
ALTER TABLE saved_addresses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own saved addresses" ON saved_addresses;
DROP POLICY IF EXISTS "Users can insert their own saved addresses" ON saved_addresses;
DROP POLICY IF EXISTS "Users can update their own saved addresses" ON saved_addresses;
DROP POLICY IF EXISTS "Users can delete their own saved addresses" ON saved_addresses;

-- RLS Policies: Users can only access their own addresses
CREATE POLICY "Users can view their own saved addresses" ON saved_addresses
  FOR SELECT TO authenticated USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can insert their own saved addresses" ON saved_addresses
  FOR INSERT TO authenticated WITH CHECK (auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can update their own saved addresses" ON saved_addresses
  FOR UPDATE TO authenticated USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can delete their own saved addresses" ON saved_addresses
  FOR DELETE TO authenticated USING (auth.jwt() ->> 'email' = email);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_saved_addresses_updated_at ON saved_addresses;
CREATE TRIGGER update_saved_addresses_updated_at
  BEFORE UPDATE ON saved_addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
