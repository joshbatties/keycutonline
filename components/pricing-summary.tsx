import { formatCurrency } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"

interface PricingSummaryProps {
  items: Array<{ label: string; amount: number }>
  gst: number
  total: number
}

export function PricingSummary({ items, gst, total }: PricingSummaryProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{item.label}</span>
            <span>{formatCurrency(item.amount)}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm text-muted-foreground pt-2 border-t">
          <span>GST (10%)</span>
          <span>{formatCurrency(gst)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
