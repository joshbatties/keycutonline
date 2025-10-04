"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function PaymentForm({
  clientSecret,
  orderId,
  bookingId,
}: { clientSecret: string; orderId?: string; bookingId?: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setErrorMessage(undefined)

    const type = orderId ? "copy" : "booking"
    const id = orderId || bookingId
    const returnUrl = `${window.location.origin}/success?order_id=${id}&type=${type}`

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    })

    if (error) {
      setErrorMessage(error.message)
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {errorMessage && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">{errorMessage}</div>}

      <Button type="submit" disabled={!stripe || isProcessing} className="w-full" size="lg">
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Pay Now"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Secure payment powered by Stripe. Your payment information is encrypted and secure.
      </p>
    </form>
  )
}

function PaymentContent() {
  const searchParams = useSearchParams()
  const clientSecret = searchParams.get("clientSecret")
  const orderId = searchParams.get("orderId")
  const bookingId = searchParams.get("bookingId")

  if (!clientSecret) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Error</CardTitle>
          <CardDescription>Missing payment information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Please return to the order form and try again.</p>
        </CardContent>
      </Card>
    )
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#1e3a5f",
      },
    },
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
          <CardDescription>
            {orderId ? "Complete your key copy order" : "Complete your locksmith booking"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentForm clientSecret={clientSecret} orderId={orderId || undefined} bookingId={bookingId || undefined} />
        </CardContent>
      </Card>
    </Elements>
  )
}

export default function PaymentPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <PaymentContent />
      </Suspense>
    </div>
  )
}
