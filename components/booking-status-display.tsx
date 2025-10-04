import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/types"
import { Calendar, Clock, CheckCircle2, XCircle } from "lucide-react"

interface BookingStatusDisplayProps {
  booking: any
}

const STATUS_CONFIG = {
  pending: { label: "Pending Confirmation", icon: Clock, variant: "secondary" as const },
  confirmed: { label: "Confirmed", icon: CheckCircle2, variant: "default" as const },
  completed: { label: "Completed", icon: CheckCircle2, variant: "default" as const },
  cancelled: { label: "Cancelled", icon: XCircle, variant: "destructive" as const },
}

export function BookingStatusDisplay({ booking }: BookingStatusDisplayProps) {
  const statusConfig = STATUS_CONFIG[booking.status as keyof typeof STATUS_CONFIG]
  const StatusIcon = statusConfig?.icon || Clock

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Booking #{booking.id.slice(0, 8).toUpperCase()}</CardTitle>
            <CardDescription>Locksmith Service</CardDescription>
          </div>
          <Badge variant={booking.payment_status === "paid" ? "default" : "secondary"}>
            {booking.payment_status === "paid" ? "Paid" : "Pending Payment"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status */}
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full ${
              booking.status === "confirmed" || booking.status === "completed"
                ? "bg-green-500"
                : booking.status === "cancelled"
                  ? "bg-red-500"
                  : "bg-yellow-500"
            } text-white`}
          >
            <StatusIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold">{statusConfig?.label}</p>
            <p className="text-sm text-muted-foreground">
              {booking.status === "confirmed" && "Your locksmith will arrive at the scheduled time"}
              {booking.status === "pending" && "We'll confirm your booking shortly"}
              {booking.status === "completed" && "Service completed successfully"}
              {booking.status === "cancelled" && "This booking has been cancelled"}
            </p>
          </div>
        </div>

        {/* Scheduled Time */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="font-semibold">Scheduled Time</h3>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {new Date(booking.scheduled_date).toLocaleDateString("en-AU", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-muted-foreground">{booking.scheduled_time}</p>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="font-semibold">Service Details</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Service Type</p>
              <p className="font-medium capitalize">{booking.service.replace("_", " ")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total</p>
              <p className="font-medium">{formatCurrency(booking.total_cents)}</p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2 pt-4 border-t">
          <h3 className="font-semibold">Service Location</h3>
          <p className="text-sm text-muted-foreground">
            {booking.address}
            <br />
            {booking.suburb} {booking.postcode}
          </p>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="space-y-2 pt-4 border-t">
            <h3 className="font-semibold">Additional Notes</h3>
            <p className="text-sm text-muted-foreground">{booking.notes}</p>
          </div>
        )}

        {/* Contact */}
        <div className="space-y-2 pt-4 border-t">
          <h3 className="font-semibold">Contact</h3>
          <p className="text-sm text-muted-foreground">{booking.name}</p>
          <p className="text-sm text-muted-foreground">{booking.email}</p>
          <p className="text-sm text-muted-foreground">{booking.phone}</p>
        </div>
      </CardContent>
    </Card>
  )
}
