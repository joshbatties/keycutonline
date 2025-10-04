import { AdminLogin } from "@/components/admin-login"

export const dynamic = 'force-dynamic'

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <AdminLogin />
    </div>
  )
}
