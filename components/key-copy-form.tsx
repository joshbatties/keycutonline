"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { KeyPhotoUpload } from "@/components/key-photo-upload"
import { DeliveryAddressForm } from "@/components/delivery-address-form"
import { PricingSummary } from "@/components/pricing-summary"
import { PRICING, calculateGST, type Address, type KeyType, type DeliveryMethod } from "@/lib/types"
import { AlertCircle, Loader2 } from "lucide-react"

export function KeyCopyForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [keyType, setKeyType] = useState<KeyType>("standard")
  const [keySubtype, setKeySubtype] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [requiresVerification, setRequiresVerification] = useState(false)
  const [verificationPhotoUrl, setVerificationPhotoUrl] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard")
  const [deliveryAddress, setDeliveryAddress] = useState<Address>({
    street: "",
    suburb: "",
    state: "NSW",
    postcode: "",
  })

  // Calculate pricing
  const getKeyPrice = () => {
    switch (keyType) {
      case "standard":
        return PRICING.STANDARD_KEY
      case "restricted":
        return PRICING.RESTRICTED_KEY
      case "car":
        return PRICING.CAR_KEY
      case "specialty":
        return PRICING.SPECIALTY_KEY
      default:
        return PRICING.STANDARD_KEY
    }
  }

  const subtotalCents = getKeyPrice() * quantity
  const deliveryCents = deliveryMethod === "express" ? PRICING.EXPRESS_DELIVERY : PRICING.STANDARD_DELIVERY
  const gstCents = calculateGST(subtotalCents + deliveryCents)
  const totalCents = subtotalCents + deliveryCents + gstCents

  const handleKeyTypeChange = (value: KeyType) => {
    setKeyType(value)
    setRequiresVerification(value === "restricted")
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Create order in database
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone,
          key_type: keyType,
          key_subtype: keySubtype || null,
          quantity,
          photo_urls: photoUrls,
          requires_verification: requiresVerification,
          verification_photo_url: verificationPhotoUrl,
          delivery_method: deliveryMethod,
          delivery_address: deliveryAddress,
          subtotal_cents: subtotalCents,
          gst_cents: gstCents,
          delivery_cents: deliveryCents,
          total_cents: totalCents,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      const { orderId, clientSecret } = await response.json()

      // Redirect to payment page
      router.push(`/payment?orderId=${orderId}&clientSecret=${clientSecret}&type=order`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceedToStep2 = photoUrls.length > 0 && keyType && quantity > 0
  const canProceedToStep3 =
    canProceedToStep2 &&
    email &&
    deliveryAddress.street &&
    deliveryAddress.suburb &&
    deliveryAddress.state &&
    deliveryAddress.postcode
  const canSubmit = canProceedToStep3 && (!requiresVerification || verificationPhotoUrl)

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          1
        </div>
        <div className={`h-1 w-12 ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          2
        </div>
        <div className={`h-1 w-12 ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          3
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Step 1: Key Details */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Key Details</CardTitle>
            <CardDescription>Upload photos and select your key type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Key Photos *</Label>
              <p className="text-sm text-muted-foreground mb-3">Upload clear photos of both sides of your key</p>
              <KeyPhotoUpload photoUrls={photoUrls} onPhotosChange={setPhotoUrls} />
            </div>

            <div>
              <Label htmlFor="key-type">Key Type *</Label>
              <Select value={keyType} onValueChange={handleKeyTypeChange}>
                <SelectTrigger id="key-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Key ($15)</SelectItem>
                  <SelectItem value="restricted">Restricted Key ($35)</SelectItem>
                  <SelectItem value="car">Car Key ($80)</SelectItem>
                  <SelectItem value="specialty">Specialty Key ($50)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {keyType === "restricted" && "Restricted keys require proof of ownership"}
              </p>
            </div>

            {keyType && (
              <div>
                <Label htmlFor="key-subtype">Key Brand/Model (Optional)</Label>
                <Input
                  id="key-subtype"
                  placeholder="e.g., Lockwood, Dorma, Toyota"
                  value={keySubtype}
                  onChange={(e) => setKeySubtype(e.target.value)}
                />
              </div>
            )}

            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
              />
            </div>

            {requiresVerification && (
              <div>
                <Label>Proof of Ownership *</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Upload photo ID or proof of ownership for restricted keys
                </p>
                <KeyPhotoUpload
                  photoUrls={verificationPhotoUrl ? [verificationPhotoUrl] : []}
                  onPhotosChange={(urls) => setVerificationPhotoUrl(urls[0] || null)}
                  maxPhotos={1}
                />
              </div>
            )}

            <Button onClick={() => setStep(2)} disabled={!canProceedToStep2} className="w-full">
              Continue to Delivery
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Delivery Details */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Delivery Details</CardTitle>
            <CardDescription>Where should we send your keys?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">We'll send your tracking link here</p>
            </div>

            <div>
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="04XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <Label>Delivery Method *</Label>
              <Select value={deliveryMethod} onValueChange={(v) => setDeliveryMethod(v as DeliveryMethod)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Delivery - $8 (3-5 days)</SelectItem>
                  <SelectItem value="express">Express Delivery - $20 (1-2 days)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DeliveryAddressForm address={deliveryAddress} onAddressChange={setDeliveryAddress} />

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(3)} disabled={!canProceedToStep3} className="flex-1">
                Continue to Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review & Payment */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Review & Pay</CardTitle>
            <CardDescription>Review your order and complete payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <PricingSummary
              items={[
                {
                  label: `${keyType.charAt(0).toUpperCase() + keyType.slice(1)} Key × ${quantity}`,
                  amount: subtotalCents,
                },
                {
                  label: `${deliveryMethod === "express" ? "Express" : "Standard"} Delivery`,
                  amount: deliveryCents,
                },
              ]}
              gst={gstCents}
              total={totalCents}
            />

            <div className="text-sm space-y-2 p-4 bg-muted/50 rounded-lg">
              <p>
                <strong>Delivery to:</strong>
              </p>
              <p className="text-muted-foreground">
                {deliveryAddress.street}
                <br />
                {deliveryAddress.suburb}, {deliveryAddress.state} {deliveryAddress.postcode}
              </p>
              <p className="mt-3">
                <strong>Email:</strong> {email}
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
