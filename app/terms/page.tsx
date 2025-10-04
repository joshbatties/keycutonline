export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-bold mb-6">Terms & Conditions</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using KeyCut Online's services, you accept and agree to be bound by these Terms and
              Conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Services</h2>
            <p>KeyCut Online provides two primary services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Mail-in Key Copying:</strong> Photo-based key duplication with Australia-wide delivery
              </li>
              <li>
                <strong>On-site Locksmith Services:</strong> Professional locksmith visits in designated service areas
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Key Ownership & Authorization</h2>
            <p>By submitting a key for duplication, you warrant that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are the legal owner of the key or have explicit authorization to duplicate it</li>
              <li>The key is not stolen, lost, or otherwise obtained illegally</li>
              <li>For restricted keys, you can provide proof of ownership or authorization upon request</li>
            </ul>
            <p className="mt-4">
              We reserve the right to refuse service for any key we believe may be duplicated without proper
              authorization.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Pricing & Payment</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All prices are in Australian Dollars (AUD) and include GST</li>
              <li>Payment is required upfront before services are rendered</li>
              <li>Prices are subject to change without notice, but you'll always see the final price before payment</li>
              <li>Refunds are provided in accordance with Australian Consumer Law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Delivery & Turnaround</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Mail-in key copies: 3-5 business days from order confirmation</li>
              <li>Delivery times are estimates and may vary due to factors beyond our control</li>
              <li>We are not responsible for delays caused by Australia Post or courier services</li>
              <li>On-site locksmith appointments are subject to availability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Quality Guarantee</h2>
            <p>
              We guarantee that all keys are cut to manufacturer specifications using precision equipment. If a key
              doesn't work properly:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contact us within 30 days of delivery</li>
              <li>We'll remake the key for free or provide a full refund</li>
              <li>Return shipping costs for defective keys will be reimbursed</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>We are not liable for any indirect, incidental, or consequential damages</li>
              <li>Our total liability is limited to the amount you paid for the service</li>
              <li>We are not responsible for lockouts, security breaches, or property damage resulting from key use</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Privacy & Data</h2>
            <p>
              Your personal information is handled in accordance with our Privacy Policy and the Australian Privacy Act
              1988. We collect only the information necessary to provide our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, and software, is the property of KeyCut
              Online and protected by Australian and international copyright laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting
              to this page. Your continued use of our services constitutes acceptance of any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Governing Law</h2>
            <p>
              These terms are governed by the laws of New South Wales, Australia. Any disputes will be subject to the
              exclusive jurisdiction of the courts of New South Wales.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">12. Contact</h2>
            <p>
              For questions about these terms, contact us at:
              <br />
              Email: legal@keycut.com.au
              <br />
              Phone: 1300 KEY CUT
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
