import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Users, Award, MapPin } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-5xl font-bold mb-6">About KeyCut Online</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-muted-foreground mb-8">
            Australia's most trusted online key cutting and locksmith booking platform, serving customers nationwide
            since 2025.
          </p>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p>
              KeyCut Online was founded to solve a simple problem: getting spare keys made shouldn't require multiple
              trips to the hardware store or waiting around for a locksmith. We've combined traditional locksmith
              expertise with modern technology to create Australia's fastest, most convenient key duplication service.
            </p>
            <p>
              Whether you need spare house keys delivered to your door or an emergency locksmith at your location, we've
              streamlined the entire process to take less than 60 seconds to book.
            </p>
          </section>

          <section className="grid md:grid-cols-2 gap-8 mb-12 not-prose">
            <div className="border rounded-lg p-6">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Licensed & Insured</h3>
              <p className="text-muted-foreground">
                All our locksmiths are fully licensed, police-checked, and carry comprehensive insurance for your peace
                of mind.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
              <p className="text-muted-foreground">
                Our network includes over 50 certified locksmiths with an average of 15+ years experience in the
                industry.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <Award className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-muted-foreground">
                We use premium key blanks and precision cutting equipment. If you're not satisfied, we'll remake your
                keys for free.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <MapPin className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Australia-Wide</h3>
              <p className="text-muted-foreground">
                Mail-in service available nationwide. On-site locksmiths currently serving Sydney metro with expansion
                planned.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Commitment</h2>
            <ul className="space-y-3">
              <li>
                <strong>Transparency:</strong> All prices include GST with no hidden fees
              </li>
              <li>
                <strong>Security:</strong> Strict verification for restricted keys and master systems
              </li>
              <li>
                <strong>Speed:</strong> Sub-60 second booking process, fast turnaround times
              </li>
              <li>
                <strong>Support:</strong> Australian-based customer service team ready to help
              </li>
            </ul>
          </section>

          <div className="bg-primary/5 rounded-lg p-8 text-center not-prose">
            <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/copy">Copy Keys</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/book">Book Locksmith</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
