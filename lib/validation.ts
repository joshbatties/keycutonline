import { z } from "zod"

// Australian phone number validation (mobile and landline)
const australianPhoneRegex = /^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/

// Australian postcode validation
const australianPostcodeRegex = /^[0-9]{4}$/

// Email validation schema
export const emailSchema = z.string().email("Please enter a valid email address").min(1, "Email is required")

// Phone validation schema
export const phoneSchema = z
  .string()
  .regex(australianPhoneRegex, "Please enter a valid Australian phone number (e.g., 0412 345 678)")
  .optional()
  .or(z.literal(""))

export const requiredPhoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(australianPhoneRegex, "Please enter a valid Australian phone number (e.g., 0412 345 678)")

// Address validation schemas
export const addressSchema = z.object({
  street: z.string().min(3, "Street address must be at least 3 characters").max(200, "Street address is too long"),
  suburb: z.string().min(2, "Suburb must be at least 2 characters").max(100, "Suburb name is too long"),
  state: z.enum(["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"], {
    errorMap: () => ({ message: "Please select a valid Australian state" }),
  }),
  postcode: z.string().regex(australianPostcodeRegex, "Please enter a valid 4-digit postcode"),
})

// Key copy order validation
export const keyCopyOrderSchema = z
  .object({
    email: emailSchema,
    phone: phoneSchema,
    key_type: z.enum(["standard", "restricted", "car", "specialty"], {
      errorMap: () => ({ message: "Please select a valid key type" }),
    }),
    key_subtype: z.string().max(100, "Key brand/model is too long").optional().nullable(),
    quantity: z.number().int().min(1, "Quantity must be at least 1").max(10, "Maximum 10 keys per order"),
    photo_urls: z.array(z.string().url("Invalid photo URL")).min(1, "At least one key photo is required"),
    requires_verification: z.boolean(),
    verification_photo_url: z.string().url("Invalid verification photo URL").nullable().optional(),
    delivery_method: z.enum(["standard", "express"], {
      errorMap: () => ({ message: "Please select a delivery method" }),
    }),
    delivery_address: addressSchema,
    subtotal_cents: z.number().int().min(0),
    gst_cents: z.number().int().min(0),
    delivery_cents: z.number().int().min(0),
    total_cents: z.number().int().min(0),
  })
  .refine(
    (data) => {
      // If key requires verification, verification photo must be provided
      if (data.requires_verification && !data.verification_photo_url) {
        return false
      }
      return true
    },
    {
      message: "Proof of ownership is required for restricted keys",
      path: ["verification_photo_url"],
    },
  )

// Locksmith booking validation
export const locksmithBookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: emailSchema,
  phone: requiredPhoneSchema,
  service: z.enum(["lockout", "rekey", "installation", "repair"], {
    errorMap: () => ({ message: "Please select a valid service type" }),
  }),
  address: z.string().min(3, "Address must be at least 3 characters").max(200, "Address is too long"),
  suburb: z.string().min(2, "Suburb must be at least 2 characters").max(100, "Suburb name is too long"),
  postcode: z.string().regex(australianPostcodeRegex, "Please enter a valid 4-digit postcode"),
  scheduled_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  scheduled_time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional().nullable(),
  service_price_cents: z.number().int().min(0),
  callout_fee_cents: z.number().int().min(0),
  gst_cents: z.number().int().min(0),
  total_cents: z.number().int().min(0),
})

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: emailSchema,
  phone: phoneSchema,
  subject: z.string().min(3, "Subject must be at least 3 characters").max(200, "Subject is too long"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message is too long"),
})

// Admin order update validation
export const orderUpdateSchema = z.object({
  status: z.enum(["received", "processing", "shipped", "delivered", "cancelled"], {
    errorMap: () => ({ message: "Invalid order status" }),
  }),
  tracking_number: z.string().max(100).optional().nullable(),
})

// Admin booking update validation
export const bookingUpdateSchema = z.object({
  status: z.enum(["pending", "confirmed", "in_progress", "completed", "cancelled"], {
    errorMap: () => ({ message: "Invalid booking status" }),
  }),
  assigned_locksmith_id: z.string().uuid("Invalid locksmith ID").optional().nullable(),
  assigned_locksmith_name: z.string().max(100).optional().nullable(),
  assigned_locksmith_phone: z.string().optional().nullable(),
  estimated_arrival: z.string().datetime().optional().nullable(),
})

// Verification update validation
export const verificationUpdateSchema = z.object({
  verification_status: z.enum(["pending", "approved", "rejected"], {
    errorMap: () => ({ message: "Invalid verification status" }),
  }),
})

// Helper function to format Zod errors for display
export function formatZodError(error: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {}
  error.errors.forEach((err) => {
    const path = err.path.join(".")
    formatted[path] = err.message
  })
  return formatted
}

// Helper function to sanitize user input
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .slice(0, 1000) // Limit length
}
