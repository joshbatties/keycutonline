export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p>
              KeyCut Online ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when you use our services, in accordance
              with the Australian Privacy Act 1988 and the Australian Privacy Principles (APPs).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
            <p>We collect the following personal information when you use our services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Contact Details:</strong> Name, email address, phone number
              </li>
              <li>
                <strong>Delivery Information:</strong> Street address, suburb, state, postcode
              </li>
              <li>
                <strong>Payment Information:</strong> Processed securely through Stripe (we don't store card details)
              </li>
              <li>
                <strong>Key Photos:</strong> Images of keys you submit for duplication
              </li>
              <li>
                <strong>Order Details:</strong> Service type, quantity, delivery preferences
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">Technical Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Usage data and analytics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Communicate about your service (confirmations, updates, tracking)</li>
              <li>Dispatch locksmiths to your location</li>
              <li>Process payments securely</li>
              <li>Improve our services and customer experience</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraud and ensure security</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Information Sharing & Disclosure</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Service Providers:</strong> Locksmiths, delivery services, payment processors (Stripe)
              </li>
              <li>
                <strong>Cloud Services:</strong> Vercel, Supabase for hosting and data storage
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect our rights
              </li>
            </ul>
            <p className="mt-4">
              We do not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure payment processing through PCI-compliant providers</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Staff training on data protection</li>
            </ul>
            <p className="mt-4">
              However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute
              security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
            <p>We retain your information for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Order Data:</strong> 7 years (for tax and legal compliance)
              </li>
              <li>
                <strong>Key Photos:</strong> 90 days after order completion (then permanently deleted)
              </li>
              <li>
                <strong>Account Data:</strong> Until you request deletion or close your account
              </li>
              <li>
                <strong>Marketing Data:</strong> Until you unsubscribe
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Your Rights</h2>
            <p>Under Australian privacy law, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Access:</strong> Request a copy of your personal information
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your information (subject to legal requirements)
              </li>
              <li>
                <strong>Opt-out:</strong> Unsubscribe from marketing communications
              </li>
              <li>
                <strong>Complaint:</strong> Lodge a complaint with us or the Office of the Australian Information
                Commissioner (OAIC)
              </li>
            </ul>
            <p className="mt-4">To exercise these rights, contact us at privacy@keycut.com.au</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Cookies & Tracking</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Remember your preferences</li>
              <li>Analyze site usage and performance</li>
              <li>Provide personalized content</li>
            </ul>
            <p className="mt-4">
              You can control cookies through your browser settings, but this may affect site functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party sites. We are not responsible for the privacy practices of
              these sites. Please review their privacy policies separately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect
              information from children.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated
              "Last updated" date. Continued use of our services after changes constitutes acceptance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
            <p>
              For privacy-related questions or to exercise your rights:
              <br />
              <br />
              <strong>Email:</strong> privacy@keycut.com.au
              <br />
              <strong>Phone:</strong> 1300 KEY CUT
              <br />
              <strong>Mail:</strong> Privacy Officer, KeyCut Online, 123 George Street, Sydney NSW 2000
              <br />
              <br />
              <strong>OAIC Contact:</strong>
              <br />
              Office of the Australian Information Commissioner
              <br />
              Phone: 1300 363 992
              <br />
              Website: www.oaic.gov.au
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
