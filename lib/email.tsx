import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    const data = await resend.emails.send({
      from: "KeyCut Online <noreply@keycut.com.au>",
      to,
      subject,
      html,
    })
    return { success: true, data }
  } catch (error) {
    console.error("Email send error:", error)
    return { success: false, error }
  }
}

export async function sendContactFormEmail({
  name,
  email,
  phone,
  subject,
  message,
}: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@keycut.com.au"

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e3a8a; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; }
          .field { margin-bottom: 20px; }
          .label { font-weight: bold; color: #1e3a8a; }
          .value { margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">From:</div>
              <div class="value">${name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${email}</div>
            </div>
            ${phone ? `<div class="field"><div class="label">Phone:</div><div class="value">${phone}</div></div>` : ""}
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${subject}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${message}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: adminEmail,
    subject: `Contact Form: ${subject}`,
    html,
  })
}

export async function sendOrderConfirmationEmail({
  email,
  orderId,
  keyType,
  quantity,
  totalAmount,
}: {
  email: string
  orderId: string
  keyType: string
  quantity: number
  totalAmount: number
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://keycut.com.au"
  const trackingUrl = `${appUrl}/track?id=${orderId}`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e3a8a; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmed!</h1>
          </div>
          <div class="content">
            <p>Thank you for your order! We've received your key copy request.</p>
            
            <div class="details">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Key Type:</strong> ${keyType}</p>
              <p><strong>Quantity:</strong> ${quantity}</p>
              <p><strong>Total:</strong> $${(totalAmount / 100).toFixed(2)} AUD (inc. GST)</p>
            </div>

            <p>Track your order anytime:</p>
            <a href="${trackingUrl}" class="button">Track Order</a>

            <p><strong>What's Next?</strong></p>
            <ul>
              <li>We'll review your key photo within 24 hours</li>
              <li>Once approved, we'll cut your keys</li>
              <li>You'll receive tracking info when shipped</li>
            </ul>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Order Confirmed - ${orderId}`,
    html,
  })
}

export async function sendBookingConfirmationEmail({
  email,
  bookingId,
  serviceType,
  scheduledDate,
  scheduledTime,
  address,
  totalAmount,
}: {
  email: string
  bookingId: string
  serviceType: string
  scheduledDate: string
  scheduledTime: string
  address: string
  totalAmount: number
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://keycut.com.au"
  const trackingUrl = `${appUrl}/track?id=${bookingId}`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e3a8a; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .highlight { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmed!</h1>
          </div>
          <div class="content">
            <p>Your locksmith appointment has been confirmed.</p>
            
            <div class="highlight">
              <p><strong>📅 ${scheduledDate} at ${scheduledTime}</strong></p>
              <p>📍 ${address}</p>
            </div>

            <div class="details">
              <h3>Booking Details</h3>
              <p><strong>Booking ID:</strong> ${bookingId}</p>
              <p><strong>Service:</strong> ${serviceType}</p>
              <p><strong>Total:</strong> $${(totalAmount / 100).toFixed(2)} AUD (inc. GST)</p>
            </div>

            <a href="${trackingUrl}" class="button">View Booking</a>

            <p><strong>Before Your Appointment:</strong></p>
            <ul>
              <li>Please be available at the scheduled time</li>
              <li>Have your ID ready for verification</li>
              <li>Our locksmith will call 15 minutes before arrival</li>
            </ul>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Locksmith Booking Confirmed - ${scheduledDate}`,
    html,
  })
}

export async function sendAdminOrderNotification({
  orderId,
  keyType,
  quantity,
  requiresVerification,
  customerEmail,
}: {
  orderId: string
  keyType: string
  quantity: number
  requiresVerification: boolean
  customerEmail: string
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@keycut.com.au"
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://keycut.com.au"
  const adminUrl = `${appUrl}/admin`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e3a8a; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .alert { background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Order Received</h1>
          </div>
          <div class="content">
            ${requiresVerification ? '<div class="alert"><strong>⚠️ Verification Required</strong><br>This order contains restricted keys and requires photo verification.</div>' : ""}
            
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Key Type:</strong> ${keyType}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Customer:</strong> ${customerEmail}</p>

            <a href="${adminUrl}" class="button">View in Admin Dashboard</a>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: adminEmail,
    subject: `New Order: ${orderId}${requiresVerification ? " - VERIFICATION REQUIRED" : ""}`,
    html,
  })
}

export async function sendAdminBookingNotification({
  bookingId,
  serviceType,
  scheduledDate,
  scheduledTime,
  address,
  customerEmail,
}: {
  bookingId: string
  serviceType: string
  scheduledDate: string
  scheduledTime: string
  address: string
  customerEmail: string
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@keycut.com.au"
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://keycut.com.au"
  const adminUrl = `${appUrl}/admin`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e3a8a; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .highlight { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Locksmith Booking</h1>
          </div>
          <div class="content">
            <div class="highlight">
              <p><strong>📅 ${scheduledDate} at ${scheduledTime}</strong></p>
              <p>📍 ${address}</p>
            </div>
            
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Service:</strong> ${serviceType}</p>
            <p><strong>Customer:</strong> ${customerEmail}</p>

            <a href="${adminUrl}" class="button">Assign Locksmith</a>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: adminEmail,
    subject: `New Booking: ${scheduledDate} - ${serviceType}`,
    html,
  })
}
