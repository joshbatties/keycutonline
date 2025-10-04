import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendAdminBookingNotification } from "@/lib/email"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    // Insert booking into database
    const { data: booking, error: dbError } = await supabase
      .from("bookings")
      .insert({
        name: body.name,
        email: body.email,
        phone: body.phone,
        service: body.service,
        address: body.address,
        suburb: body.suburb,
        postcode: body.postcode,
        scheduled_date: body.scheduled_date,
        scheduled_time: body.scheduled_time,
        notes: body.notes,
        service_price_cents: body.service_price_cents,
        callout_fee_cents: body.callout_fee_cents,
        gst_cents: body.gst_cents,
        total_cents: body.total_cents,
        payment_status: "pending",
        status: "pending",
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Database error:", dbError)
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
    }

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: body.total_cents,
      currency: "aud",
      metadata: {
        bookingId: booking.id,
        type: "booking",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Update booking with payment intent ID
    await supabase.from("bookings").update({ stripe_payment_intent_id: paymentIntent.id }).eq("id", booking.id)

    try {
      await sendAdminBookingNotification({
        bookingId: booking.id,
        name: body.name,
        email: body.email,
        service: body.service,
        scheduledDate: body.scheduled_date,
        scheduledTime: body.scheduled_time,
        totalCents: body.total_cents,
      })
    } catch (emailError) {
      console.error("[v0] Failed to send admin notification:", emailError)
      // Don't fail the booking if email fails
    }

    return NextResponse.json({
      bookingId: booking.id,
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("[v0] Booking creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
