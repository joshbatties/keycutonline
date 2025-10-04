import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import ContactForm from "@/components/contact-form" // Import the ContactForm component

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Have questions? We're here to help. Reach out through any of the channels below.
        </p>

        <ContactForm />

        <div className="grid md:grid-cols-2 gap-6 mb-12 mt-12">
          <Card>
            <CardHeader>
              <Phone className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Phone</CardTitle>
              <CardDescription>Speak with our team</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-lg">1300 KEY CUT</p>
              <p className="text-sm text-muted-foreground">(1300 539 288)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Mail className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Email</CardTitle>
              <CardDescription>Send us a message</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">support@keycut.com.au</p>
              <p className="text-sm text-muted-foreground">We reply within 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>When we're available</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">Monday - Friday: 8am - 6pm AEST</p>
              <p className="font-semibold">Saturday: 9am - 4pm AEST</p>
              <p className="text-sm text-muted-foreground mt-2">Closed Sundays & Public Holidays</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MapPin className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Head Office</CardTitle>
              <CardDescription>Sydney location</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">123 George Street</p>
              <p>Sydney NSW 2000</p>
              <p className="text-sm text-muted-foreground mt-2">By appointment only</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Looking for quick answers? Check our FAQ page for common questions about our services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/faq" className="text-primary hover:underline font-semibold">
              Visit FAQ Page →
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
