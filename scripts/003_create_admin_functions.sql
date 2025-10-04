-- Admin helper functions and views

-- Drop existing views if they exist (to avoid conflicts)
DROP VIEW IF EXISTS public.admin_orders_summary;
DROP VIEW IF EXISTS public.admin_bookings_summary;

-- View for admin dashboard: all orders with summary
CREATE OR REPLACE VIEW public.admin_orders_summary AS
SELECT
  id,
  email,
  key_type,
  quantity,
  delivery_method,
  total_cents,
  payment_status,
  status,
  verification_status,
  created_at,
  tracking_token
FROM public.orders
ORDER BY created_at DESC;

-- View for admin dashboard: all bookings with summary
CREATE OR REPLACE VIEW public.admin_bookings_summary AS
SELECT
  id,
  email,
  phone,
  service_type,
  urgency,
  preferred_date,
  preferred_time_slot,
  total_cents,
  payment_status,
  status,
  assigned_locksmith_name,
  created_at,
  tracking_token
FROM public.bookings
ORDER BY created_at DESC;

-- Function to get order statistics
CREATE OR REPLACE FUNCTION public.get_order_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_orders', COUNT(*),
    'pending_orders', COUNT(*) FILTER (WHERE status IN ('received', 'verified')),
    'in_progress', COUNT(*) FILTER (WHERE status = 'cutting'),
    'shipped', COUNT(*) FILTER (WHERE status = 'shipped'),
    'delivered', COUNT(*) FILTER (WHERE status = 'delivered'),
    'cancelled', COUNT(*) FILTER (WHERE status = 'cancelled'),
    'total_revenue_cents', COALESCE(SUM(total_cents) FILTER (WHERE payment_status = 'paid'), 0),
    'avg_order_value_cents', COALESCE(AVG(total_cents) FILTER (WHERE payment_status = 'paid'), 0)
  ) INTO result
  FROM public.orders;

  RETURN result;
END;
$$;

-- Function to get booking statistics
CREATE OR REPLACE FUNCTION public.get_booking_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_bookings', COUNT(*),
    'pending_bookings', COUNT(*) FILTER (WHERE status = 'pending'),
    'confirmed_bookings', COUNT(*) FILTER (WHERE status = 'confirmed'),
    'assigned_bookings', COUNT(*) FILTER (WHERE status = 'assigned'),
    'in_progress', COUNT(*) FILTER (WHERE status = 'in_progress'),
    'completed', COUNT(*) FILTER (WHERE status = 'completed'),
    'cancelled', COUNT(*) FILTER (WHERE status = 'cancelled'),
    'total_revenue_cents', COALESCE(SUM(total_cents) FILTER (WHERE payment_status = 'paid'), 0)
  ) INTO result
  FROM public.bookings;

  RETURN result;
END;
$$;
