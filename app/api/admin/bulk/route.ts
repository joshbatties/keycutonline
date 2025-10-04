import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check admin access
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (by email domain)
    if (!user.email?.endsWith('@keycutonline.com')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { operation, type, ids, data } = body;

    if (!operation || !type || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    let result;

    switch (operation) {
      case 'update_status':
        if (!data?.status) {
          return NextResponse.json({ error: 'Status is required for bulk update' }, { status: 400 });
        }

        if (type === 'orders') {
          result = await supabase
            .from('orders')
            .update({
              status: data.status,
              updated_at: new Date().toISOString()
            })
            .in('id', ids);

        } else if (type === 'bookings') {
          result = await supabase
            .from('bookings')
            .update({
              status: data.status,
              updated_at: new Date().toISOString()
            })
            .in('id', ids);
        }
        break;

      case 'export_csv':
        if (type === 'orders') {
          result = await supabase
            .from('orders')
            .select(`
              id,
              email,
              phone,
              key_type,
              key_subtype,
              quantity,
              delivery_method,
              delivery_address,
              subtotal_cents,
              gst_cents,
              delivery_cents,
              total_cents,
              status,
              payment_status,
              created_at,
              updated_at,
              tracking_token
            `)
            .in('id', ids);

        } else if (type === 'bookings') {
          result = await supabase
            .from('bookings')
            .select(`
              id,
              email,
              phone,
              service_type,
              service_description,
              urgency,
              service_address,
              preferred_date,
              preferred_time_slot,
              callout_fee_cents,
              estimated_total_cents,
              total_cents,
              gst_cents,
              status,
              payment_status,
              created_at,
              updated_at,
              tracking_token
            `)
            .in('id', ids);
        }
        break;

      default:
        return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
    }

    if (result?.error) {
      console.error('Bulk operation error:', result.error);
      return NextResponse.json({ error: 'Failed to perform bulk operation' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: ids.length,
      data: operation === 'export_csv' ? result.data : null
    });

  } catch (error) {
    console.error('Error in bulk operations API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
