import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch stats
    const [ordersResult, bookingsResult] = await Promise.all([
      supabase.from("orders").select("total_cents, payment_status, status"),
      supabase.from("bookings").select("total_cents, payment_status, status"),
    ])

    const orders = ordersResult.data || []
    const bookings = bookingsResult.data || []

    const totalOrders = orders.length
    const totalBookings = bookings.length

    const totalRevenue =
      orders.filter((o) => o.payment_status === "paid").reduce((sum, o) => sum + o.total_cents, 0) +
      bookings.filter((b) => b.payment_status === "paid").reduce((sum, b) => sum + b.total_cents, 0)

    const pendingItems =
      orders.filter((o) => o.status === "received" || o.status === "processing").length +
      bookings.filter((b) => b.status === "pending").length

    return NextResponse.json({
      totalOrders,
      totalBookings,
      totalRevenue,
      pendingItems,
    })
  } catch (error) {
    console.error("[v0] Stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
