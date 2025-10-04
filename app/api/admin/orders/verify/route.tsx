import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderId, verificationStatus } = await request.json()

    if (!orderId || !verificationStatus) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update verification status
    const { data: order, error } = await supabase
      .from("orders")
      .update({
        verification_status: verificationStatus,
        status: verificationStatus === "approved" ? "verified" : "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating verification:", error)
      return NextResponse.json({ error: "Failed to update verification" }, { status: 500 })
    }

    // Send notification email to customer
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const trackingUrl = `${appUrl}/track?id=${order.id}`

    if (verificationStatus === "approved") {
      await sendEmail({
        to: order.email,
        subject: "Your Key Copy Order Has Been Verified",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e3a5f;">Order Verified ✓</h2>
            <p>Great news! Your restricted key order has been verified and approved.</p>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p>We'll now proceed with cutting your keys and will notify you when they're shipped.</p>
            <p style="margin-top: 30px;">
              <a href="${trackingUrl}" style="background-color: #1e3a5f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Track Your Order
              </a>
            </p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Questions? Reply to this email or contact us at support@keycut.com.au
            </p>
          </div>
        `,
      })
    } else {
      await sendEmail({
        to: order.email,
        subject: "Update on Your Key Copy Order",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Order Verification Issue</h2>
            <p>We were unable to verify ownership for your restricted key order.</p>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p>This could be due to:</p>
            <ul>
              <li>Photos not clearly showing the key and lock together</li>
              <li>Insufficient proof of ownership</li>
              <li>Key type requiring additional documentation</li>
            </ul>
            <p>Your payment will be refunded within 5-7 business days.</p>
            <p>If you believe this is an error, please contact us with additional documentation.</p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Questions? Reply to this email or contact us at support@keycut.com.au
            </p>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("[v0] Verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
