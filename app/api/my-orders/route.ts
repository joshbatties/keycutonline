import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get("email")

    if (!email || email !== user.email) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    // Fetch all orders and bookings for this user
    const [ordersResult, bookingsResult] = await Promise.all([
      supabase.from("orders").select("*").eq("email", email).order("created_at", { ascending: false }),
      supabase.from("bookings").select("*").eq("email", email).order("created_at", { ascending: false }),
    ])

    return NextResponse.json({
      orders: ordersResult.data || [],
      bookings: bookingsResult.data || [],
    })
  } catch (error) {
    console.error("[v0] My orders error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
