import { KeyCopyForm } from "@/components/key-copy-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function KeyCopyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Mail-In Key Copying</h1>
            <p className="text-muted-foreground">
              Upload photos of your keys and we'll cut and deliver them Australia-wide. Takes less than 60 seconds.
            </p>
          </div>

          <KeyCopyForm />
        </div>
      </main>
    </div>
  )
}
