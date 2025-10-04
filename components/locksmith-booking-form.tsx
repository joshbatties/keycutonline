"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PricingSummary } from "@/components/pricing-summary"
import { TimeSlotPicker } from "@/components/time-slot-picker"
import { AddressAutocomplete } from "@/components/address-autocomplete"
import { PRICING, calculateGST, type LocksmithService } from "@/lib/types"
import { AlertCircle, Loader2 } from "lucide-react"

const LOCKSMITH_SERVICES: Array<{ value: LocksmithService; label: string; price: number }> = [
  { value: "lockout", label: "Lockout Service", price: PRICING.LOCKOUT_SERVICE },
  { value: "rekey", label: "Lock Rekey", price: PRICING.REKEY_SERVICE },
  { value: "installation", label: "Lock Installation", price: PRICING.INSTALLATION_SERVICE },
  { value: "repair", label: "Lock Repair", price: PRICING.REPAIR_SERVICE },
]

export function LocksmithBookingForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [service, setService] = useState<LocksmithService | "">("")
  const [address, setAddress] = useState("")
  const [suburb, setSuburb] = useState("")
  const [postcode, setPostcode] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")

  // Calculate pricing
  const servicePriceCents = service ? LOCKSMITH_SERVICES.find((s) => s.value === service)?.price || 0 : 0
  const calloutFeeCents = PRICING.CALLOUT_FEE
  const subtotalCents = servicePriceCents + calloutFeeCents
  const gstCents = calculateGST(subtotalCents)
  const totalCents = subtotalCents + gstCents

  const canProceedToStep2 = service && address && suburb && postcode
  const canProceedToStep3 = canProceedToStep2 && selectedDate && selectedTime
  const canSubmit = canProceedToStep3 && name && email && phone

  const handleAddressSelect = (placeDetails: any) => {
    // Parse Google Places address components to extract suburb, postcode
    const addressComponents = placeDetails.address_components || [];
    let suburb = '', postcode = '';

    addressComponents.forEach((component: any) => {
      const types = component.types;

      if (types.includes('locality') || types.includes('sublocality')) {
        suburb = component.long_name;
      }

      if (types.includes('postal_code')) {
        postcode = component.long_name;
      }
    });

    // Update address fields with the parsed data
    setAddress(placeDetails.formatted_address);
    if (suburb) setSuburb(suburb);
    if (postcode) setPostcode(postcode);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !service) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Create booking in database
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          service,
          address,
          suburb,
          postcode,
          scheduled_date: selectedDate.toISOString().split("T")[0],
          scheduled_time: selectedTime,
          notes: notes || null,
          service_price_cents: servicePriceCents,
          callout_fee_cents: calloutFeeCents,
          gst_cents: gstCents,
          total_cents: totalCents,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create booking")
      }

      const { bookingId, clientSecret } = await response.json()

      // Redirect to payment page
      router.push(`/payment?bookingId=${bookingId}&clientSecret=${clientSecret}&type=booking`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

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

      {/* Step 1: Service & Location */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Service & Location</CardTitle>
            <CardDescription>What service do you need and where?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="service">Service Type *</Label>
              <Select value={service} onValueChange={(v) => setService(v as LocksmithService)}>
                <SelectTrigger id="service">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {LOCKSMITH_SERVICES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label} - ${(s.price / 100).toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Includes ${(PRICING.CALLOUT_FEE / 100).toFixed(2)} callout fee
              </p>
            </div>

            <div>
              <Label htmlFor="address">Street Address *</Label>
              <AddressAutocomplete
                value={address}
                onChange={setAddress}
                onSelect={handleAddressSelect}
                placeholder="Start typing your address..."
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="suburb">Suburb *</Label>
                <Input
                  id="suburb"
                  placeholder="Sydney"
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="postcode">Postcode *</Label>
                <Input
                  id="postcode"
                  placeholder="2000"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button onClick={() => setStep(2)} disabled={!canProceedToStep2} className="w-full">
              Continue to Schedule
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Schedule</CardTitle>
            <CardDescription>When would you like the locksmith to arrive?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <TimeSlotPicker
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateChange={setSelectedDate}
              onTimeChange={setSelectedTime}
            />

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(3)} disabled={!canProceedToStep3} className="flex-1">
                Continue to Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Contact & Payment */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Contact Details</CardTitle>
            <CardDescription>How can we reach you?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
            </div>

            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="04XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any specific details about the job..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <PricingSummary
              items={[
                {
                  label: LOCKSMITH_SERVICES.find((s) => s.value === service)?.label || "Service",
                  amount: servicePriceCents,
                },
                {
                  label: "Callout Fee",
                  amount: calloutFeeCents,
                },
              ]}
              gst={gstCents}
              total={totalCents}
            />

            <div className="text-sm space-y-2 p-4 bg-muted/50 rounded-lg">
              <p>
                <strong>Scheduled for:</strong>
              </p>
              <p className="text-muted-foreground">
                {selectedDate?.toLocaleDateString("en-AU", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at {selectedTime}
              </p>
              <p className="mt-3">
                <strong>Location:</strong>
              </p>
              <p className="text-muted-foreground">
                {address}, {suburb} {postcode}
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
