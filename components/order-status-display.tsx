import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/types"
import { Package, Truck, CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react"

interface OrderStatusDisplayProps {
  order: any
  onOrderUpdate?: () => void
}

const STATUS_CONFIG = {
  received: { label: "Received", icon: Clock, color: "bg-blue-500" },
  processing: { label: "Processing", icon: Package, color: "bg-yellow-500" },
  shipped: { label: "Shipped", icon: Truck, color: "bg-purple-500" },
  delivered: { label: "Delivered", icon: CheckCircle2, color: "bg-green-500" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-500" },
}

export function OrderStatusDisplay({ order, onOrderUpdate }: OrderStatusDisplayProps) {
  const [isCancelling, setIsCancelling] = useState(false)
  const statusConfig = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
  const StatusIcon = statusConfig?.icon || Clock

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return
    }

    setIsCancelling(true)
    try {
      const response = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      })

      if (response.ok) {
        onOrderUpdate?.()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to cancel order')
      }
    } catch (error) {
      alert('Failed to cancel order')
    } finally {
      setIsCancelling(false)
    }
  }

  // Check if order can be cancelled
  const canCancel = ['received', 'verified'].includes(order.status) && order.payment_status === 'paid'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Order #{order.id.slice(0, 8).toUpperCase()}</CardTitle>
            <CardDescription>Key Copy Order</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={order.payment_status === "paid" ? "default" : "secondary"}>
              {order.payment_status === "paid" ? "Paid" : "Pending Payment"}
            </Badge>
            {canCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Order
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Timeline */}
        <div className="space-y-4">
          <h3 className="font-semibold">Order Status</h3>
          <div className="flex items-center gap-2">
            {Object.entries(STATUS_CONFIG).map(([key, config], index) => {
              const Icon = config.icon
              const isActive = order.status === key
              const isPast = Object.keys(STATUS_CONFIG).indexOf(order.status) > Object.keys(STATUS_CONFIG).indexOf(key)

              return (
                <div key={key} className="flex items-center flex-1">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      isActive || isPast ? config.color : "bg-muted"
                    } ${isActive || isPast ? "text-white" : "text-muted-foreground"}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  {index < Object.keys(STATUS_CONFIG).length - 1 && (
                    <div className={`flex-1 h-1 mx-2 ${isPast ? config.color : "bg-muted"}`} />
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            {Object.values(STATUS_CONFIG).map((config) => (
              <span key={config.label} className="flex-1 text-center">
                {config.label}
              </span>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="font-semibold">Order Details</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Key Type</p>
              <p className="font-medium capitalize">{order.key_type}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Quantity</p>
              <p className="font-medium">{order.quantity}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Delivery Method</p>
              <p className="font-medium capitalize">{order.delivery_method}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total</p>
              <p className="font-medium">{formatCurrency(order.total_cents)}</p>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="space-y-2 pt-4 border-t">
          <h3 className="font-semibold">Delivery Address</h3>
          <p className="text-sm text-muted-foreground">
            {order.delivery_address.unit && `${order.delivery_address.unit}, `}
            {order.delivery_address.street}
            <br />
            {order.delivery_address.suburb}, {order.delivery_address.state} {order.delivery_address.postcode}
          </p>
        </div>

        {/* Tracking Number */}
        {order.tracking_number && (
          <div className="space-y-2 pt-4 border-t">
            <h3 className="font-semibold">Tracking Number</h3>
            <p className="text-sm font-mono bg-muted p-2 rounded">{order.tracking_number}</p>
          </div>
        )}

        {/* Contact */}
        <div className="space-y-2 pt-4 border-t">
          <h3 className="font-semibold">Contact</h3>
          <p className="text-sm text-muted-foreground">{order.email}</p>
          {order.phone && <p className="text-sm text-muted-foreground">{order.phone}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
