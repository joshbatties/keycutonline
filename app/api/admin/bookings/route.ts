import { type NextRequest, NextResponse } from "next/server"
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

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*")
      .order("scheduled_date", { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("[v0] Bookings fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { bookingId, status } = await request.json()

    const { error } = await supabase.from("bookings").update({ status }).eq("id", bookingId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Booking update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
