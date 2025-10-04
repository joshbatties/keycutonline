import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"
import { sendOrderConfirmationEmail, sendBookingConfirmationEmail } from "@/lib/email"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent)
        break

      case "payment_intent.payment_failed":
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const supabase = await createClient()

  // Check if this is an order or booking
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("stripe_payment_intent_id", paymentIntent.id)
    .single()

  if (order) {
    // Update order payment status
    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        status: "processing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id)

    if (error) {
      console.error("Failed to update order:", error)
      return
    }

    try {
      await sendOrderConfirmationEmail({
        email: order.email,
        orderId: order.id,
        trackingToken: order.tracking_token,
        keyType: order.key_type,
        quantity: order.quantity,
        totalCents: order.total_cents,
        deliveryMethod: order.delivery_method,
        deliveryAddress: order.delivery_address,
      })
    } catch (emailError) {
      console.error("Failed to send order confirmation email:", emailError)
      // Don't fail the webhook if email fails
    }

    console.log(`Order ${order.id} payment confirmed`)
    return
  }

  // Check if it's a booking
  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("stripe_payment_intent_id", paymentIntent.id)
    .single()

  if (booking) {
    // Update booking payment status
    const { error } = await supabase
      .from("bookings")
      .update({
        payment_status: "paid",
        status: "confirmed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", booking.id)

    if (error) {
      console.error("Failed to update booking:", error)
      return
    }

    try {
      await sendBookingConfirmationEmail({
        email: booking.email,
        bookingId: booking.id,
        trackingToken: booking.tracking_token,
        serviceType: booking.service_type,
        preferredDate: booking.preferred_date,
        preferredTimeSlot: booking.preferred_time_slot,
        serviceAddress: booking.service_address,
        totalCents: booking.total_cents,
        urgency: booking.urgency,
      })
    } catch (emailError) {
      console.error("Failed to send booking confirmation email:", emailError)
      // Don't fail the webhook if email fails
    }

    console.log(`Booking ${booking.id} payment confirmed`)
    return
  }

  console.error(`No order or booking found for payment intent: ${paymentIntent.id}`)
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const supabase = await createClient()

  // Update order or booking payment status to failed
  const { error: orderError } = await supabase
    .from("orders")
    .update({
      payment_status: "failed",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_payment_intent_id", paymentIntent.id)

  if (!orderError) {
    console.log(`Order payment failed for payment intent: ${paymentIntent.id}`)
    return
  }

  const { error: bookingError } = await supabase
    .from("bookings")
    .update({
      payment_status: "failed",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_payment_intent_id", paymentIntent.id)

  if (!bookingError) {
    console.log(`Booking payment failed for payment intent: ${paymentIntent.id}`)
    return
  }

  console.error(`No order or booking found for failed payment intent: ${paymentIntent.id}`)
}
