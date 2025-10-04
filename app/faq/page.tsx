import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-5xl font-bold mb-6">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Everything you need to know about our key cutting and locksmith services.
        </p>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left">How does the mail-in key copy service work?</AccordionTrigger>
            <AccordionContent>
              Simply upload a clear photo of your key, select the quantity and delivery option, and complete payment.
              We'll cut your keys using precision equipment and mail them to your address within 3-5 business days. You
              don't need to send us your original key.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left">What types of keys can you copy?</AccordionTrigger>
            <AccordionContent>
              We can copy most standard house keys, padlock keys, and basic commercial keys. For restricted keys (marked
              "Do Not Copy"), we require proof of ownership. We cannot copy car keys with electronic chips or
              high-security keys without proper authorization.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left">How much does key copying cost?</AccordionTrigger>
            <AccordionContent>
              Standard keys start at $12.50 each plus GST. Restricted keys are $18.50 each plus GST. Delivery costs
              $8.50 for standard post or $15 for express. All prices are displayed upfront with GST included before you
              pay.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left">Where do you offer on-site locksmith services?</AccordionTrigger>
            <AccordionContent>
              Currently, our on-site locksmith service is available in Sydney metro areas. We're planning to expand to
              Melbourne, Brisbane, and other major cities soon. Check the booking page to see if your location is
              covered.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left">What's included in the locksmith callout fee?</AccordionTrigger>
            <AccordionContent>
              The $89 callout fee covers the locksmith's travel to your location and initial assessment. Additional
              services like key cutting, lock repairs, or installations are charged separately based on the work
              required. You'll receive a quote before any work begins.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger className="text-left">Can I track my order?</AccordionTrigger>
            <AccordionContent>
              Yes! After placing your order, you'll receive an order number. Use this on our Track Order page to see the
              current status. You'll also receive email updates when your keys are cut and shipped.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger className="text-left">Do I need to create an account?</AccordionTrigger>
            <AccordionContent>
              No account is required for guest checkout. However, creating an account lets you view all your orders in
              one place and makes future bookings faster. You can create an account during checkout or anytime from the
              login page.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger className="text-left">What payment methods do you accept?</AccordionTrigger>
            <AccordionContent>
              We accept all major credit and debit cards, Apple Pay, and Google Pay through our secure Stripe payment
              system. Payment is required upfront before we begin cutting your keys or dispatch a locksmith.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9">
            <AccordionTrigger className="text-left">What if my copied key doesn't work?</AccordionTrigger>
            <AccordionContent>
              We guarantee all our key copies. If a key doesn't work properly, contact us within 30 days and we'll
              remake it for free or provide a full refund. We use precision cutting equipment and premium blanks to
              ensure quality.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-10">
            <AccordionTrigger className="text-left">Are your locksmiths licensed and insured?</AccordionTrigger>
            <AccordionContent>
              Yes, all our locksmiths are fully licensed, police-checked, and carry comprehensive insurance. We only
              work with experienced professionals who meet strict quality and security standards.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
