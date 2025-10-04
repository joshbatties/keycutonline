"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { OrderStatusDisplay } from "@/components/order-status-display"
import { BookingStatusDisplay } from "@/components/booking-status-display"
import { AlertCircle, Loader2, Search } from "lucide-react"
import Link from "next/link"

type TrackingResult = { type: "order"; data: any } | { type: "booking"; data: any } | null

export function TrackingSearch() {
  const [searchValue, setSearchValue] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<TrackingResult>(null)

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError("Please enter an order number")
      return
    }

    setIsSearching(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`/api/track?query=${encodeURIComponent(searchValue)}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("No orders or bookings found with that order number")
        }
        throw new Error("Failed to search")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search by Order Number</CardTitle>
          <CardDescription>Enter your order number to view its status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="search">Order Number</Label>
            <Input
              id="search"
              placeholder="e.g., ORD-12345"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <Button onClick={handleSearch} disabled={isSearching} className="w-full">
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Track Order
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">Want to track all your orders in one place?</p>
            <Link href="/auth/sign-up">
              <Button variant="outline" className="w-full bg-transparent">
                Create an Account
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline hover:text-foreground">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && result.type === "order" && <OrderStatusDisplay order={result.data} />}
      {result && result.type === "booking" && <BookingStatusDisplay booking={result.data} />}
    </div>
  )
}
