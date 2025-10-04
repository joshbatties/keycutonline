import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendAdminOrderNotification } from "@/lib/email"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    // Insert order into database
    const { data: order, error: dbError } = await supabase
      .from("orders")
      .insert({
        email: body.email,
        phone: body.phone || null,
        key_type: body.key_type,
        key_subtype: body.key_subtype,
        quantity: body.quantity,
        photo_urls: body.photo_urls,
        requires_verification: body.requires_verification,
        verification_photo_url: body.verification_photo_url,
        delivery_method: body.delivery_method,
        delivery_address: body.delivery_address,
        subtotal_cents: body.subtotal_cents,
        gst_cents: body.gst_cents,
        delivery_cents: body.delivery_cents,
        total_cents: body.total_cents,
        payment_status: "pending",
        status: "received",
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Database error:", dbError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: body.total_cents,
      currency: "aud",
      metadata: {
        orderId: order.id,
        type: "order",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Update order with payment intent ID
    await supabase.from("orders").update({ stripe_payment_intent_id: paymentIntent.id }).eq("id", order.id)

    try {
      await sendAdminOrderNotification({
        orderId: order.id,
        email: body.email,
        keyType: body.key_type,
        quantity: body.quantity,
        totalCents: body.total_cents,
        requiresVerification: body.requires_verification || false,
      })
    } catch (emailError) {
      console.error("[v0] Failed to send admin notification:", emailError)
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      orderId: order.id,
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("[v0] Order creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
