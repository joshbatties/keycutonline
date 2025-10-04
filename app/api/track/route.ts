import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query")

    if (!query) {
      return NextResponse.json({ error: "Query parameter required" }, { status: 400 })
    }

    const supabase = await createClient()

    const [orderResult, bookingResult] = await Promise.all([
      supabase.from("orders").select("*").eq("id", query).single(),
      supabase.from("bookings").select("*").eq("id", query).single(),
    ])

    if (orderResult.data) {
      return NextResponse.json({ type: "order", data: orderResult.data })
    }

    if (bookingResult.data) {
      return NextResponse.json({ type: "booking", data: bookingResult.data })
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 })
  } catch (error) {
    console.error("[v0] Track error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
