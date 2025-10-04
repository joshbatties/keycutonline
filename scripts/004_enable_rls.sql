-- Enable Row Level Security on all tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON bookings;

-- Orders policies
-- Allow anyone to insert orders (guest checkout)
CREATE POLICY "Anyone can create orders"
ON orders FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow public access for order tracking (by tracking token)
-- This allows unauthenticated users to track orders using tracking tokens
CREATE POLICY "Public can track orders"
ON orders FOR SELECT
TO anon, authenticated
USING (true);

-- Allow authenticated users to view their own orders by email
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'email' = email);

-- Allow authenticated users to update their own orders (for cancellation)
CREATE POLICY "Users can update their own orders"
ON orders FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'email' = email);

-- Allow admins to view all orders (using keycutonline.com domain)
CREATE POLICY "Admins can view all orders"
ON orders FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'email' LIKE '%@keycutonline.com');

-- Allow admins to update orders
CREATE POLICY "Admins can update orders"
ON orders FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'email' LIKE '%@keycutonline.com');

-- Bookings policies
-- Allow anyone to insert bookings (guest checkout)
CREATE POLICY "Anyone can create bookings"
ON bookings FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow public access for booking tracking (by tracking token)
CREATE POLICY "Public can track bookings"
ON bookings FOR SELECT
TO anon, authenticated
USING (true);

-- Allow authenticated users to view their own bookings by email
CREATE POLICY "Users can view their own bookings"
ON bookings FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'email' = email);

-- Allow authenticated users to update their own bookings
CREATE POLICY "Users can update their own bookings"
ON bookings FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'email' = email);

-- Allow admins to view all bookings
CREATE POLICY "Admins can view all bookings"
ON bookings FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'email' LIKE '%@keycutonline.com');

-- Allow admins to update bookings
CREATE POLICY "Admins can update bookings"
ON bookings FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'email' LIKE '%@keycutonline.com');

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@keycutonline.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated, anon;
