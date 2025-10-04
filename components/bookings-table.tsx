"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { formatCurrency } from "@/lib/types"
import { convertBookingsToCSV, downloadCSV } from "@/lib/csv-utils"
import { Loader2, Download, Settings } from "lucide-react"

export function BookingsTable() {
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set())
  const [bulkStatus, setBulkStatus] = useState<string>("")
  const [isBulkUpdating, setIsBulkUpdating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings")
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch bookings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status }),
      })

      if (response.ok) {
        fetchBookings()
      }
    } catch (error) {
      console.error("[v0] Failed to update booking:", error)
    }
  }

  const handleSelectBooking = (bookingId: string, checked: boolean) => {
    const newSelected = new Set(selectedBookings)
    if (checked) {
      newSelected.add(bookingId)
    } else {
      newSelected.delete(bookingId)
    }
    setSelectedBookings(newSelected)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBookings(new Set(bookings.map(booking => booking.id)))
    } else {
      setSelectedBookings(new Set())
    }
  }

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedBookings.size === 0) return

    setIsBulkUpdating(true)
    try {
      const response = await fetch("/api/admin/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "update_status",
          type: "bookings",
          ids: Array.from(selectedBookings),
          data: { status: bulkStatus }
        }),
      })

      if (response.ok) {
        fetchBookings()
        setSelectedBookings(new Set())
        setBulkStatus("")
      }
    } catch (error) {
      console.error("Failed to update bulk status:", error)
    } finally {
      setIsBulkUpdating(false)
    }
  }

  const handleExportCSV = async () => {
    if (selectedBookings.size === 0) return

    setIsExporting(true)
    try {
      const response = await fetch("/api/admin/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "export_csv",
          type: "bookings",
          ids: Array.from(selectedBookings)
        }),
      })

      if (response.ok) {
        const { data } = await response.json()
        const csvContent = convertBookingsToCSV(data)
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')
        downloadCSV(csvContent, `bookings-${timestamp}.csv`)
      }
    } catch (error) {
      console.error("Failed to export CSV:", error)
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (bookings.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No bookings yet</p>
  }

  return (
    <>
      {/* Bulk Operations Header */}
      {selectedBookings.size > 0 && (
        <div className="mb-4 p-4 bg-muted rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {selectedBookings.size} booking{selectedBookings.size === 1 ? '' : 's'} selected
            </p>
            <div className="flex items-center gap-2">
              <Select value={bulkStatus} onValueChange={setBulkStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="New Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleBulkStatusUpdate}
                disabled={!bulkStatus || isBulkUpdating}
                size="sm"
              >
                {isBulkUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-2" />
                    Update Status
                  </>
                )}
              </Button>
              <Button
                onClick={handleExportCSV}
                disabled={isExporting}
                variant="outline"
                size="sm"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedBookings.size === bookings.length && bookings.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Booking ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>
                <Checkbox
                  checked={selectedBookings.has(booking.id)}
                  onCheckedChange={(checked) => handleSelectBooking(booking.id, !!checked)}
                />
              </TableCell>
              <TableCell className="font-mono text-xs">{booking.id.slice(0, 8)}</TableCell>
              <TableCell>{booking.name}</TableCell>
              <TableCell className="capitalize">{booking.service.replace("_", " ")}</TableCell>
              <TableCell>{new Date(booking.scheduled_date).toLocaleDateString("en-AU")}</TableCell>
              <TableCell>{booking.scheduled_time}</TableCell>
              <TableCell>{formatCurrency(booking.total_cents)}</TableCell>
              <TableCell>
                <Badge variant={booking.payment_status === "paid" ? "default" : "secondary"}>
                  {booking.payment_status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    booking.status === "completed"
                      ? "default"
                      : booking.status === "confirmed"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {booking.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Select value={booking.status} onValueChange={(value) => updateBookingStatus(booking.id, value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </>
  )
}
