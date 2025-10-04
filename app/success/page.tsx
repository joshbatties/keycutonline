"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Mail, Package } from "lucide-react"
import { Suspense } from "react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const type = searchParams.get("type") // 'copy' or 'booking'

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-2 border-primary">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-3xl">Order Confirmed!</CardTitle>
            <CardDescription className="text-base">
              {type === "booking"
                ? "Your locksmith appointment has been booked successfully."
                : "Your key copy order has been received and will be processed shortly."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {orderId && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                <p className="text-2xl font-mono font-bold">{orderId}</p>
                <p className="text-xs text-muted-foreground mt-2">Save this number to track your order</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Confirmation Email Sent</p>
                  <p className="text-sm text-muted-foreground">
                    Check your inbox for order details and tracking information.
                  </p>
                </div>
              </div>

              {type === "booking" ? (
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Locksmith Assigned</p>
                    <p className="text-sm text-muted-foreground">
                      A certified locksmith will arrive at your scheduled time. You'll receive a reminder 1 hour before.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Package className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Processing Your Keys</p>
                    <p className="text-sm text-muted-foreground">
                      Your keys will be cut within 24 hours and shipped via Australia Post. Expected delivery: 3-5
                      business days.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button asChild size="lg" className="w-full">
                <Link href={`/track?order=${orderId}`}>Track Your Order</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full bg-transparent">
                <Link href="/">Return to Home</Link>
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground pt-4 border-t">
              <p>
                Need help? Contact us at{" "}
                <a href="mailto:support@keycut.com.au" className="text-primary hover:underline">
                  support@keycut.com.au
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SuccessContent />
    </Suspense>
  )
}
