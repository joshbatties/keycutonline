import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Get the order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if order can be cancelled (only before processing starts)
    const cancellableStatuses = ['received', 'verified'];
    if (!cancellableStatuses.includes(order.status)) {
      return NextResponse.json({
        error: `Orders can only be cancelled if status is ${cancellableStatuses.join(' or ')}. Current status: ${order.status}`
      }, { status: 400 });
    }

    // Check if payment has been processed
    if (order.payment_status === 'paid' && order.status !== 'received') {
      return NextResponse.json({
        error: 'Cannot cancel order after processing has begun'
      }, { status: 400 });
    }

    // Update order status to cancelled
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error cancelling order:', updateError);
      return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 });
    }

    // Send cancellation confirmation email (we'll implement this later)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'order_cancelled',
          order: { ...order, status: 'cancelled' },
        }),
      });
    } catch (emailError) {
      console.error('Error sending cancellation email:', emailError);
      // Don't fail the cancellation if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully'
    });

  } catch (error) {
    console.error('Error in order cancellation API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
