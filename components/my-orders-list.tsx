"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { OrderStatusDisplay } from "@/components/order-status-display"
import { BookingStatusDisplay } from "@/components/booking-status-display"

interface MyOrdersListProps {
  userEmail: string
}

export function MyOrdersList({ userEmail }: MyOrdersListProps) {
  const [orders, setOrders] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/my-orders?email=${encodeURIComponent(userEmail)}`)
      if (!response.ok) throw new Error("Failed to fetch orders")

      const data = await response.json()
      setOrders(data.orders || [])
      setBookings(data.bookings || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [userEmail])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (orders.length === 0 && bookings.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">You haven't placed any orders yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="orders" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="orders">Key Copies ({orders.length})</TabsTrigger>
        <TabsTrigger value="bookings">Locksmith Bookings ({bookings.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="orders" className="space-y-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No key copy orders yet.</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => <OrderStatusDisplay key={order.id} order={order} onOrderUpdate={fetchOrders} />)
        )}
      </TabsContent>

      <TabsContent value="bookings" className="space-y-4">
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No locksmith bookings yet.</p>
            </CardContent>
          </Card>
        ) : (
          bookings.map((booking) => <BookingStatusDisplay key={booking.id} booking={booking} />)
        )}
      </TabsContent>
    </Tabs>
  )
}
