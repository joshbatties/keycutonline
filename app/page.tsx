import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Key, Wrench, Clock, Shield, MapPin, CheckCircle2 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">KeyCut Online</h1>
          </div>
          <Link href="/track">
            <Button variant="ghost" size="sm">
              Track Order
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-balance mb-4">
              Professional Key Services Across Australia
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground text-balance mb-8">
              Get keys cut and delivered, or book a qualified locksmith. Fast, secure, and transparent pricing.
            </p>
          </div>

          {/* Main CTAs */}
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mt-12">
            {/* Mail-In Key Copy CTA */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Key className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">Mail-In Key Copying</h3>
                    <p className="text-muted-foreground">
                      Send us a photo, we'll cut and deliver your keys Australia-wide
                    </p>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>From $15 per key</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>Standard delivery $8 (3-5 days)</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>Express delivery $20 (1-2 days)</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>All prices include GST</span>
                  </li>
                </ul>

                <Link href="/copy" className="block">
                  <Button className="w-full" size="lg">
                    Copy Keys Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* On-Site Locksmith CTA */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <Wrench className="h-8 w-8 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">Book a Locksmith</h3>
                    <p className="text-muted-foreground">
                      Professional locksmith service at your location (metro areas)
                    </p>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>$99 standard callout (next day)</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>$199 urgent callout (2hr response)</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>Lockouts, rekeying, installations</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>All prices include GST</span>
                  </li>
                </ul>

                <Link href="/locksmith" className="block">
                  <Button className="w-full" size="lg" variant="secondary">
                    Book Locksmith
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Features Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-10">Why Choose KeyCut Online?</h3>
          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="p-3 bg-primary/10 rounded-full mb-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Secure & Licensed</h4>
              <p className="text-sm text-muted-foreground">All locksmiths are licensed and police-checked</p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="p-3 bg-primary/10 rounded-full mb-3">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Fast Service</h4>
              <p className="text-sm text-muted-foreground">Express delivery or 2-hour urgent callouts available</p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="p-3 bg-primary/10 rounded-full mb-3">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Australia-Wide</h4>
              <p className="text-sm text-muted-foreground">Mail-in service nationwide, on-site in metro areas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h5 className="font-semibold mb-3">Services</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/copy" className="hover:text-foreground">
                    Key Copying
                  </Link>
                </li>
                <li>
                  <Link href="/locksmith" className="hover:text-foreground">
                    Locksmith Booking
                  </Link>
                </li>
                <li>
                  <Link href="/track" className="hover:text-foreground">
                    Track Order
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-3">Support</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/faq" className="hover:text-foreground">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-3">Legal</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-foreground">
                    Security & Verification
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} KeyCut Online. All rights reserved. ABN: XX XXX XXX XXX</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
