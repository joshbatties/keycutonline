import { AlertCircle } from "lucide-react"

interface FormFieldErrorProps {
  error?: string
}

export function FormFieldError({ error }: FormFieldErrorProps) {
  if (!error) return null

  return (
    <div className="flex items-center gap-1.5 text-sm text-destructive mt-1.5">
      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
      <span>{error}</span>
    </div>
  )
}
