// Shared types for KeyCut Online

export type KeyType = "standard" | "restricted" | "car" | "specialty"

export type DeliveryMethod = "standard" | "express"

export type OrderStatus = "received" | "verified" | "cutting" | "shipped" | "delivered" | "cancelled"

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded"

export type VerificationStatus = "pending" | "approved" | "rejected"

export interface Address {
  street: string
  suburb: string
  state: string
  postcode: string
  unit?: string
}

export interface Order {
  id: string
  email: string
  phone?: string
  key_type: KeyType
  key_subtype?: string
  quantity: number
  photo_urls: string[]
  requires_verification: boolean
  verification_status: VerificationStatus
  verification_photo_url?: string
  delivery_method: DeliveryMethod
  delivery_address: Address
  subtotal_cents: number
  gst_cents: number
  delivery_cents: number
  total_cents: number
  stripe_payment_intent_id?: string
  payment_status: PaymentStatus
  status: OrderStatus
  tracking_token: string
  tracking_number?: string
  created_at: string
  updated_at: string
}

export type LocksmithService = "lockout" | "rekey" | "install" | "repair" | "other"
export type ServiceType = LocksmithService

export type Urgency = "standard" | "urgent"

export type BookingStatus = "pending" | "confirmed" | "assigned" | "in_progress" | "completed" | "cancelled"

export interface Booking {
  id: string
  email: string
  phone: string
  service_address: Address
  access_instructions?: string
  preferred_date: string
  preferred_time_slot: string
  service_type: ServiceType
  service_description: string
  urgency: Urgency
  callout_fee_cents: number
  estimated_total_cents?: number
  gst_cents: number
  total_cents: number
  stripe_payment_intent_id?: string
  payment_status: PaymentStatus
  status: BookingStatus
  assigned_locksmith_id?: string
  assigned_locksmith_name?: string
  assigned_locksmith_phone?: string
  estimated_arrival?: string
  tracking_token: string
  created_at: string
  updated_at: string
}

// Pricing constants (in cents, AUD)
export const PRICING = {
  // Key copy pricing
  STANDARD_KEY: 1500, // $15
  RESTRICTED_KEY: 3500, // $35
  CAR_KEY: 8000, // $80
  SPECIALTY_KEY: 5000, // $50

  // Delivery pricing
  STANDARD_DELIVERY: 800, // $8
  EXPRESS_DELIVERY: 2000, // $20

  // Locksmith callout fees
  STANDARD_CALLOUT: 9900, // $99
  URGENT_CALLOUT: 19900, // $199

  // Locksmith service fees
  LOCKOUT_SERVICE: 15000, // $150
  REKEY_SERVICE: 12000, // $120
  INSTALLATION_SERVICE: 20000, // $200
  REPAIR_SERVICE: 10000, // $100

  // GST rate
  GST_RATE: 0.1, // 10%
} as const

// Helper function to calculate GST
export function calculateGST(amountCents: number): number {
  return Math.round(amountCents * PRICING.GST_RATE)
}

// Helper function to format cents to dollars
export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

// Australian states
export const AUSTRALIAN_STATES = [
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "WA", label: "Western Australia" },
  { value: "SA", label: "South Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "ACT", label: "Australian Capital Territory" },
  { value: "NT", label: "Northern Territory" },
] as const

// Time slots for locksmith bookings
export const TIME_SLOTS = [
  { value: "9am-12pm", label: "9:00 AM - 12:00 PM" },
  { value: "12pm-3pm", label: "12:00 PM - 3:00 PM" },
  { value: "3pm-6pm", label: "3:00 PM - 6:00 PM" },
] as const
